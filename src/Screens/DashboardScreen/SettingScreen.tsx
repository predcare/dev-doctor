import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../Layout/Header';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import AccountSettingsSection from '../../components/Modules/AccountSettings/AccountSettingsSection';
import AppSettingsSection from '../../components/Modules/AccountSettings/AppSettingsSection';
import SettingsProfileCard from '../../components/Modules/AccountSettings/SettingsProfileCard';
import SupportSection from '../../components/Modules/AccountSettings/SupportSection';
import WalletSection from '../../components/Modules/AccountSettings/WalletSection';
import PopupAlert, {
  AlertType,
} from '../../components/commons/PopupAlert/PopupAlert';
import { BellIcon, ChevronLeftIcon } from '../../components/ui/icons';
import type {
  ProfileScreenNavigationProp,
  ProfileScreenRouteProp,
  RootStackParamList,
} from '../../route';
import { profileStyles } from '../../styled/ProfileScreen.styled';
import { theme } from '../../styled/theme.styled';

export interface ProfileScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export const SettingScreen: React.FC<ProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const user = route?.params ? (route.params as any)?.user : undefined;
  const [subExpanded, setSubExpanded] = useState(false);

  const [gcConnected, setGcConnected] = useState(false);
  const [gcLoading, setGcLoading] = useState(false);
  const [gcDisconnecting, setGcDisconnecting] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [faceIDEnabled, setFaceIDEnabled] = useState(true);

  const [popupAlert, setPopupAlert] = useState<{
    visible: boolean;
    type: AlertType;
    title: string;
    message: string;
    showCancel?: boolean;
    buttonText?: string;
    onPress?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: 'Coming Soon',
    message: '',
  });

  const showComingSoon = (message: string, title: string = 'Coming Soon') => {
    setPopupAlert({
      visible: true,
      type: 'info',
      title,
      message,
      showCancel: false,
      buttonText: 'OK',
      onPress: () => setPopupAlert(prev => ({ ...prev, visible: false })),
    });
  };

  const handleLogout = () => {
    setPopupAlert({
      visible: true,
      type: 'confirm',
      title: 'Sign Out',
      message: 'Are you sure you want to log out of the Practice Portal?',
      showCancel: true,
      buttonText: 'Sign Out',
      onPress: () => {
        setPopupAlert(prev => ({ ...prev, visible: false }));
        if (navigation) {
          const rootNav =
            navigation.getParent<
              NativeStackNavigationProp<RootStackParamList>
            >();
          if (rootNav) {
            rootNav.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } else if (navigation) {
            (navigation as any).reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      },
    });
  };

  const handleGCToggle = (val: boolean) => {
    if (val) {
      setGcConnected(true);
      setPopupAlert({
        visible: true,
        type: 'success',
        title: 'Connected!',
        message: 'Google Calendar sync and appointment reminders enabled.',
        showCancel: false,
        buttonText: 'OK',
        onPress: () => setPopupAlert(prev => ({ ...prev, visible: false })),
      });
    } else {
      setPopupAlert({
        visible: true,
        type: 'warning',
        title: 'Disconnect Google Calendar',
        message:
          'You will stop receiving Google Calendar appointment reminders.',
        showCancel: true,
        buttonText: 'Disconnect',
        onPress: () => {
          setGcConnected(false);
          setPopupAlert({
            visible: true,
            type: 'info',
            title: 'Disconnected',
            message: 'Google Calendar unlinked successfully.',
            showCancel: false,
            buttonText: 'OK',
            onPress: () => setPopupAlert(prev => ({ ...prev, visible: false })),
          });
        },
      });
    }
  };

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <Header
        title="Account Settings"
        subtitle="Manage your profile & preferences"
        unreadCount={3}
        onNotificationPress={() => navigation?.navigate('Notifications')}
        onProfilePress={() => navigation?.navigate('DoctorProfile', { user })}
      />

      <ScrollView
        style={profileStyles.container}
        contentContainerStyle={profileStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsProfileCard
          user={user}
          initials="SJ"
          bgColor={theme.colors.primarySoft}
          onEditProfile={() => navigation?.navigate('DoctorProfile', { user })}
        />
        <AccountSettingsSection
          onNavigateProfile={() =>
            navigation?.navigate('DoctorProfile', { user })
          }
          onNavigatePrescription={() =>
            (navigation as any)?.navigate('PrescriptionSettings', { user })
          }
          onNavigateInvoice={() =>
            (navigation as any)?.navigate('InvoiceSettings', { user })
          }
          onNavigateAvailability={() =>
            (navigation as any)?.navigate('Availability', { user })
          }
          subExpanded={subExpanded}
          onToggleSubscription={() => setSubExpanded(v => !v)}
          onManageSubscription={() =>
            showComingSoon('Subscription management feature is coming soon.')
          }
          onAddonPress={addonName =>
            showComingSoon(`${addonName} add-on purchase is coming soon.`)
          }
        />
        <WalletSection
          onTopUp={() =>
            showComingSoon('Messaging credits top-up feature is coming soon.')
          }
        />
        <AppSettingsSection
          gcConnected={gcConnected}
          gcLoading={gcLoading}
          gcDisconnecting={gcDisconnecting}
          onGCToggle={handleGCToggle}
          notifEnabled={notifEnabled}
          onNotifToggle={setNotifEnabled}
          faceIDEnabled={faceIDEnabled}
          onFaceIDToggle={setFaceIDEnabled}
          onThemePress={() =>
            showComingSoon('Theme customization feature is coming soon.')
          }
        />
        <SupportSection
          onHelpCenter={() =>
            showComingSoon('Help Center feature is coming soon.')
          }
          onPrivacyPolicy={() =>
            showComingSoon('Privacy Policy feature is coming soon.')
          }
          onLogout={handleLogout}
        />
      </ScrollView>
      <PopupAlert
        visible={popupAlert.visible}
        type={popupAlert.type}
        title={popupAlert.title}
        message={popupAlert.message}
        showCancel={popupAlert.showCancel}
        buttonText={popupAlert.buttonText}
        onPress={popupAlert.onPress}
        onCancel={() => setPopupAlert(prev => ({ ...prev, visible: false }))}
        closeOnBackdrop={true}
      />
    </SafeAreaWrapper>
  );
};

export default SettingScreen;
