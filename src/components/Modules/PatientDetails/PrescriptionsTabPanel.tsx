import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useMyPatientPrescriptions } from '../../../hooks/react-query/patients/patients.hooks';
import { AppRoute } from '../../../route';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';
import CommonEmptyCard from '../../commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../commons/CommonErrorCard/CommonErrorCard';
import MedicalRecordsSkeleton from '../../Skeletons/MedicalRecordsSkeleton';
import PrescriptionCard from './PrescriptionCard';

export interface PrescriptionsTabPanelProps {
  patientId: string | number;
}

export const PrescriptionsTabPanel: React.FC<PrescriptionsTabPanelProps> = ({ patientId }) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: prescriptionsData,
    isPending: isPrescriptionsPending,
    isError: isPrescriptionsError,
    error: prescriptionsError,
    refetch: refetchPrescriptions,
  } = useMyPatientPrescriptions({
    patientId: patientId,
  });

  const listData = useMemo(() => {
    if (Array.isArray(prescriptionsData)) {
      return prescriptionsData;
    }
    return [];
  }, [prescriptionsData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchPrescriptions();
    setRefreshing(false);
  }, [refetchPrescriptions]);

  const handleView = useCallback(
    (prescriptionId: string) => {
      (navigation as any).navigate(AppRoute.PRESCRIPTION_VIEW, {
        rxId: prescriptionId,
        patientId: patientId,
        fromScreen: AppRoute.PATIENT_DETAILS,
      });
    },
    [navigation, patientId]
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          patientDetailsStyles.subTabRow,
          { justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
        ]}
      >
        <Text
          style={[patientDetailsStyles.cardSectionTitle, { marginBottom: 0, paddingHorizontal: 0 }]}
        >
          Prescriptions
        </Text>
        <TouchableOpacity
          style={patientDetailsStyles.addDocBtn}
          activeOpacity={0.8}
          onPress={() => {
            (navigation as any).navigate(AppRoute.CREATE_PRESCRIPTION, {
              patientId: patientId,
              fromScreen: AppRoute.PATIENT_DETAILS,
            });
          }}
        >
          <Text style={patientDetailsStyles.addDocBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {isPrescriptionsPending && !refreshing ? (
        <View style={{ flex: 1 }}>
          <MedicalRecordsSkeleton />
        </View>
      ) : isPrescriptionsError ? (
        <View style={{ flex: 1 }}>
          <CommonErrorCard
            title="Failed to Load Prescriptions"
            message={
              (prescriptionsError as any)?.message ||
              'Something went wrong while fetching prescriptions.'
            }
            onRetry={refetchPrescriptions}
          />
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={item => String(item.id || item.prescription_id)}
          renderItem={({ item }) => {
            return (
              <PrescriptionCard
                id={item.id}
                prescriptionGenId={item.prescription_id}
                diagnosis={item.diagnosis}
                patient_name={item?.patient_name}
                created_at={item.created_at}
                status={item.status}
                visible_to_patient={item.visible_to_patient}
                onPress={() => handleView(item?.id)}
                isSent={Boolean(item?.email_sent_at)}
              />
            );
          }}
          ListEmptyComponent={
            <CommonEmptyCard
              title="No Prescriptions"
              message="No prescriptions available for this patient yet."
            />
          }
          contentContainerStyle={{ paddingBottom: 40 }}
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

export default PrescriptionsTabPanel;
