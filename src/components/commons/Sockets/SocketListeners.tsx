import { useEffect } from 'react';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import { SocketEvents } from '../../../config/socket.constants';
import { leaveActiveMeeting } from '../../../hooks/commons/meeting/meetingSessionLeave';
import { MyAppointmentsQueryKeys } from '../../../hooks/react-query/query.keys';
import { showInfoToast } from '../../../lib/commons/toast.utils';
import NativePip from '../../../native/NativePip';
import { navigationRef, resetRoot } from '../../../navigation/navigationRef';
import { AppRoute } from '../../../route';
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

    const handleTimeUpVideoCallEnded = async (payload: { appointmentId: string | number }) => {
      const incomingApptId = payload?.appointmentId;
      if (!incomingApptId) return;

      const meetingState = useMeetingStore.getState();
      const isCallActiveForThisAppt = String(incomingApptId) === String(meetingState.appointmentId);

      if (!isCallActiveForThisAppt) return;

      await leaveActiveMeeting();
      NativePip.exitPipMode();
      NativePip.setMeetingScreenState(false);

      useMeetingStore.getState().resetCallInfo();
      useLoadingStore.getState().hideLoader();

      showInfoToast('Consultation time has ended. The call has ended.', 'Time Up');

      await queryClient.invalidateQueries({
        queryKey: [MyAppointmentsQueryKeys.MyAppointments],
      });
      await queryClient.invalidateQueries({
        queryKey: [MyAppointmentsQueryKeys.MyAppointmentsInfo],
      });

      if (navigationRef.isReady()) {
        resetRoot(AppRoute.CONSULTATION_COMPLETED, {
          appointmentId: incomingApptId,
        });
      }
    };

    socketConnection.on(SocketEvents.HEARTBEAT, handleHeartbeat);
    socketConnection.on(SocketEvents.TIME_UP_VIDEO_CALL_ENDED, handleTimeUpVideoCallEnded);

    return () => {
      socketConnection.off(SocketEvents.HEARTBEAT, handleHeartbeat);
      socketConnection.off(SocketEvents.TIME_UP_VIDEO_CALL_ENDED, handleTimeUpVideoCallEnded);
    };
  }, [socketConnection]);

  return null;
};

export default SocketListeners;
