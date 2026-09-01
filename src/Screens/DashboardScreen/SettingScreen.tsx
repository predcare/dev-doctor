import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Header } from '../../Layout/Header';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import AccountSettingsSection from '../../components/Modules/AccountSettings/AccountSettingsSection';
import AppSettingsSection from '../../components/Modules/AccountSettings/AppSettingsSection';
import SettingsProfileCard from '../../components/Modules/AccountSettings/SettingsProfileCard';
import SupportSection from '../../components/Modules/AccountSettings/SupportSection';
import WalletSection from '../../components/Modules/AccountSettings/WalletSection';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import { resetToLogin } from '../../lib/common/navigation.utils';
import type { ProfileScreenNavigationProp, ProfileScreenRouteProp } from '../../route';
import { profileStyles } from '../../styled/ProfileScreen.styled';
import { useAlertStore } from '../../zustand/stores/useAlertStore';
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';

export interface ProfileScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export const SettingScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const user = route?.params ? (route.params as any)?.user : undefined;
  const [subExpanded, setSubExpanded] = useState(false);

  const showComingSoon = useAlertStore(state => state.showComingSoon);
  const showConfirm = useAlertStore(state => state.showConfirm);
  const logout = useAuthStore(state => state.logout);
  const { hideLoader, showLoader } = useLoadingStore(state => state);

  const handleLogout = () => {
    showConfirm({
      title: 'Sign Out',
      message: 'Are you sure you want to log out of the Practice Portal?',
      buttonText: 'Sign Out',
      onConfirm: async () => {
        showLoader('Signing out...');
        await queryClient.clear();
        await logout();
        hideLoader();
        resetToLogin(navigation);
      },
    });
  };

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <Header
        title="Settings"
        description="Manage your App Settings"
        unreadCount={3}
        onNotificationPress={() => navigation?.navigate('Notifications')}
      />

      <ScrollView
        style={profileStyles.container}
        contentContainerStyle={profileStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsProfileCard
          onEditProfile={() => navigation?.navigate('DoctorProfile', { user })}
        />
        <AccountSettingsSection
          onNavigateProfile={() => navigation?.navigate('DoctorProfile', { user })}
          onNavigatePrescription={() =>
            (navigation as any)?.navigate('PrescriptionSettings', { user })
          }
          onNavigateInvoice={() => (navigation as any)?.navigate('InvoiceSettings', { user })}
          subExpanded={subExpanded}
          onToggleSubscription={() => setSubExpanded(v => !v)}
          onManageSubscription={() =>
            showComingSoon('Subscription management feature is coming soon.')
          }
          onAddonPress={addonName => showComingSoon(`${addonName} add-on purchase is coming soon.`)}
        />
        <WalletSection
          onTopUp={() => showComingSoon('Messaging credits top-up feature is coming soon.')}
        />
        <AppSettingsSection
          onGCToggle={() => showComingSoon('Google Calendar sync is coming soon.')}
          onNotifToggle={() => showComingSoon('Notification settings is coming soon.')}
          onFaceIDToggle={() => showComingSoon('Face ID is coming soon.')}
          onThemePress={() => showComingSoon('Theme customization feature is coming soon.')}
        />
        <SupportSection
          onHelpCenter={() => showComingSoon('Help Center feature is coming soon.')}
          onPrivacyPolicy={() => showComingSoon('Privacy Policy feature is coming soon.')}
          onLogout={handleLogout}
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default SettingScreen;
