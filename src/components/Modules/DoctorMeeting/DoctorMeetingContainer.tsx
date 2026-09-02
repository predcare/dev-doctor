import React, { useEffect, useRef } from 'react';
import { BackHandler, View } from 'react-native';
import { useMeetingTimer } from '../../../hooks/commons/useMeetingTimer';
import { useVideoCallControls } from '../../../hooks/commons/useVideoCallControls';
import { SafeAreaWrapper } from '../../../Layout/SafeAreaWrapper';
import { showErrorToast, showInfoToast } from '../../../lib/common/toast.utils';
import type { DoctorMeetingScreenProps } from '../../../route';
import { doctorMeetingStyles as S } from '../../../styled/DoctorMeetingScreen.styled';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import { DoctorMeetingHeader } from './DoctorMeetingHeader';
import { LocalParticipantView } from './LocalParticipantView';
import { MeetingControlBar } from './MeetingControlBar';
import { MeetingStageContainer } from './MeetingStageContainer';

export const DoctorMeetingContainer: React.FC<DoctorMeetingScreenProps> = ({ navigation }) => {
  const {
    callState,
    errorMessage,
    isMicOn,
    isCameraOn,
    facingMode,
    remoteParticipantId,
    patientName,
    appointmentGeneratedId,
    startTime,
    endTime,
    callDurationSeconds,
  } = useMeetingStore();
  const { resetMeetingStore } = useMeetingStore(state => state);

  const { elapsedText, remainingText, remainingSeconds, isTimeUp } = useMeetingTimer(
    callState,
    startTime,
    endTime,
    callDurationSeconds
  );

  const hasShownThreeMinWarningRef = useRef(false);
  const hasAutoEndedRef = useRef(false);

  const { joinCall, toggleAudio, toggleVideo, switchCamera, endCall, localParticipant } =
    useVideoCallControls(() => {
      if (navigation?.canGoBack?.()) {
        navigation.goBack();
      } else {
        navigation?.navigate('DoctorAppointments');
      }
    });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      endCall();
      return true;
    });
    return () => backHandler.remove();
  }, [endCall]);

  useEffect(() => {
    if (callState === 'ERROR') {
      showErrorToast(errorMessage || "'token' is empty or invalid or might have expired.");
      const timer = setTimeout(() => {
        resetMeetingStore();
        navigation?.navigate('DoctorAppointments');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [callState, errorMessage, navigation, resetMeetingStore]);

  useEffect(() => {
    joinCall();
  }, [joinCall]);

  // 3-minute warning toast
  useEffect(() => {
    if (remainingSeconds > 0 && remainingSeconds <= 180 && !hasShownThreeMinWarningRef.current) {
      hasShownThreeMinWarningRef.current = true;
      showInfoToast(
        'Your consultation time is almost up. Please wrap up.',
        '⏱ 3 Minutes Remaining'
      );
    }
  }, [remainingSeconds]);

  useEffect(() => {
    if (isTimeUp && !hasAutoEndedRef.current) {
      hasAutoEndedRef.current = true;
      showInfoToast('Consultation time has ended. The call will disconnect now.', '⏱ Time Up');
      const timer = setTimeout(() => {
        endCall();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTimeUp, endCall]);

  return (
    <SafeAreaWrapper>
      <View style={S.container}>
        <MeetingStageContainer
          callState={callState}
          remoteParticipantId={remoteParticipantId}
          errorMessage={errorMessage}
          onGoBack={endCall}
        />
        <DoctorMeetingHeader
          callState={callState}
          patientName={patientName ?? undefined}
          appointmentId={appointmentGeneratedId ?? undefined}
          elapsedText={elapsedText}
          remainingText={remainingText}
        />
        <LocalParticipantView
          participantId={localParticipant?.id}
          isCameraOn={isCameraOn}
          isMicOn={isMicOn}
          facingMode={facingMode}
        />
        <MeetingControlBar
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onSwitchCamera={switchCamera}
          onEndCall={endCall}
          onPipPress={() => {
            showInfoToast('PIP mode is under development');
          }}
          onRxPress={() => {
            showInfoToast('RX mode is under development');
          }}
          onUploadPress={() => {
            showInfoToast('Upload mode is under development');
          }}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default DoctorMeetingContainer;
