import React from 'react';
import { Text, View } from 'react-native';
import { profileStyles } from '../../../styled/ProfileScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { WalletIcon } from '../../ui/icons';
import SettingsRowItem from './SettingsRowItem';
import SettingsSectionLabel from './SettingsSectionLabel';

export interface WalletSectionProps {
  onTopUp: () => void;
}

export const WalletSection = React.memo<WalletSectionProps>(({ onTopUp }) => (
  <>
    <SettingsSectionLabel title="WALLET & CREDITS" />
    <View style={profileStyles.menuGroup}>
      <SettingsRowItem
        icon={<WalletIcon size={18} color={theme.colors.primary} />}
        label="Messaging Credits"
        value="2,450 Credits"
        onPress={onTopUp}
        last
        right={
          <View style={profileStyles.topUpBtn}>
            <Text style={profileStyles.topUpTxt}>TOP-UP</Text>
          </View>
        }
      />
    </View>
  </>
));

export default WalletSection;
