import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export interface BookingSlotsSkeletonProps {
  datesOnly?: boolean;
}

export const BookingSlotsSkeleton: React.FC<BookingSlotsSkeletonProps> = ({ datesOnly }) => {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  if (datesOnly) {
    return (
      <View style={styles.datesRow}>
        {[1, 2, 3].map(key => (
          <Animated.View key={key} style={[styles.dateChip, { opacity: pulseAnim }]} />
        ))}
        <Animated.View style={[styles.calendarIcon, { opacity: pulseAnim }]} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: pulseAnim }]}>
      {/* Skeleton Period 1 (e.g., Morning) */}
      <View style={styles.periodSection}>
        <View style={styles.periodHeader}>
          <View style={styles.iconCircle} />
          <View style={styles.titleLine} />
        </View>

        <View style={styles.slotsGrid}>
          {[1, 2, 3, 4].map(idx => (
            <View key={`slot-m-${idx}`} style={styles.slotCard} />
          ))}
        </View>
      </View>

      {/* Skeleton Period 2 (e.g., Afternoon) */}
      <View style={styles.periodSection}>
        <View style={styles.periodHeader}>
          <View style={styles.iconCircle} />
          <View style={styles.titleLine} />
        </View>

        <View style={styles.slotsGrid}>
          {[1, 2, 3, 4].map(idx => (
            <View key={`slot-a-${idx}`} style={styles.slotCard} />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  periodSection: {
    marginBottom: 18,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  titleLine: {
    width: 90,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    width: '47.5%',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  dateChip: {
    width: 78,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  calendarIcon: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
});

export default BookingSlotsSkeleton;
