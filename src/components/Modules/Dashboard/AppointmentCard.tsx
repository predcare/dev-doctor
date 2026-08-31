import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { homeStyles } from '../../../styled/HomeScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { ClockIcon, VideoIcon } from '../../ui/icons';

export interface AppointmentCardProps {
  id: string;
  patientName: string;
  ageGender: string;
  time: string;
  timeDistance: string;
  consultType: 'ONLINE' | 'IN-PERSON' | string;
  chiefComplaint: string;
  avatarInitials: string;
  avatarBgColor?: string;
  isOngoing?: boolean;
  onActionPress?: () => void;
  onSecondaryPress?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  patientName,
  ageGender,
  time,
  timeDistance,
  consultType,
  chiefComplaint,
  avatarInitials,
  avatarBgColor = theme.colors.primary,
  isOngoing = false,
  onActionPress,
  onSecondaryPress,
}) => {
  const isOnline =
    consultType.toUpperCase().includes('ONLINE') || consultType.toUpperCase().includes('VIDEO');
  const chipBg = isOnline ? theme.colors.primarySoft : theme.colors.warningLight;
  const chipText = isOnline ? theme.colors.primary : theme.colors.warning;

  return (
    <View style={homeStyles.appointmentCard}>
      {/* Time Header Row */}
      <View style={homeStyles.apptTimeRow}>
        <View style={homeStyles.timeGroup}>
          <ClockIcon size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
          <Text style={homeStyles.apptTime}>{time}</Text>
        </View>
        <Text style={homeStyles.apptDistance}>{timeDistance}</Text>
      </View>

      {/* Main Patient Content Row */}
      <View style={homeStyles.apptPatientRow}>
        <View style={[homeStyles.apptAvatar, { backgroundColor: avatarBgColor }]}>
          <Text style={homeStyles.apptAvatarText}>{avatarInitials}</Text>
        </View>

        <View style={homeStyles.patientInfoGroup}>
          <View style={homeStyles.nameRow}>
            <Text style={homeStyles.apptPatientName}>{patientName}</Text>
            <View
              style={[
                homeStyles.statusDot,
                { backgroundColor: isOnline ? theme.colors.success : theme.colors.warning },
              ]}
            />
          </View>

          <Text style={homeStyles.patientMetaText}>{ageGender}</Text>

          <View style={[homeStyles.consultChip, { backgroundColor: chipBg }]}>
            <Text style={[homeStyles.consultChipText, { color: chipText }]}>
              {consultType.toUpperCase()}
            </Text>
          </View>

          {!!chiefComplaint && (
            <Text style={homeStyles.symptomsText} numberOfLines={2}>
              <Text style={homeStyles.symptomsLabel}>Symptoms: </Text>
              {chiefComplaint}
            </Text>
          )}
        </View>

        {/* Action Button */}
        {isOnline && isOngoing ? (
          <TouchableOpacity style={homeStyles.joinBtn} onPress={onActionPress} activeOpacity={0.85}>
            <VideoIcon size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={homeStyles.joinBtnText}>Join</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={homeStyles.detailsBtn}
            onPress={onSecondaryPress || onActionPress}
            activeOpacity={0.85}
          >
            <Text style={homeStyles.detailsBtnText}>Details</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AppointmentCard;
