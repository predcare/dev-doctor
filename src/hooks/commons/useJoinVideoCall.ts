import { useCallback } from 'react';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import { showErrorToast, showInfoToast } from '../../lib/common/toast.utils';
import { navigate } from '../../navigation/navigationRef';
import { AppRoute } from '../../route';
import { useMeetingStore } from '../../zustand/stores/useMeetingStore';
import { getApptToken } from '../react-query/appointments/appointments.func';
import { MyAppointmentsQueryKeys } from '../react-query/query.keys';
import useDevicePermissions from './useDevicePermissions';

/** Only the fields the join-video-call flow actually needs. */
export interface IJoinVideoCallParams {
  id: string;
  appointment_id: string;
  patient_id: string;
  meeting_id?: string;
  call_duration_seconds?: number;
  start_time: string;
  end_time: string;
  doctorName?: string;
  patientAlphanumericId?: string;
}

const useJoinVideoCall = () => {
  const { setMeetingSession } = useMeetingStore(state => state);
  const { requestAudioVideoPermissions } = useDevicePermissions();

  const handleJoinVideoCall = useCallback(
    async (params: IJoinVideoCallParams) => {
      if (!params) return;

      const storeState = useMeetingStore.getState();
      const isCallActive =
        (storeState.callState === 'CONNECTED' || storeState.callState === 'CONNECTING') &&
        Boolean(storeState.token && storeState.meetingId);

      const isCurrentAppt =
        isCallActive &&
        (String(storeState.appointmentId) === String(params.id) ||
          (Boolean(params.appointment_id) &&
            storeState.appointmentGeneratedId === params.appointment_id));

      if (isCurrentAppt) {
        storeState.setIsInAppPip(false);
        navigate(AppRoute.DOCTOR_APPOINTMENTS);
        return;
      }

      if (isCallActive) {
        showInfoToast('Please complete the ongoing call before joining a new one');
        return;
      }

      const hasPermissions = await requestAudioVideoPermissions();
      if (!hasPermissions) {
        showErrorToast('Failed to fetch meeting credentials');
        return;
      }

      const apptId = params.id;
      let token: string | undefined;
      let meetingId: string | undefined = params.meeting_id;
      let call_duration_seconds: number | undefined = params.call_duration_seconds;
      if (!apptId) {
        showErrorToast('No appointment ID');
        return;
      }
      if (!params.patient_id) return showErrorToast('No patient ID');

      try {
        const tokenResponse = await queryClient.fetchQuery({
          queryKey: [MyAppointmentsQueryKeys.GET_TOKEN, 'token', apptId],
          queryFn: () => getApptToken(apptId),
        });
        token = tokenResponse?.data?.token || '';
        meetingId = tokenResponse?.data?.meeting_id || '';
      } catch (error) {
        console.error('Failed to fetch fresh appointment token:', error);
      }

      if (!token || !meetingId) {
        return showErrorToast('Failed to fetch meeting credentials');
      }

      const cleanedToken = token?.trim().replace(/^["']|["']$/g, '');
      const cleanedMeetingId = meetingId?.trim().replace(/^["']|["']$/g, '');

      if (!cleanedToken || !cleanedMeetingId) {
        showErrorToast('Invalid meeting credentials');
        return;
      }

      const docName = params.doctorName || 'Doctor';
      const docDisplayName = docName.startsWith('Dr.') ? docName : `Dr. ${docName}`;

      setMeetingSession({
        token: cleanedToken,
        meetingId: cleanedMeetingId,
        appointmentId: apptId,
        patientName: docDisplayName,
        patientAlphanumericId: params.patientAlphanumericId,
        appointmentGeneratedId: params.appointment_id,
        startTime: params.start_time,
        endTime: params.end_time,
        callDurationSeconds: call_duration_seconds ?? 0,
        patientUserId: String(params.patient_id),
      });

      navigate(AppRoute.DOCTOR_MEETING);
    },
    [setMeetingSession, requestAudioVideoPermissions]
  );

  return { handleJoinVideoCall };
};

export default useJoinVideoCall;
