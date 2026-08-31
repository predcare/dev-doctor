import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { patientDetailsStyles as S } from '../../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../../styled/theme.styled';
import { ConsultFormValues } from './consultSchema';

export const DiagnosisStepForm: React.FC = () => {
  const { control } = useFormContext<ConsultFormValues>();

  return (
    <View style={{ gap: 16 }}>
      {/* Symptoms & Chief Complaints */}
      <View style={S.consultSectionCard}>
        <Text style={S.consultSectionTitle}>Symptoms & Chief Complaints</Text>
        <Controller
          control={control}
          name="chief_complaints"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={S.consultTextArea}
              placeholder="Describe symptoms and chief complaints..."
              placeholderTextColor={theme.colors.textMuted}
              value={value || ''}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
      </View>

      {/* Examination Notes */}
      <View style={S.consultSectionCard}>
        <Text style={S.consultSectionTitle}>Clinical Examination Notes</Text>
        <Controller
          control={control}
          name="examination_notes"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={S.consultTextArea}
              placeholder="Enter examination findings and clinical notes..."
              placeholderTextColor={theme.colors.textMuted}
              value={value || ''}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
      </View>

      {/* Diagnosis */}
      <View style={S.consultSectionCard}>
        <Text style={S.consultSectionTitle}>Diagnosis</Text>
        <Controller
          control={control}
          name="diagnosis"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={S.consultTextArea}
              placeholder="Enter clinical diagnosis..."
              placeholderTextColor={theme.colors.textMuted}
              value={value || ''}
              onChangeText={onChange}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          )}
        />
      </View>

      {/* Treatment Plan */}
      <View style={S.consultSectionCard}>
        <Text style={S.consultSectionTitle}>Treatment Plan</Text>
        <Controller
          control={control}
          name="treatment_plan"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={S.consultTextArea}
              placeholder="Treatment plan and therapeutic approach..."
              placeholderTextColor={theme.colors.textMuted}
              value={value || ''}
              onChangeText={onChange}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          )}
        />
      </View>
    </View>
  );
};

export default DiagnosisStepForm;
