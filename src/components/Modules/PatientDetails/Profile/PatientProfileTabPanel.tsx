import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { patientProfileTabStyles as s } from '../../../../styled/PatientProfileTabPanel.styled';
import { PatientProfileTabPanelProps } from '../../../../typescripts/types/invoice.types';

const TEAL_DARK = '#0a7a70';

export const PatientProfileTabPanel: React.FC<PatientProfileTabPanelProps> = ({
  patientId,
  patientName = 'Eleanor Vance',
  navigation,
}) => {
  // Static Mock Patient Data matching reference PatientDetailsScreen
  const patient = {
    patientId: patientId || 'PAT-1092',
    name: patientName,
    email: 'eleanor.vance@example.com',
    phone: '+91 98765 43210',
    alternate_number: '+91 98123 45678',
    whatsapp_number: '+91 98765 43210',
    address: '742 Evergreen Terrace, Koramangala, Bengaluru, KA - 560034',
    date_of_birth: '14 May 1992',
    age: '34 years',
    gender: 'Female',
    blood_group: 'O+',
    occupation: 'Software Engineer',
    marital_status: 'Married',
    nationality: 'Indian',
    language: 'English, Hindi',
    blood_pressure: '120/80',
    pulse: '72',
    temperature: '36.6',
    spo2: '98',
    bmi: '21.5',
    drug_allergies: 'Penicillin, Sulfa drugs',
    medical_history: 'Essential Hypertension (controlled), Mild Seasonal Asthma',
  };

  const handleEditProfile = () => {
    if (navigation?.navigate) {
      navigation.navigate('EditPatient', {
        patientId: patient.patientId,
        patientName: patient.name,
      });
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Edit Profile Button */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 }}>
        <TouchableOpacity
          style={s.editProfileBtn}
          activeOpacity={0.85}
          onPress={handleEditProfile}
        >
          <Text style={s.editProfileBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Information */}
      <View style={s.card}>
        <Text style={s.cardSectionTitle}>Contact Information</Text>
        {[
          { label: 'Email', value: patient.email },
          { label: 'Phone', value: patient.phone },
          { label: 'Alternate Phone', value: patient.alternate_number },
          { label: 'WhatsApp', value: patient.whatsapp_number },
          { label: 'Address', value: patient.address },
        ]
          .filter(r => r.value)
          .map((row, i) => (
            <View key={i}>
              {i > 0 && <View style={s.divider} />}
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>{row.label}</Text>
                <Text style={s.infoValue}>{row.value}</Text>
              </View>
            </View>
          ))}
      </View>

      {/* Personal Details */}
      <View style={s.card}>
        <Text style={s.cardSectionTitle}>Personal Details</Text>
        {[
          { label: 'Date of Birth', value: patient.date_of_birth },
          { label: 'Age', value: patient.age },
          { label: 'Gender', value: patient.gender },
          { label: 'Blood Group', value: patient.blood_group },
          { label: 'Occupation', value: patient.occupation },
          { label: 'Marital Status', value: patient.marital_status },
          { label: 'Nationality', value: patient.nationality },
          { label: 'Language', value: patient.language },
        ]
          .filter(r => r.value)
          .map((row, i) => (
            <View key={i}>
              {i > 0 && <View style={s.divider} />}
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>{row.label}</Text>
                <Text style={s.infoValue}>{row.value}</Text>
              </View>
            </View>
          ))}
      </View>

      {/* Health Vitals */}
      <View style={s.card}>
        <Text style={s.cardSectionTitle}>Health Vitals</Text>
        <View style={s.vitalsGrid}>
          {[
            { label: 'BP', value: patient.blood_pressure || '—' },
            { label: 'Pulse', value: patient.pulse ? `${patient.pulse} bpm` : '—' },
            { label: 'Temp', value: patient.temperature ? `${patient.temperature}°C` : '—' },
            { label: 'SpO₂', value: patient.spo2 ? `${patient.spo2}%` : '—' },
            { label: 'BMI', value: patient.bmi || '—' },
          ].map((v, i) => (
            <View key={i} style={s.vitalBox}>
              <Text style={[s.vitalValue, v.value === '—' && { color: '#CBD5E1' }]}>
                {v.value}
              </Text>
              <Text style={s.vitalLabel}>{v.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Medical Alerts */}
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
                { backgroundColor: '#F0FDF9', borderColor: '#a8e6e1', marginTop: 8 },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[s.alertLabel, { color: TEAL_DARK }]}>Medical History</Text>
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
