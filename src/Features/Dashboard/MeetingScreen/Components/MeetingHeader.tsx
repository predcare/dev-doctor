import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon } from '../../../../components/ui/icons';
import useMeetingPip from '../../../../hooks/commons/meeting/useMeetingPip';
import { canGoBack, goBack } from '../../../../navigation/navigationRef';
import doctorMeetingStyles from '../../../../styled/DoctorMeetingScreen.styled';
import theme from '../../../../styled/theme.styled';
import useMeetingStore from '../../../../zustand/stores/useMeetingStore';
import MeetingSignalBadge from './MeetingSignalBadge';
import MeetingTimerBadge from './MeetingTimerBadge';

export const MeetingHeader: React.FC = () => {
  const patientName = useMeetingStore(state => state.patientInfo?.name);
  const callState = useMeetingStore(state => state.callState);
  const { enterInAppPip } = useMeetingPip();

  const name = patientName || 'Patient';
  const isConnected = callState === 'CONNECTED';
  const isReconnecting = callState === 'RECONNECTING' || callState === 'DISCONNECTED';
  const statusText = isReconnecting
    ? 'RECONNECTING…'
    : isConnected
      ? 'CONNECTED'
      : 'WAITING FOR PATIENT';

  const handleMinimize = () => {
    enterInAppPip();
    if (canGoBack()) {
      goBack();
    }
  };

  return (
    <View style={doctorMeetingStyles.headerBar}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleMinimize}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ChevronLeftIcon size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={doctorMeetingStyles.headerLeft}>
        <Text style={doctorMeetingStyles.doctorName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[doctorMeetingStyles.doctorStatus, isConnected && { color: theme.colors.green }]}>
          {statusText}
        </Text>
      </View>

      <View style={doctorMeetingStyles.timersCol}>
        <MeetingTimerBadge />
        <MeetingSignalBadge />
      </View>
    </View>
  );
};

export default memo(MeetingHeader);
