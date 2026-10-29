import { useEffect } from 'react';
import { Platform } from 'react-native';
import NativePip from '../../../native/NativePip';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';
import { usePatientStream } from './useMeetingParticipants';

export const usePipRemoteTrack = () => {
  const patientParticipantId = useMeetingStore(state => state.patientParticipantId);
  const patientName = useMeetingStore(state => state.patientInfo?.name);
  const isAudioOnly = useMeetingStore(state => state.videoTier === 'audio');
  const { webcamStream, webcamOn } = usePatientStream(patientParticipantId);

  const trackId = !isAudioOnly && webcamOn && webcamStream?.track ? webcamStream.track.id : null;

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
      patientParticipantId ? `${name}\ncamera off` : 'Waiting for patient...'
    );
  }, [patientParticipantId, patientName]);

  useEffect(() => {
    return () => {
      if (Platform.OS === 'ios') {
        NativePip.detachRemoteRenderer();
      }
    };
  }, []);
};

export default usePipRemoteTrack;
