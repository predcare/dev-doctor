import { useMeeting } from '@videosdk.live/react-native-sdk';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import NativePip from '../../../native/NativePip';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';

export const useMeetingAppState = () => {
  const { disableWebcam, enableWebcam } = useMeeting({});
  const isCamOn = useMeetingStore(state => state.isCamOn);
  const callState = useMeetingStore(state => state.callState);

  const appStateRef = useRef<AppStateStatus>((AppState.currentState as AppStateStatus) || 'active');
  const wasCamOnRef = useRef<boolean>(isCamOn);
  const pausedByUsRef = useRef<boolean>(false);

  useEffect(() => {
    wasCamOnRef.current = isCamOn;
  }, [isCamOn]);

  useEffect(() => {
    if (callState === 'IDLE' || callState === 'ENDED' || callState === 'FAILED') return;

    const subscription = AppState.addEventListener('change', async (nextState: AppStateStatus) => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;

      if (Platform.OS === 'android' && useMeetingStore.getState().isCameraPausedForCapture) {
        return;
      }

      if (prev === 'active' && nextState.match(/inactive|background/)) {
        if (!wasCamOnRef.current || !disableWebcam) return;

        const canKeepCamera = await NativePip.isBackgroundCameraSupported();
        if (canKeepCamera) return;

        try {
          await disableWebcam();
          pausedByUsRef.current = true;
        } catch (e) {
          console.warn('[useMeetingAppState] disableWebcam error on background:', e);
        }
      }

      if (prev.match(/inactive|background/) && nextState === 'active') {
        if (!pausedByUsRef.current || !enableWebcam) return;

        pausedByUsRef.current = false;
        if (!wasCamOnRef.current) return;

        try {
          await enableWebcam();
        } catch (e) {
          console.warn('[useMeetingAppState] enableWebcam error on foreground:', e);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [callState, disableWebcam, enableWebcam]);
};

export default useMeetingAppState;
