import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AssistanceBanner } from '../../components/Modules/Dashboard/AssistanceBanner';
import HomeStatsCard from '../../components/Modules/Dashboard/HomeStatsCard';
import { QuickAccessCard } from '../../components/Modules/Dashboard/QuickAccessCard';
import UpcomingAppointmentCard from '../../components/Modules/Dashboard/UpcomingAppointmentCard';
import { AppointmentSkeleton } from '../../components/Skeletons/AppointmentSkeleton';
import { HomeStatSkeleton } from '../../components/Skeletons/HomeStatSkeleton';
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  InvoiceIcon,
  PatientsIcon,
  PrescriptionIcon,
  ScheduleIcon,
  WalletIcon,
} from '../../components/ui/icons';
import { useHomeStats, useHomeUpcomingAppts } from '../../hooks/react-query/home/home.hooks';
import { Header } from '../../Layout/Header';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { _compactNumber, checkIsExpired, getTimeUntilStart } from '../../lib/common/common.utils';
import { AppRoute, type HomeScreenProps } from '../../route';
import { homeStyles } from '../../styled/HomeScreen.styled';
import { theme } from '../../styled/theme.styled';
import { formatTime12h } from '../../utils/availabilityUtils';
import { useAuthStore } from '../../zustand/stores/useAuthStore';

type PeriodKey = 'today' | 'week' | 'month';

const PERIOD_LABELS: Record<PeriodKey, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
};

