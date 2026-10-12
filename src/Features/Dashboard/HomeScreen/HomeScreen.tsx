import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CustomMenu from '../../../components/ui/CustomDropdown/CustomMenu';
import {
    CalendarIcon,
    ClockIcon,
    InvoiceIcon,
    PatientsIcon,
    PrescriptionIcon,
    ScheduleIcon,
    WalletIcon,
} from '../../../components/ui/icons';
import EmptyIcon from '../../../components/ui/icons/EmptyIcon';
import useJoinVideoCall from '../../../hooks/commons/meeting/useJoinVideoCall';
import { useHomeUpcomingAppts } from '../../../hooks/react-query/home/home.hooks';
import { useDoctorStats } from '../../../hooks/react-query/stats/stats.hooks';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { formatTime12h } from '../../../lib/commons/availability.utils';
import { showErrorToast, showInfoToast } from '../../../lib/commons/toast.utils';
import { AppRoute } from '../../../route';
import { homeStyles } from '../../../styled/HomeScreen.styled';
import theme from '../../../styled/theme.styled';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
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
        icon: <CalendarIcon size={30} color={theme.colors.primary} />,
    },
    {
        id: 'q2',
        label: 'WRITE RX',
        screen: 'Prescription' as const,
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
        screen: 'Invoices' as const,
        icon: <InvoiceIcon size={30} color={theme.colors.primary} />,
    },
];

export const HomeScreen: React.FC = () => {
    const appNavigation = useNavigation();
    const [period, setPeriod] = useState<PeriodKey>('today');
    const [showPeriodMenu, setShowPeriodMenu] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { userData } = useAuthStore(state => state);
    const { joinVideoCall } = useJoinVideoCall();
    const activeApptId = useMeetingStore(state => state.callInfo?.appointment?.id);
    const activeApptGeneratedId = useMeetingStore(state => state.callInfo?.appointment?.appointmentId);
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
        limit: 2,
        status: 'upcoming,pending',
        date_range: 'today',
    });

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([refetchAppointments(), refetchStats()]);
        setRefreshing(false);
    }, [refetchAppointments, refetchStats]);

    const homeStats = useMemo(() => {
        return [
            {
                id: '1',
                label: 'Upcoming Appts',
                value: statsInfo?.upcoming_appointments || 0,
                icon: <ClockIcon size={20} color="#8B5CF6" />,
                iconBg: '#F3E8FF',
            },
            {
                id: '2',
                label:
                    period === 'today'
                        ? 'Today Appts'
                        : period === 'last_7_days'
                            ? '7 Days Appts'
                            : '30 Days Appts',
                value: statsInfo?.week_appointments || 0,
                icon: <CalendarIcon size={20} color="#0EA5E9" />,
                iconBg: '#E0F2FE',
            },
            {
                id: '3',
                label: 'Earnings',
                value: `₹${statsInfo?.earnings || 0}`,
                icon: <WalletIcon size={20} color="#10B981" />,
                iconBg: '#D1FAE5',
            },
            {
                id: '4',
                label: 'Total Patients',
                value: statsInfo?.total_patients || 0,
                icon: <PatientsIcon size={20} color="#F59E0B" />,
                iconBg: '#FEF3C7',
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
                        <Text style={homeStyles.sectionTitle}>Upcoming Appointments</Text>
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
                                            (Boolean(apt.appointment_id) &&
                                                activeApptGeneratedId === apt.appointment_id))
                                    }
                                    appointmentStatus={apt.appointment_status}
                                    onVideoCall={() => {
                                        joinVideoCall({
                                            appointmentId: apt.id,
                                            patientName: apt.patientInfo?.name,
                                            patientId: apt.patientInfo?.patientId,
                                        });
                                    }}
                                    onStartConsultation={() => {
                                        showInfoToast('Consultation will be started soon');
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
                            <Text style={homeStyles.emptySub}>Tap below to add a new one</Text>
                            <TouchableOpacity
                                style={homeStyles.bookNowBtn}
                                onPress={() => appNavigation?.navigate(AppRoute.BOOK_APPOINTMENT)}
                                activeOpacity={0.8}
                            >
                                <Text style={homeStyles.bookNowBtnText}>Book Now</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <AssistanceBanner onContactSupport={() => appNavigation?.navigate(AppRoute.ACCOUNT)} />

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
                </ScrollView>
            </View>
        </SafeAreaWrapper>
    );
};

export default HomeScreen;
