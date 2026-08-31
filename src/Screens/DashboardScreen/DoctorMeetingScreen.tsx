import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  NativeEventEmitter,
  NativeModules,
  PanResponder,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronLeftIcon,
  CircleXIcon,
  ClockIcon,
  FileTextIcon,
  PatientsIcon,
  PrescriptionIcon,
} from '../../components/ui/icons';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { showInfoToast, showSuccessToast } from '../../lib/commons/toast.utils';
import { MOCK_APPOINTMENTS, MockAppointment } from '../../resources/mockData';
import type { DoctorMeetingScreenProps } from '../../route';
import { doctorMeetingStyles as S } from '../../styled/DoctorMeetingScreen.styled';

const { PiPModule } = NativeModules;
const pipEmitter = PiPModule ? new NativeEventEmitter(PiPModule) : null;

const { width: SW, height: SH } = Dimensions.get('window');
const PIP_W = 110;
const PIP_H = 150;
const MIN_X = 16;
const MAX_X = SW - PIP_W - 16;
const MIN_Y = 60;
const MAX_Y = SH - PIP_H - 140;

type ActivePanel = 'none' | 'patient' | 'upload' | 'prescription';

export const DoctorMeetingScreen: React.FC<DoctorMeetingScreenProps> = ({
  navigation,
  route,
}) => {
  const appointmentId = route?.params?.appointmentId;
  const appointment: MockAppointment =
    MOCK_APPOINTMENTS.find(a => a.id === appointmentId) ?? MOCK_APPOINTMENTS[0];

  // Call Local States
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [frontCamera, setFrontCamera] = useState(true);
  const [isNativePiP, setIsNativePiP] = useState(false);

  // Active Panel Modal
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');

  // Upload Form State
  const [docTitle, setDocTitle] = useState('');
  const [docNotes, setDocNotes] = useState('');

  // Draggable Doctor PiP Window State using PanResponder with strict clamping bounds
  const pipPan = useRef(new Animated.ValueXY({ x: MAX_X, y: MIN_Y })).current;

  const pipPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pipPan.setOffset({
          x: (pipPan.x as any)._value,
          y: (pipPan.y as any)._value,
        });
        pipPan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        const rawX = gestureState.dx;
        const rawY = gestureState.dy;
        const offset = (pipPan as any)._offset || { x: 0, y: 0 };
        const currentX = offset.x + rawX;
        const currentY = offset.y + rawY;

        // Clamp values inside screen bounds
        const clampedX = Math.max(MIN_X, Math.min(currentX, MAX_X));
        const clampedY = Math.max(MIN_Y, Math.min(currentY, MAX_Y));

        pipPan.x.setValue(clampedX - offset.x);
        pipPan.y.setValue(clampedY - offset.y);
      },
      onPanResponderRelease: () => {
        pipPan.flattenOffset();
      },
    }),
  ).current;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Consultation',
      'Are you sure you want to end this video call consultation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => {
            showSuccessToast('Consultation session ended', 'Call Ended');
            navigation?.navigate('DoctorAppointments', { refresh: true });
          },
        },
      ],
    );
  };

  const handleMinimize = () => {
    showInfoToast('Meeting minimized to floating window', 'Floating PiP');
    navigation?.goBack();
  };

  const handleUploadDocument = () => {
    if (!docTitle.trim()) {
      showInfoToast('Please enter document title', 'Validation Error');
      return;
    }
    showSuccessToast('Document uploaded successfully', 'Uploaded');
    setDocTitle('');
    setDocNotes('');
    setActivePanel('none');
  };

  // If in native Android OS PiP window, render simplified video-only stage
  if (isNativePiP) {
    return (
      <View
        style={[
          S.container,
          {
            backgroundColor: '#0A1410',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <View style={S.remotePlaceholder}>
          <View
            style={[
              S.remoteAvatar,
              { width: 64, height: 64, borderRadius: 32 },
            ]}
          >
            <Text style={[S.remoteAvatarTxt, { fontSize: 28 }]}>
              {appointment.patient_name.charAt(0)}
            </Text>
          </View>
          <Text style={[S.remoteNameTxt, { fontSize: 14 }]}>
            {appointment.patient_name}
          </Text>
          <Text
            style={{
              color: '#2DD4BF',
              fontSize: 11,
              fontWeight: '700',
              marginTop: 4,
            }}
          >
            LIVE 00:00
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" />

      <View style={S.container}>
        {/* Top Header Bar */}
        <View style={S.headerBar}>
          <TouchableOpacity style={S.headerBackBtn} onPress={handleMinimize}>
            <ChevronLeftIcon size={18} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={S.timerChipContainer}>
            {/* Live Pill */}
            <View style={S.timerChipLive}>
              <View style={S.recDot} />
              <Text style={S.timerText}>LIVE 00:00</Text>
            </View>

            {/* Remaining Pill */}
            <View style={S.timerChipLeft}>
              <ClockIcon size={12} color="#2DD4BF" />
              <Text style={S.timerLeftLabel}>LEFT 29:30</Text>
            </View>
          </View>
        </View>

        {/* Video Stage Area */}
        <View style={S.videoStage}>
          {/* Patient Remote Video View Placeholder */}
          <View style={S.remotePlaceholder}>
            <View style={S.remoteAvatar}>
              <Text style={S.remoteAvatarTxt}>
                {appointment.patient_name.charAt(0)}
              </Text>
            </View>
            <Text style={S.remoteNameTxt}>{appointment.patient_name}</Text>
            <Text style={S.remoteStatusTxt}>
              {cameraOff ? 'Patient Video Paused' : '📹 Connected in HD Video'}
            </Text>
          </View>

          {/* Draggable & Clamped Doctor Self Picture-in-Picture (PiP) Window */}
          <Animated.View
            style={[
              S.selfPipCard,
              {
                transform: [{ translateX: pipPan.x }, { translateY: pipPan.y }],
              },
            ]}
            {...pipPanResponder.panHandlers}
          >
            <View style={S.selfAvatarCircle}>
              <Text style={S.selfAvatarTxt}>D</Text>
            </View>
            <View style={S.selfBadge}>
              <Text style={S.selfBadgeTxt}>You (Doctor)</Text>
            </View>
          </Animated.View>
        </View>

        {/* Action Bar Tabs (Patient Info | Upload Doc | Prescription) */}
        <View style={S.actionTabsRow}>
          <TouchableOpacity
            style={[
              S.actionTabBtn,
              activePanel === 'patient' && S.actionTabBtnActive,
            ]}
            onPress={() => setActivePanel('patient')}
            activeOpacity={0.8}
          >
            <PatientsIcon
              size={16}
              color={activePanel === 'patient' ? '#FFFFFF' : '#94A3B8'}
            />
            <Text
              style={[
                S.actionTabTxt,
                activePanel === 'patient' && S.actionTabTxtActive,
              ]}
            >
              Patient Info
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              S.actionTabBtn,
              activePanel === 'upload' && S.actionTabBtnActive,
            ]}
            onPress={() => setActivePanel('upload')}
            activeOpacity={0.8}
          >
            <FileTextIcon
              size={16}
              color={activePanel === 'upload' ? '#FFFFFF' : '#94A3B8'}
            />
            <Text
              style={[
                S.actionTabTxt,
                activePanel === 'upload' && S.actionTabTxtActive,
              ]}
            >
              Upload Doc
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              S.actionTabBtn,
              activePanel === 'prescription' && S.actionTabBtnActive,
            ]}
            onPress={() => {
              navigation?.navigate('PrescriptionView', {
                rxId: `RX-${appointment.appointment_id}`,
                patientName: appointment.patient_name,
                patientId: appointment.patient_record_id,
              });
            }}
            activeOpacity={0.8}
          >
            <PrescriptionIcon size={16} color="#FFFFFF" />
            <Text style={[S.actionTabTxt, S.actionTabTxtActive]}>
              Prescription
            </Text>
          </TouchableOpacity>
        </View>

        {/* Meeting Control Bar (Mic, Camera, Flip, End Call) */}
        <View style={S.controlBar}>
          <TouchableOpacity
            style={[S.ctrlBtn, micMuted && S.ctrlBtnMuted]}
            onPress={() => {
              setMicMuted(prev => !prev);
              showInfoToast(
                micMuted ? 'Microphone unmuted' : 'Microphone muted',
                'Audio',
              );
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 20 }}>{micMuted ? '🔇' : '🎙️'}</Text>
            <Text style={S.ctrlBtnLabel}>{micMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[S.ctrlBtn, cameraOff && S.ctrlBtnMuted]}
            onPress={() => {
              setCameraOff(prev => !prev);
              showInfoToast(
                cameraOff ? 'Camera turned on' : 'Camera turned off',
                'Video',
              );
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 20 }}>{cameraOff ? '📷' : '📹'}</Text>
            <Text style={S.ctrlBtnLabel}>
              {cameraOff ? 'Start Video' : 'Stop Video'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={S.ctrlBtn}
            onPress={() => {
              setFrontCamera(prev => !prev);
              showInfoToast(
                frontCamera
                  ? 'Switched to back camera'
                  : 'Switched to front camera',
                'Camera',
              );
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 20 }}>🔄</Text>
            <Text style={S.ctrlBtnLabel}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={S.endCallBtn}
            onPress={handleEndCall}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 20 }}>📞</Text>
            <Text style={S.endCallBtnTxt}>End Call</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Patient Info Panel Modal */}
      <Modal
        visible={activePanel === 'patient'}
        transparent
        animationType="slide"
      >
        <View style={S.panelOverlay}>
          <View style={S.panelContent}>
            <View style={S.panelHeader}>
              <Text style={S.panelTitle}>Patient Overview</Text>
              <TouchableOpacity
                style={S.panelCloseBtn}
                onPress={() => setActivePanel('none')}
              >
                <CircleXIcon size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={S.panelBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={S.infoCard}>
                <Text style={S.infoCardTitle}>{appointment.patient_name}</Text>
                <Text style={S.infoText}>
                  Gender: {appointment.patient_gender} · Age:{' '}
                  {appointment.patient_age}
                </Text>
                <Text style={S.infoText}>
                  ID: {appointment.patient_record_id}
                </Text>
                <Text style={S.infoText}>
                  Phone: {appointment.patient_phone}
                </Text>
              </View>

              <View style={S.infoCard}>
                <Text style={S.infoCardTitle}>Chief Complaints & Symptoms</Text>
                <Text style={S.infoText}>
                  {appointment.symptoms ||
                    appointment.reason ||
                    'None reported'}
                </Text>
              </View>

              <View style={S.infoCard}>
                <Text style={S.infoCardTitle}>Medical History</Text>
                <Text style={S.infoText}>• Hypertension (Diagnosed 2023)</Text>
                <Text style={S.infoText}>• No known drug allergies (NKDA)</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Upload Document Panel Modal */}
      <Modal
        visible={activePanel === 'upload'}
        transparent
        animationType="slide"
      >
        <View style={S.panelOverlay}>
          <View style={S.panelContent}>
            <View style={S.panelHeader}>
              <Text style={S.panelTitle}>Upload Medical Document</Text>
              <TouchableOpacity
                style={S.panelCloseBtn}
                onPress={() => setActivePanel('none')}
              >
                <CircleXIcon size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={S.panelBody}
              showsVerticalScrollIndicator={false}
            >
              <Text style={S.inputLabel}>Document Title *</Text>
              <TextInput
                style={S.textInput}
                placeholder="e.g. ECG Report, Blood Test"
                placeholderTextColor="#94A3B8"
                value={docTitle}
                onChangeText={setDocTitle}
              />

              <Text style={S.inputLabel}>Clinical Notes (Optional)</Text>
              <TextInput
                style={[S.textInput, { height: 80 }]}
                placeholder="Add notes for this document..."
                placeholderTextColor="#94A3B8"
                multiline
                value={docNotes}
                onChangeText={setDocNotes}
              />

              <TouchableOpacity
                style={S.uploadSubmitBtn}
                onPress={handleUploadDocument}
                activeOpacity={0.85}
              >
                <Text style={S.uploadSubmitTxt}>Upload Document</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
};

export default DoctorMeetingScreen;
