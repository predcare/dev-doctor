import { MediaStream, RTCView, useParticipant } from '@videosdk.live/react-native-sdk';
import React, { useMemo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { doctorMeetingStyles as S } from '../../../styled/DoctorMeetingScreen.styled';
import { TinyMicOffIcon } from '../../ui/icons';

interface LocalParticipantViewProps {
  participantId?: string;
  isCameraOn: boolean;
  isMicOn: boolean;
  facingMode: 'front' | 'back';
  inPipMode?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const LocalParticipantView: React.FC<LocalParticipantViewProps> = ({
  participantId,
  isCameraOn,
  isMicOn,
  facingMode,
  inPipMode = false,
  containerStyle,
}) => {
  const { webcamStream, webcamOn } = useParticipant(participantId || '');

  const streamUrl = useMemo(() => {
    if (!isCameraOn || !webcamOn || !webcamStream?.track) return null;

    if (typeof (webcamStream as any).toURL === 'function') {
      return (webcamStream as any).toURL();
    }
    if (typeof (webcamStream.track as any).toURL === 'function') {
      return (webcamStream.track as any).toURL();
    }
    try {
      const mediaStream = new MediaStream([webcamStream.track]);
      if (typeof mediaStream.toURL === 'function') {
        return mediaStream.toURL();
      }
    } catch (err) {
      console.warn('Error creating MediaStream for local view:', err);
    }
    return null;
  }, [isCameraOn, webcamOn, webcamStream, webcamStream?.track, (webcamStream?.track as any)?.id]);

  const cardStyle: StyleProp<ViewStyle> = inPipMode
    ? {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 40,
        height: 56,
        borderRadius: 5,
        backgroundColor: '#0D131E',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        zIndex: 100,
        elevation: 10,
      }
    : S.selfPipCard;

  return (
    <View style={[cardStyle, containerStyle]}>
      {streamUrl && typeof streamUrl === 'string' ? (
        <RTCView
          streamURL={streamUrl}
          objectFit="cover"
          zOrder={1}
          style={{ width: '100%', height: '100%', borderRadius: inPipMode ? 5 : 16 }}
          mirror={facingMode === 'front'}
        />
      ) : (
        <Text style={[S.pipAvatarTxt, inPipMode && { fontSize: 11 }]}>P</Text>
      )}

      {!isMicOn && (
        <View
          style={[
            S.pipMuteBadge,
            inPipMode && { top: 2, right: 2, width: 11, height: 11, borderRadius: 6 },
          ]}
        >
          <TinyMicOffIcon />
        </View>
      )}

      <View
        style={[
          S.pipYouBadge,
          inPipMode && {
            bottom: 2,
            left: 2,
            paddingHorizontal: 2.5,
            paddingVertical: 0.5,
            borderRadius: 2,
          },
        ]}
      >
        <Text style={[S.pipYouTxt, inPipMode && { fontSize: 5 }]}>YOU</Text>
      </View>
    </View>
  );
};

export default LocalParticipantView;
