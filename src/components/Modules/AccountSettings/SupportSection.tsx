import React from 'react';
import { Text, View } from 'react-native';
import { profileStyles } from '../../../styled/ProfileScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { HelpIcon, LogoutIcon, ShieldIcon } from '../../ui/icons';
import SettingsRowItem from './SettingsRowItem';
import SettingsSectionLabel from './SettingsSectionLabel';

export interface SupportSectionProps {
  onHelpCenter: () => void;
  onPrivacyPolicy: () => void;
  onLogout: () => void;
}

export const SupportSection = React.memo<SupportSectionProps>(
  ({ onHelpCenter, onPrivacyPolicy, onLogout }) => (
    <>
      <SettingsSectionLabel title="SUPPORT" />
      <View style={profileStyles.menuGroup}>
        <SettingsRowItem
          icon={<HelpIcon size={18} color={theme.colors.primary} />}
          label="Help Center"
          onPress={onHelpCenter}
        />
        <SettingsRowItem
          icon={<ShieldIcon size={18} color={theme.colors.primary} />}
          label="Privacy Policy"
          onPress={onPrivacyPolicy}
        />
        <SettingsRowItem
          icon={<LogoutIcon size={18} color={theme.colors.danger} />}
          label="Logout"
          danger
          last
          onPress={onLogout}
        />
      </View>
      <Text style={profileStyles.versionText}>VERSION 2.4.0 (BUILD 882)</Text>
    </>
  )
);

export default SupportSection;
