import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import consultationCompletedStyles from '../../../../styled/ConsultationCompletedScreen.styled';

/** Placeholder for the Call Summary card and the date / time grid while the visit loads. */
export const MeetingStatusSkeleton: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.9,
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
    <>
      {/* Patient card */}
      <Animated.View style={[consultationCompletedStyles.card, { opacity: pulseAnim }]}>
        <View style={styles.topRow}>
          <View style={styles.metaCol}>
            <View style={styles.nameSkeleton} />
            <View style={styles.metaSkeleton} />
            <View style={styles.clinicSkeleton} />
          </View>
          <View style={styles.statusPillSkeleton} />
        </View>
        <View style={consultationCompletedStyles.cardDivider} />
        <View style={consultationCompletedStyles.cardMetaRow}>
          <View style={styles.typePillSkeleton} />
          <View style={styles.refSkeleton} />
        </View>
      </Animated.View>

      {/* Date / time slot grid */}
      <View style={consultationCompletedStyles.gridRow}>
        {[0, 1].map(key => (
          <Animated.View
            key={key}
            style={[consultationCompletedStyles.gridCell, { opacity: pulseAnim }]}
          >
            <View style={styles.gridHeaderRow}>
              <View style={styles.gridIconSkeleton} />
              <View style={styles.gridLabelSkeleton} />
            </View>
            <View style={styles.gridValueSkeleton} />
          </Animated.View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaCol: {
    flex: 1,
    gap: 6,
  },
  nameSkeleton: {
    width: '55%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  metaSkeleton: {
    width: '40%',
    height: 11,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
  },
  clinicSkeleton: {
    width: '65%',
    height: 11,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
  },
  statusPillSkeleton: {
    width: 76,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  typePillSkeleton: {
    width: 130,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  refSkeleton: {
    width: 90,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  gridHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  gridIconSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  gridLabelSkeleton: {
    width: 50,
    height: 10,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
  },
  gridValueSkeleton: {
    width: '75%',
    height: 13,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
});

export default MeetingStatusSkeleton;
