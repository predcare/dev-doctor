import React from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { patientDetailsStyles as S } from '../../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../../styled/theme.styled';
import { ConsultFormValues } from './consultSchema';

export const LabsStepForm: React.FC = () => {
  const { control } = useFormContext<ConsultFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lab_tests_structured',
  });

  return (
    <View style={{ gap: 14 }}>
      {fields.map((fieldItem, index) => (
        <View key={fieldItem.id} style={S.consultSectionCard}>
          <View style={S.medCardHead}>
            <Text style={{ fontSize: 18 }}>🧪</Text>
            <Text style={S.medCardTitle}>Lab Test {index + 1}</Text>
            <TouchableOpacity onPress={() => remove(index)} activeOpacity={0.7}>
              <Text style={S.removeText}>✕ Remove</Text>
            </TouchableOpacity>
          </View>

          {/* Test Name */}
          <View style={{ marginBottom: 12 }}>
            <Text style={S.vitalLabel}>
              Test Name <Text style={{ color: theme.colors.danger }}>*</Text>
            </Text>
            <Controller
              control={control}
              name={`lab_tests_structured.${index}.name`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.consultInput}
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
            <Text style={S.vitalLabel}>Instructions</Text>
            <Controller
              control={control}
              name={`lab_tests_structured.${index}.instructions`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.consultInput}
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
          S.consultSectionCard,
          { borderStyle: 'dashed', borderColor: theme.colors.primary, borderWidth: 1.5 },
        ]}
      >
        <View style={S.medCardHead}>
          <Text style={{ fontSize: 18 }}>🧪</Text>
          <Text style={S.medCardTitle}>Add New Lab Test</Text>
        </View>
        <TouchableOpacity
          onPress={() => append({ name: '', instructions: '' })}
          activeOpacity={0.85}
          style={S.addPrimaryBtn}
        >
          <Text style={S.addPrimaryBtnText}>+ Add Lab Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LabsStepForm;
