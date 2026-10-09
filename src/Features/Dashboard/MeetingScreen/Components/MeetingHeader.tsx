import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon } from '../../../../components/ui/icons';
import useMeetingCountdown from '../../../../hooks/commons/meeting/useMeetingCountdown';
import useMeetingPip from '../../../../hooks/commons/meeting/useMeetingPip';
import useNetworkStatus from '../../../../hooks/commons/useNetworkStatus';
import { canGoBack, goBack } from '../../../../navigation/navigationRef';
import doctorMeetingStyles from '../../../../styled/DoctorMeetingScreen.styled';
import theme from '../../../../styled/theme.styled';
import useMeetingStore from '../../../../zustand/stores/useMeetingStore';

const SIGNAL_LABELS = ['Offline', 'Weak', 'Fair', 'Good', 'Strong'] as const;

const getSignalLevel = (isOffline: boolean, connectionType: string): number => {
  if (isOffline || connectionType === 'none') return 0;
  if (connectionType === 'wifi' || connectionType === 'ethernet') return 4;
  if (connectionType === 'cellular') return 3;
  if (connectionType === 'unknown') return 2;
  return 3;
};

const signalColor = (level: number) => {
  if (level <= 1) return '#EF4444';
  if (level === 2) return '#F59E0B';
  return theme.colors.green;
};

export const MeetingHeader: React.FC = () => {
  const patientName = useMeetingStore(state => state.patientName);
  const callState = useMeetingStore(state => state.callState);
  const { enterInAppPip } = useMeetingPip();
  const { formattedTime, isWarning, isUrgent } = useMeetingCountdown();
  const { isOffline, connectionType } = useNetworkStatus();
  const signalLevel = getSignalLevel(isOffline, String(connectionType));

  const name = patientName || 'Patient';
  const isConnected = callState === 'CONNECTED';
  const barsColor = signalColor(signalLevel);

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
          {isConnected ? 'CONNECTED' : 'WAITING FOR PATIENT'}
        </Text>
      </View>

      <View style={doctorMeetingStyles.timersCol}>
        <View
          style={[
            doctorMeetingStyles.leftBadgeRow,
            isWarning && { backgroundColor: 'rgba(245, 158, 11, 0.25)', borderColor: '#F59E0B' },
            isUrgent && { backgroundColor: 'rgba(239, 68, 68, 0.3)', borderColor: '#EF4444' },
          ]}
        >
          <Text
            style={[
              doctorMeetingStyles.leftLbl,
              isWarning && { color: '#F59E0B' },
              isUrgent && { color: '#EF4444' },
            ]}
          >
            LEFT
          </Text>
          <Text
            style={[
              doctorMeetingStyles.leftValue,
              isWarning && { color: '#F59E0B' },
              isUrgent && { color: '#EF4444' },
            ]}
          >
            {formattedTime}
          </Text>
        </View>
        <View style={doctorMeetingStyles.networkRow}>
          <View style={doctorMeetingStyles.signalBars}>
            {[1, 2, 3, 4].map(bar => (
              <View
                key={bar}
                style={[
                  doctorMeetingStyles.signalBar,
                  { height: 4 + bar * 2 },
                  {
                    backgroundColor: bar <= signalLevel ? barsColor : 'rgba(255, 255, 255, 0.25)',
                  },
                ]}
              />
            ))}
          </View>
          <Text style={[doctorMeetingStyles.networkLabel, { color: barsColor }]}>
            {SIGNAL_LABELS[signalLevel]}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MeetingHeader;
