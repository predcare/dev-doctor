import notifee, { AndroidForegroundServiceType, AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { TCallState } from '../../../zustand/stores/useMeetingStore';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';

const MEETING_NOTIFICATION_ID = 'meeting-ongoing';
const MEETING_CHANNEL_ID = 'meeting-ongoing';

const SERVICE_STATES: TCallState[] = ['CONNECTING', 'CONNECTED'];

const createMeetingOngoingChannel = async (): Promise<string> => {
  return notifee.createChannel({
    id: MEETING_CHANNEL_ID,
    name: 'Ongoing Consultation',
    description: 'Shown while a video consultation is in progress',
    importance: AndroidImportance.LOW,
    visibility: AndroidVisibility.PUBLIC,
    vibration: false,
  });
};

const startMeetingService = async (patientName?: string | null) => {
  const channelId = await createMeetingOngoingChannel();
  const hasCamera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
  const hasMic = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);

  const foregroundServiceTypes: AndroidForegroundServiceType[] = [];
  if (hasCamera) {
    foregroundServiceTypes.push(AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_CAMERA);
  }
  if (hasMic) {
    foregroundServiceTypes.push(AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_MICROPHONE);
  }
  if (foregroundServiceTypes.length === 0) return;

  await notifee.displayNotification({
    id: MEETING_NOTIFICATION_ID,
    title: 'PRED Care Consultation',
    body: patientName
      ? `Video consultation with ${patientName} in progress`
      : 'Video consultation in progress',
    android: {
      channelId,
      asForegroundService: true,
      foregroundServiceTypes,
      ongoing: true,
      autoCancel: false,
      onlyAlertOnce: true,
      pressAction: { id: 'default', launchActivity: 'default' },
    },
  });
};

const stopMeetingService = async () => {
  try {
    await notifee.stopForegroundService();
    await notifee.cancelNotification(MEETING_NOTIFICATION_ID);
  } catch (e) {
    console.warn('[useAndroidCallForegroundService] stop error:', e);
  }
};

export const useAndroidCallForegroundService = () => {
  const callState = useMeetingStore(state => state.callState);
  const patientName = useMeetingStore(state => state.patientName);
  const runningRef = useRef(false);

  const shouldRun = SERVICE_STATES.includes(callState);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    if (shouldRun && !runningRef.current) {
      runningRef.current = true;
      startMeetingService(patientName).catch(e => {
        runningRef.current = false;
        console.warn('[useAndroidCallForegroundService] start error:', e);
      });
    } else if (!shouldRun && runningRef.current) {
      runningRef.current = false;
      stopMeetingService();
    }
  }, [shouldRun, patientName]);

  useEffect(() => {
    return () => {
      if (Platform.OS === 'android' && runningRef.current) {
        runningRef.current = false;
        stopMeetingService();
      }
    };
  }, []);
};

export default useAndroidCallForegroundService;
