import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { TCreatePrescriptionFormValues } from '../../../../lib/schemas/createPrescription.schema';
import theme from '../../../../styled/theme.styled';
import { patientDetailsStyles } from '../../../../styled/PatientDetailsScreen.styled';


export const PrescriptionDiagnosisStep: React.FC = () => {
  const { control } = useFormContext<TCreatePrescriptionFormValues>();

  return (
    <View style={{ gap: 20 }}>
      {/* Diagnosis */}
      <View style={patientDetailsStyles.consultSectionCard}>
        <Text style={patientDetailsStyles.consultSectionTitle}>Diagnosis</Text>
        <Controller
          control={control}
          name="diagnosis"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={patientDetailsStyles.consultTextArea}
              placeholder="Enter Clinical Diagnosis..."
              placeholderTextColor={theme.colors.textMuted}
              value={value || ''}
              onChangeText={onChange}
              multiline
              numberOfLines={10}
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
              placeholder="Treatment Plan and Therapeutic Approach..."
              placeholderTextColor={theme.colors.textMuted}
              value={value || ''}
              onChangeText={onChange}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          )}
        />
      </View>
    </View>
  );
};

export default PrescriptionDiagnosisStep;
