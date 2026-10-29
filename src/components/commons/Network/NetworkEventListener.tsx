import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import useUnstableConnectionMonitor from '../../../hooks/commons/useUnstableConnectionMonitor';
import { useNetworkStore } from '../../../zustand/stores/useNetworkStore';

export const NetworkEventListener: React.FC = () => {
  const setNetworkState = useNetworkStore(state => state.setNetworkState);
  useUnstableConnectionMonitor();

  useEffect(() => {
    onlineManager.setEventListener(setOnline => {
      return NetInfo.addEventListener(state => {
        const isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
        setOnline(isOnline);
      });
    });

    NetInfo.fetch().then(state => {
      setNetworkState(state);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState(state);
    });

    return () => {
      unsubscribe();
    };
  }, [setNetworkState]);

  return null;
};

export default NetworkEventListener;
