import { Platform } from 'react-native';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import {
  createCameraTrack,
  createMicTrack,
  setPendingTracks,
  stopStream,
} from '../../hooks/commons/meeting/meetingMediaTracks';
import {
  getApptToken,
  getMyAppointmentInfo,
} from '../../hooks/react-query/appointments/appointments.func';
import { MyAppointmentsQueryKeys } from '../../hooks/react-query/query.keys';
import { ensureClinicAccess } from '../../lib/commons/auth.Utils';
import { showErrorToast, showInfoToast } from '../../lib/commons/toast.utils';
import { navigate } from '../../navigation/navigationRef';
import { AppRoute } from '../../route';
import { ConsultStatus } from '../../typescripts/enums';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../zustand/stores/useMeetingStore';

const CALL_PERMISSIONS =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]
    : [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO];

// An appointment in one of these states has no call left to join.
const ENDED_STATUSES: string[] = [
  ConsultStatus.COMPLETED,
  ConsultStatus.CANCELLED,
  ConsultStatus.NO_SHOW,
];

const hasCallPermissions = async (): Promise<boolean> => {
  const result = await requestMultiple(CALL_PERMISSIONS);
  return CALL_PERMISSIONS.every(
    permission => result[permission] === RESULTS.GRANTED || result[permission] === RESULTS.LIMITED
  );
};

// Opens the mic and camera once, so MeetingProvider does not open them a second time.
// Never rejects: a failed track is undefined and the SDK opens that device itself.
const openJoinTracks = async () => {
  const [micResult, cameraResult] = await Promise.allSettled([
    createMicTrack(),
    useMeetingStore.getState().isCamOn ? createCameraTrack('hd') : Promise.resolve(undefined),
  ]);
  return {
    mic: micResult.status === 'fulfilled' ? micResult.value : undefined,
    camera: cameraResult.status === 'fulfilled' ? cameraResult.value : undefined,
  };
};

type TJoinTracks = Awaited<ReturnType<typeof openJoinTracks>>;

const releaseJoinTracks = ({ camera, mic }: TJoinTracks) => {
  stopStream(camera);
  stopStream(mic);
};

/**
 * Joins a call answered from a push (Android Answer button, CallKit Answer or a tap on the call
 * notification). Same steps as useJoinVideoCall, which stays as it is, but runs outside React. The
 * meeting token always comes from getApptToken, never from the push.
 */
export const joinIncomingCall = async (appointmentId: string, patientName: string): Promise<void> => {
  // Already in a consultation (for example the same answer reaching here twice).
  if (useMeetingStore.getState().callInfo?.meetingId) return;

  // Same gate as every Join button (inactive clinic or expired subscription).
  if (!ensureClinicAccess()) return;

  if (!(await hasCallPermissions())) {
    showErrorToast('Camera and microphone permissions are required to join the video consultation.');
    return;
  }

  const { showLoader, hideLoader } = useLoadingStore.getState();
  // Open the mic and camera while the appointment and token load; handed to the provider on
  // success, released on any failure.
  const tracksPromise = openJoinTracks();
  let tracksHandedOver = false;

  try {
    showLoader('Joining Video Call...');

    const apptResponse = await queryClient.fetchQuery({
      // Same key as useMyAppointmentInfo({ id }).
      queryKey: [MyAppointmentsQueryKeys.MyAppointmentsInfo, { id: appointmentId }],
      queryFn: () => getMyAppointmentInfo(appointmentId),
      // Never a cached copy: the appointment's status decides whether there is still a call.
      staleTime: 0,
    });
    const apptInfo = apptResponse?.data;
    if (!apptInfo) {
      showErrorToast('Failed to load appointment details');
      return;
    }

    const status = String(apptInfo.appointment_status || '').toLowerCase();
    if (ENDED_STATUSES.includes(status)) {
      showInfoToast('This consultation has already ended.', 'Call ended');
      return;
    }

    const tokenRes = await getApptToken(appointmentId);
    const videoCallData = tokenRes?.data;
    if (!tokenRes?.success || !videoCallData) {
      showErrorToast(tokenRes?.message || 'Unable to join the video consultation.');
      return;
    }

    setPendingTracks(await tracksPromise);
    tracksHandedOver = true;
    // Same shape as useJoinVideoCall's setCallInfo.
    const patientId = videoCallData.patient?.id ?? apptInfo.patient?.id ?? apptInfo.patient_id;
    useMeetingStore.getState().setCallInfo({
      token: videoCallData.token,
      meeting_id: videoCallData.meeting_id,
      appointment: videoCallData.appointment,
      patientInfo: {
        name: videoCallData.patient?.name ?? apptInfo.patient?.name ?? patientName,
        patientId: patientId ? String(patientId) : undefined,
      },
    });

    navigate(AppRoute.DOCTOR_MEETING);
  } catch (error) {
    console.error('[joinIncomingCall] Join failed:', error);
    showErrorToast('Failed to join the call. Please try again.');
  } finally {
    if (!tracksHandedOver) releaseJoinTracks(await tracksPromise);
    hideLoader();
  }
};
