import React, { useMemo } from 'react';
import { Image, Text, View } from 'react-native';
import { mediaPaths } from '../../../api/endpoints';
import { getInitials } from '../../../lib/common/common.utils';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';

export interface PrescriptionPatientHeaderCardProps {
  name: string;
  patientId: string;
  gender?: string;
  age?: string | number;
  bloodGroup?: string;
  avatarBgColor?: string;
  profileImg?: string;
}

export const PrescriptionPatientHeaderCard: React.FC<PrescriptionPatientHeaderCardProps> = ({
  name,
  patientId,
  gender = 'Female',
  age = '34 yrs',
  bloodGroup = 'O+',
  avatarBgColor = theme.colors.primary,
  profileImg,
}) => {
  const imgPath = useMemo(() => {
    return mediaPaths(profileImg);
  }, [profileImg]);

  return (
    <View style={patientDetailsStyles.profileCard}>
      <View style={patientDetailsStyles.profileCardInner}>
        {profileImg ? (
          <Image source={{ uri: imgPath }} style={patientDetailsStyles.profileAvatar} />
        ) : (
          <View style={[patientDetailsStyles.profileAvatar, { backgroundColor: avatarBgColor }]}>
            <Text style={patientDetailsStyles.profileAvatarText}>{getInitials(name)}</Text>
          </View>
        )}
        <View style={patientDetailsStyles.profileInfoGroup}>
          <Text style={patientDetailsStyles.profileName}>{name?.toUpperCase()}</Text>
          <Text style={patientDetailsStyles.profileIdText}>ID: {patientId}</Text>

          <View style={patientDetailsStyles.profileChips}>
            {!!gender && (
              <View style={patientDetailsStyles.profileChip}>
                <Text style={patientDetailsStyles.profileChipText}>{gender?.toUpperCase()}</Text>
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

export default PrescriptionPatientHeaderCard;
