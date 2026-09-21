import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { capitalize, getAge, getInitials } from '../../../lib/common/common.utils';
import { homeStyles } from '../../../styled/HomeScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { ClinicIcon, ClockIcon, PlayCircleIcon, VideoIcon } from '../../ui/icons';

export interface AppointmentCardProps {
  id?: string;
  appointmentGeneratedId?: string;
  patientName: string;
  ageGender?: string;
  dateOfBirth?: string;
  time?: string;
  isExpired?: boolean;
  consultType?: 'ONLINE' | 'IN-PERSON' | string;
  chiefComplaint?: string;
  appointmentStatus?: string;
  isJoinedOnce?: boolean;
  isCurrentApptInCall?: boolean;
  onStartConsultation?: () => void;
  onVideoCall?: () => void;
  onActionPress?: () => void;
}

export const UpcomingAppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  appointmentGeneratedId,
  patientName,
  ageGender,
  time,
  consultType = 'ONLINE',
  chiefComplaint,
  appointmentStatus,
  isExpired,
  isJoinedOnce,
  isCurrentApptInCall,
  dateOfBirth,
  onStartConsultation,
  onVideoCall,
  onActionPress,
}) => {
  const displayApptId = appointmentGeneratedId || id;

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
      <View style={homeStyles.apptHeaderRow}>
        <View style={homeStyles.timeGroup}>
          <ClockIcon size={14} color={theme.colors.primary} />
          {time ? <Text style={homeStyles.apptTime}>{time}</Text> : null}
          {appointmentStatus === 'in-progress' ? (
            <View style={homeStyles.apptDistanceBadge}>
              <Text style={homeStyles.apptDistance}>Started</Text>
            </View>
          ) : null}
        </View>

        <View
          style={[
            homeStyles.consultBadge,
            isVideo ? homeStyles.consultBadgeVideo : homeStyles.consultBadgeClinic,
          ]}
        >
          {isVideo ? (
            <VideoIcon size={11} color={theme.colors.primary} />
          ) : (
            <ClinicIcon size={11} color="#EA580C" />
          )}
          <Text
            style={[
              homeStyles.consultBadgeText,
              { color: isVideo ? theme.colors.primary : '#EA580C' },
            ]}
          >
            {isVideo ? 'Video Call' : 'In-Clinic'}
          </Text>
        </View>
      </View>
      <View style={homeStyles.apptPatientRow}>
        <View style={[homeStyles.apptAvatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={homeStyles.apptAvatarText}>{getInitials(patientName)}</Text>
        </View>

        <View style={homeStyles.patientInfoGroup}>
          <View style={homeStyles.nameRow}>
            <Text style={homeStyles.apptPatientName} numberOfLines={1} ellipsizeMode="tail">
              {patientName}
            </Text>
          </View>
          <Text style={homeStyles.patientMetaText} numberOfLines={1}>
            {capitalize(ageGender || '')} | {getAge(dateOfBirth || '', { large: true })}
          </Text>
          {displayApptId ? (
            <Text style={homeStyles.aptIdText} numberOfLines={1}>
              APT ID: {displayApptId}
            </Text>
          ) : null}
        </View>
      </View>

      {chiefComplaint ? (
        <View style={homeStyles.symptomsContainer}>
          <Text style={homeStyles.symptomsText} numberOfLines={2} ellipsizeMode="tail">
            <Text style={homeStyles.symptomsLabel}>Symptoms: </Text>
            {chiefComplaint}
          </Text>
        </View>
      ) : null}

      <View style={homeStyles.apptFooterRow}>
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
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isVideo ? (
            <VideoIcon size={13} color={isExpired ? theme.colors.grayText : '#FFFFFF'} />
          ) : (
            <PlayCircleIcon size={13} color={isExpired ? theme.colors.grayText : '#FFFFFF'} />
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
