import React from 'react';
import { Text, View } from 'react-native';
import { doctorAppointmentsStyles as S } from '../../../../styled/DoctorAppointmentsScreen.styled';

interface AppointmentStatsCardProps {
  todayCount: number;
  upcoming3hCount: number;
}

export const AppointmentStatsCard: React.FC<AppointmentStatsCardProps> = React.memo(
  ({ todayCount, upcoming3hCount }) => {
    return (
      <View style={S.statsRow}>
        <View style={[S.statCard, S.statCardActive]}>
          <Text style={[S.statLabel, S.statLabelActive]}>TODAY'S</Text>
          <Text style={[S.statValue, S.statValueActive]}>{todayCount}</Text>
          <Text style={[S.statSub, S.statSubActive]}>Scheduled Patients</Text>
        </View>

        <View style={S.statCard}>
          <Text style={S.statLabel}>UPCOMING</Text>
          <Text style={S.statValue}>{upcoming3hCount}</Text>
          <Text style={S.statSub}>Next 3 hours</Text>
        </View>
      </View>
    );
  }
);

AppointmentStatsCard.displayName = 'AppointmentStatsCard';
export default AppointmentStatsCard;
