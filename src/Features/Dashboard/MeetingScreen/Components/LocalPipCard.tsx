import { MediaStream, RTCView, useMeeting, useParticipant } from '@videosdk.live/react-native-sdk';
import React, { memo, useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { MicOffIcon } from '../../../../components/ui/icons';
import doctorMeetingStyles from '../../../../styled/DoctorMeetingScreen.styled';
import useMeetingStore from '../../../../zustand/stores/useMeetingStore';

export const LocalPipCard: React.FC = () => {
  const { localParticipant } = useMeeting({});
  const isMuted = useMeetingStore(state => state.isMuted);
  const isCamOn = useMeetingStore(state => state.isCamOn);
  const isFrontCamera = useMeetingStore(state => state.isFrontCamera);
  const cameraSessionEpoch = useMeetingStore(state => state.cameraSessionEpoch);

  const localId = localParticipant?.id || '';
  const { webcamStream, webcamOn } = useParticipant(localId);

  const localTrack = isCamOn && webcamOn && webcamStream ? webcamStream.track : null;
  // Build the URL only when the track or camera session changes, so RTCView does not re-attach.
  const localStreamURL = useMemo(
    () => (localTrack ? new MediaStream([localTrack]).toURL() : null),
    // cameraSessionEpoch: Android capture handoff/restore needs a fresh URL even for the same track
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localTrack, cameraSessionEpoch],
  );

  return (
    <View style={doctorMeetingStyles.selfPipCard}>
      {localStreamURL ? (
        <RTCView
          key={Platform.OS === 'android' ? cameraSessionEpoch : undefined}
          streamURL={localStreamURL}
          objectFit="cover"
          mirror={isFrontCamera}
          style={StyleSheet.absoluteFill}
          zOrder={1}
        />
      ) : (
        <Text style={doctorMeetingStyles.pipAvatarTxt}>You</Text>
      )}

      {isMuted && (
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

export default memo(LocalPipCard);
