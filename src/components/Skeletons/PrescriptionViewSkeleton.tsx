import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const PrescriptionViewSkeleton: React.FC = () => {
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
    <View style={styles.container}>
      {/* Clinic Card Skeleton */}
      <Animated.View style={[styles.cardSkeleton, { opacity: pulseAnim }]}>
        <View style={{ flex: 1, gap: 6 }}>
          <View style={[styles.lineSkeleton, { width: '50%', height: 16 }]} />
          <View style={[styles.lineSkeleton, { width: '35%', height: 12 }]} />
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          <View style={[styles.lineSkeleton, { width: 80, height: 12 }]} />
          <View style={[styles.chipSkeleton, { width: 70, height: 20 }]} />
        </View>
      </Animated.View>

      {/* Patient Header Card Skeleton */}
      <Animated.View style={[styles.cardSkeleton, { opacity: pulseAnim }]}>
        <View style={styles.avatarSkeleton} />
        <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
          <View style={[styles.lineSkeleton, { width: '60%', height: 16 }]} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={[styles.chipSkeleton, { width: 50, height: 20 }]} />
            <View style={[styles.chipSkeleton, { width: 60, height: 20 }]} />
          </View>
        </View>
        <View style={[styles.chipSkeleton, { width: 65, height: 24 }]} />
      </Animated.View>

      {/* Doctor Info Card Skeleton */}
      <Animated.View style={[styles.cardSkeleton, { opacity: pulseAnim }]}>
        <View style={{ flex: 1, gap: 6 }}>
          <View style={[styles.lineSkeleton, { width: '40%', height: 14 }]} />
          <View style={[styles.lineSkeleton, { width: '55%', height: 16 }]} />
          <View style={[styles.lineSkeleton, { width: '70%', height: 12 }]} />
        </View>
      </Animated.View>

      {/* Vitals Grid Skeleton */}
      <Animated.View style={[styles.cardSkeleton, { opacity: pulseAnim, flexDirection: 'column' }]}>
        <View style={[styles.lineSkeleton, { width: 80, height: 14, marginBottom: 8 }]} />
        <View style={styles.vitalsRow}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <View key={i} style={styles.vitalBoxSkeleton}>
              <View style={[styles.lineSkeleton, { width: 30, height: 10 }]} />
              <View style={[styles.lineSkeleton, { width: 45, height: 14 }]} />
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Section Skeleton */}
      <Animated.View style={[styles.cardSkeleton, { opacity: pulseAnim, flexDirection: 'column' }]}>
        <View style={[styles.lineSkeleton, { width: 120, height: 14, marginBottom: 8 }]} />
        <View style={[styles.lineSkeleton, { width: '90%', height: 14 }]} />
        <View style={[styles.lineSkeleton, { width: '70%', height: 14 }]} />
      </Animated.View>

      {/* Medications Skeleton */}
      <Animated.View style={[styles.cardSkeleton, { opacity: pulseAnim, flexDirection: 'column' }]}>
        <View style={[styles.lineSkeleton, { width: 100, height: 14, marginBottom: 8 }]} />
        <View style={styles.medItemSkeleton}>
          <View style={[styles.lineSkeleton, { width: '50%', height: 14 }]} />
          <View style={[styles.lineSkeleton, { width: '30%', height: 12 }]} />
        </View>
        <View style={styles.medItemSkeleton}>
          <View style={[styles.lineSkeleton, { width: '60%', height: 14 }]} />
          <View style={[styles.lineSkeleton, { width: '25%', height: 12 }]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    backgroundColor: '#F8FAFC',
  },
  cardSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarSkeleton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CBD5E1',
  },
  lineSkeleton: {
    backgroundColor: '#CBD5E1',
    borderRadius: 4,
  },
  chipSkeleton: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
  },
  vitalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  vitalBoxSkeleton: {
    width: '30%',
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  medItemSkeleton: {
    width: '100%',
    paddingVertical: 8,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
});

export default PrescriptionViewSkeleton;
