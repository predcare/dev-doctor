import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Circle from 'react-native-svg/src/elements/Circle';
import Path from 'react-native-svg/src/elements/Path';
import Rect from 'react-native-svg/src/elements/Rect';
import Svg from 'react-native-svg/src/elements/Svg';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { showInfoToast, showSuccessToast } from '../../lib/common/toast.utils';
import type { PrescriptionViewScreenProps } from '../../route';
import {
  prescriptionViewStyles as S,
  TEAL,
  TEAL_DARK,
} from '../../styled/PrescriptionViewScreen.styled';

// Custom SVG Icons matching exact reference design
const IconBack = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke="#0F172A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const IconEditPencil = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
      stroke={TEAL}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
      stroke={TEAL}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const IconVitals = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 12H18L15 21L9 3L6 12H2"
      stroke={TEAL}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const IconSymptoms = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke={TEAL}
      strokeWidth="2"
    />
    <Path d="M12 8V12" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
    <Circle cx={12} cy={16} r={1} fill={TEAL} />
  </Svg>
);

const IconDiagnosis = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke={TEAL}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 2V8H20"
      stroke={TEAL}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const IconMeds = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.5 20.5L3.5 13.5C2.11929 12.1193 2.11929 9.88071 3.5 8.5L8.5 3.5C9.88071 2.11929 12.1193 2.11929 13.5 3.5L20.5 10.5C21.8807 11.8807 21.8807 14.1193 20.5 15.5L15.5 20.5C14.1193 21.8807 11.8807 21.8807 10.5 20.5Z"
      stroke={TEAL}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M8.5 8.5L15.5 15.5" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const IconInstructions = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18h6m-3-3v3M9.663 17h4.673M12 3a6 6 0 00-6 6c0 1.942.923 3.67 2.356 4.773A6.002 6.002 0 0012 15a6.002 6.002 0 003.644-1.227C17.077 12.67 18 10.942 18 9a6 6 0 00-6-6z"
      stroke={TEAL}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const IconCopy = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="9" width="13" height="13" rx="2" stroke={TEAL} strokeWidth="2" />
    <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke={TEAL} strokeWidth="2" />
  </Svg>
);

const IconLabTests = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 3v2m6-2v2M9 5h6m-6 0a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2m-6 0h6"
      stroke={TEAL}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const IconCalendar = () => (
  <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
    <Rect x={2} y={4} width={18} height={16} rx={2.5} stroke={TEAL_DARK} strokeWidth={1.5} />
    <Path d="M2 9H20" stroke={TEAL_DARK} strokeWidth={1.5} />
    <Path d="M7 2V5M15 2V5" stroke={TEAL_DARK} strokeWidth={1.5} strokeLinecap="round" />
    <Rect x={5} y={12} width={3} height={3} rx={0.5} fill={TEAL_DARK} />
    <Rect x={9.5} y={12} width={3} height={3} rx={0.5} fill={TEAL_DARK} />
  </Svg>
);

const IconPromo = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={TEAL}
    />
  </Svg>
);

