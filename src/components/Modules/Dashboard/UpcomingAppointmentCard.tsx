import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { capitalize, getInitials } from '../../../lib/common/common.utils';
import { homeStyles } from '../../../styled/HomeScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { ClockIcon } from '../../ui/icons';

export interface AppointmentCardProps {
  id: string;
  patientName: string;
  ageGender: string;
  time: string;
  timeDistance: string;
  isExpired: boolean;
  consultType: 'ONLINE' | 'IN-PERSON' | string;
  chiefComplaint: string;
  onActionPress?: () => void;
  onSecondaryPress?: () => void;
}

export const UpcomingAppointmentCard: React.FC<AppointmentCardProps> = ({
  patientName,
  ageGender,
  time,
  timeDistance,
  consultType,
  chiefComplaint,
  onActionPress,
  isExpired,
}) => {
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
            homeStyles.detailsBtn,
            isExpired && {
              backgroundColor: theme.colors.grayDisabled,
            },
          ]}
          onPress={onActionPress}
          activeOpacity={0.85}
          disabled={isExpired}
        >
          <Text
            style={[
              homeStyles.detailsBtnText,
              isExpired && {
                color: theme.colors.grayText,
              },
            ]}
          >
            Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpcomingAppointmentCard;
