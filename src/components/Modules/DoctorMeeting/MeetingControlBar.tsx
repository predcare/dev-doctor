import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { doctorMeetingStyles as S } from '../../../styled/DoctorMeetingScreen.styled';
import {
  CameraOffIcon,
  CameraOnIcon,
  EndPhoneIcon,
  FlipCameraIcon,
  MicOffIcon,
  MicOnIcon,
  PipIcon,
  RxIcon,
  UploadIcon,
} from '../../ui/icons';

interface MeetingControlBarProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onSwitchCamera: () => void;
  onEndCall: () => void;
  onRxPress?: () => void;
  onUploadPress?: () => void;
  onPipPress?: () => void;
}

export const MeetingControlBar: React.FC<MeetingControlBarProps> = ({
  isMicOn,
  isCameraOn,
  onToggleAudio,
  onToggleVideo,
  onSwitchCamera,
  onEndCall,
  onRxPress,
  onUploadPress,
  onPipPress,
}) => {
  return (
    <View style={S.controlBarContainer}>
      <View style={[S.controlRow, S.controlRowSpacing]}>
        <TouchableOpacity style={S.controlBtn} activeOpacity={0.8} onPress={onToggleAudio}>
          {isMicOn ? (
            <MicOnIcon size={22} color="#2DD4BF" />
          ) : (
            <MicOffIcon size={22} color="#EF4444" />
          )}
          <Text style={S.controlBtnTxt}>{isMicOn ? 'MUTE' : 'UNMUTE'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={S.controlBtn} activeOpacity={0.8} onPress={onToggleVideo}>
          {isCameraOn ? (
            <CameraOffIcon size={22} color="#EF4444" />
          ) : (
            <CameraOnIcon size={22} color="#2DD4BF" />
          )}
          <Text style={S.controlBtnTxt}>{isCameraOn ? 'CAM OFF' : 'CAM ON'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={S.controlBtn} activeOpacity={0.8} onPress={onSwitchCamera}>
          <FlipCameraIcon size={22} color="#94A3B8" />
          <Text style={[S.controlBtnTxt, S.controlBtnTxtMuted]}>FLIP</Text>
        </TouchableOpacity>
      </View>
      <View style={S.controlRow}>
        <TouchableOpacity style={S.controlBtn} activeOpacity={0.8} onPress={onRxPress}>
          <RxIcon size={22} color="#94A3B8" />
          <Text style={S.controlBtnTxt}>RX</Text>
        </TouchableOpacity>

        <TouchableOpacity style={S.controlBtn} activeOpacity={0.8} onPress={onUploadPress}>
          <UploadIcon size={22} color="#94A3B8" />
          <Text style={S.controlBtnTxt}>UPLOAD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={S.controlBtn} activeOpacity={0.8} onPress={onPipPress}>
          <PipIcon size={22} color="#94A3B8" />
          <Text style={S.controlBtnTxt}>PIP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[S.controlBtn, S.controlBtnEnd]}
          activeOpacity={0.8}
          onPress={onEndCall}
        >
          <EndPhoneIcon size={22} color="#EF4444" />
          <Text style={[S.controlBtnTxt, S.controlBtnTxtEnd]}>END</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MeetingControlBar;
