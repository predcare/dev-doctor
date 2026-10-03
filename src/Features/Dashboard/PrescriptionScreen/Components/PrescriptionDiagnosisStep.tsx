import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { TCreatePrescriptionFormValues } from '../../../../lib/schemas/createPrescription.schema';
import theme from '../../../../styled/theme.styled';
import { patientDetailsStyles } from '../../../../styled/PatientDetailsScreen.styled';


export const PrescriptionDiagnosisStep: React.FC = () => {
  const { control } = useFormContext<TCreatePrescriptionFormValues>();

  return (
    <View style={{ gap: 16 }}>
      {/* Diagnosis */}
      <View style={patientDetailsStyles.consultSectionCard}>
        <Text style={patientDetailsStyles.consultSectionTitle}>Diagnosis</Text>
        <Controller
          control={control}
          name="diagnosis"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={patientDetailsStyles.consultTextArea}
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
      <View style={patientDetailsStyles.consultSectionCard}>
        <Text style={patientDetailsStyles.consultSectionTitle}>Treatment Plan</Text>
        <Controller
          control={control}
          name="treatment_plan"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={patientDetailsStyles.consultTextArea}
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
