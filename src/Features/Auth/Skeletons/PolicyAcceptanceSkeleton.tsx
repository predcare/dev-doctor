import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const PolicyAcceptanceSkeleton: React.FC = () => {
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
      {/* Policy Card Tile Skeletons */}
      <View style={styles.listGap}>
        {[1, 2, 3].map(key => (
          <Animated.View key={key} style={[styles.tileSkeleton, { opacity: pulseAnim }]}>
            <View style={styles.iconSkeleton} />
            <View style={styles.metaSkeleton}>
              <View style={styles.titleSkeleton} />
              <View style={styles.subtextSkeleton} />
            </View>
            <View style={styles.buttonSkeleton} />
          </Animated.View>
        ))}
      </View>

      {/* Notice Box Skeleton */}
      <Animated.View style={[styles.noticeSkeleton, { opacity: pulseAnim }]}>
        <View style={styles.textLineFull} />
        <View style={styles.textLineHalf} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  listGap: {
    gap: 10,
    marginBottom: 14,
  },
  tileSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconSkeleton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    marginRight: 10,
  },
  metaSkeleton: {
    flex: 1,
    gap: 6,
  },
  titleSkeleton: {
    width: '70%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  subtextSkeleton: {
    width: '45%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  buttonSkeleton: {
    width: 60,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  noticeSkeleton: {
    gap: 6,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFBEB',
  },
  textLineFull: {
    width: '100%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#FDE68A',
  },
  textLineHalf: {
    width: '60%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#FDE68A',
  },
});

export default PolicyAcceptanceSkeleton;

