import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import CommonEmptyCard from '../../../../../components/commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../../../../components/commons/CommonErrorCard/CommonErrorCard';
import { queryClient } from '../../../../../components/providers/ReactQueryProvider';
import { ClockIcon } from '../../../../../components/ui/icons';
import { useChangeAppointmentStatus } from '../../../../../hooks/react-query/appointments/appointments.hooks';
import { useMyPatientInfiniteConsults } from '../../../../../hooks/react-query/patients/patients.hooks';
import { MyAppointmentsQueryKeys } from '../../../../../hooks/react-query/query.keys';
import { showInfoToast } from '../../../../../lib/commons/toast.utils';
import { AppRoute } from '../../../../../route';
import { consultTabStyles } from '../../../../../styled/ConsultTabPanel.styled';
import theme from '../../../../../styled/theme.styled';
import { useAlertStore } from '../../../../../zustand/stores/useAlertStore';
import { useLoadingStore } from '../../../../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../../../../zustand/stores/useMeetingStore';
import ConsultSkeleton from '../../Skeletons/ConsultSkeleton';
import ConsultCard from '../ConsultCard';
interface ConsultPageProps {
  patientId: number | string;
}

export const ConsultTabPanel: React.FC<ConsultPageProps> = ({ patientId }) => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { setInPersonAppointment } = useMeetingStore(state => state);
  const { showLoader, hideLoader } = useLoadingStore(state => state);
  const { showConfirm } = useAlertStore(state => state);

  const { mutate: changeStatus } = useChangeAppointmentStatus();
  const {
    data: consultsData,
    isFetching: consultPending,
    isError: consultError,
    refetch: consultRefetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyPatientInfiniteConsults({
    patientId: patientId,
    limit: 10,
    status: 'confirmed,in-progress,completed',
  });

  const consultsList = useMemo(() => {
    const pages = consultsData?.pages ?? [];
    return pages.flatMap(page => (Array.isArray(page?.data) ? page.data : []));
  }, [consultsData?.pages]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isRefreshingRef = useRef(false);
  const onRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setRefreshing(true);
    try {
      await consultRefetch();
    } finally {
      setRefreshing(false);
      isRefreshingRef.current = false;
    }
  }, [consultRefetch]);

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
          },
          onSettled: () => {
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
    <View style={consultTabStyles.container}>
      {consultPending && !refreshing ? (
        <ConsultSkeleton />
      ) : consultError ? (
        <CommonErrorCard
          title="Failed to Load Consults"
          message={'Something went wrong while fetching patient consults.'}
          onRetry={consultRefetch}
        />
      ) : (
        <FlatList
          data={consultsList}
          keyExtractor={(item, index) =>
            item?.id ? String(item.id) : (item?.appointment_id ? String(item.appointment_id) : String(index))
          }
          keyboardShouldPersistTaps='handled'
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
                onCompleted={() => {
                  showConfirm({
                    title: 'Complete Appointment',
                    message: 'Are you sure you want to mark this appointment as completed?',
                    buttonText: 'Yes, Complete',
                    cancelText: 'Cancel',
                    onConfirm: () => handleMarkCompleted(item.id),
                  });
                }}
                onVideoCall={() => {
                  showInfoToast('Video call feature is not yet implemented');
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
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : undefined
          }
          contentContainerStyle={consultTabStyles.listContent}
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
