import { useMeeting } from '@videosdk.live/react-native-sdk';
import { useCallback } from 'react';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';

export const useMeetingConnection = () => {
  const { leave: sdkLeave } = useMeeting({});

  const callState = useMeetingStore(state => state.callState);
  const resetMeetingStore = useMeetingStore(state => state.resetMeetingStore);

  const endCall = useCallback(async () => {
    try {
      if (sdkLeave) {
        await sdkLeave();
      }
    } catch (e) {
      console.warn('[useMeetingConnection] leave error:', e);
    } finally {
      resetMeetingStore();
    }
  }, [sdkLeave, resetMeetingStore]);

  return {
    callState,
    endCall,
  };
};

export default useMeetingConnection;
