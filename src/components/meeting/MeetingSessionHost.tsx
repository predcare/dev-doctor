import { MeetingConsumer, MeetingProvider } from '@videosdk.live/react-native-sdk';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import MeetingStageOverlay from '../../Features/Dashboard/MeetingScreen/Components/MeetingStageOverlay';
import useAndroidCallForegroundService from '../../hooks/commons/meeting/useAndroidCallForegroundService';
import useAndroidPipCameraRestore from '../../hooks/commons/meeting/useAndroidPipCameraRestore';
import useAndroidPipLifecycle from '../../hooks/commons/meeting/useAndroidPipLifecycle';
import useMeetingAppState from '../../hooks/commons/meeting/useMeetingAppState';
import useMeetingCaptureHandoff from '../../hooks/commons/meeting/useMeetingCaptureHandoff';
import { useMeetingCountdownTicker } from '../../hooks/commons/meeting/useMeetingCountdown';
import { useRegisterMeetingLeave } from '../../hooks/commons/meeting/meetingSessionLeave';
import useMeetingParticipants from '../../hooks/commons/meeting/useMeetingParticipants';
import usePipRemoteTrack from '../../hooks/commons/meeting/usePipRemoteTrack';
import NativePip from '../../native/NativePip';
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import useMeetingStore from '../../zustand/stores/useMeetingStore';
import AndroidPipStage from './AndroidPipStage';
import InAppPipWindow from './InAppPipWindow';

const MeetingSessionController: React.FC = () => {
  useRegisterMeetingLeave();
  useMeetingAppState();
  useMeetingParticipants();
  usePipRemoteTrack();
  useAndroidPipLifecycle();
  useAndroidCallForegroundService();
  useMeetingCaptureHandoff();
  useAndroidPipCameraRestore();
  useMeetingCountdownTicker();
  const pipMode = useMeetingStore(state => state.pipMode);

  if (pipMode === 'IN_APP_PIP') {
    return <InAppPipWindow />;
  }

  if (pipMode === 'NATIVE_PIP' && Platform.OS === 'android') {
    return <AndroidPipStage />;
  }

  if (pipMode === 'NORMAL') {
    return <MeetingStageOverlay />;
  }

  return null;
};

export const MeetingSessionHost: React.FC = () => {
  const callInfo = useMeetingStore(state => state.callInfo);
  const isMuted = useMeetingStore(state => state.isMuted);
  const isCamOn = useMeetingStore(state => state.isCamOn);
  const isFrontCamera = useMeetingStore(state => state.isFrontCamera);
  const setCallState = useMeetingStore(state => state.setCallState);
  const resetCallInfo = useMeetingStore(state => state.resetCallInfo);
  const userData = useAuthStore((state) => state.userData)

  const token = callInfo?.token;
  const meetingId = callInfo?.meetingId;
  const participantId = userData?.doctor_id
    ? `doctor_${userData.doctor_id}`
    : userData?.id
      ? `doctor_${userData.id}`
      : 'doctor_guest';
  const doctorDisplayName = userData?.name || 'Doctor';
  const sessionKey = `${meetingId}_${participantId}`;

  useEffect(() => {
    if (meetingId) {
      NativePip.setMeetingScreenState(true);
    } else {
      NativePip.setMeetingScreenState(false);
    }
    return () => {
      NativePip.setMeetingScreenState(false);
    };
  }, [meetingId]);

  if (!token || !meetingId) {
    return null;
  }

  return (
    <MeetingProvider
      key={sessionKey}
      config={{
        meetingId,
        micEnabled: !isMuted,
        webcamEnabled: isCamOn,
        participantId: participantId,
        name: doctorDisplayName,
        defaultCamera: isFrontCamera ? 'front' : 'back',
        maxResolution: 'hd',
        mode: 'SEND_AND_RECV',
        debugMode: false,
        notification: {
          title: 'PRED Care Consultation',
          message: 'Video consultation in progress',
        },
        codecSwitchEnabled: true
      }}
      token={token}
      joinWithoutUserInteraction={true}
    >
      <MeetingConsumer
        onMeetingJoined={() => {
          const state = useMeetingStore.getState();
          if (state.callState === 'IDLE') {
            setCallState('CONNECTING');
          }
        }}
        onMeetingLeft={() => {
          resetCallInfo();
        }}
        onError={({ code, message }) => {
          console.warn(`[VideoSDK] Meeting error (${code}): ${message}`);
        }}
        onMeetingStateChanged={({ state }) => {
          if (state === 'CONNECTING') {
            setCallState('CONNECTING');
          } else if (state === 'CONNECTED') {
            setCallState('CONNECTED');
          } else if (state === 'FAILED' || state === 'CLOSED' || state === 'DISCONNECTED') {
            setCallState('ENDED');
          }
        }}
      >
        {() => <MeetingSessionController />}
      </MeetingConsumer>
    </MeetingProvider>
  );
};

export default MeetingSessionHost;
