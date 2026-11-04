import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
} from '@notifee/react-native';
import { Linking, Platform } from 'react-native';

export const NOTIFICATION_CHANNELS = {
  // The id must match default_notification_channel_id in AndroidManifest.xml.
  DEFAULT: {
    id: 'default_channel_id',
    name: 'General',
    description: 'General updates from PRED Doctor',
    importance: AndroidImportance.HIGH,
  },
  DOWNLOADS: {
    id: 'pdf_downloads',
    name: 'Document Downloads',
    description: 'Notifications for downloaded prescriptions, invoices, and reports',
    importance: AndroidImportance.DEFAULT,
  },
  APPOINTMENTS: {
    id: 'appointments',
    name: 'Appointments',
    description: 'Updates for appointments and patients waiting in consultation',
    importance: AndroidImportance.HIGH,
  },
  MEETING_ONGOING: {
    id: 'meeting-ongoing',
    name: 'Ongoing Consultation',
    description: 'Shown while a video consultation is in progress',
    importance: AndroidImportance.LOW,
  },
} as const;

export const createMeetingOngoingChannel = async (): Promise<string> => {
  return notifee.createChannel({
    id: NOTIFICATION_CHANNELS.MEETING_ONGOING.id,
    name: NOTIFICATION_CHANNELS.MEETING_ONGOING.name,
    description: NOTIFICATION_CHANNELS.MEETING_ONGOING.description,
    importance: NOTIFICATION_CHANNELS.MEETING_ONGOING.importance,
    visibility: AndroidVisibility.PUBLIC,
    vibration: false,
  });
};

/**
 * Initializes required Android notification channels. Safe to call idempotently.
 */
export const initNotificationChannels = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;

  try {
    await notifee.createChannel({
      id: NOTIFICATION_CHANNELS.DEFAULT.id,
      name: NOTIFICATION_CHANNELS.DEFAULT.name,
      description: NOTIFICATION_CHANNELS.DEFAULT.description,
      importance: NOTIFICATION_CHANNELS.DEFAULT.importance,
      visibility: AndroidVisibility.PUBLIC,
    });
    await notifee.createChannel({
      id: NOTIFICATION_CHANNELS.DOWNLOADS.id,
      name: NOTIFICATION_CHANNELS.DOWNLOADS.name,
      description: NOTIFICATION_CHANNELS.DOWNLOADS.description,
      importance: NOTIFICATION_CHANNELS.DOWNLOADS.importance,
      visibility: AndroidVisibility.PUBLIC,
      vibration: false,
    });
    await createMeetingOngoingChannel();
  } catch (err) {
    console.warn('[NotificationCore] Failed to create notification channels:', err);
  }
};

/**
 * Requests notification permissions for Android 13+ (POST_NOTIFICATIONS) and iOS.
 * Returns true if granted/provisional, false if denied.
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  } catch (err) {
    console.warn('[NotificationCore] Permission request failed:', err);
    return false;
  }
};

/**
 * Checks current notification permission status without prompting.
 */
export const getNotificationPermissionStatus = async (): Promise<boolean> => {
  try {
    const settings = await notifee.getNotificationSettings();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  } catch (err) {
    console.warn('[NotificationCore] Failed to get permission settings:', err);
    return false;
  }
};

/**
 * Opens notification settings in device system settings.
 * On iOS, notifee.openNotificationSettings is a no-op, so Linking.openSettings is required.
 */
export const openNotificationSettings = async (): Promise<void> => {
  try {
    if (Platform.OS === 'ios') {
      await Linking.openSettings();
      return;
    }
    await notifee.openNotificationSettings();
  } catch (err) {
    console.warn(
      '[NotificationCore] Failed to open notification settings via Notifee, falling back to Linking:',
      err,
    );
    await Linking.openSettings().catch(linkErr =>
      console.warn('[NotificationCore] Linking.openSettings failed:', linkErr),
    );
  }
};
