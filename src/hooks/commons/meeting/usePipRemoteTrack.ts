import { useEffect } from 'react';
import { Platform } from 'react-native';
import NativePip from '../../../native/NativePip';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';
import { usePatientStream } from './useMeetingParticipants';

export const usePipRemoteTrack = () => {
  const remoteParticipantId = useMeetingStore(state => state.remoteParticipantId);
  const patientName = useMeetingStore(state => state.patientName);
  const { webcamStream, webcamOn } = usePatientStream(remoteParticipantId);

  const trackId = webcamOn && webcamStream?.track ? webcamStream.track.id : null;

  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    if (trackId) {
      NativePip.attachRemoteRenderer(trackId);
    } else {
      NativePip.detachRemoteRenderer();
    }
  }, [trackId]);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    const name = patientName || 'Patient';
    NativePip.setPlaceholderText(
      remoteParticipantId ? `${name}\ncamera off` : 'Waiting for patient...'
    );
  }, [remoteParticipantId, patientName]);

  useEffect(() => {
    return () => {
      if (Platform.OS === 'ios') {
        NativePip.detachRemoteRenderer();
      }
    };
  }, []);
};

export default usePipRemoteTrack;
