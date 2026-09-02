import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import CommonErrorCard from '../../components/commons/CommonErrorCard/CommonErrorCard';
import { DoctorMeetingContainer } from '../../components/Modules/DoctorMeeting';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { showErrorToast } from '../../lib/common/toast.utils';
import type { DoctorMeetingScreenProps } from '../../route';
import { doctorMeetingStyles as S } from '../../styled/DoctorMeetingScreen.styled';
import { useMeetingStore } from '../../zustand/stores/useMeetingStore';

export const DoctorMeetingScreen: React.FC<DoctorMeetingScreenProps> = ({ navigation, route }) => {
  const {
    token: callToken,
    meetingId: callmeetingId,
    resetMeetingStore,
    setIsInAppPip,
  } = useMeetingStore(state => state);

  // When focused on DoctorMeetingScreen, ensure In-App PiP overlay is hidden
  useEffect(() => {
    setIsInAppPip(false);
  }, [setIsInAppPip]);

  const isInvalidSession = !callToken || !callmeetingId;
  useEffect(() => {
    if (isInvalidSession) {
      showErrorToast("'token' is empty or invalid or might have expired.");
      const timer = setTimeout(() => {
        useMeetingStore.getState().resetMeetingStore();
        if (navigation?.canGoBack?.()) {
          navigation.goBack();
        } else {
          navigation?.navigate('DoctorAppointments');
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isInvalidSession, navigation]);

  if (isInvalidSession) {
    return (
      <SafeAreaWrapper>
        <View style={S.container}>
          <View style={[S.stageContainer, { paddingHorizontal: 16 }]}>
            <CommonErrorCard
              title="Invalid Meeting Token"
              message="'token' is empty or invalid or might have expired."
              onRetry={() => {
                resetMeetingStore();
                navigation?.navigate('DoctorAppointments');
              }}
              retryText="Return to Appointments"
            />
            <Text style={[S.waitingSubtitle, { marginTop: 8, color: '#EF4444' }]}>
              Redirecting back in 5 seconds...
            </Text>
          </View>
        </View>
      </SafeAreaWrapper>
    );
  }

  return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
};

export default DoctorMeetingScreen;
