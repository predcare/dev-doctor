import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { doctorAppointmentsStyles as S } from '../../../../styled/DoctorAppointmentsScreen.styled';

interface AppointmentStatsCardProps {
  todayCount: number;
  upcoming3hCount: number;
  loading?: boolean;
}

export const AppointmentStatsCard: React.FC<AppointmentStatsCardProps> = React.memo(
  ({ todayCount, upcoming3hCount, loading }) => {
    const pulseAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
      if (!loading) return;
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
    }, [loading, pulseAnim]);

    return (
      <View style={S.statsRow}>
        <View style={[S.statCard, S.statCardActive]}>
          <Text style={[S.statLabel, S.statLabelActive]}>TODAY'S</Text>
          {loading ? (
            <Animated.View style={[styles.skeletonActive, { opacity: pulseAnim }]} />
          ) : (
            <Text style={[S.statValue, S.statValueActive]}>{todayCount}</Text>
          )}
          <Text style={[S.statSub, S.statSubActive]}>Scheduled Patients</Text>
        </View>

        <View style={S.statCard}>
          <Text style={S.statLabel}>UPCOMING</Text>
          {loading ? (
            <Animated.View style={[styles.skeletonInactive, { opacity: pulseAnim }]} />
          ) : (
            <Text style={S.statValue}>{upcoming3hCount}</Text>
          )}
          <Text style={S.statSub}>Next 3 hours</Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  skeletonActive: {
    width: 36,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    marginVertical: 2,
  },
  skeletonInactive: {
    width: 36,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#CBD5E1',
    marginVertical: 2,
  },
});

AppointmentStatsCard.displayName = 'AppointmentStatsCard';
export default AppointmentStatsCard;
