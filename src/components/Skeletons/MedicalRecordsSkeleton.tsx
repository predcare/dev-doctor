import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function MedicalRecordsSkeleton() {
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
      {[1, 2, 3, 4].map(key => (
        <View key={key} style={styles.card}>
          <View style={styles.topRow}>
            <Animated.View style={[styles.iconBoxSkeleton, { opacity }]} />
            <View style={styles.textGroup}>
              <Animated.View style={[styles.titleSkeleton, { opacity }]} />
              <Animated.View style={[styles.subTitleSkeleton, { opacity }]} />
              <View style={styles.metaRow}>
                <Animated.View style={[styles.pillSkeleton, { opacity }]} />
                <Animated.View style={[styles.dateSkeleton, { opacity }]} />
              </View>
            </View>
          </View>
          <View style={styles.footerRow}>
            <Animated.View style={[styles.footerTextSkeleton, { opacity }]} />
            <Animated.View style={[styles.switchSkeleton, { opacity }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconBoxSkeleton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
    marginRight: 12,
  },
  textGroup: {
    flex: 1,
    gap: 6,
  },
  titleSkeleton: {
    width: '70%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  subTitleSkeleton: {
    width: '45%',
    height: 11,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  pillSkeleton: {
    width: 48,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
  },
  dateSkeleton: {
    width: 75,
    height: 11,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerTextSkeleton: {
    width: 100,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  switchSkeleton: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
  },
});
