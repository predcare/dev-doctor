import { MediaStream, RTCView } from '@videosdk.live/react-native-sdk';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePatientStream } from '../../../../hooks/commons/meeting/useMeetingParticipants';
import doctorMeetingStyles from '../../../../styled/DoctorMeetingScreen.styled';
import useMeetingStore from '../../../../zustand/stores/useMeetingStore';

export const PatientStageView: React.FC = () => {
  const patientParticipantId = useMeetingStore(state => state.patientParticipantId);
  const patientName = useMeetingStore(state => state.patientInfo?.name);
  const callState = useMeetingStore(state => state.callState);

  const { webcamStream, webcamOn } = usePatientStream(patientParticipantId);
  const remoteTrack = webcamOn && webcamStream ? webcamStream.track : null;
  const remoteStreamURL = useMemo(
    () => (remoteTrack ? new MediaStream([remoteTrack]).toURL() : null),
    [remoteTrack],
  );

  const name = patientName || 'Patient';
  const initial = name.charAt(0).toUpperCase() || 'P';
  const isConnected = callState === 'CONNECTED';

  if (remoteStreamURL) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <RTCView
          streamURL={remoteStreamURL}
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
