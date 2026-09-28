import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CommonConfirmModal from '../../components/commons/CommonConfirmModal/CommonConfirmModal';
import CommonErrorCard from '../../components/commons/CommonErrorCard/CommonErrorCard';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import AppointmentDetailsSkeleton from '../../components/Skeletons/AppointmentDetailsSkeleton';
import {
  CalendarIcon,
  CheckIcon,
  ClinicIcon,
  ClockIcon,
  InfoCircleIcon,
  InvoiceIcon,
  PlayCircleIcon,
  ProfileIcon,
  VideoIcon,
} from '../../components/ui/icons';
import useDevicePermissions from '../../hooks/commons/useDevicePermissions';
import { getApptToken } from '../../hooks/react-query/appointments/appointments.func';
import {
  useChangeAppointmentStatus,
  useMyAppointmentInfo,
} from '../../hooks/react-query/appointments/appointments.hooks';
import { MyAppointmentsQueryKeys } from '../../hooks/react-query/query.keys';
import Header from '../../Layout/Header';
import SafeAreaWrapper from '../../Layout/SafeAreaWrapper';
import {
  _toTitleCase,
  capitalize,
  formatDate,
  formatTimeSlot,
} from '../../lib/common/common.utils';
import { showErrorToast, showInfoToast } from '../../lib/common/toast.utils';
import { canGoBack } from '../../navigation/navigationRef';
import { AppRoute } from '../../route';
import { appointmentDetailsStyles as styles } from '../../styled/AppointmentDetailsScreen.styled';
import { theme } from '../../styled/theme.styled';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../zustand/stores/useMeetingStore';

