import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { profileStyles } from '../../../styled/ProfileScreen.styled';
import { theme } from '../../../styled/theme.styled';

export interface SettingsProfileCardProps {
  user?: any;
  initials?: string;
  bgColor?: string;
  onEditProfile: () => void;
}

export const SettingsProfileCard = React.memo<SettingsProfileCardProps>(
  ({ user, initials = 'SJ', bgColor = theme.colors.primarySoft, onEditProfile }) => (
    <View style={profileStyles.profileCard}>
      <View style={[profileStyles.avatarContainer, { backgroundColor: bgColor }]}>
        <Text style={profileStyles.avatarText}>{initials}</Text>
      </View>
      <View style={profileStyles.profileInfo}>
        <Text style={profileStyles.doctorName}>{user?.name ? `Dr. ${user.name}` : 'Dr. Sarah Jenkins'}</Text>
        <Text style={profileStyles.medicalDegree}>
          {user?.specialization || 'Cardiologist'} • {user?.qualifications || 'MBBS, MD (Harvard)'}
        </Text>
      </View>
      <TouchableOpacity
        style={profileStyles.editProfileBtn}
        onPress={onEditProfile}
        activeOpacity={0.75}
      >
        <Text style={profileStyles.editProfileBtnTxt}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  )
);

export default SettingsProfileCard;
