import React, { memo } from 'react';
import { View } from 'react-native';
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
    <View style={[doctorMeetingStyles.overlayRoot, { zIndex: 9999, elevation: 9999 }]}>
      {/* Edge to edge, behind the status bar and navigation bar */}
      <PatientStageView />
      <SafeAreaWrapper style={doctorMeetingStyles.overlaySafeArea} backgroundColor="transparent">
        <View style={doctorMeetingStyles.overlayContent}>
          <MeetingHeader />
          <LocalPipCard />
          <MeetingController handleEndCall={endCall} />
        </View>
      </SafeAreaWrapper>
    </View>
  );
};

export default memo(MeetingStageOverlay);
