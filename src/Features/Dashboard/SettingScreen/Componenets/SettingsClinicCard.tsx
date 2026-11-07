import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ClinicIcon } from '../../../../components/ui/icons';
import profileStyles from '../../../../styled/ProfileScreen.styled';
import theme from '../../../../styled/theme.styled';
import { useAuthStore } from '../../../../zustand/stores/useAuthStore';
import { useSwitchClinicStore } from '../../../../zustand/stores/useSwitchClinicStore';

export interface SettingsClinicCardProps {
  onViewClinic?: () => void;
}

export const SettingsClinicCard = React.memo<SettingsClinicCardProps>(({ onViewClinic }) => {
  const userData = useAuthStore(state => state.userData);
  const openSwitchClinic = useSwitchClinicStore(state => state.open);
  const clinicName = userData?.clinic?.name || userData?.clinic_name || 'No clinic';

  return (
    <View style={[profileStyles.profileCard, { marginTop: theme.spacing.sm }]}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
        onPress={onViewClinic}
        activeOpacity={onViewClinic ? 0.7 : 1}
        disabled={!onViewClinic}
      >
        <View style={profileStyles.avatarContainer}>
          <ClinicIcon size={22} color={theme.colors.primaryDark} />
        </View>
        <View style={profileStyles.profileInfo}>
          <Text style={profileStyles.doctorName} numberOfLines={2}>
            {clinicName}
          </Text>
          <Text style={profileStyles.medicalDegree} numberOfLines={1}>
            Current clinic
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={profileStyles.editProfileBtn}
        onPress={openSwitchClinic}
        activeOpacity={0.75}
      >
        <Text style={profileStyles.editProfileBtnTxt}>Switch</Text>
      </TouchableOpacity>
    </View>
  );
});

export default SettingsClinicCard;
