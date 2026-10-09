import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import useMeetingPip from '../../../hooks/commons/meeting/useMeetingPip';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import doctorMeetingStyles from '../../../styled/DoctorMeetingScreen.styled';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';

export const DoctorMeetingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { enterInAppPip } = useMeetingPip();

  const setPipMode = useMeetingStore(state => state.setPipMode);
  const callState = useMeetingStore(state => state.callState);
  const hasToken = useMeetingStore(state => Boolean(state.token));

  useFocusEffect(
    useCallback(() => {
      if (useMeetingStore.getState().pipMode !== 'NATIVE_PIP') {
        setPipMode('NORMAL');
      }
    }, [setPipMode])
  );

  useEffect(() => {
    if (!isFocused) return;
    if (!hasToken || callState === 'ENDED' || callState === 'ERROR') {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [hasToken, callState, navigation, isFocused]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      const { callState: currentState, token, pipMode } = useMeetingStore.getState();
      if (currentState === 'ENDED' || currentState === 'IDLE' || currentState === 'ERROR' || !token) {
        return;
      }

      if (pipMode === 'NATIVE_PIP' || pipMode === 'IN_APP_PIP') {
        return;
      }

      e.preventDefault();
      enterInAppPip();
      navigation.dispatch(e.data.action);
    });

    return unsubscribe;
  }, [navigation, enterInAppPip]);

  return (
    <SafeAreaWrapper style={doctorMeetingStyles.container} backgroundColor="#000000">
      <View style={doctorMeetingStyles.stageContainerFull} />
    </SafeAreaWrapper>
  );
};

export default DoctorMeetingScreen;
