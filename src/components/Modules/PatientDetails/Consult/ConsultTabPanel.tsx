import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useChangeAppointmentStatus } from '../../../../hooks/react-query/appointments/appointments.hooks';
import { useMyPatientConsults } from '../../../../hooks/react-query/patients/patients.hooks';
import { MyAppointmentsQueryKeys } from '../../../../hooks/react-query/query.keys';
import { AppRoute } from '../../../../route';
import { consultTabStyles as S } from '../../../../styled/ConsultTabPanel.styled';
import { theme } from '../../../../styled/theme.styled';
import { ConsultStatus } from '../../../../typescripts/enums';
import { useLoadingStore } from '../../../../zustand/stores/useLoadingStore';
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await consultRefetch();
    setRefreshing(false);
  }, [consultRefetch]);

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
          keyExtractor={item => String(item.id)}
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
                onVideoCall={() => {}}
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
