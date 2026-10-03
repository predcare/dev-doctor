import React, { useState } from 'react';
import { View } from 'react-native';
import CustomSwitch from '../../../../components/ui/CustomSwitch';
import { BellIcon, CalendarIcon, ShieldIcon, ThemeIcon } from '../../../../components/ui/icons';
import profileStyles from '../../../../styled/ProfileScreen.styled';
import theme from '../../../../styled/theme.styled';
import SettingsRowItem from './SettingsRowItem';
import SettingsSectionLabel from './SettingsSectionLabel';

export interface AppSettingsSectionProps {
  gcEnabled?: boolean;
  notifEnabled?: boolean;
  faceIDEnabled?: boolean;
  onGCToggle: (val: boolean) => void;
  onNotifToggle: (val: boolean) => void;
  onFaceIDToggle: (val: boolean) => void;
  onThemePress: () => void;
}

export const AppSettingsSection = React.memo<AppSettingsSectionProps>(
  ({
    gcEnabled,
    notifEnabled,
    faceIDEnabled,
    onGCToggle,
    onNotifToggle,
    onFaceIDToggle,
    onThemePress,
  }) => {
    const [internalGC, setInternalGC] = useState(false);
    const [internalNotif, setInternalNotif] = useState(false);
    const [internalFaceID, setInternalFaceID] = useState(false);

    const isGCActive = gcEnabled ?? internalGC;
    const isNotifActive = notifEnabled ?? internalNotif;
    const isFaceIDActive = faceIDEnabled ?? internalFaceID;

    const handleGCToggle = (val: boolean) => {
      if (gcEnabled === undefined) {
        setInternalGC(false);
      }
      onGCToggle(false);
    };

    const handleNotifToggle = (val: boolean) => {
      if (notifEnabled === undefined) {
        setInternalNotif(false);
      }
      onNotifToggle(false);
    };

    const handleFaceIDToggle = (val: boolean) => {
      if (faceIDEnabled === undefined) {
        setInternalFaceID(false);
      }
      onFaceIDToggle(false);
    };

    return (
      <>
        <SettingsSectionLabel title="APP SETTINGS" />
        <View style={profileStyles.menuGroup}>
          <SettingsRowItem
            icon={<CalendarIcon size={18} color={theme.colors.primary} />}
            label="Google Calendar"
            right={
              <CustomSwitch
                value={isGCActive}
                onValueChange={handleGCToggle}
              />
            }
          />

          <SettingsRowItem
            icon={<BellIcon size={18} color={theme.colors.primary} />}
            label="Notifications"
            right={
              <CustomSwitch
                value={isNotifActive}
                onValueChange={handleNotifToggle}
              />
            }
          />

          <SettingsRowItem
            icon={<ShieldIcon size={18} color={theme.colors.primary} />}
            label="Security & FaceID"
            right={
              <CustomSwitch
                value={isFaceIDActive}
                onValueChange={handleFaceIDToggle}
              />
            }
          />
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
    );
  }
);

export default AppSettingsSection;
