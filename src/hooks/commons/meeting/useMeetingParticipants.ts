import { useMeeting, useParticipant } from '@videosdk.live/react-native-sdk';
import { useEffect, useMemo } from 'react';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';

export const useMeetingParticipants = () => {
  const { participants, localParticipant } = useMeeting({});
  const setRemoteParticipantId = useMeetingStore(state => state.setRemoteParticipantId);

  const patientId = useMemo(() => {
    if (!participants) return null;
    for (const [id] of participants) {
      if (id !== localParticipant?.id) {
        return id;
      }
    }
    return null;
  }, [participants, localParticipant?.id]);

  useEffect(() => {
    setRemoteParticipantId(patientId);
  }, [patientId, setRemoteParticipantId]);

  return {
    localParticipant,
    patientId,
  };
};

export const usePatientStream = (patientId: string | null) => {
  const participantData = useParticipant(patientId || '', {});

  const webcamStream = patientId ? participantData?.webcamStream : null;
  const webcamOn = patientId ? Boolean(participantData?.webcamOn) : false;
  const micOn = patientId ? Boolean(participantData?.micOn) : true;
  const displayName = patientId ? participantData?.displayName : '';

  return {
    webcamStream,
    webcamOn,
    micOn,
    displayName,
  };
};

export default useMeetingParticipants;
