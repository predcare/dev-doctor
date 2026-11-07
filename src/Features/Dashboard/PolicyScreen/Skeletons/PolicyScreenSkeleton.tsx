import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import SafeAreaWrapper from '../../../../Layout/SafeAreaWrapper';
import theme from '../../../../styled/theme.styled';

export const PolicyScreenSkeleton: React.FC = () => {
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
    <SafeAreaWrapper
      showBottomBar
      activeBottomTab="Account"
      header={
        <View style={styles.header}>
          <View style={styles.backBtnSkeleton} />
          <Animated.View style={[styles.headerTitleSkeleton, { opacity: pulseAnim }]} />
          <View style={{ width: 38 }} />
        </View>
      }
    >
      <View style={styles.container}>
        {/* Policy Meta Card Skeleton */}
        <Animated.View style={[styles.metaCardSkeleton, { opacity: pulseAnim }]}>
          <View style={styles.titleSkeleton} />
          <View style={styles.badgeRow}>
            <View style={styles.badgeSkeleton} />
            <View style={styles.badgeSkeleton} />
          </View>
        </Animated.View>

        {/* Content Paragraph Skeletons */}
        <Animated.View style={[styles.contentSkeleton, { opacity: pulseAnim }]}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(key => (
            <View
              key={key}
              style={[
                styles.paragraphLineSkeleton,
                { width: key % 3 === 0 ? '60%' : key % 2 === 0 ? '85%' : '100%' },
              ]}
            />
          ))}
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
    width: 140,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },
  metaCardSkeleton: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    gap: 10,
  },
  titleSkeleton: {
    width: '75%',
    height: 18,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badgeSkeleton: {
    width: 80,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  contentSkeleton: {
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    gap: 12,
  },
  paragraphLineSkeleton: {
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
});

export default PolicyScreenSkeleton;
