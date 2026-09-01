import React from 'react';
import { View } from 'react-native';
import { profileStyles } from '../../../styled/ProfileScreen.styled';
import { theme } from '../../../styled/theme.styled';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CreditCardIcon,
  HospitalIcon,
  InvoiceIcon,
  PrescriptionIcon,
  ProfessionalDetailsIcon,
} from '../../ui/icons';
import SettingsRowItem from './SettingsRowItem';
import SettingsSectionLabel from './SettingsSectionLabel';
import SubscriptionPlanBlock from './SubscriptionPlanBlock';

export interface AccountSettingsSectionProps {
  onNavigateProfile: () => void;
  onNavigatePrescription: () => void;
  onNavigateInvoice: () => void;
  subExpanded: boolean;
  onToggleSubscription: () => void;
  onManageSubscription?: () => void;
  onAddonPress?: (addonName: string) => void;
}

export const AccountSettingsSection = React.memo<AccountSettingsSectionProps>(
  ({
    onNavigateProfile,
    onNavigatePrescription,
    onNavigateInvoice,
    subExpanded,
    onToggleSubscription,
    onManageSubscription,
    onAddonPress,
  }) => (
    <>
      <SettingsSectionLabel title="ACCOUNT SETTINGS" />
      <View style={profileStyles.menuGroup}>
        {/* Professional Details */}
        <SettingsRowItem
          icon={<ProfessionalDetailsIcon size={18} color={theme.colors.primary} />}
          label="Professional Details"
          onPress={onNavigateProfile}
        />

        {/* Clinic Information */}
        <SettingsRowItem
          icon={<HospitalIcon size={18} color={theme.colors.primary} />}
          label="Clinic Information"
          onPress={onNavigateProfile}
        />

        {/* Subscription Plan — expandable */}
        <SettingsRowItem
          icon={<CreditCardIcon size={18} color={theme.colors.primary} />}
          label="Subscription Plan"
          onPress={onToggleSubscription}
          right={
            subExpanded ? (
              <ChevronUpIcon size={16} color={theme.colors.textMuted} />
            ) : (
              <ChevronDownIcon size={16} color={theme.colors.textMuted} />
            )
          }
        />

        {/* Subscription expanded block */}
        {subExpanded && (
          <SubscriptionPlanBlock
            onManageSubscription={onManageSubscription}
            onAddonPress={onAddonPress}
          />
        )}

        {/* Prescription Setup */}
        <SettingsRowItem
          icon={<PrescriptionIcon size={18} color={theme.colors.primary} />}
          label="Prescription Setup"
          onPress={onNavigatePrescription}
        />

        {/* Invoice Settings */}
        <SettingsRowItem
          icon={<InvoiceIcon size={18} color={theme.colors.primary} />}
          label="Invoice Settings"
          last
          onPress={onNavigateInvoice}
        />
      </View>
    </>
  )
);

export default AccountSettingsSection;
