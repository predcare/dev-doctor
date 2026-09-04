import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { TCreatePrescriptionFormValues } from '../../../lib/schemas/createPrescription.schema';
import { patientDetailsStyles as S } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';

export const PrescriptionDiagnosisStep: React.FC = () => {
  const { control } = useFormContext<TCreatePrescriptionFormValues>();

  return (
    <View style={{ gap: 16 }}>
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

export default PrescriptionDiagnosisStep;