const IconArrowRight = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18L15 12L9 6"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PrescriptionViewScreen: React.FC<PrescriptionViewScreenProps> = ({
  navigation,
  route,
}) => {
  // Static mock prescription matching reference design
  const prescription = {
    rxId: route?.params?.rxId || 'RX-2026-0001-A',
    clinicName: 'PRED Care Medical Center',
    date: '12 Aug 2026',
    status: 'completed',
    patient: {
      name: route?.params?.patientName || 'Eleanor Vance',
      patientId: route?.params?.patientId || 'PAT-1092',
      age: '34 yrs',
      gender: 'Female',
    },
    vitals: [
      { label: 'BP', value: '135/85' },
      { label: 'HR', value: '84 bpm' },
      { label: 'TEMP', value: '36.8 °C' },
      { label: 'SPO2', value: '98%' },
      { label: 'WT', value: '68 kg' },
    ],
    symptoms: 'Chest tightness, mild shortness of breath on exertion & fatigue since 3 days.',
    diagnosis: 'Atypical Chest Pain & Primary Essential Hypertension (ICD-10: I10)',
    medications: [
      {
        id: 1,
        name: 'Amlodipine',
        strength: '5mg',
        dosage: '1-0-0',
        duration: '30 Days',
        instructions: 'Before food',
        frequency: 'Morning',
      },
      {
        id: 2,
        name: 'Telmisartan',
        strength: '40mg',
        dosage: '0-0-1',
        duration: '30 Days',
        instructions: 'After food',
        frequency: 'Night',
      },
      {
        id: 3,
        name: 'Omeprazole',
        strength: '20mg',
        dosage: '1-0-0',
        duration: '14 Days',
        instructions: '30 mins Before breakfast',
        frequency: 'Morning',
      },
    ],
    instructions:
      'Low salt diet (< 2g daily), restrict caffeine intake. 30 minutes daily moderate aerobic walking. Monitor blood pressure every morning and maintain log.',
    followUp: '26 Aug 2026',
    labTests: [
      {
        name: 'Complete Blood Count (CBC) with ESR',
        instructions: 'Fasting sample required in morning',
      },
      { name: '12-Lead Electrocardiogram (ECG)', instructions: 'Resting state test' },
    ],
  };

  const isCompleted = prescription.status === 'completed';

  const handleResendToPatient = () => {
    showSuccessToast(
      `Prescription sent to ${prescription.patient.name} via Email & SMS`,
      'Resent to Patient'
    );
  };

  const handleDownloadPDF = () => {
    showInfoToast('Prescription PDF saved to Downloads folder', 'Download PDF');
  };

  const handleEdit = () => {
    showInfoToast('Opening prescription editor...', 'Edit Prescription');
  };

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <IconBack />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Summary</Text>
        <View style={S.headerRight}>
          <TouchableOpacity style={S.editPill} activeOpacity={0.7} onPress={handleEdit}>
            <IconEditPencil />
            <Text style={S.editPillTxt}>Edit</Text>
          </TouchableOpacity>
          <Text style={S.rxIdBadge}>{prescription.rxId}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Clinic Card */}
        <View style={S.clinicCard}>
          <View style={{ flex: 1 }}>
            <Text style={S.clinicName}>{prescription.clinicName}</Text>
            <Text style={S.clinicSub}>Prescription Details</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={S.clinicDate}>{prescription.date}</Text>
            <View style={{ height: 4 }} />
            <View style={[S.statusChip, { backgroundColor: isCompleted ? '#D1FAE5' : '#FEF3C7' }]}>
              <Text style={[S.statusChipTxt, { color: isCompleted ? '#059669' : '#D97706' }]}>
                {isCompleted ? 'CONFIRMED' : 'DRAFT'}
              </Text>
            </View>
          </View>
        </View>

        {/* Patient Card */}
        <View style={S.patientCard}>
          <View style={S.patientAvatarBox}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={8} r={4} fill={TEAL} />
              <Path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill={TEAL} />
            </Svg>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={S.patientName}>{prescription.patient.name}</Text>
            <View style={S.patientMetaRow}>
              <View style={S.patientMetaItem}>
                <Svg
                  width={14}
                  height={14}
                  viewBox="0 0 14 14"
                  fill="none"
                  style={{ marginRight: 4 }}
                >
                  <Rect
                    x={1}
                    y={2.5}
                    width={12}
                    height={10}
                    rx={1.5}
                    stroke={TEAL_DARK}
                    strokeWidth={1.3}
                  />
                  <Path d="M1 5.5H13" stroke={TEAL_DARK} strokeWidth={1.3} />
                  <Path
                    d="M4.5 1V3M9.5 1V3"
                    stroke={TEAL_DARK}
                    strokeWidth={1.3}
                    strokeLinecap="round"
                  />
                </Svg>
                <Text style={S.patientMetaTxt}>{prescription.patient.age}</Text>
              </View>

              <View style={S.patientMetaItem}>
                <Svg
                  width={18}
                  height={14}
                  viewBox="0 0 18 14"
                  fill="none"
                  style={{ marginRight: 4 }}
                >
                  <Circle cx={11} cy={3.5} r={2.5} fill={TEAL_DARK} />
                  <Path
                    d="M5.5 13.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5"
                    stroke={TEAL_DARK}
                    strokeWidth={1.25}
                    strokeLinecap="round"
                  />
                </Svg>
                <Text style={S.patientMetaTxt}>{prescription.patient.gender}</Text>
              </View>
            </View>
          </View>

          <View style={S.patientIdBadge}>
            <Text style={S.patientIdBadgeTxt}>{prescription.patient.patientId}</Text>
          </View>
        </View>

        {/* Vitals Section */}
        <View style={S.outerSection}>
          <View style={S.outerSectionHd}>
            <IconVitals />
            <Text style={S.outerSectionTitle}>Vitals</Text>
          </View>

          <View style={S.contentCard}>
            <View style={S.vitalsRow}>
              {prescription.vitals.map((v, i) => (
                <View key={i} style={S.vitalBox}>
                  <Text style={S.vitalLbl}>{v.label}</Text>
                  <Text style={S.vitalVal}>{v.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Symptoms Section */}
        <View style={S.outerSection}>
          <View style={S.outerSectionHd}>
            <IconSymptoms />
            <Text style={S.outerSectionTitle}>Symptoms</Text>
          </View>

          <View style={S.contentCard}>
            <View style={S.textBox}>
              <Text style={S.textBoxTxt}>{prescription.symptoms}</Text>
            </View>
          </View>
        </View>

        {/* Diagnosis Section */}
        <View style={S.outerSection}>
          <View style={S.outerSectionHd}>
            <IconDiagnosis />
            <Text style={S.outerSectionTitle}>Diagnosis</Text>
          </View>

          <View style={S.contentCard}>
            <View style={S.textBox}>
              <Text style={[S.textBoxTxt, { color: TEAL, fontWeight: '700' }]}>
                {prescription.diagnosis}
              </Text>
            </View>
          </View>
        </View>

        {/* Medications Section */}
        <View style={S.outerSection}>
          <View style={S.outerSectionHd}>
            <IconMeds />
            <Text style={S.outerSectionTitle}>Medications</Text>
            <View style={{ flex: 1 }} />
            <Text style={S.outerCountTxt}>{prescription.medications.length} ITEMS</Text>
          </View>

          <View style={S.contentCard}>
            {prescription.medications.map((med, i) => (
              <View
                key={med.id}
                style={[S.medItem, i < prescription.medications.length - 1 && S.medBorder]}
              >
                <View style={S.medTopRow}>
                  <Text style={S.medName}>
                    {med.name} {med.strength}
                  </Text>
                  <Text style={S.medDosage}>{med.dosage}</Text>
                </View>

                <View style={S.medBotRow}>
                  <View style={S.medMetaItem}>
                    <Text style={S.medMetaTxt}>📅 {med.duration}</Text>
                  </View>
                  <View style={S.medMetaItem}>
                    <Text style={S.medMetaTxt}>🍽 {med.instructions}</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={S.medDosage}>{med.frequency}</Text>
                    <Text style={S.medFreqRight}>DOSAGE</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Instructions Card (Teal tint) */}
        <View style={S.instructionsCard}>
          <View style={S.instructionsHd}>
            <IconInstructions />
            <Text style={S.instructionsTitle}>INSTRUCTIONS</Text>
            <View style={{ flex: 1 }} />
            <IconCopy />
          </View>
          <Text style={S.instructionsTxt}>{prescription.instructions}</Text>
        </View>

        {/* Follow-up Card */}
        <View style={S.followUpCard}>
          <View>
            <Text style={S.followUpLbl}>FOLLOW-UP</Text>
            <Text style={S.followUpDate}>{prescription.followUp}</Text>
          </View>
          <View style={S.followUpIconBox}>
            <IconCalendar />
          </View>
        </View>

        {/* Lab Tests Section */}
        <View style={S.outerSection}>
          <View style={S.outerSectionHd}>
            <IconLabTests />
            <Text style={S.outerSectionTitle}>Lab Tests</Text>
            <View style={{ flex: 1 }} />
            <Text style={S.outerCountTxt}>{prescription.labTests.length} ITEMS</Text>
          </View>

          <View style={S.contentCard}>
            {prescription.labTests.map((lab, i) => (
              <View
                key={i}
                style={[S.medItem, i < prescription.labTests.length - 1 && S.medBorder]}
              >
                <Text style={S.medName}>
                  {lab.name}
                  {lab.instructions && (
                    <Text style={{ fontWeight: '400', color: '#64748B', fontSize: 13 }}>
                      {'  '}({lab.instructions})
                    </Text>
                  )}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Promo Row */}
        <TouchableOpacity style={S.promoRow} activeOpacity={0.7}>
          <View style={S.promoIconBox}>
            <IconPromo />
          </View>
          <Text style={S.promoTxt}>Stay healthy with our clinical sanctuary programs.</Text>
          <IconArrowRight />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Bar: Resend to Patient & Download PDF */}
      <View style={S.bottomBar}>
        <View style={S.shareBtnRow}>
          <TouchableOpacity style={S.shareBtn} onPress={handleResendToPatient} activeOpacity={0.85}>
            <Text style={{ fontSize: 16, color: '#FFFFFF' }}>✉</Text>
            <Text style={S.shareBtnTxt}>Resend to Patient</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={S.shareBtnDocBtn}
            onPress={handleDownloadPDF}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 22, color: TEAL }}>📥</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default PrescriptionViewScreen;
