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
import { getApptToken } from '../../hooks/react-query/appointments/appointments.func';
import {
  useChangeAppointmentStatus,
  useMyAppointments,
} from '../../hooks/react-query/appointments/appointments.hooks';
import { MyAppointmentsQueryKeys } from '../../hooks/react-query/query.keys';
import Header from '../../Layout/Header';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import {
  checkIsExpired,
  formatDateToYYYYMMDD,
  formatTodayBannerDate,
} from '../../lib/common/common.utils';
import { showErrorToast } from '../../lib/common/toast.utils';
import { MockAppointment } from '../../resources/mockData';
import type { DoctorAppointmentsScreenProps } from '../../route';
import { doctorAppointmentsStyles as S } from '../../styled/DoctorAppointmentsScreen.styled';
import { theme } from '../../styled/theme.styled';
import { IAppointmentDoc } from '../../typescripts/interfaces/appointments.interfaces';
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../zustand/stores/useMeetingStore';

type TabType = 'both' | 'inperson' | 'video';

export const AppointmentsScreen: React.FC<DoctorAppointmentsScreenProps> = ({ navigation }) => {
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
  });

  const [selectedDetailsApt, setSelectedDetailsApt] = useState<MockAppointment | null>(null);
  const [confirmCompleteAptId, setConfirmCompleteAptId] = useState<number | string | null>(null);

  const isCustomFilterApplied = useMemo(() => {
    const isDefaultDate = filterStates.dateRange === 'today';
    const isDefaultStatus =
      filterStates.statuses.length === 1 && filterStates.statuses[0] === 'upcoming';
    const noCustomDates = filterStates.fromDate === null && filterStates.toDate === null;
    const noSearch = searchQuery.trim().length === 0;
    const noTab = activeTab === 'both';

    return !(isDefaultDate && isDefaultStatus && noCustomDates && noSearch && noTab);
  }, [filterStates, searchQuery, activeTab]);

  const { userData } = useAuthStore(state => state);
  const { showLoader, hideLoader } = useLoadingStore(state => state);
  const { setMeetingSession } = useMeetingStore(state => state);

  const {
    data: myAppointments,
    isPending: myAppointmentPending,
    isError: isMyAppointmentError,
    error: myAppointmentError,
    refetch: fetchMyAppointments,
  } = useMyAppointments({
    doctorId: userData?.user_id,
  });

  const { mutate: changeStatus } = useChangeAppointmentStatus();

  const { stats, filteredAppointments } = useMemo(() => {
    const appointmentsList: IAppointmentDoc[] = myAppointments || [];
    const now = new Date();
    const todayStr = formatDateToYYYYMMDD(now);

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = formatDateToYYYYMMDD(tomorrow);

    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    const weekEndStr = formatDateToYYYYMMDD(weekEnd);

    // 1. Calculate Stats
    let todayCount = 0;
    let upcoming3hCount = 0;

    const currentMs = now.getTime();
    const threeHoursLaterMs = currentMs + 3 * 60 * 60 * 1000;

    appointmentsList.forEach(apt => {
      if (apt.appointment_date === todayStr) {
        if (apt.appointment_status?.toLowerCase() !== 'cancelled') {
          todayCount++;
        }

        if (
          apt.start_time &&
          apt.appointment_status?.toLowerCase() !== 'cancelled' &&
          apt.appointment_status?.toLowerCase() !== 'completed'
        ) {
          const [h, m, s] = apt.start_time.split(':').map(Number);
          const aptStartTime = new Date(now);
          aptStartTime.setHours(h || 0, m || 0, s || 0, 0);
          const aptStartMs = aptStartTime.getTime();

          if (aptStartMs >= currentMs && aptStartMs <= threeHoursLaterMs) {
            upcoming3hCount++;
          }
        }
      }
    });

    // 2. Filter Appointments
    const query = searchQuery.trim().toLowerCase();

    const filtered = appointmentsList.filter(apt => {
      // Consultation Type Tab Filter
      if (activeTab === 'inperson' && apt.consultation_type?.toLowerCase() !== 'in-person') {
        return false;
      }
      if (activeTab === 'video' && apt.consultation_type?.toLowerCase() !== 'video') {
        return false;
      }

      // Search Query Filter
      if (query) {
        const matchName = apt.patient_name?.toLowerCase().includes(query);
        const matchPtId = apt.patient_alphanumeric_id?.toLowerCase().includes(query);
        const matchAptId = apt.appointment_id?.toLowerCase().includes(query);
        const matchPhone = apt.patient_phone?.toLowerCase().includes(query);
        if (!matchName && !matchPtId && !matchAptId && !matchPhone) {
          return false;
        }
      }

      // Date Range Filter
      if (filterStates.dateRange === 'today') {
        if (apt.appointment_date !== todayStr) return false;
      } else if (filterStates.dateRange === 'tomorrow') {
        if (apt.appointment_date !== tomorrowStr) return false;
      } else if (filterStates.dateRange === 'thisweek') {
        if (apt.appointment_date < todayStr || apt.appointment_date > weekEndStr) return false;
      } else if (filterStates.dateRange === 'all') {
        if (filterStates.fromDate) {
          const fromStr = formatDateToYYYYMMDD(filterStates.fromDate);
          if (apt.appointment_date < fromStr) return false;
        }
        if (filterStates.toDate) {
          const toStr = formatDateToYYYYMMDD(filterStates.toDate);
          if (apt.appointment_date > toStr) return false;
        }
      }

      // Status Filter
      if (filterStates.statuses.length > 0) {
        const statusMatch = filterStates.statuses.some(st => {
          const isExpired = checkIsExpired(apt.appointment_date, apt.end_time, apt.start_time);
          const rawAptStatus = apt.appointment_status?.toLowerCase();
          const effectiveAptStatus =
            isExpired && rawAptStatus !== 'cancelled' ? 'completed' : rawAptStatus;
          const payStatus = apt.payment_status?.toLowerCase();

          if (st === 'upcoming')
            return (
              !isExpired &&
              (effectiveAptStatus === 'confirmed' || effectiveAptStatus === 'upcoming')
            );
          if (st === 'completed') return effectiveAptStatus === 'completed';
          if (st === 'cancelled') return rawAptStatus === 'cancelled';
          if (st === 'pending')
            return (
              payStatus === 'pending' ||
              effectiveAptStatus === 'in_progress' ||
              effectiveAptStatus === 'pending'
            );
          if (st === 'noshow')
            return effectiveAptStatus === 'noshow' || effectiveAptStatus === 'no_show';
          return false;
        });
        if (!statusMatch) return false;
      }

      return true;
    });

    return {
      stats: { todayCount, upcoming3hCount },
      filteredAppointments: filtered,
    };
  }, [myAppointments, activeTab, searchQuery, filterStates]);

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

  const handleJoinVideoCall = useCallback(
    async (appointment: IAppointmentDoc) => {
      if (!appointment) return;
      const apptId = appointment.id;
      let token: string | undefined;
      let meetingId: string | undefined = appointment.meeting_id;
      let call_duration_seconds: number | undefined = appointment.call_duration_seconds;
      if (!apptId) {
        showErrorToast('No valid appointment ID found to fetch token');
        return;
      }

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

      // Fallback to appointment cached credentials if fetch returned empty
      if (!token && appointment.token) {
        token = appointment.token;
        call_duration_seconds = appointment.call_duration_seconds;
      }

      // Sanitize token & meetingId strings
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
      });

      navigation?.navigate('DoctorMeeting');
    },
    [navigation, queryClient, setMeetingSession]
  );

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
    <SafeAreaWrapper>
      <Header
        title="Manage Appointments"
        description="View and manage patient schedule"
        unreadCount={3}
        onNotificationPress={() => navigation?.navigate('Notifications')}
      />

      <AppointmentStatsCard todayCount={stats.todayCount} upcoming3hCount={stats.upcoming3hCount} />

      <View style={S.searchRow}>
        <View style={S.searchBox}>
          <SearchIcon size={18} color="#94A3B8" />
          <TextInput
            style={S.searchInput}
            placeholder="Search patient name, ID or phone..."
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

      {isCustomFilterApplied ? (
        <View style={S.filterBanner}>
          <Text style={S.filterBannerTxt}>
            Filtered · {filteredAppointments.length} appointment
            {filteredAppointments.length !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={handleResetFilters}>
            <Text style={S.filterBannerClear}>Clear</Text>
          </TouchableOpacity>
        </View>
      ) : filteredAppointments?.length > 0 ? (
        <View style={S.filterBanner}>
          <Text style={S.filterBannerTxt}>Today · {formatTodayBannerDate(new Date())}</Text>
          <Text style={S.filterBannerCountTxt}>
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
          </Text>
        </View>
      ) : null}

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
            onRetry={handleOpenFilterModal}
          />
        </ScrollView>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={filteredAppointments}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={S.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <CommonEmptyCard
              title={'No Appointments Found'}
              message={'No appointments match your search or filter criteria.'}
              actionText={isCustomFilterApplied ? 'Clear Filters' : undefined}
              onAction={isCustomFilterApplied ? handleResetFilters : undefined}
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
            const isExpired = checkIsExpired(item.appointment_date, item.end_time, item.start_time);
            return (
              <AppointmentCard
                appointmentGeneratedId={item.appointment_id}
                appointmentId={item.id}
                patientName={item.patient_name}
                appointmentStatus={item.appointment_status}
                appointment_date={item.appointment_date}
                consultation_type={item.consultation_type}
                startTime={item.start_time}
                endTime={item.end_time}
                isExpired={isExpired}
                onViewDetails={() => setSelectedDetailsApt(item as any)}
                onStartConsultation={() => handleJoinVideoCall(item)}
                onComplete={() => setConfirmCompleteAptId(item.id)}
              />
            );
          }}
        />
      )}

      <AppointmentInfoModal
        visible={selectedDetailsApt !== null}
        appointment={selectedDetailsApt}
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
          handleResetFilters();
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
