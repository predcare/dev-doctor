import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import CustomMenu from '../../../components/ui/CustomDropdown/CustomMenu';
import {
  CalendarIcon,
  InvoiceIcon,
  PrescriptionIcon,
  ScheduleIcon,
} from '../../../components/ui/icons';
import CalendarCheckIcon from '../../../components/ui/icons/CalendarCheckIcon';
import EarningIcon from '../../../components/ui/icons/EarningIcon';
import EmptyIcon from '../../../components/ui/icons/EmptyIcon';
import PatientWalkIcon from '../../../components/ui/icons/PatientWalkIcon';
import useJoinVideoCall from '../../../hooks/commons/meeting/useJoinVideoCall';
import { useChangeAppointmentStatus } from '../../../hooks/react-query/appointments/appointments.hooks';
import { useHomeUpcomingAppts } from '../../../hooks/react-query/home/home.hooks';
import { MyAppointmentsQueryKeys } from '../../../hooks/react-query/query.keys';
import { useDoctorStats } from '../../../hooks/react-query/stats/stats.hooks';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { formatTime12h } from '../../../lib/commons/availability.utils';
import {
  _formatShortNumber,
  resolveAppointmentDurationMinutes,
} from '../../../lib/commons/common.utils';
import { showErrorToast } from '../../../lib/commons/toast.utils';
import { AppRoute } from '../../../route';
import { homeStyles } from '../../../styled/HomeScreen.styled';
import theme from '../../../styled/theme.styled';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import AssistanceBanner from './components/AssistanceBanner';
import HomeStatsCard from './components/HomeStatsCard';
import QuickAccessCard from './components/QuickAccessCard';
import UpcomingAppointmentCard from './components/UpcomingAppointmentCard';
import UpcomingAppointmentSkeleton from './Skeletons/AppointmentSkeleton';

type PeriodKey = 'today' | 'last_7_days' | 'last_30_days';

const PERIOD_LABELS: Record<PeriodKey, string> = {
  today: 'Today',
  last_7_days: 'Last 7 Days',
  last_30_days: 'Last 30 Days',
};

const periodItems = (Object.entries(PERIOD_LABELS) as [PeriodKey, string][]).map(([id, label]) => ({
  id,
  label,
}));

const quickAccessItems = [
  {
    id: 'q1',
    label: 'BOOK APPT',
    screen: 'BookAppointment' as const,
    icon: <CalendarIcon size={30} color={theme.colors.textInPerson} />,
  },
  {
    id: 'q2',
    label: 'WRITE RX',
    screen: 'Prescription' as const,
    icon: <PrescriptionIcon size={30} color={theme.colors.textInPerson} />,
  },
  {
    id: 'q3',
    label: 'AVAILABILITY',
    screen: 'Availability' as const,
    icon: <ScheduleIcon size={30} color={theme.colors.textInPerson} />,
  },
  {
    id: 'q4',
    label: 'BILLING',
    screen: 'Invoices' as const,
    icon: <InvoiceIcon size={30} color={theme.colors.textInPerson} />,
  },
];

