import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function PatientSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(key => (
        <View key={key} style={styles.card}>
          <Animated.View style={[styles.avatar, { opacity }]} />
          <View style={styles.info}>
            <Animated.View style={[styles.nameLine, { opacity }]} />
            <Animated.View style={[styles.subLine, { opacity }]} />
          </View>
          <Animated.View style={[styles.arrow, { opacity }]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#CBD5E1',
    marginRight: 12,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  nameLine: {
    width: '60%',
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
  arrow: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
});
