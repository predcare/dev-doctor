import notifee, { AuthorizationStatus } from '@notifee/react-native';
import {
  getMessaging,
  getToken,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';
import { Platform, type AppStateStatus } from 'react-native';
import { getItem, removeItem, setItem, STORAGE_KEYS } from '../../../lib/commons/asyncStorage';
import { showSuccessToast, showWarningToast } from '../../../lib/commons/toast.utils';
import { useAlertStore } from '../../../zustand/stores/useAlertStore';
import { syncPushToken } from '../../calls/deviceSync';
import { openNotificationSettings } from '../notification.core';

const TOAST_WARNING_MSG = 'You will not receive any notifications from this app.';
const TOAST_WARNING_TITLE = 'Notifications Disabled';

let awaitingSettingsResume = false;
let activePromptPromise: Promise<void> | null = null;

/**
 * On iOS, registers with APNs and retrieves FCM token with a short retry for APNs handshake.
 */
export const fetchAndSaveFcmToken = async (): Promise<string | null> => {
  try {
    const messaging = getMessaging();

    // iOS requires registering for remote messages before requesting token
    if (Platform.OS === 'ios') {
      await registerDeviceForRemoteMessages(messaging).catch(err =>
        console.warn('[NotificationPermission] registerDeviceForRemoteMessages error:', err)
      );
    }

    let token = '';
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        token = await getToken(messaging);
        if (token) break;
      } catch (err) {
        if (attempt === 2) throw err;
        await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
      }
    }

    if (token) {
      await setItem(STORAGE_KEYS.FCM_TOKEN, token);
      syncPushToken(token);
      return token;
    }
    return null;
  } catch (err) {
    console.warn('[NotificationPermission] Failed to fetch or sync FCM token:', err);
    return null;
  }
};

/**
 * Saves FCM token and notifies backend once notification permission is authorized.
 */
export const handlePermissionGranted = async (): Promise<void> => {
  await removeItem(STORAGE_KEYS.NOTIFICATION_DENIED);
  const token = await fetchAndSaveFcmToken();
  if (token) {
    showSuccessToast('Notifications enabled successfully.', 'Success');
  }
};

/**
 * Handles denial: records denial state and triggers warning toast.
 */
export const handlePermissionDenied = async (): Promise<void> => {
  await setItem(STORAGE_KEYS.NOTIFICATION_DENIED, 'true');
  showWarningToast(TOAST_WARNING_MSG, TOAST_WARNING_TITLE);
};

/**
 * Shows in-app Allow / Don't Allow prompt on the Splash screen.
 * Resolves the returned Promise once the doctor taps Allow or Don't Allow.
 */
export const showReAskNotificationPrompt = (isBlockedAtOsLevel = false): Promise<void> => {
  return new Promise(resolve => {
    useAlertStore.getState().showConfirm({
      title: isBlockedAtOsLevel ? 'Enable Notifications in Settings' : 'Allow Notifications?',
      message: isBlockedAtOsLevel
        ? 'Notifications are currently turned off. Please enable them in your iPhone settings to receive alerts for video consultations and appointments.'
        : 'You will not receive any notifications from this app unless enabled. Turn on notifications to receive updates about appointments, incoming calls, and patient consultations.',
      buttonText: 'Allow',
      cancelText: "Don't Allow",
      onConfirm: async () => {
        try {
          if (isBlockedAtOsLevel) {
            awaitingSettingsResume = true;
            await openNotificationSettings();
            resolve();
            return;
          }

          const requested = await notifee.requestPermission();
          if (requested.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
            await handlePermissionGranted();
          } else {
            await handlePermissionDenied();
          }
        } catch (err) {
          console.warn('[NotificationPermission] Request error:', err);
        } finally {
          resolve();
        }
      },
      onCancel: async () => {
        await handlePermissionDenied();
        resolve();
      },
    });
  });
};

/**
 * Called on Splash Screen startup:
 * 1. If already authorized -> clears flag, fetches token if missing, resolves immediately.
 * 2. If first time -> shows native OS prompt on Splash Screen.
 * 3. If previously denied -> shows custom PopupAlert on Splash Screen.
 */
export const checkAndPromptNotificationPermission = (): Promise<void> => {
  if (activePromptPromise) return activePromptPromise;

  activePromptPromise = (async () => {
    try {
      const settings = await notifee.getNotificationSettings();
      const isGranted = settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;

      // ALREADY GRANTED: Never show any prompt!
      if (isGranted) {
        await removeItem(STORAGE_KEYS.NOTIFICATION_DENIED);
        const savedToken = await getItem(STORAGE_KEYS.FCM_TOKEN);
        if (!savedToken) {
          await fetchAndSaveFcmToken();
        }
        return;
      }

      const wasDenied = (await getItem(STORAGE_KEYS.NOTIFICATION_DENIED)) === 'true';

      // FIRST TIME: Request native OS prompt on Splash Screen
      if (!wasDenied && settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED) {
        const requested = await notifee.requestPermission();
        if (requested.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
          await handlePermissionGranted();
        } else {
          await handlePermissionDenied();
        }
        return;
      }

      // SUBSEQUENT APP OPEN: Show custom prompt on Splash Screen
      const isBlocked = settings.authorizationStatus === AuthorizationStatus.DENIED;
      await showReAskNotificationPrompt(isBlocked);
    } catch (err) {
      console.warn('[NotificationPermission] checkAndPrompt failed:', err);
    }
  })().finally(() => {
    activePromptPromise = null;
  });

  return activePromptPromise;
};

/**
 * Listens for doctor returning from iPhone Settings to sync token immediately.
 */
export const handleAppStateChangeForNotifications = async (nextState: AppStateStatus) => {
  if (nextState !== 'active' || !awaitingSettingsResume) return;
  awaitingSettingsResume = false;

  const settings = await notifee.getNotificationSettings();
  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    await handlePermissionGranted();
  } else {
    await handlePermissionDenied();
  }
};
