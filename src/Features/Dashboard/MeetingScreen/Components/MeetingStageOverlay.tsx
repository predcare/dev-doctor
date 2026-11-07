import React, { memo } from 'react';
import { StatusBar, View } from 'react-native';
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
    <View style={doctorMeetingStyles.stageOverlay}>
      <StatusBar barStyle="light-content" />

      {/* Full-screen remote patient video, edge to edge behind the system bars */}
      <View style={doctorMeetingStyles.fullScreenStage}>
        <PatientStageView />
      </View>

      <SafeAreaWrapper style={doctorMeetingStyles.stageContent} backgroundColor="transparent">
        <View style={doctorMeetingStyles.stageControls} pointerEvents="box-none">
          <MeetingHeader />
          <LocalPipCard />
          <MeetingController handleEndCall={endCall} />
        </View>
      </SafeAreaWrapper>
    </View>
  );
};

export default memo(MeetingStageOverlay);
