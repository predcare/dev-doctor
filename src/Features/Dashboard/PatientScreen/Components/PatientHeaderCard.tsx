import React from 'react';
import { Image, Text, View } from 'react-native';
import { getInitials } from '../../../../lib/commons/common.utils';
import { patientDetailsStyles } from '../../../../styled/PatientDetailsScreen.styled';
import theme from '../../../../styled/theme.styled';

export interface PatientHeaderCardProps {
  name: string;
  patientId: string;
  gender?: string;
  age?: string | number;
  bloodGroup?: string;
  profileImg?: string;
}

export const PatientHeaderCard: React.FC<PatientHeaderCardProps> = ({
  name,
  patientId,
  gender = '-',
  age = '-',
  bloodGroup = '-',
  profileImg,
}) => {
  return (
    <View style={patientDetailsStyles.profileCard}>
      <View style={patientDetailsStyles.profileCardInner}>
        {profileImg ? (
          <Image source={{ uri: profileImg }} style={patientDetailsStyles.profileAvatar} />
        ) : (
          <View
            style={[patientDetailsStyles.profileAvatar, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={patientDetailsStyles.profileAvatarText}>{getInitials(name)}</Text>
          </View>
        )}
        <View style={patientDetailsStyles.profileInfoGroup}>
          <Text style={patientDetailsStyles.profileName}>{name}</Text>
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
                <Text
                  style={[patientDetailsStyles.profileChipText, { color: theme.colors.danger }]}
                >
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
