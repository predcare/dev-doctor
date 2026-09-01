import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  BellIcon,
  CalendarIcon,
  ChevronLeftIcon,
  InfoCircleIcon,
  InvoiceIcon,
  PatientsIcon,
  PrescriptionIcon,
  SettingsIcon,
} from '../components/ui/icons';
import { getInitials } from '../lib/common/common.utils';
import { headerStyles } from '../styled/Header.styled';
import { theme } from '../styled/theme.styled';
import { useAuthStore } from '../zustand/stores/useAuthStore';

const getDefaultHeaderIcon = (title?: string) => {
  if (!title) return <SettingsIcon size={20} color={theme.colors.primary} />;
  const lower = title.toLowerCase();
  if (lower.includes('setting')) return <SettingsIcon size={20} color={theme.colors.primary} />;
  if (lower.includes('patient')) return <PatientsIcon size={20} color={theme.colors.primary} />;
  if (lower.includes('appoint') || lower.includes('schedul') || lower.includes('calendar')) {
    return <CalendarIcon size={20} color={theme.colors.primary} />;
  }
  if (lower.includes('invoic') || lower.includes('bill')) {
    return <InvoiceIcon size={20} color={theme.colors.primary} />;
  }
  if (lower.includes('prescrip') || lower.includes('rx')) {
    return <PrescriptionIcon size={20} color={theme.colors.primary} />;
  }
  return <InfoCircleIcon size={20} color={theme.colors.primary} />;
};
interface HeaderProps {
  isHome?: boolean;
  title?: string;
  description?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onBackPress?: () => void;
  doctorName?: string;
  specialty?: string;
  clinicName?: string;
  unreadCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isHome,
  title,
  description,
  subtitle,
  icon,
  onBackPress,
  doctorName = 'Dr. Sarah Jenkins',
  specialty = 'Cardiologist • MD',
  clinicName = 'St. Jude Medical Center',
  unreadCount = 3,
  onNotificationPress,
  onProfilePress,
}) => {
  const subText = description || subtitle;
  const { userData } = useAuthStore(state => state);
  return (
    <View style={headerStyles.container}>
      {/* Top Profile & Action Row */}
      <View style={headerStyles.topRow}>
        {!isHome ? (
          <View style={headerStyles.titleContainer}>
            {onBackPress && (
              <TouchableOpacity
                style={headerStyles.backButton}
                onPress={onBackPress}
                activeOpacity={0.7}
              >
                <ChevronLeftIcon size={20} color={theme.colors.dark} />
              </TouchableOpacity>
            )}
            <View style={headerStyles.titleRow}>
              <View style={headerStyles.titleIconBadge}>{icon || getDefaultHeaderIcon(title)}</View>
              <View style={headerStyles.titleTextGroup}>
                <Text style={headerStyles.headerTitle}>{title}</Text>
                {subText ? <Text style={headerStyles.headerDescription}>{subText}</Text> : null}
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={headerStyles.profileGroup}
            onPress={onProfilePress}
            activeOpacity={0.8}
          >
            <View style={headerStyles.avatarWrapper}>
              <View style={headerStyles.avatarContainer}>
                <Text style={headerStyles.avatarText}>{getInitials(userData?.name || 'Dr.')}</Text>
              </View>
              <View style={headerStyles.onlineBadge} />
            </View>

            <View style={headerStyles.greetingContainer}>
              <Text style={headerStyles.welcomeText}>Good morning 👋</Text>
              <Text style={headerStyles.doctorName}>{userData?.name || 'Unknown'}</Text>
              <Text style={headerStyles.specialtyText}>
                {userData?.specialization || 'Unknown'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Action Buttons */}
        <View style={headerStyles.actionsGroup}>
          <TouchableOpacity
            style={headerStyles.iconButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <BellIcon size={20} color={theme.colors.textPrimary} />
            {unreadCount > 0 && <View style={headerStyles.notificationDot} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;
