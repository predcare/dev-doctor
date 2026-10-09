import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
} from '../../../../components/ui/icons';
import useMeetingCamera from '../../../../hooks/commons/meeting/useMeetingCamera';
import useMeetingPip from '../../../../hooks/commons/meeting/useMeetingPip';
import { canGoBack, goBack, navigate } from '../../../../navigation/navigationRef';
import { AppRoute } from '../../../../route';
import doctorMeetingStyles from '../../../../styled/DoctorMeetingScreen.styled';

interface IMeetingControllerProps {
  handleEndCall: () => void;
}

export const MeetingController: React.FC<IMeetingControllerProps> = ({ handleEndCall }) => {
  const { isMicOn, isCameraOn, toggleMic, toggleCamera, flipCamera } = useMeetingCamera();
  const { enterInAppPip } = useMeetingPip();

  const openBesideCall = (go: () => void) => {
    enterInAppPip();
    go();
  };

  const handleRxPress = () => {
    openBesideCall(() => {
      navigate(AppRoute.PATIENTS);
    });
  };

  const handleUploadPress = () => {
    openBesideCall(() => {
      navigate(AppRoute.PATIENTS);
    });
  };

  const handlePipPress = () => {
    enterInAppPip();
    if (canGoBack()) {
      goBack();
      return;
    }
    navigate(AppRoute.APPOINTMENTS);
  };

  return (
    <View style={doctorMeetingStyles.controlBarContainer}>
      <View style={[doctorMeetingStyles.controlRow, doctorMeetingStyles.controlRowSpacing]}>
        <TouchableOpacity style={doctorMeetingStyles.controlBtn} activeOpacity={0.8} onPress={toggleMic}>
          {isMicOn ? <MicOnIcon size={22} color="#FFFFFF" /> : <MicOffIcon size={22} color="#FFFFFF" />}
          <Text style={doctorMeetingStyles.controlBtnTxt}>{isMicOn ? 'MUTE' : 'UNMUTE'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={doctorMeetingStyles.controlBtn} activeOpacity={0.8} onPress={toggleCamera}>
          {isCameraOn ? (
            <CameraOnIcon size={22} color="#FFFFFF" />
          ) : (
            <CameraOffIcon size={22} color="#FFFFFF" />
          )}
          <Text style={doctorMeetingStyles.controlBtnTxt}>{isCameraOn ? 'CAM ON' : 'CAM OFF'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={doctorMeetingStyles.controlBtn} activeOpacity={0.8} onPress={flipCamera}>
          <FlipCameraIcon size={22} color="#FFFFFF" />
          <Text style={doctorMeetingStyles.controlBtnTxt}>FLIP</Text>
        </TouchableOpacity>
      </View>

      <View style={doctorMeetingStyles.controlRow}>
        <TouchableOpacity style={doctorMeetingStyles.controlBtn} activeOpacity={0.8} onPress={handleRxPress}>
          <RxIcon size={20} color="#FFFFFF" />
          <Text style={doctorMeetingStyles.controlBtnTxt}>RX</Text>
        </TouchableOpacity>

        <TouchableOpacity style={doctorMeetingStyles.controlBtn} activeOpacity={0.8} onPress={handleUploadPress}>
          <UploadIcon size={20} color="#FFFFFF" />
          <Text style={doctorMeetingStyles.controlBtnTxt}>UPLOAD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={doctorMeetingStyles.controlBtn} activeOpacity={0.8} onPress={handlePipPress}>
          <PipIcon size={20} color="#FFFFFF" />
          <Text style={doctorMeetingStyles.controlBtnTxt}>PIP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[doctorMeetingStyles.controlBtn, doctorMeetingStyles.controlBtnEnd]}
          activeOpacity={0.85}
          onPress={handleEndCall}
        >
          <EndPhoneIcon size={20} color="#EF4444" />
          <Text style={[doctorMeetingStyles.controlBtnTxt, doctorMeetingStyles.controlBtnTxtEnd]}>END</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MeetingController;
