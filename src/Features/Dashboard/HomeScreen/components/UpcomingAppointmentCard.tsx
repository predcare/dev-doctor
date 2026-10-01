import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  ChevronRightIcon,
  ClinicIcon,
  ClockIcon,
  PlayCircleIcon,
  VideoIcon,
} from '../../../../components/ui/icons';
import { capitalize, getAge, getInitials } from '../../../../lib/commons/common.utils';
import { homeStyles } from '../../../../styled/HomeScreen.styled';
import theme from '../../../../styled/theme.styled';

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
  onCardPress?: () => void;
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
  onCardPress,
}) => {
  const displayApptId = appointmentGeneratedId || id;

  const isVideo = useMemo(() => {
    const type = consultType?.toLowerCase() || '';
    return type === 'video' || type === 'online';
  }, [consultType]);

  const isInProgress = useMemo(() => {
    const status = appointmentStatus?.toLowerCase();
    return (
      status === 'in-progress' ||
      status === 'in_progress' ||
      status === 'started' ||
      Boolean(isJoinedOnce) ||
      Boolean(isCurrentApptInCall)
    );
  }, [appointmentStatus, isJoinedOnce, isCurrentApptInCall]);

  const patientMeta = useMemo(() => {
    const parts: string[] = [];
    if (ageGender) {
      parts.push(capitalize(ageGender));
    }
    if (dateOfBirth) {
      const age = getAge(dateOfBirth, { large: true });
      if (age) parts.push(age);
    }
    return parts.join(' • ');
  }, [ageGender, dateOfBirth]);

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
    <TouchableOpacity
      style={homeStyles.appointmentCard}
      activeOpacity={onCardPress ? 0.88 : 1}
      onPress={onCardPress}
      disabled={!onCardPress}
    >
      <View style={homeStyles.apptHeaderRow}>
        <View style={homeStyles.timeGroup}>
          <View style={homeStyles.timePill}>
            <ClockIcon size={13} color={theme.colors.primary} />
            {time ? <Text style={homeStyles.apptTime}>{time}</Text> : null}
          </View>
          {isInProgress ? (
            <View style={homeStyles.liveStatusBadge}>
              <View style={homeStyles.liveStatusDot} />
              <Text style={homeStyles.liveStatusText}>Started</Text>
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
            <VideoIcon size={12} color={theme.colors.primary} />
          ) : (
            <ClinicIcon size={12} color="#EA580C" />
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
        <View style={homeStyles.apptAvatar}>
          <Text style={homeStyles.apptAvatarText}>{getInitials(patientName)}</Text>
        </View>

        <View style={homeStyles.patientInfoGroup}>
          <View style={homeStyles.nameRow}>
            <Text style={homeStyles.apptPatientName} numberOfLines={1} ellipsizeMode="tail">
              {patientName}
            </Text>
          </View>
          {patientMeta ? (
            <Text style={homeStyles.patientMetaText} numberOfLines={1}>
              {patientMeta}
            </Text>
          ) : null}
          {displayApptId ? (
            <View style={homeStyles.apptIdBadge}>
              <Text style={homeStyles.aptIdText} numberOfLines={1}>
                APT ID: #{displayApptId}
              </Text>
            </View>
          ) : null}
        </View>

        {onCardPress ? (
          <View style={homeStyles.chevronWrapper}>
            <ChevronRightIcon size={18} color="#94A3B8" />
          </View>
        ) : null}
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
        <View style={homeStyles.footerLeftGroup}>
          {onCardPress ? (
            <TouchableOpacity
              style={homeStyles.viewDetailsBtn}
              onPress={onCardPress}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={homeStyles.viewDetailsText}>View Details</Text>
              <ChevronRightIcon size={12} color={theme.colors.primary} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            homeStyles.joinBtn,
            isExpired && homeStyles.joinBtnDisabled,
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
              isExpired && homeStyles.joinBtnTextDisabled,
            ]}
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default UpcomingAppointmentCard;
