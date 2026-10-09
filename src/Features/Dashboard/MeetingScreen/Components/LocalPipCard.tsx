import { MediaStream, RTCView, useMeeting, useParticipant } from '@videosdk.live/react-native-sdk';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { MicOffIcon } from '../../../../components/ui/icons';
import doctorMeetingStyles from '../../../../styled/DoctorMeetingScreen.styled';
import useMeetingStore from '../../../../zustand/stores/useMeetingStore';

export const LocalPipCard: React.FC = () => {
  const { localParticipant } = useMeeting({});
  const isMicOn = useMeetingStore(state => state.isMicOn);
  const isCameraOn = useMeetingStore(state => state.isCameraOn);
  const facingMode = useMeetingStore(state => state.facingMode);
  const cameraSessionEpoch = useMeetingStore(state => state.cameraSessionEpoch);

  const localId = localParticipant?.id || '';
  const { webcamStream, webcamOn } = useParticipant(localId);

  const shouldRenderVideo = isCameraOn && webcamOn && webcamStream;

  return (
    <View style={doctorMeetingStyles.selfPipCard}>
      {shouldRenderVideo ? (
        <RTCView
          key={Platform.OS === 'android' ? cameraSessionEpoch : undefined}
          streamURL={new MediaStream([webcamStream.track]).toURL()}
          objectFit="cover"
          mirror={facingMode === 'front'}
          style={StyleSheet.absoluteFill}
          zOrder={1}
        />
      ) : (
        <Text style={doctorMeetingStyles.pipAvatarTxt}>You</Text>
      )}

      {!isMicOn && (
        <View style={doctorMeetingStyles.pipMuteBadge}>
          <MicOffIcon size={12} color="#FFFFFF" />
        </View>
      )}
      <View style={doctorMeetingStyles.pipYouBadge}>
        <Text style={doctorMeetingStyles.pipYouTxt}>YOU</Text>
      </View>
    </View>
  );
};

export default LocalPipCard;
