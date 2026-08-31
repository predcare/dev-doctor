import React, { useState } from 'react';
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import ConsultTabPanel from '../../components/Modules/PatientDetails/Consult/ConsultTabPanel';
import MedicalDocumentCard, { MedicalDocument } from '../../components/Modules/PatientDetails/MedicalDocumentCard';
import PatientHeaderCard from '../../components/Modules/PatientDetails/PatientHeaderCard';
import PatientTabBar, { MainTabKey, TabItem } from '../../components/Modules/PatientDetails/PatientTabBar';
import PrescriptionCard, { PrescriptionItem } from '../../components/Modules/PatientDetails/PrescriptionCard';
import PatientInvoiceTabPanel from '../../components/Modules/PatientDetails/Invoice/PatientInvoiceTabPanel';
import PatientProfileTabPanel from '../../components/Modules/PatientDetails/Profile/PatientProfileTabPanel';
import RecordsTabPanel from '../../components/Modules/PatientDetails/RecordsTabPanel';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import type { PatientDetailsScreenProps } from '../../route';
import { patientDetailsStyles } from '../../styled/PatientDetailsScreen.styled';
import { theme } from '../../styled/theme.styled';

const MAIN_TABS: TabItem[] = [
  { key: 'records', label: 'Records' },
  { key: 'consultation', label: 'Consult' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'profile', label: 'Profile' },
];

export const PatientDetailsScreen: React.FC<PatientDetailsScreenProps> = ({ navigation }) => {
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
    <SafeAreaWrapper
      edges={['top', 'left', 'right', 'bottom']}
      backgroundColor={theme.colors.primary}
      barStyle="light-content"
    >
      <StatusBar barStyle="light-content" />

      {/* Top Header Bar */}
      <View style={patientDetailsStyles.topBar}>
        <TouchableOpacity
          style={patientDetailsStyles.backCircle}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.8}
        >
          <Text style={patientDetailsStyles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={patientDetailsStyles.topBarTitle}>Patient Details</Text>
      </View>

      {/* Patient Profile Card */}
      <PatientHeaderCard
        name={patient.name}
        patientId={patient.patientId}
        gender={patient.gender}
        age={patient.age}
        bloodGroup={patient.bloodGroup}
        avatarBgColor={patient.avatarBgColor}
      />

      {/* Main Tab Navigation Bar */}
      <PatientTabBar
        tabs={MAIN_TABS}
        activeTab={activeMainTab}
        onTabPress={setActiveMainTab}
      />

      {/* Active Tab Panel Content */}
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
            patientId={patient.patientId}
            patientName={patient.name}
            navigation={navigation}
          />
        )}

        {activeMainTab === 'profile' && (
          <PatientProfileTabPanel
            patientId={patient.patientId}
            patientName={patient.name}
            navigation={navigation}
          />
        )}
      </View>
 
    </SafeAreaWrapper>
  );
};

export default PatientDetailsScreen;
