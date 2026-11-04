import React from 'react';
import { Text, View } from 'react-native';
import { WalletIcon } from '../../../../components/ui/icons';
import { formatReviewText } from '../../../../lib/commons/common.utils';
import profileStyles from '../../../../styled/ProfileScreen.styled';
import theme from '../../../../styled/theme.styled';
import { useAuthStore } from '../../../../zustand/stores/useAuthStore';
import SettingsRowItem from './SettingsRowItem';
import SettingsSectionLabel from './SettingsSectionLabel';

export interface WalletSectionProps {
  onTopUp: () => void;
}

export const WalletSection = React.memo<WalletSectionProps>(({ onTopUp }) => {
  const userData = useAuthStore(state => state.userData);
  return (
    <>
      <SettingsSectionLabel title="WALLET & CREDITS" />
      <View style={profileStyles.menuGroup}>
        <SettingsRowItem
          icon={<WalletIcon size={18} color={theme.colors.primary} />}
          label="Messaging Credits"
          value={formatReviewText(Number(userData?.wallet_credit), 'Credit')}
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
  );
});

export default WalletSection;
