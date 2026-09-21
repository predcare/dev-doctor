import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useMyPatientConsults } from '../../../../hooks/react-query/patients/patients.hooks';
import { showUnderDevelopmentToast } from '../../../../lib/common/toast.utils';
import { consultTabStyles as S } from '../../../../styled/ConsultTabPanel.styled';
import { theme } from '../../../../styled/theme.styled';
import CommonEmptyCard from '../../../commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../../commons/CommonErrorCard/CommonErrorCard';
import ConsultSkeleton from '../../../Skeletons/ConsultSkeleton';
import { ClockIcon } from '../../../ui/icons';
import ConsultCard from './ConsultCard';

interface ConsultPageProps {
  patientId: number | string;
}

export const ConsultTabPanel: React.FC<ConsultPageProps> = ({ patientId }) => {
  const [refreshing, setRefreshing] = useState(false);

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
                onCompleted={() => {
                  showUnderDevelopmentToast();
                }}
                onVideoCall={() => {
                  showUnderDevelopmentToast();
                }}
                onStartConsultation={() => {
                  showUnderDevelopmentToast();
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
    </View>
  );
};

export default ConsultTabPanel;
