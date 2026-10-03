import React from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TCreatePrescriptionFormValues } from '../../../../lib/schemas/createPrescription.schema';
import { patientDetailsStyles } from '../../../../styled/PatientDetailsScreen.styled';
import theme from '../../../../styled/theme.styled';

export const PrescriptionLabsStep: React.FC = () => {
  const { control } = useFormContext<TCreatePrescriptionFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lab_tests_structured',
  });

  return (
    <View style={{ gap: 14 }}>
      {fields.map((fieldItem, index) => (
        <View key={fieldItem.id} style={patientDetailsStyles.consultSectionCard}>
          <View style={patientDetailsStyles.medCardHead}>
            <Text style={{ fontSize: 18 }}>🧪</Text>
            <Text style={patientDetailsStyles.medCardTitle}>Lab Test {index + 1}</Text>
            <TouchableOpacity onPress={() => remove(index)} activeOpacity={0.7}>
              <Text style={patientDetailsStyles.removeText}>✕ Remove</Text>
            </TouchableOpacity>
          </View>

          {/* Test Name */}
          <View style={{ marginBottom: 12 }}>
            <Text style={patientDetailsStyles.vitalLabel}>
              Test Name <Text style={{ color: theme.colors.danger }}>*</Text>
            </Text>
            <Controller
              control={control}
              name={`lab_tests_structured.${index}.name`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={patientDetailsStyles.consultInput}
                  placeholder="e.g. Blood Test, X-Ray, ECG, HbA1c..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Instructions */}
          <View>
            <Text style={patientDetailsStyles.vitalLabel}>Instructions</Text>
            <Controller
              control={control}
              name={`lab_tests_structured.${index}.instructions`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={patientDetailsStyles.consultInput}
                  placeholder="e.g. Fasting sample in morning"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
      ))}

      {/* Add Lab Test Button */}
      <View
        style={[
          patientDetailsStyles.consultSectionCard,
          { borderStyle: 'dashed', borderColor: theme.colors.primary, borderWidth: 1.5 },
        ]}
      >
        <View style={patientDetailsStyles.medCardHead}>
          <Text style={{ fontSize: 18 }}>🧪</Text>
          <Text style={patientDetailsStyles.medCardTitle}>Add New Lab Test</Text>
        </View>
        <TouchableOpacity
          onPress={() => append({ name: '', instructions: '' })}
          activeOpacity={0.85}
          style={patientDetailsStyles.addPrimaryBtn}
        >
          <Text style={patientDetailsStyles.addPrimaryBtnText}>+ Add Lab Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrescriptionLabsStep;
