import React from 'react';
import { Switch, View } from 'react-native';
import { profileStyles } from '../../../styled/ProfileScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { BellIcon, CalendarIcon, ShieldIcon, ThemeIcon } from '../../ui/icons';
import SettingsRowItem from './SettingsRowItem';
import SettingsSectionLabel from './SettingsSectionLabel';

export interface AppSettingsSectionProps {
  onGCToggle: (val: boolean) => void;
  onNotifToggle: (val: boolean) => void;
  onFaceIDToggle: (val: boolean) => void;
  onThemePress: () => void;
}

export const AppSettingsSection = React.memo<AppSettingsSectionProps>(
  ({ onGCToggle, onNotifToggle, onFaceIDToggle, onThemePress }) => (
    <>
      <SettingsSectionLabel title="APP SETTINGS" />
      <View style={profileStyles.menuGroup}>
        {/* Google Calendar toggle */}
        <SettingsRowItem
          icon={<CalendarIcon size={18} color={theme.colors.primary} />}
          label="Google Calendar"
          right={
            <Switch
              onValueChange={onGCToggle}
              trackColor={{ false: theme.colors.surfaceBorder, true: '#A7F3D0' }}
              thumbColor={theme.colors.primary}
              ios_backgroundColor={theme.colors.surfaceBorder}
            />
          }
        />

        {/* Notifications toggle */}
        <SettingsRowItem
          icon={<BellIcon size={18} color={theme.colors.primary} />}
          label="Notifications"
          right={
            <Switch
              onValueChange={onNotifToggle}
              trackColor={{ false: theme.colors.surfaceBorder, true: '#A7F3D0' }}
              thumbColor={theme.colors.primary}
              ios_backgroundColor={theme.colors.surfaceBorder}
            />
          }
        />

        {/* Security & FaceID toggle */}
        <SettingsRowItem
          icon={<ShieldIcon size={18} color={theme.colors.primary} />}
          label="Security & FaceID"
          right={
            <Switch
              onValueChange={onFaceIDToggle}
              trackColor={{ false: theme.colors.surfaceBorder, true: '#A7F3D0' }}
              thumbColor={theme.colors.primary}
              ios_backgroundColor={theme.colors.surfaceBorder}
            />
          }
        />

        {/* Theme */}
        <SettingsRowItem
          icon={<ThemeIcon size={18} color={theme.colors.primary} />}
          label="Theme"
          value="Teal Mint"
          last
          onPress={onThemePress}
          right={
            <View style={[profileStyles.themeDot, { backgroundColor: theme.colors.primary }]} />
          }
        />
      </View>
    </>
  )
);

export default AppSettingsSection;
