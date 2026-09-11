import React, { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatDate } from '../../../lib/common/common.utils';
import { theme } from '../../../styled/theme.styled';
import {
  IMetadata,
  INotificationDoc,
} from '../../../typescripts/interfaces/notification.interfaces';
import { CalendarIcon, TrashIcon } from '../../ui/icons';

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
  iconColor = theme.colors.primary,
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
    <View style={styles.container}>
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
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
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
      <Animated.View
        style={[styles.card, { transform: [{ translateX: pan }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={onPress ? 0.7 : 1}
          onPress={onPress}
          style={styles.cardTouchable}
        >
          <View style={[styles.cardIconBox, { backgroundColor: `${iconColor}14` }]}>
            {typeof icon === 'string' ? (
              <Text style={{ fontSize: 20 }}>{icon}</Text>
            ) : icon ? (
              icon
            ) : (
              <CalendarIcon color={iconColor} size={22} />
            )}
          </View>

          <View style={styles.cardBody}>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {eventAction}
              </Text>
              <Text style={styles.cardTime}>{formatTimeAgo(item.created_at)}</Text>
            </View>
            <Text style={styles.cardDesc} numberOfLines={3}>
              {description}
            </Text>

            {metadata && Object.keys(metadata).length > 0 && (
              <View style={styles.metadataContainer}>
                {!!metadata.patient_name && (
                  <View style={styles.metadataChip}>
                    <Text style={styles.metadataChipText}>👤 {metadata.patient_name}</Text>
                  </View>
                )}
                {!!metadata.doctor_name && (
                  <View style={styles.metadataChip}>
                    <Text style={styles.metadataChipText}>
                      🩺 Dr. {metadata.doctor_name.replace(/^Dr\.\s*/i, '')}
                    </Text>
                  </View>
                )}
                {!!metadata.appointment_id && (
                  <View style={styles.metadataChip}>
                    <Text style={styles.metadataChipText}>🔖 {metadata.appointment_id}</Text>
                  </View>
                )}
                {!!metadata.appointment_date && (
                  <View style={styles.metadataChip}>
                    <Text style={styles.metadataChipText}>
                      📅 {formatDate(metadata.appointment_date)}
                    </Text>
                  </View>
                )}
                {!!metadata.appointment_slot_time && metadata.appointment_slot_time !== 'N/A' && (
                  <View style={styles.metadataChip}>
                    <Text style={styles.metadataChipText}>⏰ {metadata.appointment_slot_time}</Text>
                  </View>
                )}
                {!!metadata.title && !metadata.document_type && (
                  <View style={styles.metadataChip}>
                    <Text style={styles.metadataChipText}>📄 {metadata.title}</Text>
                  </View>
                )}
                {!!metadata.new_date && (
                  <View style={styles.metadataChip}>
                    <Text style={styles.metadataChipText}>📅 {formatDate(metadata.new_date)}</Text>
                  </View>
                )}
                {!!metadata.medications_count && (
                  <View style={styles.metadataChip}>
                    <Text style={styles.metadataChipText}>
                      💊 {metadata.medications_count} meds
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

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#EF4444',
    borderRadius: 14,
    overflow: 'hidden',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_BTN_WIDTH,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTouchable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },
  cardIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  cardTime: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    flexShrink: 0,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 19,
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  metadataChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metadataChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
});

export default NotificationCard;
