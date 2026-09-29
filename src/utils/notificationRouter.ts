import { navigationRef } from '../navigation/navigationRef';
import { AppRoute } from '../route';

export {
  NotificationAction,
  NotificationCategory,
  NotificationType,
} from '../config/notification.constants';

let pendingRoute: { name: string; params?: any } | null = null;

export interface NotificationRouteResult {
  name: string;
  params?: any;
}

export function resolveNotificationRoute(data: any): NotificationRouteResult {
  if (!data) {
    return { name: AppRoute.HOME };
  }

  const type = String(data?.type || '').toUpperCase();
  const eventCategory = String(data?.event_category || '').toLowerCase();
  const eventAction = String(data?.event_action || '').toLowerCase();
  const appointmentId = data?.appointment_id || data?.appointmentId;
  const prescriptionId = data?.prescription_id || data?.prescriptionId || data?.rx_id || data?.rxId;
  const patientId = data?.patient_id || data?.patientId;

  // 1. Appointment / Video Call Notifications
  if (
    type === 'APPOINTMENT' ||
    type === 'VIDEO_CALL_ROOM' ||
    eventCategory === 'appointment' ||
    eventAction.includes('appointment') ||
    eventAction.includes('call') ||
    Boolean(appointmentId)
  ) {
    const formattedApptId = appointmentId
      ? isNaN(Number(appointmentId))
        ? appointmentId
        : Number(appointmentId)
      : undefined;

    return {
      name: AppRoute.APPOINTMENT_DETAILS,
      params: {
        appointmentId: formattedApptId,
        isComingFromNotification: true,
      },
    };
  }

  // 4. Notifications Screen
  if (type === 'NOTIFICATIONS' || eventCategory === 'notifications') {
    return {
      name: AppRoute.NOTIFICATIONS,
    };
  }

  // 5. Fallback Home Route
  return {
    name: AppRoute.HOME,
    params: { isComingFromNotification: true },
  };
}

export function handleNotificationClick(source: string, rawData?: any): void {
  const data = rawData?.data || rawData?.notification?.data || rawData;

  console.log('====================================================');
  console.log(`[PUSH NOTIFICATION CLICKED] Source: ${source}`);
  console.log('[PUSH NOTIFICATION PAYLOAD]:', JSON.stringify(data, null, 2));
  console.log('====================================================');

  const resolved = resolveNotificationRoute(data);

  const currentRouteName = navigationRef.isReady() ? navigationRef.getCurrentRoute()?.name : null;
  const isPastSplash =
    navigationRef.isReady() && Boolean(currentRouteName) && currentRouteName !== AppRoute.SPLASH;

  if (isPastSplash) {
    console.info(
      `[NotificationRouter] App is active on route "${currentRouteName}". Navigating immediately to "${resolved.name}" with params:`,
      resolved.params
    );
    // @ts-ignore
    navigationRef.navigate(resolved.name, resolved.params);
  } else {
    console.info(
      `[NotificationRouter] App is cold-starting (Current route: "${currentRouteName}"). Setting pending target for SplashScreen:`,
      resolved
    );
    pendingRoute = resolved;
  }
}

export function consumeTargetRoute(): { name: string; params?: any } {
  const route = pendingRoute || { name: AppRoute.HOME };
  pendingRoute = null;
  console.log('[NotificationRouter] SplashScreen resolved initial route:', route);
  return route;
}
