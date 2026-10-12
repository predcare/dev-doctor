import { useCallback } from 'react';
import { useGetToken } from '../../react-query/appointments/appointments.hooks';
import { showErrorToast } from '../../../lib/commons/toast.utils';
import { navigate } from '../../../navigation/navigationRef';
import { AppRoute } from '../../../route';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import { useDevicePermissions } from '../useDevicePermissions';
import useMeetingPip from './useMeetingPip';

export interface IJoinVideoCallInput {
  appointmentId?: string | number | null;
  patientName?: string;
  patientId?: string | number | null;
}

export const useJoinVideoCall = () => {
  const { mutate: getToken } = useGetToken();
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
      getToken(
        { appointmentId: String(appointmentId) },
        {
          onSuccess: res => {
            const videoCallData = res?.data;
            if (res?.success && videoCallData) {
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
            showErrorToast(res?.message || 'Unable to join the video consultation.');
          },
          onError: () => {
            showErrorToast('Unable to join the video consultation.');
          },
          onSettled: () => hideLoader(),
        }
      );
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
