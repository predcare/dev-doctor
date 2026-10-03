import { useNavigation } from '@react-navigation/native';
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
    type ViewInstance,
} from 'react-native';
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
} from '../../../components/ui/icons';
import EmptyIcon from '../../../components/ui/icons/EmptyIcon';
import { useHomeUpcomingAppts } from '../../../hooks/react-query/home/home.hooks';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { formatTime12h } from '../../../lib/commons/availability.utils';
import { showErrorToast, showInfoToast } from '../../../lib/commons/toast.utils';
import { AppRoute } from '../../../route';
import { homeStyles } from '../../../styled/HomeScreen.styled';
import theme from '../../../styled/theme.styled';
import AssistanceBanner from './components/AssistanceBanner';
import HomeStatsCard from './components/HomeStatsCard';
import QuickAccessCard from './components/QuickAccessCard';
import UpcomingAppointmentCard from './components/UpcomingAppointmentCard';
import UpcomingAppointmentSkeleton from './Skeletons/AppointmentSkeleton';
import HomeStatSkeleton from './Skeletons/HomeStatSkeleton';

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
    const [period, setPeriod] = useState<PeriodKey>('week');
    const [showPeriodMenu, setShowPeriodMenu] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 155, right: 16 });
    const pillRef = useRef<ViewInstance>(null);
    const [refreshing, setRefreshing] = useState(false);

    const statsPending = false;

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
        await Promise.all([refetchAppointments()]);
        setRefreshing(false);
    }, [refetchAppointments]);

    const homeStats = useMemo(() => {
        return [
            {
                id: '1',
                label: 'Upcoming Appts',
                value: 0,
                icon: <ClockIcon size={20} color="#8B5CF6" />,
                iconBg: '#F3E8FF',
            },
            {
                id: '2',
                label:
                    period === 'today' ? 'Today Appts' : period === 'week' ? 'Week Appts' : 'Month Appts',
                value: 0,
                icon: <CalendarIcon size={20} color="#0EA5E9" />,
                iconBg: '#E0F2FE',
            },
            {
                id: '3',
                label: 'Earnings',
                value: 0,
                icon: <WalletIcon size={20} color="#10B981" />,
                iconBg: '#D1FAE5',
            },
            {
                id: '4',
                label: 'Total Patients',
                value: 0,
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
            <View style={{ flex: 1, position: 'relative' }}>
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
                                keyboardShouldPersistTaps="handled"
                            >
                                {homeStats.map(stat => (
                                    <HomeStatsCard
                                        key={stat.id}
                                        label={stat.label}
                                        value={String(stat.value)}
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
                                    isCurrentApptInCall={false}
                                    appointmentStatus={apt.appointment_status}
                                    onVideoCall={() => {
                                        showInfoToast('Video call will be available soon');
                                    }}
                                    onStartConsultation={() => {
                                        showInfoToast('Consultation will be started soon');
                                    }}
                                    onCardPress={() => {
                                        if (!apt.id) return showErrorToast("Appointment not found")
                                        appNavigation.navigate(AppRoute.APPOINTMENT_DETAILS, { appointmentId: apt.id })
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
