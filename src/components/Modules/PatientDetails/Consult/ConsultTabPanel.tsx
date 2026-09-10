import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import useDevicePermissions from '../../../../hooks/commons/useDevicePermissions';
import { getApptToken } from '../../../../hooks/react-query/appointments/appointments.func';
import { useChangeAppointmentStatus } from '../../../../hooks/react-query/appointments/appointments.hooks';
import { useMyPatientConsults } from '../../../../hooks/react-query/patients/patients.hooks';
import {
  MyAppointmentsQueryKeys,
  PatientsQueryKeys,
} from '../../../../hooks/react-query/query.keys';
import { showErrorToast, showInfoToast } from '../../../../lib/common/toast.utils';
import { AppRoute } from '../../../../route';
import { consultTabStyles as S } from '../../../../styled/ConsultTabPanel.styled';
import { theme } from '../../../../styled/theme.styled';
import { ConsultStatus } from '../../../../typescripts/enums';
import { IAppointmentDoc } from '../../../../typescripts/interfaces/appointments.interfaces';
import { useLoadingStore } from '../../../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../../../zustand/stores/useMeetingStore';
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
  const navigation = useNavigation();
  const { showLoader, hideLoader } = useLoadingStore(state => state);
  const { setInPersonAppointment, setMeetingSession } = useMeetingStore(state => state);
  const { requestAudioVideoPermissions } = useDevicePermissions();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: consults,
    isPending: consultPending,
    isError: consultError,
    error,
    refetch: consultRefetch,
  } = useMyPatientConsults({
    patientId: patientId,
  });
  const { mutate: changeStatus, isPending: changeStatusLoading } = useChangeAppointmentStatus();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await consultRefetch();
    setRefreshing(false);
  }, [consultRefetch]);

  const handleStartConsulation = useCallback(
    (
      appointmentId: number | string,
      patientId: number,
      patientName: string,
      status: string,
      id: string | number
    ) => {
      if (status?.toLowerCase() === ConsultStatus.CONFIRMED) {
        showLoader('Loading...');
        changeStatus(
          { appointmentId, appointment_status: ConsultStatus.IN_PROGRESS },
          {
            onSuccess: async () => {
              await queryClient.invalidateQueries({
                queryKey: [MyAppointmentsQueryKeys.MyAppointments],
              });
              await queryClient.invalidateQueries({
                queryKey: [PatientsQueryKeys.MyConsults],
              });
              setInPersonAppointment({
                apptIdforInPerson: String(appointmentId),
                patientIdforInPerson: String(patientId),
                patientNameforInPerson: String(patientName),
                statusforInPerson: String(status),
              });
              hideLoader();
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
    [changeStatus, queryClient, showLoader, hideLoader, navigation]
  );

  const handleMarkCompleted = useCallback(
    (appointmentId: number | string, id: string | number) => {
      showLoader('Loading...');
      changeStatus(
        { appointmentId, appointment_status: ConsultStatus.COMPLETED },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: [MyAppointmentsQueryKeys.MyAppointments],
            });
            await queryClient.invalidateQueries({
              queryKey: [PatientsQueryKeys.MyConsults],
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

  const handleJoinVideoCall = useCallback(
    async (appointment: IAppointmentDoc) => {
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

      navigation.navigate(AppRoute.DOCTOR_MEETING);
    },
    [navigation, queryClient, setMeetingSession, requestAudioVideoPermissions]
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
          data={consults || []}
          keyExtractor={item => String(item.appointment_id)}
          renderItem={({ item }) => {
            return (
              <ConsultCard
                appointmentDate={item.appointment_date}
                appointmentGeneratedId={item.appointment_id}
                appointmentStatus={item.appointment_status}
                appointmentType={item.consultation_type}
                patientName={item.patient_name}
                patientId={item.patient_alphanumeric_id}
                startTime={item.start_time}
                endTime={item.end_time}
                onCompleted={() => {
                  handleMarkCompleted(item.id, item.id);
                }}
                onVideoCall={() => handleJoinVideoCall(item)}
                onStartConsultation={() => {
                  handleStartConsulation(
                    item.appointment_id,
                    item.patient_id,
                    item.patient_name,
                    item.appointment_status,
                    item.id
                  );
                }}
                loading={changeStatusLoading}
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
    </View>
  );
};

export default ConsultTabPanel;
