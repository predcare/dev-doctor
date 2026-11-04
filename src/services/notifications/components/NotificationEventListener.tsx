import notifee from '@notifee/react-native';
import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { initNotificationChannels } from '../notification.core';
import { processInitialNotification, routeNotificationPress } from '../notificationDispatcher';
import {
  checkAndPromptNotificationPermission,
  handleAppStateChangeForNotifications,
} from '../push/notificationPermissionManager';

/**
 * Headless listener component that manages notification lifecycles:
 * 1. Initializes Android notification channels on app startup.
 * 2. Handles foreground notification interactions (tap to open).
 * 3. Handles cold-start initial notification if app was opened via notification tap.
 * 4. Checks and prompts for notification permissions on app launch and resumes.
 */
export const NotificationEventListener: React.FC = () => {
  useEffect(() => {
    // 1. Initialize notification channels
    initNotificationChannels();

    // 2. Handle cold start if app opened via notification tap
    processInitialNotification();

    // 3. Check and prompt notification permission on app open
    checkAndPromptNotificationPermission();

    // 4. Subscribe to foreground notification events
    const unsubscribeNotifee = notifee.onForegroundEvent(event => {
      routeNotificationPress(event);
    });

    // 5. Subscribe to AppState changes (e.g. returning from settings)
    const appStateSub = AppState.addEventListener('change', handleAppStateChangeForNotifications);

    return () => {
      unsubscribeNotifee();
      appStateSub.remove();
    };
  }, []);

  return null;
};

export default NotificationEventListener;
