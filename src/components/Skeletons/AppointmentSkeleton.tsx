import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const AppointmentSkeleton: React.FC = () => {
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
      {[1, 2, 3, 4].map(key => (
        <Animated.View key={key} style={[styles.card, { opacity: pulseAnim }]}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.patientRow}>
              <View style={styles.avatarSkeleton} />
              <View style={styles.patientInfo}>
                <View style={styles.nameLine} />
                <View style={styles.subLine} />
                <View style={styles.aptIdLine} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={styles.statusBadgeSkeleton} />
              <View style={styles.kebabSkeleton} />
            </View>
          </View>

          {/* Chips Row */}
          <View style={styles.chipsRow}>
            <View style={[styles.chipSkeleton, { width: 84 }]} />
            <View style={[styles.chipSkeleton, { width: 96 }]} />
            <View style={[styles.chipSkeleton, { width: 88 }]} />
          </View>

          {/* Footer Action Button */}
          {key % 2 !== 0 && <View style={styles.footerActionSkeleton} />}
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarSkeleton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#CBD5E1',
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
    gap: 6,
  },
  nameLine: {
    width: '55%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  subLine: {
    width: '40%',
    height: 11,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  aptIdLine: {
    width: '48%',
    height: 10,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  statusBadgeSkeleton: {
    width: 76,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  kebabSkeleton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chipSkeleton: {
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  footerActionSkeleton: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
    marginTop: 4,
  },
});

export default AppointmentSkeleton;
