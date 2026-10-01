import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const ConsultSkeleton: React.FC = () => {
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
      {[1, 2].map(key => (
        <Animated.View key={key} style={[styles.card, { opacity: pulseAnim }]}>
          <View style={styles.cardHeader}>
            <View style={styles.idTagLine} />
            <View style={styles.typeBadgeSkeleton} />
          </View>
          <View style={styles.patientHeader}>
            <View style={styles.avatarSkeleton} />
            <View style={styles.patientMeta}>
              <View style={styles.nameLine} />
              <View style={styles.subLine} />
            </View>
          </View>
          <View style={styles.dateTimeBoxSkeleton}>
            <View style={styles.dateTimeLine} />
            <View style={styles.dateTimeLine} />
          </View>
          <View style={styles.actionBtnSkeleton} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: 'rgba(15, 23, 42, 0.05)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  idTagLine: {
    width: 100,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  typeBadgeSkeleton: {
    width: 70,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatarSkeleton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CBD5E1',
  },
  patientMeta: {
    flex: 1,
    gap: 6,
  },
  nameLine: {
    width: '60%',
    height: 15,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  subLine: {
    width: '35%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  dateTimeBoxSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  dateTimeLine: {
    width: '42%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  actionBtnSkeleton: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#CBD5E1',
  },
});

export default ConsultSkeleton;
