import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const AvailabilitySkeleton: React.FC = () => {
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
      {[1, 2, 3].map(key => (
        <Animated.View key={key} style={[styles.card, { opacity: pulseAnim }]}>
          <View style={styles.headerRow}>
            <View style={styles.iconBoxSkeleton} />
            <View style={styles.headerInfo}>
              <View style={styles.labelLine} />
              <View style={styles.titleLine} />
            </View>
            <View style={styles.actionBtnSkeleton} />
          </View>
          <View style={styles.consultationChipRow}>
            <View style={styles.chipLabelLine} />
            <View style={styles.chipsContainer}>
              <View style={styles.chipItem} />
              <View style={styles.chipItem} />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}>
              <View style={styles.cellLabelLine} />
              <View style={styles.cellValueLine} />
            </View>
            <View style={styles.gridCell}>
              <View style={styles.cellLabelLine} />
              <View style={styles.cellValueLine} />
            </View>
          </View>
          <View style={styles.feesRow}>
            <View style={styles.feeLabelLine} />
            <View style={styles.feesGrid}>
              <View style={styles.feeCell} />
              <View style={styles.feeCell} />
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBoxSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
    gap: 6,
  },
  labelLine: {
    width: 40,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  titleLine: {
    width: 120,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  actionBtnSkeleton: {
    width: 65,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  consultationChipRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  chipLabelLine: {
    width: 90,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  chipItem: {
    width: 70,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  gridCell: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    gap: 6,
  },
  cellLabelLine: {
    width: 45,
    height: 9,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  cellValueLine: {
    width: 90,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  feesRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
  },
  feeLabelLine: {
    width: 110,
    height: 9,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  feesGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  feeCell: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
});

export default AvailabilitySkeleton;
