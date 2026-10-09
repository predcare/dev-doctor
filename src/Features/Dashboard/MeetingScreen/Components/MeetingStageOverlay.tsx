import React from 'react';
import { StyleSheet, View } from 'react-native';
import useMeetingConnection from '../../../../hooks/commons/meeting/useMeetingConnection';
import SafeAreaWrapper from '../../../../Layout/SafeAreaWrapper';
import doctorMeetingStyles from '../../../../styled/DoctorMeetingScreen.styled';
import LocalPipCard from './LocalPipCard';
import MeetingController from './MeetingController';
import MeetingHeader from './MeetingHeader';
import PatientStageView from './PatientStageView';

export const MeetingStageOverlay: React.FC = () => {
  const { endCall } = useMeetingConnection();

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 9999 }]}>
      <SafeAreaWrapper style={doctorMeetingStyles.container} backgroundColor="#000000">
        <View style={doctorMeetingStyles.stageContainerFull}>
          <PatientStageView />
          <MeetingHeader />
          <LocalPipCard />
          <MeetingController handleEndCall={endCall} />
        </View>
      </SafeAreaWrapper>
    </View>
  );
};

export default MeetingStageOverlay;