const quickAccessItems = [
  {
    id: 'q1',
    label: 'BOOK APPT',
    screen: 'BookAppointment' as const,
    icon: <CalendarIcon size={30} color={theme.colors.primary} />,
  },
  {
    id: 'q2',
    label: 'WRITE RX',
    screen: 'PrescriptionList' as const,
    icon: <PrescriptionIcon size={30} color={theme.colors.primary} />,
  },
  {
    id: 'q3',
    label: 'AVAILABILITY',
    screen: 'Availability' as const,
    icon: <ScheduleIcon size={30} color={theme.colors.primary} />,
  },
  {
    id: 'q4',
    label: 'BILLING',
    screen: 'InvoiceList' as const,
    icon: <InvoiceIcon size={30} color={theme.colors.primary} />,
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [period, setPeriod] = useState<PeriodKey>('week');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { userData } = useAuthStore(state => state);

  const menuRef = useRef<View>(null);

  useEffect(() => {
    if (!showPeriodMenu) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current) {
        const node = menuRef.current as unknown as HTMLElement;
        if (node && typeof node.contains === 'function') {
          if (!node.contains(event.target as Node)) {
            setShowPeriodMenu(false);
          }
        }
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      }
    };
  }, [showPeriodMenu]);

  const {
    data: boardStats,
    isPending: statsPending,
    refetch: refetchHomeStats,
  } = useHomeStats({
    doctorId: userData?.user_id || '',
    period: period,
  });

  const {
    data: upcomingAppts,
    isPending: upcomiongApptsPending,
    refetch: refetchAppointments,
  } = useHomeUpcomingAppts({
    doctorId: userData?.user_id || '',
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchHomeStats(), refetchAppointments()]);
    setRefreshing(false);
  }, [refetchHomeStats, refetchAppointments]);

  const homeStats = useMemo(() => {
    return [
      {
        id: '1',
        label: 'Upcoming Appts',
        value: String(boardStats?.upcomingAppointments ?? 0),
        icon: <ClockIcon size={20} color="#8B5CF6" />,
        iconBg: '#F3E8FF',
      },
      {
        id: '2',
        label:
          period === 'today' ? 'Today Appts' : period === 'week' ? 'Week Appts' : 'Month Appts',
        value: String(boardStats?.todayAppointments ?? 0),
        icon: <CalendarIcon size={20} color="#0EA5E9" />,
        iconBg: '#E0F2FE',
      },
      {
        id: '3',
        label: 'Earnings',
        value: `₹${_compactNumber(Number(boardStats?.todayRevenue ?? 0))}`,
        icon: <WalletIcon size={20} color="#10B981" />,
        iconBg: '#D1FAE5',
      },
      {
        id: '4',
        label: 'Total Patients',
        value: String(boardStats?.totalPatients ?? 0),
        icon: <PatientsIcon size={20} color="#F59E0B" />,
        iconBg: '#FEF3C7',
      },
    ];
  }, [boardStats, period]);

  const filtersUpcomingAppts = useMemo(() => {
    return upcomingAppts || [];
  }, [upcomingAppts]);

  return (
    <SafeAreaWrapper>
      <Header
        isHome
        onNotificationPress={() => navigation?.navigate(AppRoute.NOTIFICATIONS)}
        onProfilePress={() => navigation?.navigate(AppRoute.DOCTOR_PROFILE)}
      />
      <ScrollView
        style={homeStyles.container}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={homeStyles.insightsSection}>
          <View style={homeStyles.insightsHeader}>
            <Text style={homeStyles.insightsTitle}>Highlights & Insights</Text>
            <View  style={{ position: 'relative', zIndex: 10 }}>
              <TouchableOpacity
                style={homeStyles.periodPill}
                onPress={() => setShowPeriodMenu(v => !v)}
                activeOpacity={0.8}
              >
                <Text style={homeStyles.periodPillText}>{PERIOD_LABELS[period]}</Text>
                {showPeriodMenu ? (
                  <ChevronUpIcon size={12} color={theme.colors.primary} />
                ) : (
                  <ChevronDownIcon size={12} color={theme.colors.primary} />
                )}
              </TouchableOpacity>

              {showPeriodMenu && (
                <View style={homeStyles.periodDropdownMenu}>
                  {(Object.entries(PERIOD_LABELS) as [PeriodKey, string][]).map(([key, label]) => (
                    <TouchableOpacity
                      key={key}
                      onPress={() => {
                        setPeriod(key);
                        setShowPeriodMenu(false);
                      }}
                      activeOpacity={0.75}
                      style={homeStyles.periodMenuItem}
                    >
                      <Text
                        style={[
                          homeStyles.periodMenuItemText,
                          period === key && homeStyles.periodMenuItemTextActive,
                        ]}
                      >
                        {label}
                      </Text>
                      {period === key && <CheckIcon size={14} color={theme.colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {statsPending ? (
            <HomeStatSkeleton />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: theme.spacing.lg }}
            >
              {homeStats.map(stat => (
                <HomeStatsCard
                  key={stat.id}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  iconBg={stat.iconBg}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={homeStyles.sectionHeader}>
          <Text style={homeStyles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity
            onPress={() => navigation?.navigate(AppRoute.PATIENTS)}
            activeOpacity={0.7}
          >
            <Text style={homeStyles.sectionLink}>See All</Text>
          </TouchableOpacity>
        </View>

        {upcomiongApptsPending ? (
          <AppointmentSkeleton />
        ) : filtersUpcomingAppts && filtersUpcomingAppts?.length > 0 ? (
          filtersUpcomingAppts?.slice(0, 3)?.map(apt => {
            const isExpired = checkIsExpired(apt.appointment_date, apt.end_time, apt.start_time);
            return (
              <UpcomingAppointmentCard
                key={apt.appointment_id}
                id={String(apt.id)}
                patientName={apt.patient_name || 'Patient'}
                ageGender={apt.patient_gender}
                time={formatTime12h(apt.start_time)}
                timeDistance={getTimeUntilStart(apt?.start_time)}
                consultType={apt.consultation_type || 'ONLINE'}
                chiefComplaint={apt.symptoms || apt.reason || ''}
                isExpired={isExpired}
                onActionPress={() => {
                  navigation?.navigate(AppRoute.DOCTOR_APPOINTMENTS, { refresh: true });
                }}
              />
            );
          })
        ) : (
          <View style={{ paddingVertical: theme.spacing.lg, alignItems: 'center' }}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>
              No upcoming appointments found.
            </Text>
          </View>
        )}

        <AssistanceBanner onContactSupport={() => navigation?.navigate(AppRoute.ACCOUNT)} />

        <View style={homeStyles.sectionHeader}>
          <Text style={homeStyles.sectionTitle}>Quick Access</Text>
        </View>

        <View style={homeStyles.quickAccessGrid}>
          {quickAccessItems.map(item => (
            <QuickAccessCard
              key={item.id}
              label={item.label}
              icon={item.icon}
              onPress={() => navigation?.navigate(item.screen)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
