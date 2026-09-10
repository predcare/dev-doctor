import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { capitalize, getInitials } from '../../../lib/common/common.utils';
import { homeStyles } from '../../../styled/HomeScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { ClockIcon, PlayCircleIcon, VideoIcon } from '../../ui/icons';

export interface AppointmentCardProps {
  id: string;
  patientName: string;
  ageGender: string;
  time: string;
  timeDistance: string;
  isExpired: boolean;
  consultType: 'ONLINE' | 'IN-PERSON' | string;
  chiefComplaint: string;
  appointmentStatus?: string;
  isJoinedOnce?: boolean;
  isCurrentApptInCall?: boolean;
  onStartConsultation?: () => void;
  onVideoCall?: () => void;
  onActionPress?: () => void;
}

export const UpcomingAppointmentCard: React.FC<AppointmentCardProps> = ({
  patientName,
  ageGender,
  time,
  timeDistance,
  consultType,
  chiefComplaint,
  isExpired,
  isJoinedOnce,
  isCurrentApptInCall,
  onStartConsultation,
  onVideoCall,
  onActionPress,
}) => {
  const isVideo = useMemo(() => {
    const type = consultType?.toLowerCase() || '';
    return type === 'video' || type === 'online';
  }, [consultType]);

  const buttonText = useMemo(() => {
    if (isVideo) {
      if (isCurrentApptInCall) return 'Resume Call';
      if (isJoinedOnce) return 'Rejoin Video';
      return 'Join Video';
    }
    return 'Start Consultation';
  }, [isVideo, isCurrentApptInCall, isJoinedOnce]);

  const handlePress = () => {
    if (isVideo) {
      if (onVideoCall) {
        onVideoCall();
      } else {
        onActionPress?.();
      }
    } else {
      if (onStartConsultation) {
        onStartConsultation();
      } else {
        onActionPress?.();
      }
    }
  };

  return (
    <View style={homeStyles.appointmentCard}>
      {time && (
        <View style={homeStyles.apptTimeRow}>
          <View style={homeStyles.timeGroup}>
            <ClockIcon size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
            <Text style={homeStyles.apptTime}>{time}</Text>
          </View>
          <Text style={homeStyles.apptDistance}>{timeDistance}</Text>
        </View>
      )}

      <View style={homeStyles.apptPatientRow}>
        <View style={[homeStyles.apptAvatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={homeStyles.apptAvatarText}>{getInitials(patientName)}</Text>
        </View>

        <View style={homeStyles.patientInfoGroup}>
          <View style={homeStyles.nameRow}>
            <Text style={homeStyles.apptPatientName}>{patientName}</Text>
          </View>
          <Text style={homeStyles.patientMetaText}>{ageGender?.toUpperCase()}</Text>
          <View style={[homeStyles.consultChip, { backgroundColor: theme.colors.primarySoft }]}>
            <Text style={[homeStyles.consultChipText, { color: theme.colors.primary }]}>
              {capitalize(consultType)}
            </Text>
          </View>
          {chiefComplaint && (
            <Text style={homeStyles.symptomsText} numberOfLines={2}>
              <Text style={homeStyles.symptomsLabel}>Symptoms: </Text>
              {chiefComplaint}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            homeStyles.joinBtn,
            isExpired && {
              backgroundColor: theme.colors.grayDisabled,
            },
          ]}
          onPress={handlePress}
          activeOpacity={0.85}
          disabled={isExpired}
        >
          {isVideo ? (
            <VideoIcon
              size={14}
              color={isExpired ? theme.colors.grayText : '#FFFFFF'}
              style={{ marginRight: 4 }}
            />
          ) : (
            <PlayCircleIcon
              size={14}
              color={isExpired ? theme.colors.grayText : '#FFFFFF'}
              style={{ marginRight: 4 }}
            />
          )}
          <Text
            style={[
              homeStyles.joinBtnText,
              isExpired && {
                color: theme.colors.grayText,
              },
            ]}
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpcomingAppointmentCard;
