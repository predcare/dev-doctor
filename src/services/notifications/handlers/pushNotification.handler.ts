import { ensureClinicAccess } from '../../../lib/commons/auth.Utils';
import { setTargetRoute } from '../../../lib/commons/navigation.utils';
import { resolveNotificationModalNavigation } from '../../../lib/commons/notificationModal.utils';
import { navigate, navigationRef, resetRoot } from '../../../navigation/navigationRef';
import { AppRoute } from '../../../route';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import { callFromPush } from '../../calls/callPayload';
import { answerCall } from '../../calls/callService';
import { NotificationEventActions, PushNotificationData } from '../notification.types';

// Pushes that belong to one appointment open AppointmentDetails.
const APPOINTMENT_ACTIONS: string[] = [
  NotificationEventActions.PATIENT_JOINED_CALL, // "Patient is waiting for Consultation"
  NotificationEventActions.CALL_ENDED,
  NotificationEventActions.APPOINTMENT_BOOKED,
  NotificationEventActions.APPOINTMENT_CONFIRMED,
  NotificationEventActions.APPOINTMENT_CANCELLED,
  NotificationEventActions.APPOINTMENT_RESCHEDULED,
  NotificationEventActions.APPOINTMENT_COMPLETED,
  NotificationEventActions.APPOINTMENT_REMINDER,
];

// Screens a tap must not navigate away from: the setup steps the doctor still has to finish, and a live call.
const PROTECTED_ROUTES: string[] = [
  AppRoute.EMAIL_VERIFY,
  AppRoute.POLICY_ACCEPTANCE,
  AppRoute.DOCTOR_MEETING,
];

const resolvePushRoute = (data: PushNotificationData = {}): { name: string; params?: object } => {
  const action = String(data.event_action ?? '');

  if (APPOINTMENT_ACTIONS.includes(action)) {
    // data.id is the numeric appointment ID; data.appointment_id is a display code the API can't load.
    return data.id
      ? {
          name: AppRoute.APPOINTMENT_DETAILS,
          params: { appointmentId: String(data.id), isComingFromNotification: true },
        }
      : { name: AppRoute.APPOINTMENTS };
  }

  // Everything else (EMR, patients, ...) uses the same routing as the in-app notification list.
  return resolveNotificationModalNavigation(data);
};

export const handlePushNotificationPress = (data?: PushNotificationData): void => {
  // A tap on the incoming call notification (the iOS system alert) answers the call.
  const incomingCall = callFromPush(data);
  if (incomingCall) {
    answerCall(incomingCall.callId, incomingCall);
    return;
  }

  const route = resolvePushRoute(data);
  const currentRoute = navigationRef.isReady() ? navigationRef.getCurrentRoute()?.name : undefined;

  // Still starting up: SplashScreen opens this route once it knows the doctor can see it.
  if (!currentRoute || currentRoute === AppRoute.SPLASH) {
    setTargetRoute(route);
    return;
  }

  if (!useAuthStore.getState().isLoggedIn || PROTECTED_ROUTES.includes(currentRoute)) return;
  // Same gate as NotificationScreen.handleNotificationPress.
  if (!ensureClinicAccess()) return;

  if (route.name === AppRoute.HOME) {
    // navigate() could stack a second Home on top of the existing one.
    resetRoot(AppRoute.HOME);
  } else {
    navigate(route.name as never, route.params as never);
  }
};
