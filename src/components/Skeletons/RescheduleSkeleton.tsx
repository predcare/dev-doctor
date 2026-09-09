import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const RescheduleSkeleton: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: pulseAnim }]}>
      {/* Current Appointment Card Skeleton */}
      <View style={styles.card}>
        <View style={styles.cardLabelSkeleton} />
        <View style={styles.patientRow}>
          <View style={styles.avatarSkeleton} />
          <View style={styles.patientInfo}>
            <View style={styles.nameLine} />
            <View style={styles.subLine} />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <View style={styles.detailLabelSkeleton} />
          <View style={styles.detailValueSkeleton} />
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailLabelSkeleton} />
          <View style={styles.detailValueSkeleton} />
        </View>
      </View>

      {/* Date Selection Section Skeleton */}
      <View style={styles.sectionTitleSkeleton} />
      <View style={styles.dateStripSkeleton}>
        {[1, 2, 3, 4].map(key => (
          <View key={key} style={styles.dateCardSkeleton} />
        ))}
      </View>

      {/* Time Selection Section Skeleton */}
      <View style={styles.sectionTitleSkeleton} />
      <View style={styles.periodHeaderSkeleton} />
      <View style={styles.slotsGridSkeleton}>
        {[1, 2, 3, 4].map(key => (
          <View key={key} style={styles.timeChipSkeleton} />
        ))}
      </View>
      <View style={styles.periodHeaderSkeleton} />
      <View style={styles.slotsGridSkeleton}>
        {[1, 2, 3, 4].map(key => (
          <View key={key} style={styles.timeChipSkeleton} />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardLabelSkeleton: {
    width: 140,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginBottom: 14,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarSkeleton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CBD5E1',
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
    gap: 8,
  },
  nameLine: {
    width: '60%',
    height: 16,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  subLine: {
    width: '35%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabelSkeleton: {
    width: 120,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  detailValueSkeleton: {
    width: 100,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  sectionTitleSkeleton: {
    width: 130,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginBottom: 12,
  },
  dateStripSkeleton: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  dateCardSkeleton: {
    width: 72,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  periodHeaderSkeleton: {
    width: 90,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    marginTop: 8,
    marginBottom: 10,
  },
  slotsGridSkeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  timeChipSkeleton: {
    width: '47.5%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
});

export default RescheduleSkeleton;
