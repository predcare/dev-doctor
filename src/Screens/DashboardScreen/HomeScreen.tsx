import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AssistanceBanner } from '../../components/Modules/Dashboard/AssistanceBanner';
import HomeStatsCard from '../../components/Modules/Dashboard/HomeStatsCard';
import { QuickAccessCard } from '../../components/Modules/Dashboard/QuickAccessCard';
import UpcomingAppointmentCard from '../../components/Modules/Dashboard/UpcomingAppointmentCard';
import { queryClient } from '../../components/providers/ReactQueryProvider';
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
import EmptyIcon from '../../components/ui/icons/EmptyIcon';
import { useDevicePermissions } from '../../hooks/commons/useDevicePermissions';
import { getApptToken } from '../../hooks/react-query/appointments/appointments.func';
import { useChangeAppointmentStatus } from '../../hooks/react-query/appointments/appointments.hooks';
import { useHomeStats, useHomeUpcomingAppts } from '../../hooks/react-query/home/home.hooks';
import { MyAppointmentsQueryKeys } from '../../hooks/react-query/query.keys';
import { Header } from '../../Layout/Header';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { _compactNumber, checkIsExpired, getTimeUntilStart } from '../../lib/common/common.utils';
import { showErrorToast, showInfoToast } from '../../lib/common/toast.utils';
import { AppRoute, type HomeScreenProps } from '../../route';
import { homeStyles } from '../../styled/HomeScreen.styled';
import { theme } from '../../styled/theme.styled';
import { IUpcomingApptsDoc } from '../../typescripts/interfaces/homes.interfaces';
import { formatTime12h } from '../../utils/availabilityUtils';
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../zustand/stores/useMeetingStore';

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
  const [menuPos, setMenuPos] = useState({ top: 155, right: 16 });
  const pillRef = useRef<View>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { userData } = useAuthStore(state => state);
  const { showLoader, hideLoader } = useLoadingStore(state => state);
  const { setMeetingSession, setInPersonAppointment } = useMeetingStore(state => state);
  const { requestAudioVideoPermissions } = useDevicePermissions();
  const { mutate: changeStatus } = useChangeAppointmentStatus();

  const handleJoinVideoCall = useCallback(
    async (appointment: IUpcomingApptsDoc) => {
      if (!appointment) return;

      const storeState = useMeetingStore.getState();
      const isCallActive =
        (storeState.callState === 'CONNECTED' || storeState.callState === 'CONNECTING') &&
        Boolean(storeState.token && storeState.meetingId);

      const isCurrentAppt =
        isCallActive &&
        (String(storeState.appointmentId) === String(appointment.id) ||
          (Boolean(appointment.appointment_id) &&
            storeState.appointmentGeneratedId === appointment.appointment_id));

      if (isCurrentAppt) {
        storeState.setIsInAppPip(false);
        navigation?.navigate(AppRoute.DOCTOR_MEETING);
        return;
      }

      if (isCallActive) {
        showInfoToast(
          'You are currently in an active consultation. Please end that call first.',
          'Active Call Ongoing'
        );
        return;
      }

      const hasPermissions = await requestAudioVideoPermissions();
      if (!hasPermissions) {
        showErrorToast('Camera and Microphone permissions are required to join the consultation.');
        return;
      }

      const apptId = appointment.id;
      let token: string | undefined;
      let meetingId: string | undefined = appointment.meeting_id;
      let call_duration_seconds: number | undefined = appointment.call_duration_seconds;

      if (!apptId) {
        showErrorToast('No valid appointment ID found to fetch token');
        return;
      }
      if (!appointment?.patient_id)
        return showErrorToast('No valid patient ID found to fetch token');

      try {
        const tokenResponse = await queryClient.fetchQuery({
          queryKey: [MyAppointmentsQueryKeys.MyAppointments, 'token', apptId],
          queryFn: () => getApptToken(apptId),
        });
        token = tokenResponse?.token;
        meetingId = tokenResponse?.meeting_id;
      } catch (error) {
        console.error('Failed to fetch fresh appointment token:', error);
      }

      if (!token && appointment.token) {
        token = appointment.token;
        call_duration_seconds = appointment.call_duration_seconds;
      }

      const cleanedToken = token?.trim().replace(/^["']|["']$/g, '');
      const cleanedMeetingId = meetingId?.trim().replace(/^["']|["']$/g, '');

      if (!cleanedToken || !cleanedMeetingId) {
        showErrorToast('Meeting credentials missing or invalid');
        return;
      }

      setMeetingSession({
        token: cleanedToken,
        meetingId: cleanedMeetingId,
        appointmentId: apptId,
        patientName: appointment.patient_name,
        patientAlphanumericId: appointment.patient_alphanumeric_id,
        appointmentGeneratedId: appointment.appointment_id,
        startTime: appointment.start_time,
        endTime: appointment.end_time,
        callDurationSeconds: call_duration_seconds ?? 0,
        patientUserId: String(appointment?.patient_id),
      });

      navigation?.navigate(AppRoute.DOCTOR_MEETING);
    },
    [navigation, setMeetingSession, requestAudioVideoPermissions]
  );

  const handleStartConsultation = useCallback(
    (appointmentId: number | string, patientId: number, patientName: string, status: string) => {
      if (status?.toLowerCase() === 'confirmed') {
        showLoader('Loading...');
        changeStatus(
          { appointmentId, appointment_status: 'in_progress' },
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
              navigation?.navigate(AppRoute.CREATE_PRESCRIPTION, {
                patientId: patientId,
                patientName: patientName,
              });
            },
            onError: () => {
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
        navigation?.navigate(AppRoute.CREATE_PRESCRIPTION, {
          patientId: patientId,
          patientName: patientName,
        });
      }
    },
    [changeStatus, showLoader, hideLoader, navigation, setInPersonAppointment]
  );

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

  const togglePeriodMenu = useCallback(() => {
    if (showPeriodMenu) {
      setShowPeriodMenu(false);
    } else {
      pillRef.current?.measureInWindow((x, y, width, height) => {
        const screenWidth = Dimensions.get('window').width;
        setMenuPos({
          top: y + height + 6,
          right: Math.max(16, screenWidth - (x + width)),
        });
        setShowPeriodMenu(true);
      });
    }
  }, [showPeriodMenu]);

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

  useEffect(() => {
    const unsubscribe = navigation?.addListener('blur', () => {
      setShowPeriodMenu(false);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaWrapper>
      <Header
        isHome
        onNotificationPress={() => navigation?.navigate(AppRoute.NOTIFICATIONS)}
        onProfilePress={() =>
          navigation?.navigate(AppRoute.MAIN_TABS, {
            screen: AppRoute.ACCOUNT,
          })
        }
      />
      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView
          style={homeStyles.container}
          contentContainerStyle={homeStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => setShowPeriodMenu(false)}
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
              <View style={{ position: 'relative', zIndex: 100 }} ref={pillRef}>
                <TouchableOpacity
                  style={homeStyles.periodPill}
                  onPress={togglePeriodMenu}
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
                  <Modal
                    transparent
                    visible={showPeriodMenu}
                    animationType="fade"
                    onRequestClose={() => setShowPeriodMenu(false)}
                  >
                    <Pressable
                      style={homeStyles.screenBackdrop}
                      onPress={() => setShowPeriodMenu(false)}
                    >
                      <View
                        style={[
                          homeStyles.periodDropdownMenu,
                          { top: menuPos.top, right: menuPos.right },
                        ]}
                      >
                        {(Object.entries(PERIOD_LABELS) as [PeriodKey, string][]).map(
                          ([key, label]) => (
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
                              {period === key && (
                                <CheckIcon size={14} color={theme.colors.primary} />
                              )}
                            </TouchableOpacity>
                          )
                        )}
                      </View>
                    </Pressable>
                  </Modal>
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
            <AppointmentSkeleton />
          ) : upcomingAppts && upcomingAppts?.length > 0 ? (
            upcomingAppts?.slice(0, 3)?.map(apt => {
              const isExpired = checkIsExpired(apt.appointment_date, apt.end_time, apt.start_time);
              const storeState = useMeetingStore.getState();
              const isCallActive =
                (storeState.callState === 'CONNECTED' || storeState.callState === 'CONNECTING') &&
                Boolean(storeState.token && storeState.meetingId);
              const isCurrentApptInCall =
                isCallActive &&
                (String(storeState.appointmentId) === String(apt.id) ||
                  (Boolean(apt.appointment_id) &&
                    storeState.appointmentGeneratedId === apt.appointment_id));

              return (
                <UpcomingAppointmentCard
                  key={apt.appointment_id || apt.id}
                  id={String(apt.id)}
                  patientName={apt.patient_name || 'Patient'}
                  ageGender={apt.patient_gender}
                  time={formatTime12h(apt.start_time)}
                  timeDistance={getTimeUntilStart(apt?.start_time)}
                  consultType={apt.consultation_type || 'ONLINE'}
                  chiefComplaint={apt.symptoms || apt.reason || ''}
                  isExpired={isExpired}
                  isJoinedOnce={Number(apt?.call_duration_seconds) > 0}
                  isCurrentApptInCall={isCurrentApptInCall}
                  appointmentStatus={apt.appointment_status}
                  onVideoCall={() => handleJoinVideoCall(apt)}
                  onStartConsultation={() =>
                    handleStartConsultation(
                      apt.id,
                      apt.patient_id,
                      apt.patient_name,
                      apt.appointment_status
                    )
                  }
                />
              );
            })
          ) : (
            <View style={homeStyles.emptyCard}>
              <EmptyIcon color={theme.colors.primary} />
              <Text style={homeStyles.emptyText}>No upcoming appointments for today</Text>
              <Text style={homeStyles.emptySub}>Tap below to add a new one</Text>
              <TouchableOpacity
                style={homeStyles.bookNowBtn}
                onPress={() => navigation?.navigate(AppRoute.BOOK_APPOINTMENT)}
                activeOpacity={0.8}
              >
                <Text style={homeStyles.bookNowBtnText}>Book Now</Text>
              </TouchableOpacity>
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
      </View>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
