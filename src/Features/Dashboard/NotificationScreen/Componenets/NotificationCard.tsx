import React, { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Text, TouchableOpacity, View } from 'react-native';
import { CalendarIcon, TrashIcon } from '../../../../components/ui/icons';
import { formatDate } from '../../../../lib/commons/common.utils';
import { notificationCardStyles } from '../../../../styled/NotificationsScreen.styled';
import theme from '../../../../styled/theme.styled';
import {
  IMetadata,
  INotificationDoc,
} from '../../../../typescripts/interfaces/notification.interfaces';

export interface NotificationCardProps {
  item: INotificationDoc;
  onDelete?: () => void;
  onPress?: () => void;
  icon?: React.ReactNode;
  iconColor?: string;
  isUnread?: boolean;
}

const DELETE_BTN_WIDTH = 80;

export const formatTimeAgo = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const formatEventAction = (action?: string, type?: string): string => {
  const raw = action || type || 'Notification';
  if (raw.includes('_')) {
    return raw
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return raw;
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  item,
  onDelete,
  onPress,
  icon,
}) => {
  const pan = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 15;
      },
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx + (isOpen ? -DELETE_BTN_WIDTH : 0);
        if (newX > 0) newX = 0;
        if (newX < -120) newX = -120;
        pan.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentX = gestureState.dx + (isOpen ? -DELETE_BTN_WIDTH : 0);
        if (currentX < -DELETE_BTN_WIDTH / 2) {
          Animated.spring(pan, {
            toValue: -DELETE_BTN_WIDTH,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
          setIsOpen(true);
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
          setIsOpen(false);
        }
      },
    })
  ).current;

  const eventAction = formatEventAction(item.event_action, item.type);
  const description = item.description || item.message || 'You have a new notification';

  const metadata: IMetadata = useMemo(() => {
    return typeof item.metadata === 'string'
      ? (() => {
        try {
          return JSON.parse(item.metadata);
        } catch {
          return {};
        }
      })()
      : item.metadata || {};
  }, [item.metadata]);

  return (
    <View style={notificationCardStyles.container}>
      {onDelete && (
        <TouchableOpacity
          style={notificationCardStyles.deleteButton}
          activeOpacity={0.8}
          onPress={() => {
            Animated.timing(pan, {
              toValue: 0,
              duration: 180,
              useNativeDriver: true,
            }).start(() => {
              setIsOpen(false);
              onDelete();
            });
          }}
        >
          <TrashIcon />
          <Text style={notificationCardStyles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
      <Animated.View
        style={[notificationCardStyles.card, { transform: [{ translateX: pan }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={onPress ? 0.7 : 1}
          onPress={onPress}
          style={notificationCardStyles.cardTouchable}
        >
          <View
            style={[
              notificationCardStyles.cardIconBox,
              { backgroundColor: `${theme.colors.primary}14` },
            ]}
          >
            {typeof icon === 'string' ? (
              <Text style={{ fontSize: 20 }}>{icon}</Text>
            ) : icon ? (
              icon
            ) : (
              <CalendarIcon color={theme.colors.primary} size={22} />
            )}
          </View>

          <View style={notificationCardStyles.cardBody}>
            <View style={notificationCardStyles.cardTopRow}>
              <Text style={notificationCardStyles.cardTitle} numberOfLines={1}>
                {eventAction}
              </Text>
              <Text style={notificationCardStyles.cardTime}>{formatTimeAgo(item.created_at)}</Text>
            </View>
            <Text style={notificationCardStyles.cardDesc} numberOfLines={3}>
              {description}
            </Text>

            {metadata && Object.keys(metadata).length > 0 && (
              <View style={notificationCardStyles.metadataContainer}>
                {!!metadata.patient_name && (
                  <View style={notificationCardStyles.metadataChip}>
                    <Text style={notificationCardStyles.metadataChipText}>
                      👤 {metadata.patient_name}
                    </Text>
                  </View>
                )}
                {!!metadata.doctor_name && (
                  <View style={notificationCardStyles.metadataChip}>
                    <Text style={notificationCardStyles.metadataChipText}>
                      🩺 Dr. {metadata.doctor_name.replace(/^Dr\.\s*/i, '')}
                    </Text>
                  </View>
                )}
                {!!metadata.clinic_name && (
                  <View style={notificationCardStyles.metadataChip}>
                    <Text style={notificationCardStyles.metadataChipText}>
                      🏥 {metadata.clinic_name}
                    </Text>
                  </View>
                )}
                {!!metadata.appointment_id && (
                  <View style={notificationCardStyles.metadataChip}>
                    <Text style={notificationCardStyles.metadataChipText}>
                      🔖 {metadata.appointment_id}
                    </Text>
                  </View>
                )}
                {!!metadata.appointment_date && (
                  <View style={notificationCardStyles.metadataChip}>
                    <Text style={notificationCardStyles.metadataChipText}>
                      📅 {formatDate(metadata.appointment_date)}
                    </Text>
                  </View>
                )}
                {!!metadata.appointment_slot_time && metadata.appointment_slot_time !== 'N/A' && (
                  <View style={notificationCardStyles.metadataChip}>
                    <Text style={notificationCardStyles.metadataChipText}>
                      ⏰ {metadata.appointment_slot_time}
                    </Text>
                  </View>
                )}
                {!!metadata.title && !metadata.document_type && (
                  <View style={notificationCardStyles.metadataChip}>
                    <Text style={notificationCardStyles.metadataChipText}>📄 {metadata.title}</Text>
                  </View>
                )}
                {!!metadata.new_date && (
                  <View style={notificationCardStyles.metadataChip}>
                    <Text style={notificationCardStyles.metadataChipText}>
                      📅 {formatDate(metadata.new_date)}
                    </Text>
                  </View>
                )}
                {!!metadata.medications_count && (
                  <View style={notificationCardStyles.metadataChip}>
                    <Text style={notificationCardStyles.metadataChipText}>
                      💊 {metadata.medications_count} meds
                    </Text>
                  </View>
                )}
                {!!metadata.consultation_type && (
                  <View style={notificationCardStyles.metadataChip}>
                    <Text style={notificationCardStyles.metadataChipText}>
                      {metadata.consultation_type.toLowerCase() === 'video'
                        ? '📹 Video'
                        : '🏥 In-person'}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default NotificationCard;
