import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CommonErrorCard from '../../components/commons/CommonErrorCard/CommonErrorCard';
import ConsultTabPanel from '../../components/Modules/PatientDetails/Consult/ConsultTabPanel';
import PatientInvoiceTabPanel from '../../components/Modules/PatientDetails/Invoice/PatientInvoiceTabPanel';
import PatientHeaderCard from '../../components/Modules/PatientDetails/PatientHeaderCard';
import PatientTabBar, {
  MainTabKey,
  TabItem,
} from '../../components/Modules/PatientDetails/PatientTabBar';
import PrescriptionsTabPanel from '../../components/Modules/PatientDetails/PrescriptionsTabPanel';
import PatientProfileTabPanel from '../../components/Modules/PatientDetails/Profile/PatientProfileTabPanel';
import RecordsTabPanel from '../../components/Modules/PatientDetails/RecordsTabPanel';
import PatientDetailsSkeleton from '../../components/Skeletons/PatientDetailsSkeleton';
import ChevronLeftIcon from '../../components/ui/icons/ChevronLeftIcon';
import { useMyPatientInfo } from '../../hooks/react-query/patients/patients.hooks';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { getAge } from '../../lib/common/common.utils';
import type { PatientDetailsScreenProps } from '../../route';
import { patientDetailsStyles } from '../../styled/PatientDetailsScreen.styled';
import { theme } from '../../styled/theme.styled';

const PatientMainTabs: TabItem[] = [
  { key: 'records', label: 'Records' },
  { key: 'prescriptions', label: 'Prescriptions' },
  { key: 'consultation', label: 'Consult' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'profile', label: 'Profile' },
];

interface PageProps {
  patientId: string;
  patientName: string;
}

export const PatientDetailsScreen: React.FC<PatientDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { patientId, patientName } = route?.params as PageProps;
  const [activeMainTab, setActiveMainTab] = useState<MainTabKey>('records');

  // Static Patient Mock Data
  const patient = {
    name: 'Eleanor Vance',
    patientId: 'PAT-1092',
    gender: 'Female',
    age: '34 yrs',
    bloodGroup: 'O+',
    avatarBgColor: theme.colors.primary,
  };
  const {
    data: patientInfo,
    isFetching: patientInfoPending,
    isError: isPatientInfoError,
    error: patientInfoError,
    refetch: refetchPatientInfo,
  } = useMyPatientInfo({
    patientId: patientId,
  });

  const displayName = useMemo(() => {
    return patientInfo?.name || patientName;
  }, [patientInfo?.name, patientName]);

  return (
    <SafeAreaWrapper>
      <View style={patientDetailsStyles.topBar}>
        <TouchableOpacity
          style={patientDetailsStyles.backCircle}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.8}
        >
          <ChevronLeftIcon size={20} color={theme.colors.textInverted} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={patientDetailsStyles.topBarTitleContainer}>
          <Text style={patientDetailsStyles.topBarTitle} numberOfLines={1}>
            {displayName || 'Patient Details'}
          </Text>
          {!!displayName && (
            <Text style={patientDetailsStyles.topBarSubTitle}>Patient Details</Text>
          )}
        </View>
      </View>

      {patientInfoPending ? (
        <PatientDetailsSkeleton />
      ) : isPatientInfoError ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 40, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <CommonErrorCard
            title="Failed to Load Patient Details"
            message={
              (patientInfoError as any)?.message ||
              'Something went wrong while fetching patient records.'
            }
            onRetry={refetchPatientInfo}
          />
        </ScrollView>
      ) : (
        <>
          <PatientHeaderCard
            name={patientInfo?.name || 'UnKnown'}
            patientId={patientInfo?.patient_id || ''}
            gender={patientInfo?.gender || ''}
            age={getAge(patientInfo?.date_of_birth || '') || ''}
            bloodGroup={patientInfo?.blood_type || ''}
            profileImg={patientInfo?.profile_image}
          />
          <PatientTabBar
            tabs={PatientMainTabs}
            activeTab={activeMainTab}
            onTabPress={setActiveMainTab}
          />
          <View style={{ flex: 1 }}>
            {activeMainTab === 'records' && <RecordsTabPanel patientId={patientId} />}

            {activeMainTab === 'prescriptions' && <PrescriptionsTabPanel patientId={patientId} />}
            {activeMainTab === 'invoice' && (
              <PatientInvoiceTabPanel
                patientId={patientId}
                patientGeneratedId={patientInfo?.patient_id || ''}
              />
            )}

            {activeMainTab === 'profile' && <PatientProfileTabPanel patientInfo={patientInfo} />}
            {activeMainTab === 'consultation' && (
              <ConsultTabPanel
                onCompletePrescription={completedRx => {
                  const newRxId = `RX-${Date.now().toString().slice(-4)}`;
                  navigation?.navigate('PrescriptionView', {
                    rxId: newRxId,
                    patientName: patient.name,
                    patientId: patient.patientId,
                  });
                }}
              />
            )}
          </View>
        </>
      )}
    </SafeAreaWrapper>
  );
};

export default PatientDetailsScreen;
