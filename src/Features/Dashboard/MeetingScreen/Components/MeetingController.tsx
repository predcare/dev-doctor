import React, { memo } from 'react';
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
import useMeetingStore from '../../../../zustand/stores/useMeetingStore';

interface IMeetingControllerProps {
  handleEndCall: () => void;
}

export const MeetingController: React.FC<IMeetingControllerProps> = ({ handleEndCall }) => {
  const { isMuted, isCamOn, toggleMic, toggleCamera, flipCamera } = useMeetingCamera();
  const { enterInAppPip } = useMeetingPip();

  const openBesideCall = (go: () => void) => {
    enterInAppPip();
    go();
  };

  const handleRxPress = () => {
    const { appointmentId, patientInfo } = useMeetingStore.getState();
    if (!patientInfo?.patientId) return;

    openBesideCall(() => {
      navigate(AppRoute.CREATE_PRESCRIPTION, {
        patientId: patientInfo.patientId,
        patientName: patientInfo.name,
        appointmentId: appointmentId ?? undefined,
        fromScreen: AppRoute.DOCTOR_MEETING,
      });
    });
  };

  const handleUploadPress = () => {
    const { patientInfo } = useMeetingStore.getState();
    if (!patientInfo?.patientId) return;

    openBesideCall(() => {
      navigate(AppRoute.PATIENT_DETAILS, {
        patientId: patientInfo.patientId,
        patientName: patientInfo.name,
        openUploadModal: true,
      });
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
    <View style={doctorMeetingStyles.bottomHud}>
      <View style={doctorMeetingStyles.controlsRow1}>
        <TouchableOpacity
          style={doctorMeetingStyles.btnCol3}
          activeOpacity={0.8}
          onPress={toggleMic}
        >
          <View style={[doctorMeetingStyles.ctrlBtnLg, isMuted && doctorMeetingStyles.ctrlBtnLgActiveRed]}>
            {isMuted ? <MicOffIcon size={22} color="#FFFFFF" /> : <MicOnIcon size={22} color="#FFFFFF" />}
            <Text style={doctorMeetingStyles.ctrlLabel}>{isMuted ? 'UNMUTE' : 'MUTE'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={doctorMeetingStyles.btnCol3}
          activeOpacity={0.8}
          onPress={toggleCamera}
        >
          <View style={[doctorMeetingStyles.ctrlBtnLg, isCamOn && doctorMeetingStyles.ctrlBtnLgActiveTeal]}>
            {isCamOn ? (
              <CameraOnIcon size={22} color="#FFFFFF" />
            ) : (
              <CameraOffIcon size={22} color="#FFFFFF" />
            )}
            <Text style={doctorMeetingStyles.ctrlLabel}>{isCamOn ? 'CAM ON' : 'CAM OFF'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={doctorMeetingStyles.btnCol3}
          activeOpacity={0.8}
          onPress={flipCamera}
        >
          <View style={doctorMeetingStyles.ctrlBtnLg}>
            <FlipCameraIcon size={22} color="#FFFFFF" />
            <Text style={doctorMeetingStyles.ctrlLabel}>FLIP</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={doctorMeetingStyles.controlsRow2}>
        <TouchableOpacity
          style={doctorMeetingStyles.btnCol4}
          activeOpacity={0.8}
          onPress={handleRxPress}
        >
          <View style={doctorMeetingStyles.ctrlBtnSm}>
            <RxIcon size={20} color="#FFFFFF" />
            <Text style={doctorMeetingStyles.ctrlLabel}>RX</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={doctorMeetingStyles.btnCol4}
          activeOpacity={0.8}
          onPress={handleUploadPress}
        >
          <View style={doctorMeetingStyles.ctrlBtnSm}>
            <UploadIcon size={20} color="#FFFFFF" />
            <Text style={doctorMeetingStyles.ctrlLabel}>UPLOAD</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={doctorMeetingStyles.btnCol4}
          activeOpacity={0.8}
          onPress={handlePipPress}
        >
          <View style={doctorMeetingStyles.ctrlBtnSm}>
            <PipIcon size={20} color="#FFFFFF" />
            <Text style={doctorMeetingStyles.ctrlLabel}>PIP</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={doctorMeetingStyles.btnCol4}
          activeOpacity={0.85}
          onPress={handleEndCall}
        >
          <View style={[doctorMeetingStyles.ctrlBtnSm, doctorMeetingStyles.ctrlBtnSmActiveRed]}>
            <EndPhoneIcon size={20} color="#FFFFFF" />
            <Text style={doctorMeetingStyles.ctrlLabel}>END</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(MeetingController);
