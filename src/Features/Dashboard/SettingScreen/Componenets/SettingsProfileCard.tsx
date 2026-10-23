import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { _toTitleCase, getInitials } from '../../../../lib/commons/common.utils';
import profileStyles from '../../../../styled/ProfileScreen.styled';
import { useAuthStore } from '../../../../zustand/stores/useAuthStore';

export interface SettingsProfileCardProps {
  onEditProfile: () => void;
}

export const SettingsProfileCard = React.memo<SettingsProfileCardProps>(({ onEditProfile }) => {
  const { userData } = useAuthStore(state => state);

  const doctorName = userData?.name ? `Dr. ${userData?.name}` : 'Dr.';
  const degreeDetails = _toTitleCase(userData?.qualifications ?? '');

  return (
    <View style={profileStyles.profileCard}>
      <View style={profileStyles.avatarContainer}>
        <Text style={profileStyles.avatarText}>{getInitials(userData?.name || '')}</Text>
      </View>
      <View style={profileStyles.profileInfo}>
        <Text style={profileStyles.doctorName} numberOfLines={2}>
          {doctorName}
        </Text>
        <Text style={profileStyles.medicalDegree} numberOfLines={2}>
          {degreeDetails || 'Unknown'}
        </Text>
      </View>
      <TouchableOpacity
        style={profileStyles.editProfileBtn}
        onPress={onEditProfile}
        activeOpacity={0.75}
      >
        <Text style={profileStyles.editProfileBtnTxt}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
});

export default SettingsProfileCard;
