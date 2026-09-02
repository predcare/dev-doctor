import { MeetingProvider } from '@videosdk.live/react-native-sdk';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import CommonErrorCard from '../../components/commons/CommonErrorCard/CommonErrorCard';
import { DoctorMeetingContainer } from '../../components/Modules/DoctorMeeting';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { showErrorToast } from '../../lib/common/toast.utils';
import type { DoctorMeetingScreenProps } from '../../route';
import { doctorMeetingStyles as S } from '../../styled/DoctorMeetingScreen.styled';
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import { useMeetingStore } from '../../zustand/stores/useMeetingStore';

export const DoctorMeetingScreen: React.FC<DoctorMeetingScreenProps> = ({ navigation, route }) => {
  const { userData } = useAuthStore(state => state);
  const {
    token: callToken,
    meetingId: callmeetingId,
    resetMeetingStore,
  } = useMeetingStore(state => state);

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

  const doctorParticipantId = userData?.doctor_id ? `doctor_${userData.doctor_id}` : 'doctor_host';
  const doctorDisplayName = userData?.name ? `Dr. ${userData.name}` : 'Doctor';
  const sessionKey = `${callmeetingId}_${doctorParticipantId}`;

  return (
    <MeetingProvider
      key={sessionKey}
      config={{
        meetingId: callmeetingId,
        participantId: doctorParticipantId,
        micEnabled: true,
        webcamEnabled: true,
        name: doctorDisplayName,
        maxResolution: 'hd',
        multiStream: true,
        codecSwitchEnabled: true,
        mode: 'SEND_AND_RECV',
        debugMode: false,
        defaultCamera: 'front',
      }}
      token={callToken}
      reinitialiseMeetingOnConfigChange={true}
    >
      <DoctorMeetingContainer navigation={navigation} route={route} />
    </MeetingProvider>
  );
};

export default DoctorMeetingScreen;
