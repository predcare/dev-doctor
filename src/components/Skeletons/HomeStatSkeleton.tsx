import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const HomeStatSkeleton: React.FC = () => {
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
    <View style={styles.rowContainer}>
      {[1, 2, 3, 4].map(key => (
        <Animated.View key={key} style={[styles.tile, { opacity: pulseAnim }]}>
          <View style={styles.topRow}>
            <View style={styles.iconSkeleton} />
          </View>
          <View style={styles.valueSkeleton} />
          <View style={styles.labelSkeleton} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
  tile: {
    width: 148,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  topRow: {
    marginBottom: 16,
  },
  iconSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#CBD5E1',
  },
  valueSkeleton: {
    width: '60%',
    height: 24,
    borderRadius: 6,
    backgroundColor: '#CBD5E1',
    marginBottom: 8,
  },
  labelSkeleton: {
    width: '80%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
});

export default HomeStatSkeleton;
