import { useMeeting } from '@videosdk.live/react-native-sdk';
import { useCallback } from 'react';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';

export const useMeetingCamera = () => {
  const { toggleMic: sdkToggleMic, toggleWebcam: sdkToggleWebcam, changeWebcam: sdkChangeWebcam } =
    useMeeting({});

  const isMicOn = useMeetingStore(state => state.isMicOn);
  const isCameraOn = useMeetingStore(state => state.isCameraOn);
  const facingMode = useMeetingStore(state => state.facingMode);
  const setMicState = useMeetingStore(state => state.setMicState);
  const setCameraState = useMeetingStore(state => state.setCameraState);
  const setFacingMode = useMeetingStore(state => state.setFacingMode);

  const toggleMic = useCallback(async () => {
    try {
      setMicState(!isMicOn);
      if (sdkToggleMic) {
        await sdkToggleMic();
      }
    } catch (err) {
      console.error('[useMeetingCamera] toggleMic error:', err);
    }
  }, [isMicOn, setMicState, sdkToggleMic]);

  const toggleCamera = useCallback(async () => {
    try {
      setCameraState(!isCameraOn);
      if (sdkToggleWebcam) {
        await sdkToggleWebcam();
      }
    } catch (err) {
      console.error('[useMeetingCamera] toggleCamera error:', err);
    }
  }, [isCameraOn, setCameraState, sdkToggleWebcam]);

  const flipCamera = useCallback(async () => {
    try {
      setFacingMode(facingMode === 'front' ? 'back' : 'front');
      if (sdkChangeWebcam) {
        await sdkChangeWebcam();
      }
    } catch (err) {
      console.error('[useMeetingCamera] flipCamera error:', err);
    }
  }, [facingMode, setFacingMode, sdkChangeWebcam]);

  return {
    isMicOn,
    isMuted: !isMicOn,
    isCameraOn,
    isCamOn: isCameraOn,
    isFrontCamera: facingMode === 'front',
    toggleMic,
    toggleCamera,
    flipCamera,
  };
};

export default useMeetingCamera;
