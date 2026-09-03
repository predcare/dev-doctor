import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const PatientDetailsSkeleton: React.FC = () => {
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

      {/* Main Tab Bar Skeleton */}
      <Animated.View style={[styles.mainTabBarSkeleton, { opacity: pulseAnim }]}>
        <View style={styles.tabItemSkeleton}>
          <View style={styles.tabLabelSkeleton} />
        </View>
        <View style={styles.tabItemSkeleton}>
          <View style={styles.tabLabelSkeleton} />
        </View>
        <View style={styles.tabItemSkeleton}>
          <View style={styles.tabLabelSkeleton} />
        </View>
        <View style={styles.tabItemSkeleton}>
          <View style={styles.tabLabelSkeleton} />
        </View>
      </Animated.View>

      {/* Content Area Skeleton */}
      <View style={styles.contentContainer}>
        {/* Sub Tab Row Skeleton */}
        <Animated.View style={[styles.subTabRowSkeleton, { opacity: pulseAnim }]}>
          <View style={styles.subTabPillSkeleton} />
          <View style={styles.subTabPillSkeleton} />
          <View style={styles.addBtnSkeleton} />
        </Animated.View>

        {/* Section Title Skeleton */}
        <Animated.View style={[styles.sectionTitleSkeleton, { opacity: pulseAnim }]} />

        {/* Card Skeletons */}
        {[1, 2, 3, 4,].map(key => (
          <Animated.View key={key} style={[styles.cardSkeleton, { opacity: pulseAnim }]}>
            <View style={styles.cardItemRow}>
              <View style={styles.iconBoxSkeleton} />
              <View style={styles.cardInfoGroup}>
                <View style={styles.cardTitleSkeleton} />
                <View style={styles.cardSubTitleSkeleton} />
                <View style={styles.cardMetaSkeleton} />
              </View>
            </View>
            <View style={styles.cardFooterSkeleton}>
              <View style={styles.footerTextSkeleton} />
              <View style={styles.footerToggleSkeleton} />
            </View>
          </Animated.View>
        ))}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
  mainTabBarSkeleton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 4,
  },
  tabItemSkeleton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  tabLabelSkeleton: {
    width: 50,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 8,
  },
  subTabRowSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  subTabPillSkeleton: {
    width: 90,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
  },
  addBtnSkeleton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#CBD5E1',
    marginLeft: 'auto',
  },
  sectionTitleSkeleton: {
    width: 140,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
  },
  cardSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  cardItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconBoxSkeleton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  cardInfoGroup: {
    flex: 1,
    gap: 6,
  },
  cardTitleSkeleton: {
    width: '75%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  cardSubTitleSkeleton: {
    width: '50%',
    height: 11,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  cardMetaSkeleton: {
    width: '35%',
    height: 10,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  cardFooterSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerTextSkeleton: {
    width: 110,
    height: 11,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  footerToggleSkeleton: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
  },
});

export default PatientDetailsSkeleton;
