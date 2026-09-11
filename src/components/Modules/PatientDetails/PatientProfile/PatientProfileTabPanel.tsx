import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMyPatientFamilyMembers } from '../../../../hooks/react-query/patients/patients.hooks';
import { capitalize } from '../../../../lib/common/common.utils';
import { showErrorToast } from '../../../../lib/common/toast.utils';
import { AppRoute } from '../../../../route';
import { patientProfileTabStyles } from '../../../../styled/PatientProfileTabPanel.styled';
import { theme } from '../../../../styled/theme.styled';
import {
  IMyPatientDoc,
  IPatientFamilyMember,
} from '../../../../typescripts/interfaces/patients.interfaces';
import FamilyMemberCard from './FamilyMemberCard';

interface ProfileTabProps {
  patientInfo?: IMyPatientDoc | null;
}

// Static mock family members as per response format
const STATIC_FAMILY_MEMBERS: IPatientFamilyMember[] = [
  {
    user_id: 5,
    name: 'Samir',
    relation: 'parent',
    gender: 'male',
    date_of_birth: '1994-12-31',
    phone: '8918030206',
    email: 'iamsahilmallick@gmail.com',
    patient_record_id: 3,
    patient_id: 'PT0003',
    profile_image: null,
    address: null,
    city: null,
    state: null,
    postal_code: null,
    country: null,
    profile_picture: null,
  },
];

export const PatientProfileTabPanel: React.FC<ProfileTabProps> = ({ patientInfo }) => {
  const navigation = useNavigation();

  const {
    data: familyMemberList,
    isPending: familyMemberListPending,
    isError: isFamilyMemberListError,
    error: familyMemberListError,
  } = useMyPatientFamilyMembers({
    patientId: patientInfo?.user_id,
  });

  const patient = useMemo(
    () => ({
      patientId: patientInfo?.patient_id || '-',
      name: patientInfo?.name,
      email: patientInfo?.email,
      phone: patientInfo?.phone_number,
      alternate_number: patientInfo?.alternate_phone,
      // whatsapp_number: patientInfo?.whatsapp_number,
      address: patientInfo?.address,
      date_of_birth: patientInfo?.date_of_birth,
      age: patientInfo?.age_display || '',
      gender: capitalize(patientInfo?.gender || ''),
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
        // { label: 'WhatsApp', value: patient.whatsapp_number },
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
        { label: 'Blood Group', value: patient.blood_group || '-' },
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
        <TouchableOpacity
          style={patientProfileTabStyles.editProfileBtn}
          activeOpacity={0.85}
          onPress={handleEditProfile}
        >
          <Text style={patientProfileTabStyles.editProfileBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={patientProfileTabStyles.card}>
        <Text style={patientProfileTabStyles.cardSectionTitle}>Contact Information</Text>
        {contactInfoRows.map((row, i) => (
          <View key={i}>
            {i > 0 && <View style={patientProfileTabStyles.divider} />}
            <View style={patientProfileTabStyles.infoRow}>
              <Text style={patientProfileTabStyles.infoLabel}>{row.label}</Text>
              <Text style={patientProfileTabStyles.infoValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={patientProfileTabStyles.card}>
        <Text style={patientProfileTabStyles.cardSectionTitle}>Personal Details</Text>
        {personalDetailRows.map((row, i) => (
          <View key={i}>
            {i > 0 && <View style={patientProfileTabStyles.divider} />}
            <View style={patientProfileTabStyles.infoRow}>
              <Text style={patientProfileTabStyles.infoLabel}>{row.label}</Text>
              <Text style={patientProfileTabStyles.infoValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
      {(patient.drug_allergies || patient.medical_history) && (
        <View style={patientProfileTabStyles.card}>
          <Text style={patientProfileTabStyles.cardSectionTitle}>Medical Alerts</Text>
          {patient.drug_allergies && patient.drug_allergies !== 'None' && (
            <View
              style={[
                patientProfileTabStyles.alertBox,
                { backgroundColor: '#FFF1F2', borderColor: '#FECDD3' },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[patientProfileTabStyles.alertLabel, { color: '#BE123C' }]}>
                  Drug Allergies
                </Text>
                <Text style={patientProfileTabStyles.alertText}>{patient.drug_allergies}</Text>
              </View>
            </View>
          )}
          {patient.medical_history && (
            <View
              style={[
                patientProfileTabStyles.alertBox,
                {
                  backgroundColor: theme.colors.primarySoft,
                  borderColor: theme.colors.tealBdr,
                  marginTop: 8,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[patientProfileTabStyles.alertLabel, { color: theme.colors.primary }]}>
                  Medical History
                </Text>
                <Text style={patientProfileTabStyles.alertText}>{patient.medical_history}</Text>
              </View>
            </View>
          )}
        </View>
      )}
      <View style={patientProfileTabStyles.card}>
        <View style={patientProfileTabStyles.familyHeaderContainer}>
          <View style={patientProfileTabStyles.familyHeaderLeft}>
            <Text
              style={[
                patientProfileTabStyles.cardSectionTitle,
                { marginHorizontal: 0, marginTop: 0, marginBottom: 0 },
              ]}
            >
              Family Members
            </Text>
            <View style={patientProfileTabStyles.familySectionTag}>
              <Text style={patientProfileTabStyles.familySectionTagText}>Family Members</Text>
            </View>
          </View>
        </View>

        {familyMemberListPending ? (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={{ paddingVertical: 20 }}
          />
        ) : (
          <FlatList
            data={familyMemberList || []}
            keyExtractor={item => String(item.user_id || item.patient_id)}
            scrollEnabled={false}
            contentContainerStyle={patientProfileTabStyles.familyCardList}
            renderItem={({ item }) => (
              <FamilyMemberCard
                dateOfBirth={item.date_of_birth}
                gender={item.gender}
                name={item.name}
                patientId={item.patient_id}
                phone={item.phone}
                relation={item.relation}
                email={item.email}
              />
            )}
            ListEmptyComponent={() => (
              <View style={patientProfileTabStyles.emptyFamilyContainer}>
                <Text style={patientProfileTabStyles.emptyFamilyText}>
                  {isFamilyMemberListError
                    ? `${familyMemberListError?.message || 'Error loading family members'}`
                    : 'No family members added'}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

export default PatientProfileTabPanel;
