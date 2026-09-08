import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { theme } from '../../styled/theme.styled';

export const DoctorProfileSkeleton: React.FC = () => {
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
    <SafeAreaWrapper>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.backBtnSkeleton} />
        <Animated.View style={[styles.headerTitleSkeleton, { opacity: pulseAnim }]} />
        <View style={styles.editBtnSkeleton} />
      </View>

      <View style={styles.scroll}>
        {/* Hero Section Skeleton */}
        <Animated.View style={[styles.hero, { opacity: pulseAnim }]}>
          <View style={styles.heroRow}>
            <View style={styles.avatarCircleSkeleton} />
            <View style={styles.heroInfoGroup}>
              <View style={styles.drNameSkeleton} />
              <View style={styles.idRowSkeleton}>
                <View style={styles.drIdSkeleton} />
                <View style={styles.badgeSkeleton} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Tabs Row Skeleton */}
        <Animated.View style={[styles.tabsSkeleton, { opacity: pulseAnim }]}>
          <View style={styles.tabItemSkeleton} />
          <View style={styles.tabItemSkeleton} />
        </Animated.View>

        {/* Profile Info Cards Skeleton */}
        <View style={styles.cardContainer}>
          {[1, 2, 3, 4, 5, 6].map(key => (
            <Animated.View key={key} style={[styles.infoCardSkeleton, { opacity: pulseAnim }]}>
              <View style={styles.iconCircleSkeleton} />
              <View style={styles.cardTextGroup}>
                <View style={styles.labelSkeleton} />
                <View style={styles.valueSkeleton} />
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Actions Skeleton */}
        <Animated.View style={[styles.actionsSkeleton, { opacity: pulseAnim }]}>
          <View style={styles.primaryBtnSkeleton} />
          <View style={styles.secondaryBtnSkeleton} />
        </Animated.View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  backBtnSkeleton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
  },
  headerTitleSkeleton: {
    width: 120,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  editBtnSkeleton: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2E8F0',
  },
  scroll: {
    flex: 1,
  },
  hero: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 12,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircleSkeleton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#CBD5E1',
  },
  heroInfoGroup: {
    flex: 1,
    gap: 8,
  },
  drNameSkeleton: {
    width: '70%',
    height: 20,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  idRowSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drIdSkeleton: {
    width: 70,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  badgeSkeleton: {
    width: 65,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  tabsSkeleton: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tabItemSkeleton: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#CBD5E1',
  },
  cardContainer: {
    marginHorizontal: 16,
  },
  infoCardSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 13,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconCircleSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  cardTextGroup: {
    flex: 1,
    gap: 6,
  },
  labelSkeleton: {
    width: 90,
    height: 10,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  valueSkeleton: {
    width: '60%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  actionsSkeleton: {
    marginHorizontal: 16,
    gap: 10,
    marginTop: 8,
  },
  primaryBtnSkeleton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#CBD5E1',
  },
  secondaryBtnSkeleton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
});

export default DoctorProfileSkeleton;
