import PipHandler, { usePipModeListener } from '@videosdk.live/react-native-pip-android';
import { MeetingProvider } from '@videosdk.live/react-native-sdk';
import React, { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { navigationRef, replace } from '../../../navigation/navigationRef';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import MeetingSessionController from './MeetingSessionController';

export const GlobalMeetingManager: React.FC = () => {
  const { userData } = useAuthStore();
  const {
    token: callToken,
    meetingId: callmeetingId,
    callState,
    setIsNativePip,
    setIsInAppPip,
  } = useMeetingStore();

  const inPipMode = usePipModeListener();

  // Sync VideoSDK native PiP state with store and navigation
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const activePip = Boolean(inPipMode);
    setIsNativePip(activePip);

    if (!activePip && (callState === 'CONNECTED' || callState === 'CONNECTING')) {
      // Returned from Native OS PiP -> bring full DoctorMeeting view into focus
      setIsInAppPip(false);
      if (navigationRef.isReady()) {
        const currentRouteName = navigationRef.getCurrentRoute()?.name;
        if (currentRouteName !== 'DoctorMeeting') {
          (navigationRef as any).navigate('DoctorMeeting');
        }
      }
    }
  }, [inPipMode, callState, setIsNativePip, setIsInAppPip]);

  // Configure PiP dimensions and enable auto-PiP when consultation is active
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const isCalling = (callState === 'CONNECTED' || callState === 'CONNECTING') && Boolean(callmeetingId);

    try {
      PipHandler.setDefaultPipDimensions(300, 500);
      PipHandler.setMeetingScreenState(isCalling);
    } catch (_) {}

    return () => {
      if (Platform.OS === 'android') {
        try {
          PipHandler.setMeetingScreenState(false);
        } catch (_) {}
      }
    };
  }, [callState, callmeetingId]);

  // Back button handling on Android root screen during active call
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const isCalling = (callState === 'CONNECTED' || callState === 'CONNECTING') && Boolean(callmeetingId);
    if (!isCalling) return;

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigationRef.isReady()) {
        const currentRouteName = navigationRef.getCurrentRoute()?.name;
        const canGoBack = navigationRef.canGoBack();

        if (currentRouteName === 'DoctorMeeting') {
          if (canGoBack) {
            // Standard back navigation fires DoctorMeeting's beforeRemove to trigger In-App PiP
            return false;
          } else {
            useMeetingStore.getState().setIsInAppPip(true);
            replace('DoctorAppointments');
            return true;
          }
        }

        if (!canGoBack) {
          // Root screen reached during active call -> enter Native OS PiP mode
          try {
            PipHandler.enterPipMode(300, 500);
            return true;
          } catch (_) {}
        }
      }
      return false;
    });

    return () => {
      backSubscription.remove();
    };
  }, [callState, callmeetingId]);

  const hasActiveMeeting = Boolean(
    callToken && callmeetingId && callState !== 'ENDED' && callState !== 'IDLE'
  );

  if (!hasActiveMeeting) {
    return null;
  }

  const doctorParticipantId = userData?.doctor_id ? `doctor_${userData.doctor_id}` : 'doctor_host';
  const doctorDisplayName = userData?.name ? `Dr. ${userData.name}` : 'Doctor';
  const sessionKey = `${callmeetingId}_${doctorParticipantId}`;

  return (
    <MeetingProvider
      key={sessionKey}
      config={{
        meetingId: callmeetingId!,
        participantId: doctorParticipantId,
        micEnabled: true,
        webcamEnabled: true,
        name: doctorDisplayName,
        maxResolution: 'hd',
        multiStream: true,
        codecSwitchEnabled: true,
        mode: 'SEND_AND_RECV',
        debugMode: false,
        defaultCamera: 'front',
      }}
      token={callToken!}
      reinitialiseMeetingOnConfigChange={false}
    >
      <MeetingSessionController />
    </MeetingProvider>
  );
};

export default GlobalMeetingManager;
