import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function InvoiceSkeleton() {
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
          <View style={styles.topMetaRow}>
            <Animated.View style={[styles.invoiceNumSkeleton, { opacity }]} />
            <Animated.View style={[styles.amountSkeleton, { opacity }]} />
          </View>
          <View style={styles.bottomMetaRow}>
            <View style={styles.pillsRow}>
              <Animated.View style={[styles.dateSkeleton, { opacity }]} />
              <Animated.View style={[styles.pillSkeleton, { opacity }]} />
              <Animated.View style={[styles.pillSkeleton, { opacity }]} />
            </View>
            <Animated.View style={[styles.chevronSkeleton, { opacity }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  invoiceNumSkeleton: {
    width: '40%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  amountSkeleton: {
    width: '25%',
    height: 16,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  bottomMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateSkeleton: {
    width: 70,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  pillSkeleton: {
    width: 50,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  chevronSkeleton: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
});