export const HomeScreen: React.FC = () => {
  const appNavigation = useNavigation();
  const [period, setPeriod] = useState<PeriodKey>('today');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { userData } = useAuthStore(state => state);
  const { joinVideoCall } = useJoinVideoCall();
  const setInPersonAppointment = useMeetingStore(state => state.setInPersonAppointment);
  const { showLoader, hideLoader } = useLoadingStore(state => state);
  const { mutate: changeStatus } = useChangeAppointmentStatus();
  const activeApptId = useMeetingStore(state => state.callInfo?.appointment?.id);
  const activeApptGeneratedId = useMeetingStore(
    state => state.callInfo?.appointment?.appointmentId
  );
  const activeCallState = useMeetingStore(state => state.callState);
  const activeToken = useMeetingStore(state => state.callInfo?.token);
  const activeMeetingId = useMeetingStore(state => state.callInfo?.meetingId);
  const isCallActive =
    (activeCallState === 'INITIALIZING' ||
      activeCallState === 'CONNECTING' ||
      activeCallState === 'WAITING_FOR_PATIENT' ||
      activeCallState === 'CONNECTED' ||
      activeCallState === 'RECONNECTING') &&
    Boolean(activeToken && activeMeetingId);

  const {
    data: statsInfo,
    isPending: statsPending,
    refetch: refetchStats,
  } = useDoctorStats({
    date_filter: period,
    clinic_id: Number(userData?.clinic?.id) || 0,
  });

  const {
    data: upcomingAppts,
    isPending: upcomiongApptsPending,
    refetch: refetchAppointments,
  } = useHomeUpcomingAppts({
    page: 1,
    limit: 3,
    status: 'upcoming,confirmed,in-progress,in_progress',
    date_range: 'today',
    consultation_type: 'video,in-person',
  });

  const handleStartConsulation = useCallback(
    (appointmentId: number | string, patientId: number, patientName: string, status: string) => {
      if (status?.toLowerCase() === 'confirmed') {
        showLoader('Loading...');
        changeStatus(
          { appointmentId, status: 'in_progress' },
          {
            onSuccess: async () => {
              await queryClient.invalidateQueries({
                queryKey: [MyAppointmentsQueryKeys.MyAppointments],
              });
              hideLoader();
              setInPersonAppointment({
                apptIdforInPerson: String(appointmentId),
                patientIdforInPerson: String(patientId),
                patientNameforInPerson: String(patientName),
                statusforInPerson: String(status),
              });
              appNavigation.navigate(AppRoute.CREATE_PRESCRIPTION, {
                patientId: patientId,
                patientName: patientName,
              });
            },
            onSettled: () => {
              hideLoader();
            },
          }
        );
      } else {
        setInPersonAppointment({
          apptIdforInPerson: String(appointmentId),
          patientIdforInPerson: String(patientId),
          patientNameforInPerson: String(patientName),
          statusforInPerson: String(status),
        });
        appNavigation.navigate(AppRoute.CREATE_PRESCRIPTION, {
          patientId: patientId,
          patientName: patientName,
        });
      }
    },
    [changeStatus, queryClient, showLoader, hideLoader, setInPersonAppointment, appNavigation]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchAppointments(), refetchStats()]);
    setRefreshing(false);
  }, [refetchAppointments, refetchStats]);

  const homeStats = useMemo(() => {
    return [
      // {
      //     id: '1',
      //     label: 'Upcoming Appts',
      //     value: statsInfo?.upcoming_appointments || 0,
      //     icon: <CalendarCheckIcon size={32} color="#9333EA" />,
      //     iconBg: '#F3E8FF',
      // },
      {
        id: '2',
        label:
          period === 'today'
            ? 'Today Appts'
            : period === 'last_7_days'
            ? '7 Days Appts'
            : '30 Days Appts',
        value: statsInfo?.week_appointments || 0,
        icon: <CalendarCheckIcon size={32} color="#9333EA" />,
      },
      {
        id: '3',
        label: 'Earnings',
        value: `₹${_formatShortNumber(Number(statsInfo?.earnings))}`,
        icon: <EarningIcon size={32} color="#10B981" />,
      },
      {
        id: '4',
        label: 'Total Patients',
        value: statsInfo?.total_patients || 0,
        icon: <PatientWalkIcon size={23} color="#3B82F6" />,
        iconBg: '#f5f7f7ff',
      },
    ];
  }, [period]);

  useEffect(() => {
    const unsubscribe = appNavigation?.addListener('blur', () => {
      setShowPeriodMenu(false);
    });
    return unsubscribe;
  }, [appNavigation]);

  return (
    <SafeAreaWrapper showBottomBar={true} activeBottomTab="Home" header={<Header isHome />}>
      <View
        style={{ flex: 1 }}
        onTouchStart={() => {
          if (showPeriodMenu) {
            setShowPeriodMenu(false);
          }
        }}
      >
        <ScrollView
          style={homeStyles.container}
          contentContainerStyle={homeStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => setShowPeriodMenu(false)}
          keyboardShouldPersistTaps="handled"
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
              <CustomMenu
                items={periodItems}
                selectedId={period}
                onSelect={id => setPeriod(id as PeriodKey)}
                open={showPeriodMenu}
                onOpenChange={setShowPeriodMenu}
                triggerLabel={PERIOD_LABELS[period]}
                align="right"
                triggerStyle={homeStyles.periodPill}
                triggerTextStyle={homeStyles.periodPillText}
                menuStyle={homeStyles.periodDropdownMenu}
                itemStyle={homeStyles.periodMenuItem}
                itemTextStyle={homeStyles.periodMenuItemText}
                activeItemTextStyle={homeStyles.periodMenuItemTextActive}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: theme.spacing.lg }}
              keyboardShouldPersistTaps="handled"
            >
              {homeStats.map(stat => (
                <HomeStatsCard
                  key={stat.id}
                  label={stat.label}
                  value={String(stat.value)}
                  icon={stat.icon}
                  iconBg={stat.iconBg}
                  loading={statsPending}
                />
              ))}
            </ScrollView>
          </View>

          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity
              onPress={() => appNavigation?.navigate(AppRoute.APPOINTMENTS)}
              activeOpacity={0.7}
              style={{
                width: 100,
                height: 25,
                justifyContent: 'center',
                alignItems: 'flex-end',
                borderRadius: 20,
              }}
            >
              <Text style={homeStyles.sectionLink}>See All</Text>
            </TouchableOpacity>
          </View>

          {upcomiongApptsPending ? (
            <UpcomingAppointmentSkeleton />
          ) : upcomingAppts && upcomingAppts?.meta?.total > 0 ? (
            upcomingAppts?.data?.map(apt => {
              return (
                <UpcomingAppointmentCard
                  key={`${apt.appointment_id}-${apt.id}`}
                  id={String(apt.id)}
                  appointmentGeneratedId={apt.appointment_id}
                  patientName={apt.patientInfo?.name || 'Patient'}
                  ageGender={apt.patientInfo?.gender}
                  dateOfBirth={apt?.patientInfo?.dateOfBirth}
                  time={formatTime12h(apt.start_time)}
                  consultType={apt.consultation_type || 'ONLINE'}
                  chiefComplaint={apt.reason || ''}
                  isExpired={false}
                  isJoinedOnce={
                    apt?.appointment_status === 'in_progress' ||
                    apt?.appointment_status === 'in-progress'
                  }
                  isCurrentApptInCall={
                    apt.consultation_type?.toLowerCase() === 'video' &&
                    isCallActive &&
                    (String(activeApptId) === String(apt.id) ||
                      (Boolean(apt.appointment_id) && activeApptGeneratedId === apt.appointment_id))
                  }
                  appointmentStatus={apt.appointment_status}
                  appointmentDurationMinutes={resolveAppointmentDurationMinutes(
                    apt.appointment_duration,
                    apt.slot_duration_minutes,
                    apt.start_time,
                    apt.end_time
                  )}
                  callDurationSeconds={apt.call_duration_seconds}
                  onVideoCall={() => {
                    joinVideoCall({
                      appointmentId: apt.id,
                      patientName: apt.patientInfo?.name,
                      patientId: apt.patientInfo?.patientId,
                    });
                  }}
                  onStartConsultation={() => {
                    handleStartConsulation(
                      apt.id,
                      Number(apt.patientInfo?.patientId),
                      apt.patientInfo?.name || '',
                      apt.appointment_status
                    );
                  }}
                  onCardPress={() => {
                    if (!apt.id) return showErrorToast('Appointment not found');
                    appNavigation.navigate(AppRoute.APPOINTMENT_DETAILS, { appointmentId: apt.id });
                  }}
                />
              );
            })
          ) : (
            <View style={homeStyles.emptyCard}>
              <EmptyIcon color={theme.colors.primary} />
              <Text style={homeStyles.emptyText}>No upcoming appointments for today</Text>
            </View>
          )}

          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>Quick Access</Text>
          </View>

          <View style={homeStyles.quickAccessGrid}>
            {quickAccessItems.map(item => (
              <QuickAccessCard
                key={item.id}
                label={item.label}
                icon={item.icon}
                onPress={() => appNavigation?.navigate(item.screen)}
              />
            ))}
          </View>
          <AssistanceBanner onContactSupport={() => appNavigation?.navigate(AppRoute.SUPPORT)} />
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
