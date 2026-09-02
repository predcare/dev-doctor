import { useMeeting } from '@videosdk.live/react-native-sdk';
import React, { useCallback } from 'react';
import { NativeModules, Platform, StyleSheet, View } from 'react-native';
import { navigationRef } from '../../../navigation/navigationRef';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import { DoctorMeetingContainer } from './DoctorMeetingContainer';
import { InAppPipOverlay } from './InAppPipOverlay';
import { MeetingStageContainer } from './MeetingStageContainer';

const { PiPModule } = NativeModules;

const MeetingSessionController: React.FC = () => {
  const { leave } = useMeeting();
  const {
    isInAppPip,
    setIsInAppPip,
    isNativePip,
    callState,
    remoteParticipantId,
    errorMessage,
    resetMeetingStore,
  } = useMeetingStore();

  const handleExpandFromPip = useCallback(() => {
    setIsInAppPip(false);
    if (navigationRef.isReady()) {
      (navigationRef as any).navigate('DoctorMeeting');
    }
  }, [setIsInAppPip]);

  const handleEndCall = useCallback(() => {
    try {
      if (leave) {
        leave();
      }
    } catch (e) {
      console.warn('[GlobalMeetingManager]: Error leaving call:', e);
    }
    if (Platform.OS === 'android' && PiPModule?.setCallActive) {
      PiPModule.setCallActive(false).catch?.(() => {});
    }
    resetMeetingStore();
    if (navigationRef.isReady()) {
      (navigationRef as any).navigate('DoctorAppointments');
    }
  }, [leave, resetMeetingStore]);

  if (isNativePip) {
    return (
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#000000', zIndex: 999999 }]}>
        <MeetingStageContainer
          callState={callState}
          remoteParticipantId={remoteParticipantId}
          errorMessage={errorMessage}
          onGoBack={handleEndCall}
        />
      </View>
    );
  }

  if (isInAppPip) {
    return <InAppPipOverlay onExpand={handleExpandFromPip} onEndCall={handleEndCall} />;
  }

  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#000000', zIndex: 9999 }]}>
      <DoctorMeetingContainer navigation={navigationRef as any} />
    </View>
  );
};

export default MeetingSessionController;
