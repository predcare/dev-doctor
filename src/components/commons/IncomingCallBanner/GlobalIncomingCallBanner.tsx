import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import useJoinVideoCall from '../../../hooks/commons/meeting/useJoinVideoCall';
import useMeetingPip from '../../../hooks/commons/meeting/useMeetingPip';
import { showErrorToast } from '../../../lib/commons/toast.utils';
import { useIncomingCallStore } from '../../../zustand/stores/useIncomingCallStore';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import IncomingCallBanner from './IncomingCallBanner';

export const GlobalIncomingCallBanner: React.FC = () => {
  const { visible, patientName, callType, appointmentId, meetingId, hideCallBanner } =
    useIncomingCallStore(
      useShallow(state => ({
        visible: state.visible,
        patientName: state.patientName,
        callType: state.callType,
        appointmentId: state.appointmentId,
        meetingId: state.meetingId,
        hideCallBanner: state.hideCallBanner,
      }))
    );
  const { joinVideoCall } = useJoinVideoCall();
  const { restoreToMeeting } = useMeetingPip();

  if (!visible) return null;

  const handleJoin = () => {
    if (!appointmentId) {
      showErrorToast('No appointment ID found');
      return;
    }

    const meetingState = useMeetingStore.getState();
    const activeAppointment = meetingState.callInfo?.appointment;
    const incomingId = String(appointmentId);
    const sameAppointment =
      Boolean(meetingState.callInfo?.meetingId) &&
      (incomingId === String(meetingState.appointmentId) ||
        incomingId === String(activeAppointment?.id) ||
        (Boolean(activeAppointment?.appointmentId) &&
          incomingId === String(activeAppointment?.appointmentId)));
    const sameMeeting =
      !meetingId || String(meetingId) === String(meetingState.callInfo?.meetingId);

    if (sameAppointment && sameMeeting) {
      hideCallBanner();
      restoreToMeeting();
      return;
    }

    hideCallBanner();
    joinVideoCall({
      appointmentId,
      patientName,
    });
  };

  return (
    <IncomingCallBanner
      visible={visible}
      patientName={patientName}
      callType={callType}
      onJoin={handleJoin}
    />
  );
};

export default GlobalIncomingCallBanner;
