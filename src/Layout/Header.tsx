import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { BellIcon, ChevronLeftIcon } from '../components/ui/icons';
import { headerStyles } from '../styled/Header.styled';
import { theme } from '../styled/theme.styled';
import { getInitials } from '../lib/commons/common.utils';

export interface HeaderProps {
  isHome?: boolean;
  title?: string;
  subtitle?: string;
  doctorName?: string;
  specialty?: string;
  clinicName?: string;
  unreadCount?: number;
  barStyle?: 'dark-content' | 'light-content';
  showBack?: boolean;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isHome = false,
  title,
  subtitle,
  doctorName = 'Dr. Sarah Jenkins',
  specialty,
  unreadCount = 0,
  barStyle = 'dark-content',
  showBack = false,
  onBackPress,
  onNotificationPress,
  onProfilePress,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  const showHomeScreen = isHome || !title;

  return (
    <View style={headerStyles.container}>
      <StatusBar barStyle={barStyle} animated />
      <View style={headerStyles.topRow}>
        <View style={headerStyles.profileGroup}>
          {showBack ? (
            <TouchableOpacity
              style={headerStyles.backBtn}
              onPress={onBackPress}
              activeOpacity={0.8}
            >
              <ChevronLeftIcon size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={headerStyles.avatarWrapper}
              onPress={onProfilePress}
              activeOpacity={0.85}
            >
              <View style={headerStyles.avatar}>
                <Text style={headerStyles.avatarText}>
                  {getInitials(doctorName)}
                </Text>
              </View>
              <View style={headerStyles.onlineBadge} />
            </TouchableOpacity>
          )}

          <View style={headerStyles.greetingContainer}>
            {showHomeScreen ? (
              <>
                <Text style={headerStyles.welcomeText}>{getGreeting()}</Text>
                <Text style={headerStyles.doctorName} numberOfLines={1}>
                  {doctorName}
                </Text>
                {specialty && (
                  <Text style={headerStyles.specialtyText} numberOfLines={1}>
                    {specialty}
                  </Text>
                )}
              </>
            ) : (
              <>
                <Text style={headerStyles.pageTitle} numberOfLines={1}>
                  {title}
                </Text>
                {subtitle ? (
                  <Text style={headerStyles.welcomeText} numberOfLines={1}>
                    {subtitle}
                  </Text>
                ) : null}
              </>
            )}
          </View>
        </View>
        <View style={headerStyles.actionsGroup}>
          <TouchableOpacity
            style={headerStyles.iconButton}
            onPress={onNotificationPress}
            activeOpacity={0.75}
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
