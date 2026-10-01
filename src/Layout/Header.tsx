import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import {
  BellIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ClinicIcon,
  InfoCircleIcon,
  InvoiceIcon,
  PatientsIcon,
  PrescriptionIcon,
  SettingsIcon,
} from '../components/ui/icons';
import { useNotificationCount } from '../hooks/react-query/notifications/notifications.hooks';
import { getInitials } from '../lib/commons/common.utils';
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
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  isHome,
  title,
  description,
  subtitle,
  icon,
  isIconShow = true,
  onBackPress,
  doctorName,
  specialty,
  clinicName,
  unreadCount,
  onNotificationPress,
  onProfilePress,
  rightAction,
}) => {
  const navigation = useNavigation();

  const { userData } = useAuthStore(state => state);

  const { data: notificationData, isPending: isLoadingNotificationCount } = useNotificationCount();

  const effectiveUnreadCount = useMemo(() => {
    if (typeof unreadCount === 'number') return unreadCount;
    return notificationData?.data?.unread_count ?? 0;
  }, [unreadCount, notificationData?.data?.unread_count]);

  const isNotificationAvailable = useMemo(() => {
    return effectiveUnreadCount > 0;
  }, [effectiveUnreadCount]);

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      navigation.navigate(AppRoute.NOTIFICATIONS);
    }
  };

  const displayName = useMemo(() => {
    const raw = doctorName || userData?.name || 'Doctor';
    return raw.trim();
  }, [doctorName, userData?.name]);

  const initials = useMemo(() => {
    const cleanName = displayName.replace(/^(Dr\.?|Prof\.?|Doctor)\s+/i, '').trim();
    return getInitials(cleanName || displayName);
  }, [displayName]);


  // Responsive font size and line height based on name length to handle long names cleanly
  const nameFontSize = useMemo(() => {
    const len = displayName.length;
    if (len > 30) return 14;
    if (len > 22) return 15;
    if (len > 16) return 16;
    return 17;
  }, [displayName]);

  const nameLineHeight = useMemo(() => {
    if (nameFontSize <= 14) return 18;
    if (nameFontSize <= 15) return 20;
    return 22;
  }, [nameFontSize]);

  const titleFontSize = useMemo(() => {
    const len = (title || '').length;
    if (len > 30) return 15;
    if (len > 20) return 16;
    return 18;
  }, [title]);

  const titleLineHeight = useMemo(() => {
    if (titleFontSize <= 15) return 20;
    if (titleFontSize <= 16) return 21;
    return 23;
  }, [titleFontSize]);

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
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
                <Text
                  style={[
                    headerStyles.headerTitle,
                    { fontSize: titleFontSize, lineHeight: titleLineHeight },
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.85}
                >
                  {title}
                </Text>
                {description || subtitle ? (
                  <Text
                    style={headerStyles.headerDescription}
                    numberOfLines={2}
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
            activeOpacity={0.75}
          >
            <View style={headerStyles.avatarWrapper}>
              <View style={headerStyles.avatarContainer}>
                <Text style={headerStyles.avatarText}>{initials}</Text>
              </View>
              <View style={headerStyles.onlineBadge} />
            </View>

            <View style={headerStyles.greetingContainer}>
              <Text style={headerStyles.welcomeText} numberOfLines={1}>
                {subtitle || 'Welcome back,'}
              </Text>
              <Text
                style={[
                  headerStyles.doctorName,
                  { fontSize: nameFontSize, lineHeight: nameLineHeight },
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}
              >
                {userData?.name || "Doctor"}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={headerStyles.actionsGroup}>
          {rightAction ? (
            rightAction
          ) : (
            <TouchableOpacity
              style={headerStyles.iconButton}
              onPress={handleNotificationPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              {isLoadingNotificationCount ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <>
                  <BellIcon size={20} color={theme.colors.textSecondary} />
                  {effectiveUnreadCount > 0 ? (
                    <View style={headerStyles.notificationBadge}>
                      <Text style={headerStyles.notificationBadgeText}>
                        {effectiveUnreadCount > 99 ? '99+' : effectiveUnreadCount}
                      </Text>
                    </View>
                  ) : isNotificationAvailable ? (
                    <View style={headerStyles.notificationDot} />
                  ) : null}
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {clinicName ? (
        <View style={headerStyles.clinicBar}>
          <View style={headerStyles.clinicInfo}>
            <ClinicIcon size={14} color={theme.colors.primary} />
            <Text style={headerStyles.clinicName} numberOfLines={1} ellipsizeMode="tail">
              {clinicName}
            </Text>
          </View>
          <View style={headerStyles.statusBadge}>
            <Text style={headerStyles.statusText}>Active</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default Header;
