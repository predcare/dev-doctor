import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import CommonEmptyCard from '../../../components/commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../../components/commons/CommonErrorCard/CommonErrorCard';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import { CircleXIcon, FilterIcon, SearchIcon } from '../../../components/ui/icons';
import { useDebounce } from '../../../hooks/commons/useDebounce';
import {
    useChangeAppointmentStatus,
    useMyAppointmentStats,
    useMyInfiniteAppointments,
} from '../../../hooks/react-query/appointments/appointments.hooks';
import { IMyApptQueryParams } from '../../../hooks/react-query/appointments/payload.interafce';
import { MyAppointmentsQueryKeys } from '../../../hooks/react-query/query.keys';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { formatDate, formatDateToYYYYMMDD } from '../../../lib/commons/common.utils';
import { showInfoToast } from '../../../lib/commons/toast.utils';
import { AppRoute } from '../../../route';
import doctorAppointmentsStyles from '../../../styled/DoctorAppointmentsScreen.styled';
import theme from '../../../styled/theme.styled';
import { useAlertStore } from '../../../zustand/stores/useAlertStore';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import AppointmentCard from './Components/AppointmentCard';
import AppointmentStatsCard from './Components/AppointmentStatsCard';
import AppointmentFilterModal, { FilterStates } from './Modals/AppointmentFilterModal';
import AppointmentSkeleton from './Skeletons/AppointmentSkeleton';

type TabType = 'both' | 'inperson' | 'video';

