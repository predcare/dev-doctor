import { useCallback } from 'react';
import { useGetToken } from '../../react-query/appointments/appointments.hooks';
import { showErrorToast } from '../../../lib/commons/toast.utils';
import { navigate } from '../../../navigation/navigationRef';
import { AppRoute } from '../../../route';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import { useDevicePermissions } from '../useDevicePermissions';
import {
  createCameraTrack,
  createMicTrack,
  setPendingTracks,
  stopStream,
} from './meetingMediaTracks';
import useMeetingPip from './useMeetingPip';

export interface IJoinVideoCallInput {
  appointmentId?: string | number | null;
  patientName?: string;
  patientId?: string | number | null;
}

export const useJoinVideoCall = () => {
  const { mutateAsync: getToken } = useGetToken();
  const { showLoader, hideLoader } = useLoadingStore(state => state);
  const setCallInfo = useMeetingStore(state => state.setCallInfo);
  const activeMeetingId = useMeetingStore(state => state.callInfo?.meetingId);
  const activeCallAppointmentId = useMeetingStore(state => state.callInfo?.appointment?.id);
  const { restoreToMeeting } = useMeetingPip();
  const { requestAudioVideoPermissions } = useDevicePermissions();

  const joinVideoCall = useCallback(
    async ({ appointmentId, patientName, patientId }: IJoinVideoCallInput) => {
      if (!appointmentId) return;

      if (activeMeetingId && String(activeCallAppointmentId) === String(appointmentId)) {
        restoreToMeeting();
        return;
      }

      const hasPermissions = await requestAudioVideoPermissions();
      if (!hasPermissions) {
        showErrorToast(
          'Camera and microphone permissions are required to join the video consultation.'
        );
        return;
      }

      showLoader('Joining Video Call...');
      // Open the mic and camera once, in parallel with the token request, and hand them to
      // MeetingProvider. If track creation fails the SDK opens the devices itself, as before.
      const [tokenResult, micResult, cameraResult] = await Promise.allSettled([
        getToken({ appointmentId: String(appointmentId) }),
        createMicTrack(),
        useMeetingStore.getState().isCamOn ? createCameraTrack('hd') : Promise.resolve(undefined),
      ]);
      const mic = micResult.status === 'fulfilled' ? micResult.value : undefined;
      const camera = cameraResult.status === 'fulfilled' ? cameraResult.value : undefined;

      try {
        if (tokenResult.status === 'rejected') {
          stopStream(camera);
          stopStream(mic);
          showErrorToast('Unable to join the video consultation.');
          return;
        }

        const res = tokenResult.value;
        const videoCallData = res?.data;
        if (res?.success && videoCallData) {
          setPendingTracks({ camera, mic });
          setCallInfo({
            token: videoCallData.token,
            meeting_id: videoCallData.meeting_id,
            appointment: videoCallData.appointment,
            patientInfo: {
              name: videoCallData.patient?.name ?? patientName,
              patientId: videoCallData.patient?.id
                ? String(videoCallData.patient.id)
                : patientId
                  ? String(patientId)
                  : undefined,
            },
          });
          navigate(AppRoute.DOCTOR_MEETING);
          return;
        }
        stopStream(camera);
        stopStream(mic);
        showErrorToast(res?.message || 'Unable to join the video consultation.');
      } finally {
        hideLoader();
      }
    },
    [
      activeCallAppointmentId,
      activeMeetingId,
      getToken,
      hideLoader,
      requestAudioVideoPermissions,
      restoreToMeeting,
      setCallInfo,
      showLoader,
    ]
  );

  return { joinVideoCall };
};

export default useJoinVideoCall;
