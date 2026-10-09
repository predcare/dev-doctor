import { MediaStream, RTCView } from '@videosdk.live/react-native-sdk';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePatientStream } from '../../../../hooks/commons/meeting/useMeetingParticipants';
import doctorMeetingStyles from '../../../../styled/DoctorMeetingScreen.styled';
import useMeetingStore from '../../../../zustand/stores/useMeetingStore';

export const PatientStageView: React.FC = () => {
  const remoteParticipantId = useMeetingStore(state => state.remoteParticipantId);
  const patientName = useMeetingStore(state => state.patientName);
  const callState = useMeetingStore(state => state.callState);

  const { webcamStream, webcamOn } = usePatientStream(remoteParticipantId);

  const name = patientName || 'Patient';
  const initial = name.charAt(0).toUpperCase() || 'P';
  const isConnected = callState === 'CONNECTED';

  if (webcamOn && webcamStream) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <RTCView
          streamURL={new MediaStream([webcamStream.track]).toURL()}
          objectFit="contain"
          style={StyleSheet.absoluteFill}
          zOrder={0}
        />
      </View>
    );
  }

  return (
    <View style={doctorMeetingStyles.stageContainer}>
      <Text style={doctorMeetingStyles.pipAvatarTxt}>{initial}</Text>
      <Text style={doctorMeetingStyles.waitingTitle}>
        {isConnected ? 'Patient camera off' : 'Waiting for patient'}
      </Text>
      <Text style={doctorMeetingStyles.waitingSubtitle}>{name}</Text>
    </View>
  );
};

export default PatientStageView;