export const AppointmentsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<TabType>('both');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [filterStates, setFilterStates] = useState<FilterStates>({
        dateRange: 'today',
        statuses: ['upcoming'],
        fromDate: null,
        toDate: null,
        activeTarget: null,
        bookingMode: null,
    });
    const debounceSearch = useDebounce(searchQuery?.trim(), 500);
    const { showConfirm } = useAlertStore(state => state);

    const { showLoader, hideLoader } = useLoadingStore(state => state);
    const { setInPersonAppointment } = useMeetingStore(state => state);

    const queryParams: IMyApptQueryParams = useMemo(() => {
        const params: IMyApptQueryParams = {
            limit: 15,
        };

        if (debounceSearch) {
            params.search = debounceSearch;
        }

        if (activeTab === 'inperson') {
            params.consultation_type = 'in-person';
        } else if (activeTab === 'video') {
            params.consultation_type = 'video';
        }

        if (filterStates.statuses && filterStates.statuses.length > 0) {
            params.status = filterStates.statuses.join(',');
        }

        if (filterStates.dateRange) {
            if (filterStates.dateRange === 'today') {
                params.date_range = 'today';
            } else if (filterStates.dateRange === 'tomorrow') {
                params.date_range = 'tomorrow';
            } else if (filterStates.dateRange === 'thisweek') {
                params.date_range = 'this_week';
            } else if (filterStates.dateRange === 'all') {
                if (filterStates.fromDate) {
                    params.start_date = formatDateToYYYYMMDD(filterStates.fromDate);
                }
                if (filterStates.toDate) {
                    params.end_date = formatDateToYYYYMMDD(filterStates.toDate);
                }
            }
        }

        return params;
    }, [debounceSearch, activeTab, filterStates]);

    const {
        data: myAppointmentsData,
        isPending: myAppointmentPending,
        isError: isMyAppointmentError,
        refetch: fetchMyAppointments,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useMyInfiniteAppointments(queryParams);

    const appointmentsList = useMemo(() => {
        const pages = myAppointmentsData?.pages ?? [];
        return pages.flatMap(page => (Array.isArray(page?.data) ? page.data : []));
    }, [myAppointmentsData?.pages]);

    const totalAppointments = useMemo(() => {
        return myAppointmentsData?.pages?.[0]?.meta?.total ?? appointmentsList.length;
    }, [myAppointmentsData?.pages, appointmentsList.length]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const { data: apptStats, isFetching: apptStatsPending, refetch: refetchStats } = useMyAppointmentStats();

    const { mutate: changeStatus } = useChangeAppointmentStatus();

    const isCustomFilterApplied = useMemo(() => {
        const isDefaultDate = filterStates.dateRange === 'today';
        const isDefaultStatus =
            filterStates.statuses.length === 1 && filterStates.statuses[0] === 'upcoming';
        const noCustomDates = filterStates.fromDate === null && filterStates.toDate === null;
        const noSearch = searchQuery.trim().length === 0;
        const noTab = activeTab === 'both';

        return !(isDefaultDate && isDefaultStatus && noCustomDates && noSearch && noTab);
    }, [filterStates, searchQuery, activeTab]);

    const updateFilterState = useCallback((updates: Partial<FilterStates>) => {
        setFilterStates(prev => ({
            ...prev,
            ...updates,
        }));
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchMyAppointments();
        await refetchStats();
        setRefreshing(false);
    }, [fetchMyAppointments, refetchStats]);

    const handleResetFilters = useCallback(() => {
        setFilterStates({
            dateRange: 'today',
            statuses: ['upcoming'],
            fromDate: null,
            toDate: null,
            activeTarget: null,
            bookingMode: null,
        });
        setSearchQuery('');
        setActiveTab('both');
        setShowFilterPanel(false);
    }, []);

    const handleOpenFilterModal = useCallback(() => {
        setShowFilterPanel(true);
    }, []);


    const handleMarkCompleted = useCallback(
        (appointmentId: number | string) => {
            showLoader('Loading...');
            changeStatus(
                {
                    appointmentId,
                    status: 'completed',
                    call_end_reason: 'Call ended and Booking Completed by Doctor',
                },
                {
                    onSuccess: async () => {
                        await queryClient.invalidateQueries({
                            queryKey: [MyAppointmentsQueryKeys.MyAppointments],
                        });
                        hideLoader();
                    },
                    onError: () => {
                        hideLoader();
                    },
                }
            );
        },
        [changeStatus, queryClient, showLoader, hideLoader]
    );

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
                            navigation?.navigate(AppRoute.CREATE_PRESCRIPTION, {
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
                navigation.navigate(AppRoute.CREATE_PRESCRIPTION, {
                    patientId: patientId,
                    patientName: patientName,
                });
            }
        },
        [changeStatus, queryClient, showLoader, hideLoader]
    );

    return (
        <SafeAreaWrapper
            showBottomBar={true}
            activeBottomTab="Appointments"
            header={<Header title="Manage Appointments" description="View and manage patient schedule" />}
        >
            <AppointmentStatsCard
                todayCount={apptStats?.today_count || 0}
                upcoming3hCount={apptStats?.upcoming_3h_count || 0}
                loading={apptStatsPending}
            />

            <View style={doctorAppointmentsStyles.searchRow}>
                <View style={doctorAppointmentsStyles.searchBox}>
                    <SearchIcon size={18} color="#94A3B8" />
                    <TextInput
                        style={doctorAppointmentsStyles.searchInput}
                        placeholder="Search by Appointment Id"
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <CircleXIcon size={16} color="#94A3B8" />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        doctorAppointmentsStyles.filterBtn,
                        isCustomFilterApplied && { borderColor: theme.colors.primary },
                    ]}
                    onPress={handleOpenFilterModal}
                    activeOpacity={0.7}
                >
                    <FilterIcon size={20} color={isCustomFilterApplied ? theme.colors.primary : '#64748B'} />
                </TouchableOpacity>
            </View>

            <View style={doctorAppointmentsStyles.tabsContainer}>
                {(
                    [
                        { key: 'both', label: 'Both' },
                        { key: 'inperson', label: 'In-person' },
                        { key: 'video', label: 'Video' },
                    ] as { key: TabType; label: string }[]
                ).map(t => (
                    <TouchableOpacity
                        key={t.key}
                        style={[
                            doctorAppointmentsStyles.tab,
                            activeTab === t.key && doctorAppointmentsStyles.activeTab,
                        ]}
                        onPress={() => setActiveTab(t.key)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                doctorAppointmentsStyles.tabText,
                                {
                                    color: activeTab === t.key ? '#FFFFFF' : '#374151',
                                    fontWeight: activeTab === t.key ? '600' : '500',
                                },
                            ]}
                        >
                            {t.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={doctorAppointmentsStyles.filterBanner}>
                <Text style={doctorAppointmentsStyles.filterBannerTxt}>
                    {isCustomFilterApplied
                        ? `Filtered · ${totalAppointments} appointment${totalAppointments !== 1 ? 's' : ''}`
                        : `Today · ${formatDate(new Date())}`}
                </Text>
                {isCustomFilterApplied && (
                    <TouchableOpacity onPress={handleResetFilters} activeOpacity={0.7}>
                        <Text style={doctorAppointmentsStyles.filterBannerClear}>Clear</Text>
                    </TouchableOpacity>
                )}
            </View>

            {myAppointmentPending ? (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 100, justifyContent: 'center' }}
                    showsVerticalScrollIndicator={false}
                >
                    <AppointmentSkeleton />
                </ScrollView>
            ) : isMyAppointmentError ? (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 100, justifyContent: 'center' }}
                    showsVerticalScrollIndicator={false}
                >
                    <CommonErrorCard
                        title="Failed to Load Appointments"
                        message="Something went wrong while fetching Appointments."
                        onRetry={() => fetchMyAppointments()}
                    />
                </ScrollView>
            ) : (
                <FlatList
                    style={{ flex: 1 }}
                    data={appointmentsList}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={doctorAppointmentsStyles.listContent}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            </View>
                        ) : undefined
                    }
                    ListEmptyComponent={
                        <CommonEmptyCard
                            title={'No Appointments Found'}
                            message={'No appointments match your search or filter criteria.'}
                            actionText={'Clear Filters'}
                            onAction={handleResetFilters}
                        />
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                    renderItem={({ item }) => {
                        return (
                            <AppointmentCard
                                appointmentGeneratedId={item.appointment_id}
                                appointmentId={Number(item.id)}
                                patientName={item?.patientInfo?.name || ''}
                                patientGender={item.patientInfo?.gender || ''}
                                patientDateOfBirth={item?.patientInfo?.dateOfBirth || ''}
                                appointmentStatus={item.appointment_status}
                                appointment_date={item.appointment_date}
                                consultation_type={item.consultation_type}
                                startTime={item.start_time}
                                endTime={item.end_time}
                                isJoinedOnce={
                                    item?.appointment_status === 'in_progress' ||
                                    item?.appointment_status === 'in-progress'
                                }
                                onVideoCall={() => {
                                    showInfoToast('Video call feature will be available soon');
                                }}
                                onComplete={() => {
                                    showConfirm({
                                        title: 'Complete Appointment',
                                        message: 'Are you sure you want to mark this appointment as completed?',
                                        buttonText: 'Yes, Complete',
                                        cancelText: 'Cancel',
                                        onConfirm: () => handleMarkCompleted(item.id),
                                    });
                                }}
                                onReschedule={() => {
                                    showInfoToast('Appointment reschedule feature will be available soon');
                                }}
                                onStartConsultation={() => {
                                    handleStartConsulation(
                                        item.id,
                                        Number(item.patientInfo?.patientId),
                                        item.patientInfo?.name || '',
                                        item.appointment_status
                                    );
                                }}
                                onViewDetails={() => {
                                    navigation.navigate(AppRoute.APPOINTMENT_DETAILS, { appointmentId: item.id });
                                }}
                            />
                        );
                    }}
                />
            )}

            <AppointmentFilterModal
                visible={showFilterPanel}
                filterStates={filterStates}
                updateFilterState={updateFilterState}
                onApply={() => {
                    setShowFilterPanel(false);
                }}
                onReset={() => {
                    handleResetFilters();
                }}
                onClose={() => {
                    setShowFilterPanel(false);
                }}
            />
        </SafeAreaWrapper>
    );
};

export default AppointmentsScreen;
