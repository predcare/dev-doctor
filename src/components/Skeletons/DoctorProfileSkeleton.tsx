import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const DoctorProfileSkeleton: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.9,
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
      {/* Hero Header Skeleton */}
      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={styles.avatarSkeleton} />
          <View style={styles.heroInfo}>
            <View style={styles.nameSkeleton} />
            <View style={styles.subRow}>
              <View style={styles.idSkeleton} />
              <View style={styles.badgeSkeleton} />
            </View>
          </View>
        </View>
      </View>

      {/* Tabs Skeleton */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabItemSkeleton} />
        <View style={styles.tabItemSkeleton} />
      </View>

      {/* Profile Info Cards Skeleton */}
      <View style={styles.cardsContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(key => (
          <View key={key} style={styles.infoCardSkeleton}>
            <View style={styles.iconSkeleton} />
            <View style={styles.infoTextContainer}>
              <View style={styles.labelSkeleton} />
              <View style={styles.valueSkeleton} />
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarSkeleton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E2E8F0',
  },
  heroInfo: {
    flex: 1,
    gap: 10,
  },
  nameSkeleton: {
    width: '70%',
    height: 20,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  idSkeleton: {
    width: 80,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  badgeSkeleton: {
    width: 60,
    height: 16,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    gap: 6,
  },
  tabItemSkeleton: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  cardsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoCardSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  infoTextContainer: {
    flex: 1,
    gap: 6,
  },
  labelSkeleton: {
    width: '35%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  valueSkeleton: {
    width: '80%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
});

export default DoctorProfileSkeleton;
