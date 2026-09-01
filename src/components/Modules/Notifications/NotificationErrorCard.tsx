import React from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import CommonErrorCard from '../../commons/CommonErrorCard/CommonErrorCard';
import { ChevronLeftIcon } from '../../ui/icons';
import { notificationsStyles as styles } from '../../../styled/NotificationsScreen.styled';
import { theme } from '../../../styled/theme.styled';

export interface NotificationErrorCardProps {
  onRetry?: () => void;
  onBack?: () => void;
  title?: string;
  message?: string;
}

export const NotificationErrorCard: React.FC<NotificationErrorCardProps> = ({
  onRetry,
  onBack,
  title = 'Failed to Load Notifications',
  message = 'Something went wrong while fetching your notifications.',
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <View style={styles.backBtnCircle}>
              <ChevronLeftIcon size={18} color={theme.colors.primary} />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>
      <View style={styles.emptyWrapper}>
        <CommonErrorCard title={title} message={message} onRetry={onRetry} />
      </View>
    </View>
  );
};

export default NotificationErrorCard;
