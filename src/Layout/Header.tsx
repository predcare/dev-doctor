import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
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
import { useNotificationCount } from '../hooks/react-query/notifications/notifications.hooks';
import { getInitials } from '../lib/common/common.utils';
import { AppRoute } from '../route';
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
  isIconShow?: boolean;
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
  isIconShow = true,
  onBackPress,
  onProfilePress,
}) => {
  const navigation = useNavigation();

  const { userData } = useAuthStore(state => state);

  const { data: notificationData, isPending: isLoadingNotificationCount } = useNotificationCount();

  const isNotificationAvailable = useMemo(() => {
    return notificationData && notificationData?.data?.unread_count > 0 ? true : false;
  }, [notificationData?.data?.unread_count]);

  const handleMoveToNotify = () => {
    navigation.navigate(AppRoute.NOTIFICATIONS);
  };

  return (
    <View style={headerStyles.container}>
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
              {isIconShow ? (
                <View style={headerStyles.titleIconBadge}>
                  {icon || getDefaultHeaderIcon(title)}
                </View>
              ) : null}
              <View style={headerStyles.titleTextGroup}>
                <Text style={headerStyles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                  {title}
                </Text>
                {description || subtitle ? (
                  <Text
                    style={headerStyles.headerDescription}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {description || subtitle}
                  </Text>
                ) : null}
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
              <Text style={headerStyles.doctorName} numberOfLines={1} ellipsizeMode="tail">
                {userData?.name || 'Unknown'}
              </Text>
              <Text style={headerStyles.specialtyText} numberOfLines={1} ellipsizeMode="tail">
                {userData?.specialization || 'Unknown'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={headerStyles.actionsGroup}>
          <TouchableOpacity
            style={headerStyles.iconButton}
            onPress={handleMoveToNotify}
            activeOpacity={0.7}
          >
            {isLoadingNotificationCount ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <>
                <BellIcon size={20} color={theme.colors.textPrimary} />
                {isNotificationAvailable && <View style={headerStyles.notificationDot} />}
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;
