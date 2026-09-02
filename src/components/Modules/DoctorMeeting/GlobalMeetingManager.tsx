import { MeetingProvider } from '@videosdk.live/react-native-sdk';
import React, { useEffect } from 'react';
import { DeviceEventEmitter, NativeModules, Platform } from 'react-native';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import MeetingSessionController from './MeetingSessionController';

const { PiPModule } = NativeModules;

export const GlobalMeetingManager: React.FC = () => {
  const { userData } = useAuthStore();
  const {
    token: callToken,
    meetingId: callmeetingId,
    callState,
    setIsNativePip,
  } = useMeetingStore();

  useEffect(() => {
    if (Platform.OS !== 'android' || !PiPModule) return;

    const isCalling = (callState === 'CONNECTED' || callState === 'CONNECTING') && !!callmeetingId;
    if (PiPModule.setCallActive) {
      PiPModule.setCallActive(isCalling).catch?.(() => {});
    }

    const subscription = DeviceEventEmitter.addListener('onPiPModeChanged', (isInPip: boolean) => {
      setIsNativePip(isInPip);
    });

    return () => {
      subscription.remove();
      if (PiPModule.setCallActive) {
        PiPModule.setCallActive(false).catch?.(() => {});
      }
    };
  }, [callState, callmeetingId, setIsNativePip]);

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