export const AppointmentDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const apptId = route.params?.appointmentId;
  const isComingFromNotification = route.params?.isComingFromNotification;
  const [refreshing, setRefreshing] = useState(false);
  const [confirmCompleteAptId, setConfirmCompleteAptId] = useState<number | string | null>(null);
  const { showLoader, hideLoader } = useLoadingStore(state => state);
  const { setMeetingSession, setInPersonAppointment } = useMeetingStore(state => state);
  const { requestAudioVideoPermissions } = useDevicePermissions();
  const { mutate: changeStatus } = useChangeAppointmentStatus();

  const {
    data: apptInfo,
    isFetching: apptInfoIsPending,
    isError: apptInfoIsError,
    refetch: refetchApptInfo,
  } = useMyAppointmentInfo({ id: apptId });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchApptInfo();
    setRefreshing(false);
  }, [refetchApptInfo]);

  const handleBack = useCallback(() => {
    if (isComingFromNotification || !canGoBack()) {
      navigation.reset({
        index: 0,
        routes: [{ name: AppRoute.HOME }],
      });
    } else {
      navigation.goBack();
    }
  }, [isComingFromNotification, navigation]);

  const handleJoinVideoCall = useCallback(
    async (appointment: any) => {
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
        navigation.navigate(AppRoute.DOCTOR_MEETING);
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

      const targetApptId = appointment.id;
      let token: string | undefined;
      let meetingId: string | undefined = appointment.meeting_id;
      let call_duration_seconds: number | undefined = appointment.call_duration_seconds;
      if (!targetApptId) {
        showErrorToast('No valid appointment ID found to fetch token');
        return;
      }

      const patientUserId =
        appointment?.patient?.user_id || appointment?.patient?.id || appointment?.patient_id;

      if (!patientUserId) {
        showErrorToast('No valid patient ID found to fetch token');
        return;
      }

      try {
        const tokenResponse = await queryClient.fetchQuery({
          queryKey: [MyAppointmentsQueryKeys.MyAppointments, 'token', targetApptId],
          queryFn: () => getApptToken(targetApptId),
        });
        token = tokenResponse?.data?.token || '';
        meetingId = tokenResponse?.data?.meeting_id || '';
      } catch (error) {
        console.error('Failed to fetch fresh appointment token:', error);
      }

      if (!token || !meetingId) {
        showErrorToast('Failed to fetch meeting credentials');
        return;
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
        appointmentId: targetApptId,
        patientName: appointment?.patient?.name || 'Patient',
        patientAlphanumericId: appointment?.patient?.patient_id || '',
        appointmentGeneratedId: appointment?.appointment_id,
        startTime: appointment?.start_time,
        endTime: appointment?.end_time,
        callDurationSeconds: call_duration_seconds ?? 0,
        patientUserId: String(patientUserId),
      });

      navigation.navigate(AppRoute.DOCTOR_MEETING);
    },
    [navigation, setMeetingSession, requestAudioVideoPermissions]
  );

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
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: [MyAppointmentsQueryKeys.MyAppointments],
              }),
              queryClient.invalidateQueries({
                queryKey: [MyAppointmentsQueryKeys.MyAppointmentsInfo],
              }),
            ]);
            hideLoader();
            setConfirmCompleteAptId(null);
            refetchApptInfo();
          },
          onError: () => {
            hideLoader();
            setConfirmCompleteAptId(null);
          },
        }
      );
    },
    [changeStatus, showLoader, hideLoader, refetchApptInfo]
  );

  const handleStartConsulation = useCallback(
    (
      appointmentId: number | string,
      patientId: number | string,
      patientName: string,
      status: string
    ) => {
      if (status?.toLowerCase() === 'confirmed') {
        showLoader('Loading...');
        changeStatus(
          { appointmentId, status: 'in_progress' },
          {
            onSuccess: async () => {
              await Promise.all([
                queryClient.invalidateQueries({
                  queryKey: [MyAppointmentsQueryKeys.MyAppointments],
                }),
                queryClient.invalidateQueries({
                  queryKey: [MyAppointmentsQueryKeys.MyAppointmentsInfo],
                }),
              ]);
              hideLoader();
              setConfirmCompleteAptId(null);
              setInPersonAppointment({
                apptIdforInPerson: String(appointmentId),
                patientIdforInPerson: String(patientId),
                patientNameforInPerson: String(patientName),
                statusforInPerson: String(status),
              });
              refetchApptInfo();
              navigation?.navigate(AppRoute.CREATE_PRESCRIPTION, {
                patientId: Number(patientId),
                patientName: patientName,
                appointmentId: appointmentId,
              });
            },
            onError: () => {
              hideLoader();
              setConfirmCompleteAptId(null);
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
          patientId: Number(patientId),
          patientName: patientName,
          appointmentId: appointmentId,
        });
      }
    },
    [changeStatus, showLoader, hideLoader, setInPersonAppointment, navigation, refetchApptInfo]
  );

  const paymentStatusConfig = useMemo(() => {
    const status = (apptInfo?.payment_status || 'PENDING').toUpperCase();
    if (status === 'PAID' || status === 'COMPLETED' || status === 'SUCCESS') {
      return { bg: theme.colors.successLight, text: theme.colors.success, label: 'Paid' };
    }
    if (status === 'REFUNDED') {
      return { bg: theme.colors.warningLight, text: theme.colors.warning, label: 'Refunded' };
    }
    return { bg: theme.colors.dangerSoft, text: theme.colors.danger, label: 'Pending' };
  }, [apptInfo?.payment_status]);

  const isOnline = apptInfo?.consultation_type === 'video';

  const status = (apptInfo?.appointment_status || '').toLowerCase();
  const isInProgress = status === 'in_progress' || status === 'in-progress';
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  const isConfirmed = status === 'confirmed';
  const isJoinedOnce = isInProgress;

  const meetingStoreState = useMeetingStore(state => state);
  const isCallActive =
    (meetingStoreState.callState === 'CONNECTED' || meetingStoreState.callState === 'CONNECTING') &&
    Boolean(meetingStoreState.token && meetingStoreState.meetingId);

  const isCurrentApptInCall =
    isCallActive &&
    (String(meetingStoreState.appointmentId) === String(apptInfo?.id) ||
      (Boolean(apptInfo?.appointment_id) &&
        meetingStoreState.appointmentGeneratedId === apptInfo?.appointment_id));

  return (
    <SafeAreaWrapper showBottomBar isPathClear>
      <Header
        title="Appointment Details"
        subtitle={
          apptInfo?.appointment_id ? `#${apptInfo.appointment_id}` : 'Consultation Overview'
        }
        isIconShow={false}
        onBackPress={handleBack}
      />

      {apptInfoIsPending && !apptInfo ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <AppointmentDetailsSkeleton />
        </ScrollView>
      ) : apptInfoIsError || !apptInfo ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
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
          <CommonErrorCard
            title="Appointment Not Found"
            message="Could not load appointment details. Please pull down to refresh or try again later."
            onRetry={refetchApptInfo}
          />
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
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
          <View style={styles.statusCard}>
            <View style={styles.statusTopRow}>
              <View style={styles.apptIdContainer}>
                <Text style={styles.apptIdLabel}>ID:</Text>
                <Text style={styles.apptIdValue}>
                  {apptInfo.appointment_id || `#${apptInfo.id}`}
                </Text>
              </View>

              <View style={[styles.statusBadge]}>
                <View style={[styles.statusDot]} />
                <Text style={[styles.statusBadgeText]}>
                  {_toTitleCase(apptInfo?.appointment_status)}
                </Text>
              </View>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoText}>
                Created on{' '}
                <Text style={styles.statusInfoBold}>
                  {formatDate(apptInfo.created_at || new Date(), 'DD MMM YYYY')}
                </Text>
              </Text>

              {apptInfo.appointment_type ? (
                <Text style={styles.statusInfoText}>
                  Type:{' '}
                  <Text style={styles.statusInfoBold}>{capitalize(apptInfo.appointment_type)}</Text>
                </Text>
              ) : null}
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <ProfileIcon size={18} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>Patient Details</Text>
              </View>
            </View>

            <View style={styles.patientInfoGrid}>
              <View style={styles.patientInfoRow}>
                <Text style={styles.patientInfoLabel}>Patient Name</Text>
                <Text style={styles.patientInfoVal}>{apptInfo?.patient?.name || 'N/A'}</Text>
              </View>

              {apptInfo?.patient?.patient_id ? (
                <View style={styles.patientInfoRow}>
                  <Text style={styles.patientInfoLabel}>Patient ID</Text>
                  <Text style={styles.patientInfoVal}>{apptInfo?.patient?.patient_id}</Text>
                </View>
              ) : null}

              {apptInfo?.patient?.gender || apptInfo?.patient?.date_of_birth ? (
                <View style={styles.patientInfoRow}>
                  <Text style={styles.patientInfoLabel}>Gender & Age</Text>
                  <Text style={styles.patientInfoVal}>
                    {capitalize(apptInfo?.patient?.gender || '')}
                    {apptInfo?.patient?.date_of_birth
                      ? ` (${formatDate(apptInfo.patient.date_of_birth, 'DD MMM YYYY')})`
                      : ''}
                  </Text>
                </View>
              ) : null}

              {apptInfo?.patient?.phone_number ? (
                <View style={styles.patientInfoRow}>
                  <Text style={styles.patientInfoLabel}>Phone Number</Text>
                  <Text style={styles.patientInfoVal}>{apptInfo?.patient?.phone_number}</Text>
                </View>
              ) : null}

              {apptInfo?.patient?.email ? (
                <View style={[styles.patientInfoRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.patientInfoLabel}>Email</Text>
                  <Text style={styles.patientInfoVal}>{apptInfo?.patient?.email}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* 3. Schedule & Consultation Mode */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <CalendarIcon size={18} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>Date & Time</Text>
              </View>
            </View>

            <View style={styles.gridContainer}>
              <View style={styles.detailRow}>
                <View style={styles.detailIconWrap}>
                  <CalendarIcon size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Appointment Date</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(apptInfo.appointment_date, 'dddd, DD MMMM YYYY')}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIconWrap}>
                  <ClockIcon size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Slot Timing</Text>
                  <Text style={styles.detailValue}>
                    {apptInfo.start_time
                      ? formatTimeSlot(apptInfo.start_time, apptInfo.end_time)
                      : 'Time not specified'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                {isOnline ? (
                  <VideoIcon size={18} color={theme.colors.primary} />
                ) : (
                  <ClinicIcon size={18} color={theme.colors.primary} />
                )}
                <Text style={styles.cardTitle}>Consultation Mode</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIconWrap}>
                {isOnline ? (
                  <VideoIcon size={20} color={theme.colors.primary} />
                ) : (
                  <ClinicIcon size={20} color={theme.colors.primary} />
                )}
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Mode</Text>
                <Text style={styles.detailValue}>{isOnline ? 'Video' : 'In-Person'}</Text>
                <Text style={styles.detailSubValue}>
                  {isOnline
                    ? 'Consultation conducted securely through high-definition video.'
                    : 'Physical consultation conducted at the registered clinic premises.'}
                </Text>
              </View>
            </View>
          </View>
          {apptInfo.reason ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <InfoCircleIcon size={18} color={theme.colors.primary} />
                  <Text style={styles.cardTitle}>Clinical Notes & Reason</Text>
                </View>
              </View>

              <View style={{ gap: 12 }}>
                {apptInfo.reason ? (
                  <View>
                    <Text style={styles.detailLabel}>Reason for Consultation</Text>
                    <Text style={[styles.detailValue, { marginTop: 4, fontWeight: '500' }]}>
                      {typeof apptInfo.reason === 'string'
                        ? apptInfo.reason
                        : JSON.stringify(apptInfo.reason)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <InvoiceIcon size={18} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>Payment Summary</Text>
              </View>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Consultation Fee</Text>
              <Text style={styles.billValue}>
                ₹{Number(apptInfo.appointment_fee || 0).toFixed(2)}
              </Text>
            </View>

            {apptInfo.fee_type ? (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Fee Type</Text>
                <Text style={styles.billValue}>
                  {apptInfo.fee_type.replace(/_/g, ' ').toUpperCase()}
                </Text>
              </View>
            ) : null}

            <View style={styles.billTotalRow}>
              <Text style={styles.billTotalLabel}>Total Amount</Text>
              <Text style={styles.billTotalValue}>
                ₹{Number(apptInfo.appointment_fee || 0).toFixed(2)}
              </Text>
            </View>

            <View style={styles.paymentBadgeRow}>
              <View>
                <Text style={styles.paymentBadgeLabel}>
                  Payment Mode: {capitalize(apptInfo.payment_type || 'N/A')}
                </Text>
              </View>

              <View
                style={[styles.paymentStatusBadge, { backgroundColor: paymentStatusConfig.bg }]}
              >
                <Text style={[styles.paymentStatusText, { color: paymentStatusConfig.text }]}>
                  {paymentStatusConfig.label}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.cardFooterActions}>
            <View style={[styles.actionRow, !isInProgress && { flexDirection: 'column' }]}>
              {isConfirmed && (
                <TouchableOpacity
                  style={[
                    styles.joinButton,
                    isCurrentApptInCall && { backgroundColor: theme.colors.primary },
                    isJoinedOnce && { backgroundColor: theme.colors.primaryDark },
                  ]}
                  onPress={() =>
                    isOnline || isCurrentApptInCall
                      ? handleJoinVideoCall(apptInfo)
                      : handleStartConsulation(
                          apptInfo.id,
                          apptInfo.patient?.patient_id || apptInfo.patient_id,
                          apptInfo.patient?.name || '',
                          apptInfo.appointment_status
                        )
                  }
                  activeOpacity={0.85}
                >
                  <PlayCircleIcon size={20} color="#FFFFFF" />
                  <Text style={styles.joinButtonText}>
                    {isCurrentApptInCall
                      ? 'Already in Call'
                      : isJoinedOnce
                      ? 'Re-join Call'
                      : isOnline
                      ? 'Join Call'
                      : 'Start Consultation'}
                  </Text>
                </TouchableOpacity>
              )}

              {isInProgress && (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => setConfirmCompleteAptId(apptInfo.id)}
                    activeOpacity={0.85}
                  >
                    <CheckIcon size={18} color="#FFFFFF" />
                    <Text style={styles.joinButtonText}>Completed</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {isCurrentApptInCall && (
              <Text style={styles.activeCallNotice}>
                Reschedule & Cancel unavailable while call is active.
              </Text>
            )}
          </View>
        </ScrollView>
      )}
      <CommonConfirmModal
        visible={confirmCompleteAptId !== null}
        title="Complete Appointment"
        message="Are you sure you want to mark this consultation as completed?"
        confirmText="Mark Completed"
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

export default AppointmentDetailsScreen;
