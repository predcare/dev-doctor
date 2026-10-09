import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import NativePip from '../../../native/NativePip';
import { navigationRef } from '../../../navigation/navigationRef';
import { AppRoute } from '../../../route';
import { TCallState } from '../../../zustand/stores/useMeetingStore';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';
import useMeetingConnection from './useMeetingConnection';

const PIP_ELIGIBLE_STATES: TCallState[] = ['CONNECTING', 'CONNECTED'];

const goToMeetingScreen = () => {
  if (!navigationRef.isReady()) return;
  if (navigationRef.getCurrentRoute()?.name !== AppRoute.DOCTOR_MEETING) {
    navigationRef.navigate(AppRoute.DOCTOR_MEETING);
  }
};

/** Android only: the system PiP window always shows the meeting stage, whatever screen was open. */
export const useAndroidPipLifecycle = () => {
  const { endCall } = useMeetingConnection();
  const callState = useMeetingStore(state => state.callState);
  const endCallRef = useRef(endCall);
  endCallRef.current = endCall;

  const isPipEligible = PIP_ELIGIBLE_STATES.includes(callState);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    NativePip.setMeetingScreenState(isPipEligible);
  }, [isPipEligible]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const willEnterSub = NativePip.addAndroidPipWillEnterListener(() => {
      const state = useMeetingStore.getState();
      if (!state.meetingId) return;
      if (state.isCameraPausedForCapture) return;
      state.setPipMode('NATIVE_PIP');
      goToMeetingScreen();
    });

    const changeSub = NativePip.addAndroidPipListener(active => {
      const state = useMeetingStore.getState();
      if (!state.meetingId) return;
      if (state.isCameraPausedForCapture) return;

      if (active) {
        if (state.pipMode !== 'NATIVE_PIP') {
          state.setPipMode('NATIVE_PIP');
        }
        goToMeetingScreen();
      } else if (state.pipMode === 'NATIVE_PIP') {
        state.setPipMode('NORMAL');
        goToMeetingScreen();
      }
    });

    const dismissSub = NativePip.addAndroidPipDismissListener(() => {
      if (!useMeetingStore.getState().meetingId) return;
      endCallRef.current();
    });

    return () => {
      willEnterSub?.remove();
      changeSub?.remove();
      dismissSub?.remove();
    };
  }, []);
};

export default useAndroidPipLifecycle;
