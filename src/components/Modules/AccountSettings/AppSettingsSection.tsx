import React from 'react';
import { ActivityIndicator, Switch, View } from 'react-native';
import { profileStyles } from '../../../styled/ProfileScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { BellIcon, CalendarIcon, ShieldIcon, ThemeIcon } from '../../ui/icons';
import SettingsRowItem from './SettingsRowItem';
import SettingsSectionLabel from './SettingsSectionLabel';

export interface AppSettingsSectionProps {
  gcConnected: boolean;
  gcLoading: boolean;
  gcDisconnecting: boolean;
  onGCToggle: (val: boolean) => void;
  notifEnabled: boolean;
  onNotifToggle: (val: boolean) => void;
  faceIDEnabled: boolean;
  onFaceIDToggle: (val: boolean) => void;
  onThemePress: () => void;
}

export const AppSettingsSection = React.memo<AppSettingsSectionProps>(
  ({
    gcConnected,
    gcLoading,
    gcDisconnecting,
    onGCToggle,
    notifEnabled,
    onNotifToggle,
    faceIDEnabled,
    onFaceIDToggle,
    onThemePress,
  }) => (
    <>
      <SettingsSectionLabel title="APP SETTINGS" />
      <View style={profileStyles.menuGroup}>
        {/* Google Calendar toggle */}
        <SettingsRowItem
          icon={<CalendarIcon size={18} color={theme.colors.primary} />}
          label="Google Calendar"
          right={
            gcLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Switch
                value={gcConnected}
                onValueChange={onGCToggle}
                trackColor={{ false: theme.colors.surfaceBorder, true: '#A7F3D0' }}
                thumbColor={gcConnected ? theme.colors.primary : '#CBD5E1'}
                disabled={gcDisconnecting}
                ios_backgroundColor={theme.colors.surfaceBorder}
              />
            )
          }
        />

        {/* Notifications toggle */}
        <SettingsRowItem
          icon={<BellIcon size={18} color={theme.colors.primary} />}
          label="Notifications"
          right={
            <Switch
              value={notifEnabled}
              onValueChange={onNotifToggle}
              trackColor={{ false: theme.colors.surfaceBorder, true: '#A7F3D0' }}
              thumbColor={notifEnabled ? theme.colors.primary : '#CBD5E1'}
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
              value={faceIDEnabled}
              onValueChange={onFaceIDToggle}
              trackColor={{ false: theme.colors.surfaceBorder, true: '#A7F3D0' }}
              thumbColor={faceIDEnabled ? theme.colors.primary : '#CBD5E1'}
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
          right={<View style={[profileStyles.themeDot, { backgroundColor: theme.colors.primary }]} />}
        />
      </View>
    </>
  )
);

export default AppSettingsSection;
