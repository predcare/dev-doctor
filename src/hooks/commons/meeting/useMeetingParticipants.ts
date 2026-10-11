import { useMeeting, useParticipant } from '@videosdk.live/react-native-sdk';
import { useEffect, useMemo } from 'react';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';

export const useMeetingParticipants = () => {
  const { participants, localParticipant } = useMeeting({});
  const setPatientParticipant = useMeetingStore(state => state.setPatientParticipant);
  const setCallState = useMeetingStore(state => state.setCallState);
  const currentCallState = useMeetingStore(state => state.callState);

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
    if (patientId) {
      setPatientParticipant({ id: patientId });
      if (currentCallState === 'WAITING_FOR_PATIENT' || currentCallState === 'CONNECTING') {
        setCallState('CONNECTED');
      }
    } else {
      setPatientParticipant({ id: null, webcamOn: false });
      if (currentCallState === 'CONNECTED') {
        setCallState('WAITING_FOR_PATIENT');
      }
    }
  }, [patientId, currentCallState, setPatientParticipant, setCallState]);

  return {
    localParticipant,
    patientId,
  };
};

export const usePatientStream = (patientId: string | null) => {
  const setPatientParticipant = useMeetingStore(state => state.setPatientParticipant);

  const participantData = useParticipant(patientId || '', {
    onStreamEnabled: stream => {
      if (stream.kind === 'video') {
        setPatientParticipant({ id: patientId, webcamOn: true });
      }
    },
    onStreamDisabled: stream => {
      if (stream.kind === 'video') {
        setPatientParticipant({ id: patientId, webcamOn: false });
      }
    },
  });

  const webcamStream = patientId ? participantData?.webcamStream : null;
  const webcamOn = patientId ? Boolean(participantData?.webcamOn) : false;
  const micOn = patientId ? Boolean(participantData?.micOn) : true;
  const displayName = patientId ? participantData?.displayName : '';

  useEffect(() => {
    if (patientId) {
      setPatientParticipant({
        id: patientId,
        webcamOn,
        micOn,
      });
    }
  }, [patientId, webcamOn, micOn, setPatientParticipant]);

  return {
    webcamStream,
    webcamOn,
    micOn,
    displayName,
  };
};

export default useMeetingParticipants;
