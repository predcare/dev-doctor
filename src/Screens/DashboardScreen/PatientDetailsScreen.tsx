import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CommonErrorCard from '../../components/commons/CommonErrorCard/CommonErrorCard';
import ConsultTabPanel from '../../components/Modules/PatientDetails/Consult/ConsultTabPanel';
import PatientInvoiceTabPanel from '../../components/Modules/PatientDetails/Invoice/PatientInvoiceTabPanel';
import { MedicalDocument } from '../../components/Modules/PatientDetails/MedicalDocumentCard';
import PatientHeaderCard from '../../components/Modules/PatientDetails/PatientHeaderCard';
import PatientTabBar, {
  MainTabKey,
  TabItem,
} from '../../components/Modules/PatientDetails/PatientTabBar';
import { PrescriptionItem } from '../../components/Modules/PatientDetails/PrescriptionCard';
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

  // Static Medical Documents Mock Data
  const [documents, setDocuments] = useState<MedicalDocument[]>([
    {
      id: 'doc1',
      title: 'Complete Blood Count (CBC) Report',
      document_type: 'Lab Report',
      document_path: 'sample_cbc.pdf',
      visible_to_patient: true,
      appointment_date: '12 Aug 2026',
      isDoctorUploaded: true,
    },
    {
      id: 'doc2',
      title: 'Chest X-Ray & Radiology Scan',
      document_type: 'Scan / X-Ray',
      document_path: 'chest_xray.png',
      visible_to_patient: false,
      appointment_date: '10 Aug 2026',
      isDoctorUploaded: true,
    },
    {
      id: 'doc3',
      title: 'Prior Hospital Discharge Summary',
      document_type: 'Discharge Summary',
      document_path: 'discharge.pdf',
      visible_to_patient: true,
      appointment_date: '04 Jul 2026',
      isDoctorUploaded: false,
    },
  ]);

  // Static Prescriptions Mock Data
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'rx1',
      diagnosis: 'Atypical Chest tightness & Fatigue',
      doctor_name: 'Sarah Jenkins',
      doctor_specialization: 'Cardiologist',
      consultation_date: '12 Aug 2026',
      status: 'completed',
      visible_to_patient: true,
    },
    {
      id: 'rx2',
      diagnosis: 'Essential Hypertension & Tachycardia',
      doctor_name: 'Sarah Jenkins',
      doctor_specialization: 'Cardiologist',
      consultation_date: '01 Aug 2026',
      status: 'completed',
      visible_to_patient: true,
    },
    {
      id: 'rx3',
      diagnosis: 'Acute Upper Respiratory Infection',
      doctor_name: 'Sarah Jenkins',
      doctor_specialization: 'Cardiologist',
      consultation_date: '15 Jul 2026',
      status: 'draft',
      visible_to_patient: false,
    },
  ]);

  const displayName = useMemo(() => {
    return patientInfo?.name || patientName;
  }, [patientInfo?.name, patientName]);

  // Toggle handlers for patient visibility switches
  const handleToggleDocShare = (docId: string, newShareState: boolean) => {
    setDocuments(prev =>
      prev.map(d => (d.id === docId ? { ...d, visible_to_patient: newShareState } : d))
    );
  };

  const handleToggleRxShare = (rxId: string, newShareState: boolean) => {
    setPrescriptions(prev =>
      prev.map(p => (p.id === rxId ? { ...p, visible_to_patient: newShareState } : p))
    );
  };

  const handleAddDocumentSuccess = (newDoc: { title: string; type: string }) => {
    const created: MedicalDocument = {
      id: `doc_${Date.now()}`,
      title: newDoc.title,
      document_type: newDoc.type,
      document_path: 'uploaded_doc.pdf',
      visible_to_patient: true,
      appointment_date: 'Today',
      isDoctorUploaded: true,
    };
    setDocuments(prev => [created, ...prev]);
  };

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
            {activeMainTab === 'records' && (
              <RecordsTabPanel
                documents={documents}
                prescriptions={prescriptions}
                onToggleDocShare={handleToggleDocShare}
                onToggleRxShare={handleToggleRxShare}
                onAddDocumentSuccess={handleAddDocumentSuccess}
                onPrescriptionPress={rx =>
                  navigation?.navigate('PrescriptionView', {
                    rxId: rx.id,
                    patientName: patient.name,
                    patientId: patient.patientId,
                  })
                }
              />
            )}

            {activeMainTab === 'consultation' && (
              <ConsultTabPanel
                onCompletePrescription={completedRx => {
                  const newRxId = `RX-${Date.now().toString().slice(-4)}`;
                  const newRxItem: PrescriptionItem = {
                    id: newRxId,
                    diagnosis: completedRx.diagnosis || 'Cardiovascular Follow-up',
                    doctor_name: 'Sarah Jenkins',
                    doctor_specialization: 'Cardiologist',
                    consultation_date: 'Today',
                    status: 'completed',
                    visible_to_patient: true,
                  };
                  setPrescriptions(prev => [newRxItem, ...prev]);
                  navigation?.navigate('PrescriptionView', {
                    rxId: newRxId,
                    patientName: patient.name,
                    patientId: patient.patientId,
                  });
                }}
              />
            )}

            {activeMainTab === 'invoice' && (
              <PatientInvoiceTabPanel
                patientId={patientId}
                patientGeneratedId={patientInfo?.patient_id || ''}
              />
            )}

            {activeMainTab === 'profile' && <PatientProfileTabPanel patientInfo={patientInfo} />}
          </View>
        </>
      )}
    </SafeAreaWrapper>
  );
};

export default PatientDetailsScreen;
