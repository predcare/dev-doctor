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
import useMeetingParticipants from '../../hooks/commons/meeting/useMeetingParticipants';
import usePipRemoteTrack from '../../hooks/commons/meeting/usePipRemoteTrack';
import NativePip from '../../native/NativePip';
import useMeetingStore from '../../zustand/stores/useMeetingStore';
import AndroidPipStage from './AndroidPipStage';
import InAppPipWindow from './InAppPipWindow';

const MeetingSessionController: React.FC = () => {
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
  const token = useMeetingStore(state => state.token);
  const meetingId = useMeetingStore(state => state.meetingId);
  const isMicOn = useMeetingStore(state => state.isMicOn);
  const isCameraOn = useMeetingStore(state => state.isCameraOn);
  const facingMode = useMeetingStore(state => state.facingMode);
  const setCallState = useMeetingStore(state => state.setCallState);
  const resetMeetingStore = useMeetingStore(state => state.resetMeetingStore);

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
      config={{
        meetingId,
        micEnabled: isMicOn,
        webcamEnabled: isCameraOn,
        name: 'Doctor',
        defaultCamera: facingMode,
        maxResolution: 'hd',
        mode: 'SEND_AND_RECV',
        debugMode: false,
        notification: {
          title: 'PRED Care Consultation',
          message: 'Video consultation in progress',
        },
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
          resetMeetingStore();
        }}
        onError={({ code, message }) => {
          console.warn(`[VideoSDK] Meeting error (${code}): ${message}`);
        }}
        onMeetingStateChanged={({ state }) => {
          const current = useMeetingStore.getState();
          if (current.callState === 'ERROR' || current.callState === 'ENDED') {
            return;
          }
          if (state === 'CONNECTING') {
            setCallState('CONNECTING');
          } else if (state === 'CONNECTED') {
            setCallState(current.remoteParticipantId ? 'CONNECTED' : 'CONNECTING');
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
