import {
  getMessaging,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import { getItem, setItem, STORAGE_KEYS } from '../../../lib/commons/asyncStorage';
import { checkAndPromptNotificationPermission } from './notificationPermissionManager';

// Returns the saved token, or '' so login and registration still work without one.
export const getSavedPushToken = async (): Promise<string> => {
  return (await getItem(STORAGE_KEYS.FCM_TOKEN)) ?? '';
};

// Ensures permission is handled and a token fetched.
// If permission is denied, warning toast is shown and re-prompted on next app open.
export const ensurePushToken = async (): Promise<void> => {
  let token = await getSavedPushToken();

  if (!token) {
    await checkAndPromptNotificationPermission();
    token = await getSavedPushToken();
  }

  if (__DEV__) console.log('FCM token:', token);
};

// Returns the listener's unsubscribe function.
export const listenForTokenRefresh = () => {
  return onTokenRefresh(getMessaging(), token => setItem(STORAGE_KEYS.FCM_TOKEN, token));
};
