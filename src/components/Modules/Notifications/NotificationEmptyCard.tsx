import React from 'react';
import { View } from 'react-native';
import CommonEmptyCard from '../../commons/CommonEmptyCard/CommonEmptyCard';
import { notificationsStyles as styles } from '../../../styled/NotificationsScreen.styled';

export interface NotificationEmptyCardProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export const NotificationEmptyCard: React.FC<NotificationEmptyCardProps> = ({
  title = 'No Notifications',
  message = "You're all caught up! New notifications will appear here.",
  actionText,
  onAction,
}) => {
  return (
    <View style={styles.emptyWrapper}>
      <CommonEmptyCard
        title={title}
        message={message}
        actionText={actionText}
        onAction={onAction}
        containerStyle={{ width: '100%' }}
      />
    </View>
  );
};

export default NotificationEmptyCard;
