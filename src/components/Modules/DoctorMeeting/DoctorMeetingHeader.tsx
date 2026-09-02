import React from 'react';
import { Text, View } from 'react-native';
import { doctorMeetingStyles as S } from '../../../styled/DoctorMeetingScreen.styled';
import type { TCallState } from '../../../zustand/stores/useMeetingStore';

interface DoctorMeetingHeaderProps {
  callState: TCallState;
  patientName?: string;
  appointmentId?: string;
  elapsedText?: string;
  remainingText?: string;
}

export const DoctorMeetingHeader: React.FC<DoctorMeetingHeaderProps> = React.memo(
  ({
    callState,
    patientName = 'Patient',
    appointmentId,
    elapsedText = '0:00',
    remainingText = '--:--',
  }) => {
    const isConnected = callState === 'CONNECTED';
    return (
      <View style={S.headerBar}>
        <View style={S.headerLeft}>
          <Text style={S.doctorName} numberOfLines={1}>
            {patientName}
          </Text>
          <Text style={S.doctorStatus}>
            {appointmentId
              ? `${appointmentId} · ${isConnected ? 'IN CONSULTATION' : 'CONNECTING TO DOCTOR...'}`
              : isConnected
              ? 'IN CONSULTATION'
              : 'CONNECTING TO DOCTOR...'}
          </Text>
        </View>

        <View style={S.headerRight}>
          <View style={S.headerTopRightRow}>
            <View style={S.connectingPill}>
              <View style={S.connectingDot} />
              <Text style={S.connectingText}>{isConnected ? 'CONNECTED' : 'CONNECTING...'}</Text>
            </View>
            <Text style={S.timerText}>{elapsedText}</Text>
          </View>
          <View style={S.headerBottomRightRow}>
            <View style={S.leftPill}>
              <Text style={S.leftPillText}>LEFT</Text>
            </View>
            <Text style={S.leftTimeText}>{remainingText}</Text>
          </View>
        </View>
      </View>
    );
  }
);

export default DoctorMeetingHeader;
