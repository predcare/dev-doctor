import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import CommonErrorCard from '../../commons/CommonErrorCard/CommonErrorCard';
import { doctorMeetingStyles as S } from '../../../styled/DoctorMeetingScreen.styled';
import type { TCallState } from '../../../zustand/stores/useMeetingStore';
import { RemoteParticipantView } from './RemoteParticipantView';

interface MeetingStageContainerProps {
  callState: TCallState;
  remoteParticipantId: string | null;
  errorMessage?: string | null;
  waitingTitle?: string;
  waitingSubtitle?: string;
  onGoBack?: () => void;
}

export const MeetingStageContainer: React.FC<MeetingStageContainerProps> = ({
  callState,
  remoteParticipantId,
  errorMessage,
  waitingTitle = 'Waiting for patient to join...',
  waitingSubtitle = 'Patient will join your consultation shortly.',
  onGoBack,
}) => {
  if (callState === 'ERROR') {
    return (
      <View style={[S.stageContainer, { paddingHorizontal: 16 }]}>
        <CommonErrorCard
          title="Meeting Session Error"
          message={errorMessage || "'token' is empty or invalid or might have expired."}
          onRetry={onGoBack}
          retryText="Return to Appointments"
        />
        <Text style={[S.waitingSubtitle, { marginTop: 8, color: '#EF4444' }]}>
          Redirecting back in 5 seconds...
        </Text>
      </View>
    );
  }

  if (callState === 'CONNECTED' && remoteParticipantId) {
    return (
      <View style={S.stageContainerFull}>
        <RemoteParticipantView participantId={remoteParticipantId} />
      </View>
    );
  }

  return (
    <View style={S.stageContainer}>
      <ActivityIndicator size="large" color="#2DD4BF" />
      <Text style={S.waitingTitle}>{waitingTitle}</Text>
      <Text style={S.waitingSubtitle}>{waitingSubtitle}</Text>
    </View>
  );
};

export default MeetingStageContainer;
