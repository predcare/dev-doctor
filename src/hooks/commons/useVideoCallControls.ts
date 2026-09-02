import { useMeeting } from '@videosdk.live/react-native-sdk';
import { useCallback, useEffect, useRef } from 'react';
import { useMeetingStore } from '../../zustand/stores/useMeetingStore';

export const useVideoCallControls = (onLeaveCallback?: () => void) => {
  const hasJoinedRef = useRef(false);
  const isJoiningRef = useRef(false);
  const isLeavingRef = useRef(false);
  const isMountedRef = useRef(true);

  const {
    setCallState,
    setErrorState,
    setMicState,
    setCameraState,
    setFacingMode,
    setRemoteParticipantId,
    resetMeetingStore,
    isMicOn,
    isCameraOn,
    facingMode,
  } = useMeetingStore();

  const {
    join,
    leave,
    toggleMic,
    toggleWebcam,
    changeWebcam,
    getWebcams,
    muteMic,
    unmuteMic,
    disableWebcam,
    enableWebcam,
    localParticipant,
    participants,
  } = useMeeting({
    onMeetingJoined: async () => {
      hasJoinedRef.current = true;
      isJoiningRef.current = false;
      if (!isMountedRef.current) return;
      setCallState('CONNECTING');

      // Camera setup is isolated — errors here must NOT propagate to onError
      // or set ERROR state. They are best-effort.
      try {
        if (getWebcams) {
          const webcams = await getWebcams();
          const frontCam = webcams?.find(
            w => w.facingMode === 'user' || w.label?.toLowerCase().includes('front')
          );
          if (frontCam && changeWebcam) {
            await changeWebcam(frontCam.deviceId);
          }
        }
        if (isMountedRef.current) {
          setFacingMode('front');
        }
      } catch (err) {
        // Swallow camera init errors — they are non-fatal and the SDK
        // will fall back to a default camera automatically.
        console.warn('[VideoSDK]: Non-fatal error selecting front camera on join:', err);
      }
    },
    onMeetingLeft: () => {
      hasJoinedRef.current = false;
      isJoiningRef.current = false;
      isLeavingRef.current = false;
      resetMeetingStore();
      if (onLeaveCallback) {
        onLeaveCallback();
      }
    },
    onParticipantJoined: participant => {
      if (participant && !participant.local && isMountedRef.current) {
        setRemoteParticipantId(participant.id);
      }
    },
    onParticipantLeft: () => {
      if (isMountedRef.current) {
        useMeetingStore.getState().setRemoteParticipantId(null);
      }
    },
    onError: (error: any) => {
      const errMsg = error?.message || error?.name || '';
      const errName = error?.name || '';
      const combinedError = `${errName} ${errMsg}`.toLowerCase();

      // These are transient/internal VideoSDK (mediasoup) errors that the SDK
      // recovers from automatically. They must NOT end the meeting session.
      const NON_FATAL_PATTERNS = [
        'consumer', // "consumer with id X not found" during SFU negotiation
        'set_quality', // SET_QUALITY_FAILED on stream quality adjustment
        'producer', // transient producer errors during track renegotiation
        'already closed', // transport/channel already closed during cleanup
      ];

      const isNonFatal = NON_FATAL_PATTERNS.some(pattern => combinedError.includes(pattern));

      if (isNonFatal) {
        console.warn('[VideoSDK Non-Fatal]:', errMsg || errName);
        return; // Don't crash the meeting — SDK handles recovery internally
      }

      // Truly fatal errors (auth failure, invalid token, network down)
      console.error('[VideoSDK Fatal Error]:', error);
      hasJoinedRef.current = false;
      isJoiningRef.current = false;
      isLeavingRef.current = false;
      if (isMountedRef.current) {
        setErrorState(errMsg || "'token' is empty or invalid or might have expired.");
      }
    },
  });

  const leaveRef = useRef(leave);
  useEffect(() => {
    leaveRef.current = leave;
  }, [leave]);

  // Cleanup on component unmount to ensure VideoSDK leaves session
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (hasJoinedRef.current || isJoiningRef.current) {
        hasJoinedRef.current = false;
        isJoiningRef.current = false;
        try {
          if (leaveRef.current) {
            leaveRef.current();
          }
        } catch (e) {
          console.warn('[VideoSDK]: Cleanup leave error:', e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (participants && participants.size > 0 && isMountedRef.current) {
      const remote = Array.from(participants.values()).find((p: any) => !p.local);
      if (remote && remote.id) {
        const currentRemoteId = useMeetingStore.getState().remoteParticipantId;
        if (currentRemoteId !== remote.id) {
          useMeetingStore.getState().setRemoteParticipantId(remote.id);
        }
      }
    }
  }, [participants]);

  const joinCall = useCallback(() => {
    if (join && !hasJoinedRef.current && !isJoiningRef.current) {
      isJoiningRef.current = true;
      setTimeout(() => {
        if (!isMountedRef.current) {
          isJoiningRef.current = false;
          return;
        }
        try {
          join();
        } catch (err) {
          isJoiningRef.current = false;
          console.error('[VideoSDK]: Exception during join():', err);
        }
      }, 300);
    }
  }, [join]);

  const toggleAudio = useCallback(() => {
    if (toggleMic) {
      toggleMic();
      setMicState(!isMicOn);
    }
  }, [toggleMic, isMicOn, setMicState]);

  const muteAudio = useCallback(() => {
    if (muteMic) {
      muteMic();
      setMicState(false);
    }
  }, [muteMic, setMicState]);

  const unmuteAudio = useCallback(() => {
    if (unmuteMic) {
      unmuteMic();
      setMicState(true);
    }
  }, [unmuteMic, setMicState]);

  const toggleVideo = useCallback(() => {
    if (toggleWebcam) {
      toggleWebcam();
      setCameraState(!isCameraOn);
    }
  }, [toggleWebcam, isCameraOn, setCameraState]);

  const stopCamera = useCallback(() => {
    if (disableWebcam) {
      disableWebcam();
      setCameraState(false);
    }
  }, [disableWebcam, setCameraState]);

  const startCamera = useCallback(() => {
    if (enableWebcam) {
      enableWebcam();
      setCameraState(true);
    }
  }, [enableWebcam, setCameraState]);

  const switchCamera = useCallback(async () => {
    if (changeWebcam) {
      const nextMode = facingMode === 'front' ? 'back' : 'front';
      try {
        if (getWebcams) {
          const webcams = await getWebcams();
          const targetCam = webcams?.find(w =>
            nextMode === 'front'
              ? w.facingMode === 'user' || w.label?.toLowerCase().includes('front')
              : w.facingMode === 'environment' || w.label?.toLowerCase().includes('back')
          );
          if (targetCam) {
            await changeWebcam(targetCam.deviceId);
          } else {
            await changeWebcam();
          }
        } else {
          await changeWebcam();
        }
      } catch (err) {
        await changeWebcam();
      }
      setFacingMode(nextMode);
    }
  }, [changeWebcam, getWebcams, facingMode, setFacingMode]);

  const endCall = useCallback(() => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;
    hasJoinedRef.current = false;
    isJoiningRef.current = false;

    if (leave) {
      try {
        leave();
      } catch (err) {
        console.warn('[VideoSDK]: Error executing leave():', err);
        resetMeetingStore();
        if (onLeaveCallback) {
          onLeaveCallback();
        }
      }
    } else {
      resetMeetingStore();
      if (onLeaveCallback) {
        onLeaveCallback();
      }
    }
  }, [leave, resetMeetingStore, onLeaveCallback]);

  return {
    joinCall,
    toggleAudio,
    muteAudio,
    unmuteAudio,
    toggleVideo,
    stopCamera,
    startCamera,
    switchCamera,
    endCall,
    localParticipant,
    participants,
  };
};
