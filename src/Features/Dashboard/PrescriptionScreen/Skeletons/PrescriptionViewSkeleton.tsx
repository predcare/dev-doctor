import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { theme } from '../../../../styled/theme.styled';

export const PrescriptionViewSkeleton: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Clinic Card Skeleton */}
      <Animated.View style={[styles.card, styles.clinicCard, { opacity: pulseAnim }]}>
        <View style={{ flex: 1, gap: 8 }}>
          <View style={[styles.line, { width: '60%', height: 16 }]} />
          <View style={[styles.line, { width: '40%', height: 12 }]} />
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          <View style={[styles.line, { width: 75, height: 14 }]} />
          <View style={[styles.chip, { width: 64, height: 22 }]} />
        </View>
      </Animated.View>

      {/* Patient Card Skeleton */}
      <Animated.View style={[styles.card, styles.patientCard, { opacity: pulseAnim }]}>
        <View style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
          <View style={[styles.line, { width: '55%', height: 16 }]} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={[styles.chip, { width: 50, height: 20 }]} />
            <View style={[styles.chip, { width: 60, height: 20 }]} />
          </View>
        </View>
        <View style={[styles.chip, { width: 64, height: 26, borderRadius: 8 }]} />
      </Animated.View>

      {/* Medical Badges Skeleton */}
      <Animated.View style={[styles.card, { opacity: pulseAnim, gap: 8 }]}>
        <View style={[styles.line, { width: '30%', height: 11 }]} />
        <View style={[styles.line, { width: '70%', height: 14 }]} />
      </Animated.View>

      {/* Vitals Grid Skeleton */}
      <View style={styles.sectionWrap}>
        <Animated.View style={[styles.sectionHeaderRow, { opacity: pulseAnim }]}>
          <View style={styles.sectionIcon} />
          <View style={[styles.line, { width: 70, height: 14 }]} />
        </Animated.View>
        <Animated.View style={[styles.card, { opacity: pulseAnim }]}>
          <View style={styles.vitalsRow}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <View key={i} style={styles.vitalBox}>
                <View style={[styles.line, { width: 32, height: 9 }]} />
                <View style={[styles.line, { width: 44, height: 14 }]} />
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      {/* Diagnosis Section Skeleton */}
      <View style={styles.sectionWrap}>
        <Animated.View style={[styles.sectionHeaderRow, { opacity: pulseAnim }]}>
          <View style={styles.sectionIcon} />
          <View style={[styles.line, { width: 85, height: 14 }]} />
        </Animated.View>
        <Animated.View style={[styles.card, { opacity: pulseAnim, gap: 8 }]}>
          <View style={[styles.line, { width: '90%', height: 15 }]} />
          <View style={[styles.line, { width: '65%', height: 13 }]} />
        </Animated.View>
      </View>

      {/* Medications Section Skeleton */}
      <View style={styles.sectionWrap}>
        <Animated.View style={[styles.sectionHeaderRow, { opacity: pulseAnim }]}>
          <View style={styles.sectionIcon} />
          <View style={[styles.line, { width: 95, height: 14 }]} />
          <View style={{ flex: 1 }} />
          <View style={[styles.chip, { width: 55, height: 16 }]} />
        </Animated.View>
        <Animated.View style={[styles.card, { opacity: pulseAnim, gap: 12 }]}>
          {[1, 2].map(i => (
            <View key={i} style={[styles.medItem, i === 1 && styles.medBorder]}>
              <View style={styles.rowBetween}>
                <View style={[styles.line, { width: '55%', height: 15 }]} />
                <View style={[styles.chip, { width: 50, height: 20 }]} />
              </View>
              <View style={[styles.row, { gap: 10 }]}>
                <View style={[styles.line, { width: 65, height: 12 }]} />
                <View style={[styles.line, { width: 75, height: 12 }]} />
              </View>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

export const PrescriptionBottomBarSkeleton: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.bottomBarContainer}>
      <Animated.View style={[styles.bottomBarRow, { opacity: pulseAnim }]}>
        <View style={styles.bottomBarPrimaryBtn} />
        <View style={styles.bottomBarSquareBtn} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  card: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  clinicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  line: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 4,
  },
  chip: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 6,
  },
  sectionWrap: {
    marginHorizontal: 12,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
    gap: 7,
  },
  sectionIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  vitalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  vitalBox: {
    minWidth: '28%',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 8,
    alignItems: 'center',
    gap: 5,
  },
  medItem: {
    paddingVertical: 8,
    gap: 8,
  },
  medBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarContainer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bottomBarPrimaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  bottomBarSquareBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceSecondary,
  },
});

export default PrescriptionViewSkeleton;
