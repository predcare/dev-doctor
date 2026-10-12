import { useEffect } from 'react';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import { SocketEvents } from '../../../config/socket.constants';
import { leaveActiveMeeting } from '../../../hooks/commons/meeting/meetingSessionLeave';
import { MyAppointmentsQueryKeys } from '../../../hooks/react-query/query.keys';
import { showInfoToast } from '../../../lib/commons/toast.utils';
import NativePip from '../../../native/NativePip';
import { navigationRef, resetRoot } from '../../../navigation/navigationRef';
import { AppRoute } from '../../../route';
import { useAlertStore } from '../../../zustand/stores/useAlertStore';
import useIncomingCallStore from '../../../zustand/stores/useIncomingCallStore';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import { useSocketStore } from '../../../zustand/stores/useSocketStore';

const SocketListeners = () => {
  const socketConnection = useSocketStore(state => state.socketConnection);

  useEffect(() => {
    if (!socketConnection) return;

    const handleHeartbeat = (payload: unknown) => {
      console.log('[Socket] HEARTBEAT received:', payload);
    };

    const handleIncomingCall = (payload: {
      appointmentId: string;
      name: string;
      meetingId: string;
      callType: string;
    }) => {
      const activeMeetingId = useMeetingStore.getState().callInfo?.meetingId;
      if (activeMeetingId && payload.meetingId) {
        return;
      }
      if (payload?.appointmentId) {
        useIncomingCallStore.getState().showCallBanner({
          appointmentId: payload.appointmentId,
          callType: payload?.callType,
          patientName: payload?.name,
          meetingId: payload?.meetingId,
        });
      }
    };

    const handleCallCancelled = (payload: { appointmentId: string }) => {
      if (payload?.appointmentId) {
        const incomingState = useIncomingCallStore.getState();
        if (String(payload.appointmentId) === String(incomingState.appointmentId)) {
          incomingState.hideCallBanner();
        }
      }
    };

    const handleCallConnected = (payload: { appointmentId: string }) => {
      if (payload?.appointmentId) {
        const incomingState = useIncomingCallStore.getState();
        if (String(payload.appointmentId) === String(incomingState.appointmentId)) {
          incomingState.hideCallBanner();
        }
      }
    };

    const handleTimeUpVideoCallEnded = async (payload: { appointmentId: string | number }) => {
      const incomingApptId = payload?.appointmentId;
      if (!incomingApptId) return;

      const incomingState = useIncomingCallStore.getState();
      if (String(incomingApptId) === String(incomingState.appointmentId)) {
        incomingState.hideCallBanner();
      }

      const meetingState = useMeetingStore.getState();
      const isCallActiveForThisAppt = String(incomingApptId) === String(meetingState.appointmentId);
      const isCreatePrescription =
        navigationRef.getCurrentRoute()?.name === AppRoute.CREATE_PRESCRIPTION;

      if (!isCallActiveForThisAppt) return;

      await leaveActiveMeeting();
      NativePip.exitPipMode();
      NativePip.setMeetingScreenState(false);

      useMeetingStore.getState().resetCallInfo();
      useLoadingStore.getState().hideLoader();

      await queryClient.invalidateQueries({
        queryKey: [MyAppointmentsQueryKeys.MyAppointments],
      });
      await queryClient.invalidateQueries({
        queryKey: [MyAppointmentsQueryKeys.MyAppointmentsInfo],
      });

      if (isCreatePrescription) {
        useAlertStore.getState().showInfo(
          'The consultation time is over. The call has ended.',
          'Time Up'
        );
        return;
      }

      showInfoToast('Consultation time has ended. The call has ended.', 'Time Up');

      if (navigationRef.isReady()) {
        resetRoot(AppRoute.CONSULTATION_COMPLETED, {
          appointmentId: incomingApptId,
        });
      }
    };

    socketConnection.on(SocketEvents.HEARTBEAT, handleHeartbeat);
    socketConnection.on(SocketEvents.INCOMING_CALL, handleIncomingCall);
    socketConnection.on(SocketEvents.INCOMING_CALL_CANCELLED, handleCallCancelled);
    socketConnection.on(SocketEvents.TIME_UP_VIDEO_CALL_ENDED, handleTimeUpVideoCallEnded);
    socketConnection.on(SocketEvents.CALL_CONNECTED, handleCallConnected);

    return () => {
      socketConnection.off(SocketEvents.HEARTBEAT, handleHeartbeat);
      socketConnection.off(SocketEvents.INCOMING_CALL, handleIncomingCall);
      socketConnection.off(SocketEvents.INCOMING_CALL_CANCELLED, handleCallCancelled);
      socketConnection.off(SocketEvents.TIME_UP_VIDEO_CALL_ENDED, handleTimeUpVideoCallEnded);
      socketConnection.off(SocketEvents.CALL_CONNECTED, handleCallConnected);
    };
  }, [socketConnection]);

  return null;
};

export default SocketListeners;
