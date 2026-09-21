import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonConfirmModal from '../../components/commons/CommonConfirmModal/CommonConfirmModal';
import CommonEmptyCard from '../../components/commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../components/commons/CommonErrorCard/CommonErrorCard';
import AppointmentCard from '../../components/Modules/Appointments/Cards/AppointmentCard';
import AppointmentStatsCard from '../../components/Modules/Appointments/Cards/AppointmentStatsCard';
import AppointmentFilterModal, {
  FilterStates,
} from '../../components/Modules/Appointments/Modals/AppointmentFilterModal';
import AppointmentInfoModal from '../../components/Modules/Appointments/Modals/AppointmentInfoModal';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import AppointmentSkeleton from '../../components/Skeletons/AppointmentSkeleton';
import { CircleXIcon, FilterIcon, SearchIcon } from '../../components/ui/icons';
import { useDebounce } from '../../hooks/commons/useDebounce';
import {
  useChangeAppointmentStatus,
  useMyAppointments,
  useMyAppointmentStats,
} from '../../hooks/react-query/appointments/appointments.hooks';
import { IMyApptQueryParams } from '../../hooks/react-query/appointments/payload.interafce';
import { MyAppointmentsQueryKeys } from '../../hooks/react-query/query.keys';
import Header from '../../Layout/Header';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { formatDate, formatDateToYYYYMMDD } from '../../lib/common/common.utils';
import { showUnderDevelopmentToast } from '../../lib/common/toast.utils';
import { AppRoute, type DoctorAppointmentsScreenProps } from '../../route';
import { doctorAppointmentsStyles as S } from '../../styled/DoctorAppointmentsScreen.styled';
import { theme } from '../../styled/theme.styled';
import { IMyAppointmentDoc } from '../../typescripts/interfaces/appointments.interfaces';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';

type TabType = 'both' | 'inperson' | 'video';

export const AppointmentsScreen: React.FC<DoctorAppointmentsScreenProps> = () => {
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
  const [selectedDetailsApt, setSelectedDetailsApt] = useState<IMyAppointmentDoc | null>(null);
  const [confirmCompleteAptId, setConfirmCompleteAptId] = useState<number | string | null>(null);

  const { showLoader, hideLoader } = useLoadingStore(state => state);

  const queryParams: IMyApptQueryParams = useMemo(() => {
    const params: IMyApptQueryParams = {
      limit: 10,
      page: 1,
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
    data: myAppointments,
    isPending: myAppointmentPending,
    isError: isMyAppointmentError,
    error: myAppointmentError,
    refetch: fetchMyAppointments,
  } = useMyAppointments(queryParams);

  const { data: apptStats, isFetching: apptStatsPending } = useMyAppointmentStats();

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
    setRefreshing(false);
  }, [fetchMyAppointments]);

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

  const handleCloseDetailsModal = useCallback(() => {
    setSelectedDetailsApt(null);
  }, []);

  const handleMarkCompleted = useCallback(
    (appointmentId: number | string) => {
      showLoader('Loading...');
      changeStatus(
        { appointmentId, appointment_status: 'completed' },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: [MyAppointmentsQueryKeys.MyAppointments],
            });
            hideLoader();
            setConfirmCompleteAptId(null);
          },
          onError: () => {
            hideLoader();
            setConfirmCompleteAptId(null);
          },
        }
      );
    },
    [changeStatus, queryClient, showLoader, hideLoader]
  );

  return (
    <SafeAreaWrapper showBottomBar={true} activeBottomTab="Schedule">
      <Header
        title="Manage Appointments"
        description="View and manage patient schedule"
        onNotificationPress={() => navigation.navigate(AppRoute.NOTIFICATIONS)}
      />

      <AppointmentStatsCard
        todayCount={apptStats?.today_count || 0}
        upcoming3hCount={apptStats?.upcoming_3h_count || 0}
        loading={apptStatsPending}
      />

      <View style={S.searchRow}>
        <View style={S.searchBox}>
          <SearchIcon size={18} color="#94A3B8" />
          <TextInput
            style={S.searchInput}
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
          style={[S.filterBtn, isCustomFilterApplied && { borderColor: theme.colors.primary }]}
          onPress={handleOpenFilterModal}
          activeOpacity={0.7}
        >
          <FilterIcon size={20} color={isCustomFilterApplied ? theme.colors.primary : '#64748B'} />
        </TouchableOpacity>
      </View>

      <View style={S.tabsContainer}>
        {(
          [
            { key: 'both', label: 'Both' },
            { key: 'inperson', label: 'In-person' },
            { key: 'video', label: 'Video' },
          ] as { key: TabType; label: string }[]
        ).map(t => (
          <TouchableOpacity
            key={t.key}
            style={[S.tab, activeTab === t.key && S.activeTab]}
            onPress={() => setActiveTab(t.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                S.tabText,
                {
                  color: activeTab === t.key ? '#FFFFFF' : '#374151',
                  fontWeight: activeTab === t.key ? '700' : '600',
                },
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={S.filterBanner}>
        <Text style={S.filterBannerTxt}>
          {isCustomFilterApplied
            ? `Filtered · ${myAppointments?.meta?.total} appointment${
                myAppointments?.meta?.total !== 1 ? 's' : ''
              }`
            : `Today · ${formatDate(new Date())}`}
        </Text>
        {isCustomFilterApplied && (
          <TouchableOpacity onPress={handleResetFilters} activeOpacity={0.7}>
            <Text style={S.filterBannerClear}>Clear</Text>
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
            message={
              (myAppointmentError as any)?.message ||
              'Something went wrong while fetching Appointments.'
            }
            onRetry={() => fetchMyAppointments()}
          />
        </ScrollView>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={myAppointments?.data || []}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={S.listContent}
          showsVerticalScrollIndicator={false}
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
                isJoinedOnce={false}
                callDurationSeconds={0}
                onViewDetails={() => setSelectedDetailsApt(item)}
                onVideoCall={() => {
                  showUnderDevelopmentToast();
                }}
                onComplete={() => setConfirmCompleteAptId(item.id)}
                onReschedule={() => {
                  showUnderDevelopmentToast();
                }}
                onStartConsultation={() => {
                  showUnderDevelopmentToast();
                }}
              />
            );
          }}
        />
      )}

      <AppointmentInfoModal
        visible={selectedDetailsApt !== null}
        appointment={selectedDetailsApt || null}
        onClose={handleCloseDetailsModal}
      />

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

      <CommonConfirmModal
        visible={confirmCompleteAptId !== null}
        title="Complete Appointment"
        message="Are you sure you want to mark this appointment as completed?"
        confirmText="Yes, Complete"
        cancelText="Cancel"
        type="info"
        onConfirm={() => {
          if (confirmCompleteAptId) {
            handleMarkCompleted(confirmCompleteAptId);
          }
        }}
        onCancel={() => setConfirmCompleteAptId(null)}
      />
    </SafeAreaWrapper>
  );
};

export default AppointmentsScreen;
