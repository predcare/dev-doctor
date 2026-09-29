import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import { LocalParticipantView } from './LocalParticipantView';
import { MeetingStageContainer } from './MeetingStageContainer';

interface PipMeetingViewProps {
  localParticipantId?: string;
  onGoBack?: () => void;
}

export const PipMeetingView: React.FC<PipMeetingViewProps> = ({
  localParticipantId,
  onGoBack,
}) => {
  const {
    callState,
    remoteParticipantId,
    errorMessage,
    isMicOn,
    isCameraOn,
    facingMode,
  } = useMeetingStore();

  return (
    <View style={styles.container}>
      {/* 1. Main Stage: Remote Participant Video / Waiting Fallback */}
      <View style={styles.stageLayer}>
        <MeetingStageContainer
          callState={callState}
          remoteParticipantId={remoteParticipantId}
          errorMessage={errorMessage}
          onGoBack={onGoBack}
        />
      </View>

      {/* 2. Floating Local (Doctor) Preview: Clean PIP Inset */}
      <LocalParticipantView
        participantId={localParticipantId}
        isCameraOn={isCameraOn}
        isMicOn={isMicOn}
        facingMode={facingMode}
        inPipMode={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  stageLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 1,
  },
  localPipWrapper: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 100,
  },
});

export default PipMeetingView;
