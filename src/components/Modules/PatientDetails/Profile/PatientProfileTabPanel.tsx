import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { showErrorToast } from '../../../../lib/common/toast.utils';
import { AppRoute } from '../../../../route';
import { patientProfileTabStyles as s } from '../../../../styled/PatientProfileTabPanel.styled';
import { theme } from '../../../../styled/theme.styled';
import { IMyPatientDoc } from '../../../../typescripts/interfaces/patients.interfaces';

interface ProfileTabProps {
  patientInfo?: IMyPatientDoc | null;
}

export const PatientProfileTabPanel: React.FC<ProfileTabProps> = ({ patientInfo }) => {
  const navigation = useNavigation();
  const patient = useMemo(
    () => ({
      patientId: patientInfo?.patient_id || 'PAT-1092',
      name: patientInfo?.name,
      email: patientInfo?.email,
      phone: patientInfo?.phone_number,
      alternate_number: patientInfo?.alternate_phone,
      whatsapp_number: patientInfo?.whatsapp_number,
      address: patientInfo?.address,
      date_of_birth: patientInfo?.date_of_birth,
      age: patientInfo?.age_display || '',
      gender: patientInfo?.gender?.toUpperCase(),
      blood_group: patientInfo?.blood_type || '',
      blood_pressure: patientInfo?.blood_pressure || '',
      pulse: patientInfo?.pulse || '',
      temperature: patientInfo?.temperature || '',
      spo2: patientInfo?.spo2 || '',
      bmi: patientInfo?.bmi || '',
      drug_allergies: patientInfo?.drug_allergies || '',
      medical_history: patientInfo?.medical_history || '',
    }),
    [patientInfo]
  );

  const contactInfoRows = useMemo(
    () =>
      [
        { label: 'Email', value: patient.email },
        { label: 'Phone', value: patient.phone },
        { label: 'Alternate Phone', value: patient.alternate_number },
        { label: 'WhatsApp', value: patient.whatsapp_number },
        { label: 'Address', value: patient.address },
      ].filter(r => r.value),
    [patient]
  );

  const personalDetailRows = useMemo(
    () =>
      [
        { label: 'Date of Birth', value: patient.date_of_birth },
        { label: 'Age', value: patient.age },
        { label: 'Gender', value: patient.gender },
        { label: 'Blood Group', value: patient.blood_group },
      ].filter(r => r.value),
    [patient]
  );

  const vitalsList = useMemo(
    () => [
      { label: 'BP', value: patient.blood_pressure || '—' },
      { label: 'Pulse', value: patient.pulse ? `${patient.pulse} bpm` : '—' },
      { label: 'Temp', value: patient.temperature ? `${patient.temperature}°C` : '—' },
      { label: 'SpO₂', value: patient.spo2 ? `${patient.spo2}%` : '—' },
      { label: 'BMI', value: patient.bmi || '—' },
    ],
    [patient]
  );

  const handleEditProfile = () => {
    if (!patientInfo?.user_id) return showErrorToast('Invalid patient details');
    if (navigation?.navigate) {
      navigation.navigate(AppRoute.EDIT_PATIENT, {
        patientId: patientInfo.user_id,
        patientName: patientInfo.name,
      });
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 }}>
        <TouchableOpacity style={s.editProfileBtn} activeOpacity={0.85} onPress={handleEditProfile}>
          <Text style={s.editProfileBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={s.card}>
        <Text style={s.cardSectionTitle}>Contact Information</Text>
        {contactInfoRows.map((row, i) => (
          <View key={i}>
            {i > 0 && <View style={s.divider} />}
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>{row.label}</Text>
              <Text style={s.infoValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={s.card}>
        <Text style={s.cardSectionTitle}>Personal Details</Text>
        {personalDetailRows.map((row, i) => (
          <View key={i}>
            {i > 0 && <View style={s.divider} />}
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>{row.label}</Text>
              <Text style={s.infoValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={s.card}>
        <Text style={s.cardSectionTitle}>Health Vitals</Text>
        <View style={s.vitalsGrid}>
          {vitalsList.map((v, i) => (
            <View key={i} style={s.vitalBox}>
              <Text style={[s.vitalValue, v.value === '—' && { color: '#CBD5E1' }]}>{v.value}</Text>
              <Text style={s.vitalLabel}>{v.label}</Text>
            </View>
          ))}
        </View>
      </View>
      {(patient.drug_allergies || patient.medical_history) && (
        <View style={s.card}>
          <Text style={s.cardSectionTitle}>Medical Alerts</Text>
          {patient.drug_allergies && patient.drug_allergies !== 'None' && (
            <View style={[s.alertBox, { backgroundColor: '#FFF1F2', borderColor: '#FECDD3' }]}>
              <View style={{ flex: 1 }}>
                <Text style={[s.alertLabel, { color: '#BE123C' }]}>Drug Allergies</Text>
                <Text style={s.alertText}>{patient.drug_allergies}</Text>
              </View>
            </View>
          )}
          {patient.medical_history && (
            <View
              style={[
                s.alertBox,
                {
                  backgroundColor: theme.colors.primarySoft,
                  borderColor: theme.colors.tealBdr,
                  marginTop: 8,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[s.alertLabel, { color: theme.colors.primary }]}>Medical History</Text>
                <Text style={s.alertText}>{patient.medical_history}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

export default PatientProfileTabPanel;
