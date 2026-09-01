import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import type { DoctorMeetingScreenProps } from '../../route';
import { doctorMeetingStyles as S } from '../../styled/DoctorMeetingScreen.styled';

// --- Custom Icons matching the design image ---

const MicOffIcon = ({ size = 22, color = '#EF4444' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 10v2a7 7 0 01-14 0v-2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 19v3M8 22h8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M3 3l18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CameraOffIcon = ({ size = 22, color = '#EF4444' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 16v1a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h2m4 0h4a2 2 0 012 2v4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 8l-6 4 6 4V8z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M3 3l18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const FlipCameraIcon = ({ size = 22, color = '#94A3B8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 19a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h3l2-3h8l2 3h3a2 2 0 012 2v11z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 13a3 3 0 015.12-2.12M15 13a3 3 0 01-5.12 2.12"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

const RxIcon = ({ size = 22, color = '#94A3B8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 2v6h6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M8 12h3M8 16h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const UploadIcon = ({ size = 22, color = '#94A3B8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 2v6h6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 18v-5M9.5 15.5L12 13l2.5 2.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PipIcon = ({ size = 22, color = '#94A3B8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth="1.8" />
    <Rect
      x="13"
      y="11"
      width="6"
      height="6"
      rx="1.5"
      stroke={color}
      strokeWidth="1.5"
      fill={color}
    />
  </Svg>
);

const EndPhoneIcon = ({ size = 22, color = '#EF4444' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.68 13.31a16 16 0 003.41 3.41l2.2-2.2a1 1 0 011.05-.24 11.53 11.53 0 003.59.57 1 1 0 011 1V19a1 1 0 01-1 1A17 17 0 013 3a1 1 0 011-1h3.1a1 1 0 011 1 11.53 11.53 0 00.57 3.59 1 1 0 01-.25 1.05l-2.24 2.21z"
      fill={color}
      transform="rotate(135 12 12)"
    />
  </Svg>
);

const TinyMicOffIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="#FFFFFF" strokeWidth="2.5" />
    <Path d="M19 10v2a7 7 0 01-14 0v-2" stroke="#FFFFFF" strokeWidth="2.5" />
    <Path d="M3 3l18 18" stroke="#FFFFFF" strokeWidth="2.5" />
  </Svg>
);

export const DoctorMeetingScreen: React.FC<DoctorMeetingScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <View style={S.container}>
        {/* Top Header Bar */}
        <View style={S.headerBar}>
          <View style={S.headerLeft}>
            <Text style={S.doctorName}>Dr. Samir Mallick</Text>
            <Text style={S.doctorStatus}>CONNECTING TO DOCTOR...</Text>
          </View>

          <View style={S.headerRight}>
            {/* Row 1: CONNECTING... Pill & Timer */}
            <View style={S.headerTopRightRow}>
              <View style={S.connectingPill}>
                <View style={S.connectingDot} />
                <Text style={S.connectingText}>CONNECTING...</Text>
              </View>
              <Text style={S.timerText}>0:00</Text>
            </View>

            {/* Row 2: LEFT Pill & Time Left */}
            <View style={S.headerBottomRightRow}>
              <View style={S.leftPill}>
                <Text style={S.leftPillText}>LEFT</Text>
              </View>
              <Text style={S.leftTimeText}>30:00</Text>
            </View>
          </View>
        </View>

        {/* Floating Self Picture-in-Picture (PiP) Window */}
        <View style={S.selfPipCard}>
          <View style={S.pipMuteBadge}>
            <TinyMicOffIcon />
          </View>
          <Text style={S.pipAvatarTxt}>P</Text>
          <View style={S.pipYouBadge}>
            <Text style={S.pipYouTxt}>YOU</Text>
          </View>
        </View>

        {/* Main Stage (Center Stage: Waiting for doctor) */}
        <View style={S.stageContainer}>
          <ActivityIndicator size="large" color="#2DD4BF" />
          <Text style={S.waitingTitle}>Waiting for doctor to join...</Text>
          <Text style={S.waitingSubtitle}>The doctor will join your consultation shortly.</Text>
        </View>

        {/* Bottom Meeting Control Bar */}
        <View style={S.controlBarContainer}>
          {/* Row 1: UNMUTE | CAM OFF | FLIP */}
          <View style={[S.controlRow, S.controlRowSpacing]}>
            <TouchableOpacity style={S.controlBtn} activeOpacity={0.8}>
              <MicOffIcon size={22} color="#EF4444" />
              <Text style={S.controlBtnTxt}>UNMUTE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={S.controlBtn} activeOpacity={0.8}>
              <CameraOffIcon size={22} color="#EF4444" />
              <Text style={S.controlBtnTxt}>CAM OFF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={S.controlBtn} activeOpacity={0.8}>
              <FlipCameraIcon size={22} color="#94A3B8" />
              <Text style={[S.controlBtnTxt, S.controlBtnTxtMuted]}>FLIP</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: RX | UPLOAD | PIP | END */}
          <View style={S.controlRow}>
            <TouchableOpacity style={S.controlBtn} activeOpacity={0.8}>
              <RxIcon size={22} color="#94A3B8" />
              <Text style={S.controlBtnTxt}>RX</Text>
            </TouchableOpacity>

            <TouchableOpacity style={S.controlBtn} activeOpacity={0.8}>
              <UploadIcon size={22} color="#94A3B8" />
              <Text style={S.controlBtnTxt}>UPLOAD</Text>
            </TouchableOpacity>

            <TouchableOpacity style={S.controlBtn} activeOpacity={0.8}>
              <PipIcon size={22} color="#94A3B8" />
              <Text style={S.controlBtnTxt}>PIP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[S.controlBtn, S.controlBtnEnd]}
              activeOpacity={0.8}
              onPress={() => navigation?.goBack()}
            >
              <EndPhoneIcon size={22} color="#EF4444" />
              <Text style={[S.controlBtnTxt, S.controlBtnTxtEnd]}>END</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default DoctorMeetingScreen;
