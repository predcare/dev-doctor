import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDevicePermissions } from '../../../hooks/commons/useDevicePermissions';
import { useVideoCallControls } from '../../../hooks/commons/useVideoCallControls';
import { showErrorToast } from '../../../lib/common/toast.utils';
import { navigationRef } from '../../../navigation/navigationRef';
import { AppRoute } from '../../../route';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import { DoctorMeetingContainer } from './DoctorMeetingContainer';
import { InAppPipOverlay } from './InAppPipOverlay';
import { MeetingStageContainer } from './MeetingStageContainer';

const MeetingSessionController: React.FC = () => {
  const {
    isInAppPip,
    setIsInAppPip,
    isNativePip,
    callState,
    remoteParticipantId,
    errorMessage,
    resetMeetingStore,
  } = useMeetingStore();

  const { joinCall, endCall } = useVideoCallControls(() => {
    if (navigationRef.isReady()) {
      (navigationRef as any).navigate('DoctorAppointments');
    }
  });

  const { requestAudioVideoPermissions } = useDevicePermissions();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const granted = await requestAudioVideoPermissions();
      if (!granted) {
        showErrorToast('Camera and Microphone permissions are required for the consultation.');
        resetMeetingStore();
        if (navigationRef.isReady()) {
          (navigationRef as any).navigate('DoctorAppointments');
        }
        return;
      }
      if (isMounted) {
        joinCall();
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [joinCall, requestAudioVideoPermissions, resetMeetingStore]);

  const handleExpandFromPip = useCallback(() => {
    setIsInAppPip(false);
    if (navigationRef.isReady()) {
      (navigationRef as any).navigate(AppRoute.DOCTOR_MEETING);
    }
  }, [setIsInAppPip]);

  const handleEndCall = useCallback(() => {
    endCall();
  }, [endCall]);

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
