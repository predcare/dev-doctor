import React from 'react';
import { Text, View } from 'react-native';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';

export interface PatientHeaderCardProps {
  name: string;
  patientId: string;
  gender?: string;
  age?: string | number;
  bloodGroup?: string;
  avatarBgColor?: string;
}

export const PatientHeaderCard: React.FC<PatientHeaderCardProps> = ({
  name,
  patientId,
  gender = 'Female',
  age = '34 yrs',
  bloodGroup = 'O+',
  avatarBgColor = theme.colors.primary,
}) => {
  const words = name.trim().split(' ');
  const initials =
    words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[words.length - 1][0]).toUpperCase();

  return (
    <View style={patientDetailsStyles.profileCard}>
      <View style={patientDetailsStyles.profileCardInner}>
        {/* Avatar */}
        <View style={[patientDetailsStyles.profileAvatar, { backgroundColor: avatarBgColor }]}>
          <Text style={patientDetailsStyles.profileAvatarText}>{initials}</Text>
        </View>

        {/* Name + ID + Info Chips */}
        <View style={patientDetailsStyles.profileInfoGroup}>
          <Text style={patientDetailsStyles.profileName}>{name.toUpperCase()}</Text>
          <Text style={patientDetailsStyles.profileIdText}>ID: {patientId}</Text>

          <View style={patientDetailsStyles.profileChips}>
            {!!gender && (
              <View style={patientDetailsStyles.profileChip}>
                <Text style={patientDetailsStyles.profileChipText}>{gender}</Text>
              </View>
            )}
            {!!age && (
              <View style={patientDetailsStyles.profileChip}>
                <Text style={patientDetailsStyles.profileChipText}>{age}</Text>
              </View>
            )}
            {!!bloodGroup && (
              <View
                style={[
                  patientDetailsStyles.profileChip,
                  { backgroundColor: theme.colors.dangerLight, borderColor: '#FECACA' },
                ]}
              >
                <Text style={[patientDetailsStyles.profileChipText, { color: theme.colors.danger }]}>
                  {bloodGroup}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default PatientHeaderCard;
