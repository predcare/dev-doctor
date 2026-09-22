import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import useDevicePermissions from '../../../../hooks/commons/useDevicePermissions';
import { getApptToken } from '../../../../hooks/react-query/appointments/appointments.func';
import { useChangeAppointmentStatus } from '../../../../hooks/react-query/appointments/appointments.hooks';
import { useMyPatientConsults } from '../../../../hooks/react-query/patients/patients.hooks';
import { MyAppointmentsQueryKeys } from '../../../../hooks/react-query/query.keys';
import { showErrorToast, showInfoToast } from '../../../../lib/common/toast.utils';
import { AppRoute } from '../../../../route';
import { consultTabStyles as S } from '../../../../styled/ConsultTabPanel.styled';
import { theme } from '../../../../styled/theme.styled';
import { IMyAppointmentDoc } from '../../../../typescripts/interfaces/appointments.interfaces';
import { useLoadingStore } from '../../../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../../../zustand/stores/useMeetingStore';
import CommonConfirmModal from '../../../commons/CommonConfirmModal/CommonConfirmModal';
import CommonEmptyCard from '../../../commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../../commons/CommonErrorCard/CommonErrorCard';
import { queryClient } from '../../../providers/ReactQueryProvider';
import ConsultSkeleton from '../../../Skeletons/ConsultSkeleton';
import { ClockIcon } from '../../../ui/icons';
import ConsultCard from './ConsultCard';

interface ConsultPageProps {
  patientId: number | string;
}

export const ConsultTabPanel: React.FC<ConsultPageProps> = ({ patientId }) => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [confirmCompleteAptId, setConfirmCompleteAptId] = useState<number | string | null>(null);

  const { setMeetingSession, setInPersonAppointment } = useMeetingStore(state => state);
  const { showLoader, hideLoader } = useLoadingStore(state => state);
  const { requestAudioVideoPermissions } = useDevicePermissions();

  const { mutate: changeStatus } = useChangeAppointmentStatus();
  const {
    data: consults,
    isFetching: consultPending,
    isError: consultError,
    error,
    refetch: consultRefetch,
  } = useMyPatientConsults({
    patientId: patientId,
    limit: 100,
    page: 1,
    status: 'confirmed,in-progress,completed',
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await consultRefetch();
    setRefreshing(false);
  }, [consultRefetch]);

  const handleJoinVideoCall = useCallback(
    async (appointment: IMyAppointmentDoc) => {
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
          queryKey: [MyAppointmentsQueryKeys.GET_TOKEN, 'token', apptId],
          queryFn: () => getApptToken(apptId),
        });
        token = tokenResponse?.data?.token || '';
        meetingId = tokenResponse?.data?.meeting_id || '';
      } catch (error) {
        console.error('Failed to fetch fresh appointment token:', error);
      }

      if (!token || !meetingId) {
        return showErrorToast('Failed to fetch meeting credentials');
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
        patientName: appointment.patientInfo?.name,
        patientAlphanumericId: appointment.patientInfo?.patientId,
        appointmentGeneratedId: appointment.appointment_id,
        startTime: appointment.start_time,
        endTime: appointment.end_time,
        callDurationSeconds: call_duration_seconds ?? 0,
        patientUserId: String(appointment?.patient_id),
      });

      navigation.navigate(AppRoute.DOCTOR_MEETING);
    },
    [navigation, queryClient, setMeetingSession, requestAudioVideoPermissions]
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
            await queryClient.invalidateQueries({
              queryKey: [MyAppointmentsQueryKeys.MyAppointments],
            });
            await consultRefetch();
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
              setConfirmCompleteAptId(null);
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
          patientId: patientId,
          patientName: patientName,
        });
      }
    },
    [changeStatus, queryClient, showLoader, hideLoader]
  );

  return (
    <View style={S.container}>
      {consultPending && !refreshing ? (
        <ConsultSkeleton />
      ) : consultError ? (
        <CommonErrorCard
          title="Failed to Load Consults"
          message={error?.message || 'Something went wrong while fetching patient consults.'}
          onRetry={consultRefetch}
        />
      ) : (
        <FlatList
          data={consults?.data || []}
          keyExtractor={item => String(item.appointment_id)}
          renderItem={({ item }) => {
            console.log('item', item);
            return (
              <ConsultCard
                appointmentDate={item.appointment_date}
                appointmentGeneratedId={item.appointment_id}
                appointmentStatus={item.appointment_status}
                appointmentType={item.consultation_type}
                patientName={item.patientInfo?.name}
                patientId={item?.patientInfo?.patientId || ''}
                startTime={item.start_time}
                endTime={item.end_time}
                onCompleted={() => setConfirmCompleteAptId(item.id)}
                onVideoCall={() => {
                  handleJoinVideoCall(item);
                }}
                isJoinedOnce={
                  item?.appointment_status === 'in_progress' ||
                  item?.appointment_status === 'in-progress'
                }
                onStartConsultation={() => {
                  handleStartConsulation(
                    item.id,
                    Number(item.patientInfo?.patientId),
                    item.patientInfo?.name || '',
                    item.appointment_status
                  );
                }}
                loading={consultPending}
              />
            );
          }}
          ListEmptyComponent={
            <CommonEmptyCard
              actionText="Reload Consults"
              message="No Consultation History Found"
              title="No Consultations"
              onAction={() => {
                consultRefetch();
              }}
              icon={<ClockIcon size={40} color={theme.colors.textSlate} />}
            />
          }
          contentContainerStyle={S.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
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
    </View>
  );
};

export default ConsultTabPanel;
