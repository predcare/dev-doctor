import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import theme from '../../styled/theme.styled';

export const EditPatientSkeleton: React.FC = () => {
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
      <View style={styles.header}>
        <View style={styles.backCircleSkeleton} />
        <Animated.View style={[styles.headerTitleSkeleton, { opacity: pulseAnim }]} />
        <View style={styles.idBadgeSkeleton} />
      </View>

      <View style={styles.container}>
        {/* Section 1 Skeleton */}
        <View style={styles.sectionRow}>
          <View style={[styles.sectionBar, { backgroundColor: '#6366F1' }]} />
          <Animated.View style={[styles.sectionTitleSkeleton, { opacity: pulseAnim }]} />
        </View>
        <View style={styles.card}>
          {[1, 2, 3, 4, 5].map(key => (
            <View key={key} style={styles.inputGroup}>
              <Animated.View style={[styles.labelSkeleton, { opacity: pulseAnim }]} />
              <Animated.View style={[styles.lockedInputSkeleton, { opacity: pulseAnim }]} />
            </View>
          ))}
        </View>

        {/* Section 2 Skeleton */}
        <View style={styles.sectionRow}>
          <View style={[styles.sectionBar, { backgroundColor: theme.colors.primary }]} />
          <Animated.View style={[styles.sectionTitleSkeleton, { opacity: pulseAnim }]} />
        </View>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Animated.View style={[styles.labelSkeleton, { opacity: pulseAnim }]} />
            <Animated.View style={[styles.textAreaSkeleton, { opacity: pulseAnim }]} />
          </View>
          <View style={styles.inputGroup}>
            <Animated.View style={[styles.labelSkeleton, { opacity: pulseAnim }]} />
            <Animated.View style={[styles.inputSkeleton, { opacity: pulseAnim }]} />
          </View>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Animated.View style={[styles.labelSkeleton, { opacity: pulseAnim }]} />
              <Animated.View style={[styles.inputSkeleton, { opacity: pulseAnim }]} />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Animated.View style={[styles.labelSkeleton, { opacity: pulseAnim }]} />
              <Animated.View style={[styles.inputSkeleton, { opacity: pulseAnim }]} />
            </View>
          </View>
        </View>

        {/* Section 3 Skeleton */}
        <View style={styles.sectionRow}>
          <View style={[styles.sectionBar, { backgroundColor: '#EF4444' }]} />
          <Animated.View style={[styles.sectionTitleSkeleton, { opacity: pulseAnim }]} />
        </View>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Animated.View style={[styles.labelSkeleton, { opacity: pulseAnim }]} />
              <Animated.View style={[styles.inputSkeleton, { opacity: pulseAnim }]} />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Animated.View style={[styles.labelSkeleton, { opacity: pulseAnim }]} />
              <Animated.View style={[styles.inputSkeleton, { opacity: pulseAnim }]} />
            </View>
          </View>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backCircleSkeleton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
  },
  headerTitleSkeleton: {
    width: 120,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  idBadgeSkeleton: {
    width: 70,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  container: {
    padding: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitleSkeleton: {
    width: 140,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  inputGroup: {
    marginBottom: 12,
  },
  labelSkeleton: {
    width: 90,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginBottom: 6,
  },
  lockedInputSkeleton: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  inputSkeleton: {
    width: '100%',
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  textAreaSkeleton: {
    width: '100%',
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  row: {
    flexDirection: 'row',
  },
});

export default EditPatientSkeleton;
