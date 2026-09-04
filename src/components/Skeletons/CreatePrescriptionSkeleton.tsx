import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const CreatePrescriptionSkeleton: React.FC = () => {
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
      {/* Patient Header Card Skeleton */}
      <Animated.View style={[styles.headerCard, { opacity: pulseAnim }]}>
        <View style={styles.headerCardInner}>
          <View style={styles.avatarSkeleton} />
          <View style={styles.headerInfoGroup}>
            <View style={styles.nameLineSkeleton} />
            <View style={styles.idLineSkeleton} />
            <View style={styles.chipsRowSkeleton}>
              <View style={[styles.chipSkeleton, { width: 56 }]} />
              <View style={[styles.chipSkeleton, { width: 48 }]} />
              <View style={[styles.chipSkeleton, { width: 40 }]} />
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Step Tabs Bar Skeleton */}
      <Animated.View style={[styles.stepBarSkeleton, { opacity: pulseAnim }]}>
        {[1, 2, 3, 4, 5, 6].map(key => (
          <View key={key} style={styles.stepTabSkeleton}>
            <View style={styles.badgeSkeleton} />
            <View style={styles.tabTitleSkeleton} />
          </View>
        ))}
      </Animated.View>

      {/* Form Content Skeleton */}
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.cardSkeleton, { opacity: pulseAnim }]}>
          <View style={styles.sectionTitleSkeleton} />
          <View style={styles.inputSkeleton} />
        </Animated.View>

        <Animated.View style={[styles.cardSkeleton, { opacity: pulseAnim }]}>
          <View style={styles.sectionTitleSkeleton} />
          <View style={styles.textAreaSkeleton} />
        </Animated.View>
        <Animated.View style={[styles.cardSkeleton, { opacity: pulseAnim }]}>
          <View style={styles.sectionTitleSkeleton} />
          <View style={styles.textAreaSkeleton} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSkeleton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#CBD5E1',
  },
  headerInfoGroup: {
    flex: 1,
    marginLeft: 16,
    gap: 6,
  },
  nameLineSkeleton: {
    width: '60%',
    height: 16,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  idLineSkeleton: {
    width: '35%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  chipsRowSkeleton: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  chipSkeleton: {
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
  },
  stepBarSkeleton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  stepTabSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  badgeSkeleton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
  },
  tabTitleSkeleton: {
    width: 50,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    gap: 14,
  },
  cardSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionTitleSkeleton: {
    width: 140,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  inputSkeleton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  textAreaSkeleton: {
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
});

export default CreatePrescriptionSkeleton;
