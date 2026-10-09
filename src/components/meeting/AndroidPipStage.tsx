import { MediaStream, RTCView, useMeeting, useParticipant } from '@videosdk.live/react-native-sdk';
import React, { useCallback } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MicOffIcon, ProfileIcon } from '../ui/icons';
import { usePatientStream } from '../../hooks/commons/meeting/useMeetingParticipants';
import NativePip from '../../native/NativePip';
import androidPipStyles, { PIP_NAME_PILL_MIN_WIDTH } from '../../styled/AndroidPip.styled';
import useMeetingStore from '../../zustand/stores/useMeetingStore';

const LocalPipTile: React.FC = () => {
  const { localParticipant } = useMeeting({});
  const isMicOn = useMeetingStore(state => state.isMicOn);
  const isCameraOn = useMeetingStore(state => state.isCameraOn);
  const facingMode = useMeetingStore(state => state.facingMode);
  const cameraSessionEpoch = useMeetingStore(state => state.cameraSessionEpoch);
  const { webcamStream, webcamOn } = useParticipant(localParticipant?.id || '');

  const showVideo = isCameraOn && webcamOn && webcamStream;

  return (
    <View style={androidPipStyles.selfTile}>
      {showVideo ? (
        <RTCView
          key={cameraSessionEpoch}
          streamURL={new MediaStream([webcamStream.track]).toURL()}
          objectFit="cover"
          mirror={facingMode === 'front'}
          style={StyleSheet.absoluteFill}
          zOrder={1}
        />
      ) : (
        <ProfileIcon size={16} color="#E2E8F0" />
      )}
      {!isMicOn && (
        <View style={androidPipStyles.muteBadge}>
          <MicOffIcon size={8} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

/** Content of the Android system PiP window: patient video only, no header or controls. */
export const AndroidPipStage: React.FC = () => {
  const { width } = useWindowDimensions();
  const remoteParticipantId = useMeetingStore(state => state.remoteParticipantId);
  const patientName = useMeetingStore(state => state.patientName);
  const { webcamStream, webcamOn } = usePatientStream(remoteParticipantId);

  const name = patientName || 'Patient';
  const initial = name.charAt(0).toUpperCase() || 'P';

  const handleLayout = useCallback(() => {
    NativePip.notifyAndroidPipContentReady();
  }, []);

  return (
    <View style={androidPipStyles.container} pointerEvents="none" onLayout={handleLayout}>
      {webcamOn && webcamStream ? (
        <RTCView
          streamURL={new MediaStream([webcamStream.track]).toURL()}
          objectFit="cover"
          style={StyleSheet.absoluteFill}
          zOrder={0}
        />
      ) : (
        <View style={androidPipStyles.placeholder}>
          <View style={androidPipStyles.avatarCircle}>
            <Text style={androidPipStyles.avatarTxt}>{initial}</Text>
          </View>
          <Text style={androidPipStyles.placeholderTxt} numberOfLines={1}>
            {remoteParticipantId ? 'Camera off' : 'Waiting for patient'}
          </Text>
        </View>
      )}

      {width >= PIP_NAME_PILL_MIN_WIDTH && (
        <View style={androidPipStyles.namePill}>
          <Text style={androidPipStyles.nameTxt} numberOfLines={1}>
            {name}
          </Text>
        </View>
      )}

      <LocalPipTile />
    </View>
  );
};

export default AndroidPipStage;
