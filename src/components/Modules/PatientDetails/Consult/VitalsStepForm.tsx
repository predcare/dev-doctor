import React, { useEffect } from 'react';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { patientDetailsStyles as S } from '../../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../../styled/theme.styled';
import { ConsultFormValues } from './consultSchema';

export const VitalsStepForm: React.FC = () => {
  const { control, setValue } = useFormContext<ConsultFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'custom_vitals',
  });

  // Auto calculate BMI from weight & height
  const weight = useWatch({ control, name: 'weight' });
  const height = useWatch({ control, name: 'height' });
  const bmi = useWatch({ control, name: 'bmi' });

  useEffect(() => {
    const w = parseFloat(weight || '0');
    const h = parseFloat(height || '0');
    if (w > 0 && h > 0) {
      const calculatedBmi = (w / ((h / 100) * (h / 100))).toFixed(1);
      setValue('bmi', calculatedBmi);
    }
  }, [weight, height, setValue]);

  return (
    <View style={S.consultSectionCard}>
      <Text style={S.consultSectionTitle}>Patient Vitals</Text>

      {/* Row 1: BP & Pulse */}
      <View style={S.vitalsRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={S.vitalLabel}>Blood Pressure</Text>
          <View style={S.vitalInputContainer}>
            <Controller
              control={control}
              name="blood_pressure"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.vitalInput}
                  placeholder="120/80"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                />
              )}
            />
            <View style={S.vitalUnitTag}>
              <Text style={S.vitalUnitText}>mmHg</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={S.vitalLabel}>Heart Rate</Text>
          <View style={S.vitalInputContainer}>
            <Controller
              control={control}
              name="pulse"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.vitalInput}
                  placeholder="72"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                  keyboardType="decimal-pad"
                />
              )}
            />
            <View style={S.vitalUnitTag}>
              <Text style={S.vitalUnitText}>bpm</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Row 2: Temp & SpO2 */}
      <View style={S.vitalsRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={S.vitalLabel}>Temperature</Text>
          <View style={S.vitalInputContainer}>
            <Controller
              control={control}
              name="temperature"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.vitalInput}
                  placeholder="36.6"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                  keyboardType="decimal-pad"
                />
              )}
            />
            <View style={S.vitalUnitTag}>
              <Text style={S.vitalUnitText}>°C</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={S.vitalLabel}>SpO2</Text>
          <View style={S.vitalInputContainer}>
            <Controller
              control={control}
              name="spo2"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.vitalInput}
                  placeholder="98"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                  keyboardType="decimal-pad"
                />
              )}
            />
            <View style={S.vitalUnitTag}>
              <Text style={S.vitalUnitText}>%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Row 3: Weight & Height */}
      <View style={S.vitalsRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={S.vitalLabel}>Weight</Text>
          <View style={S.vitalInputContainer}>
            <Controller
              control={control}
              name="weight"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.vitalInput}
                  placeholder="70"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                  keyboardType="decimal-pad"
                />
              )}
            />
            <View style={S.vitalUnitTag}>
              <Text style={S.vitalUnitText}>kg</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={S.vitalLabel}>Height</Text>
          <View style={S.vitalInputContainer}>
            <Controller
              control={control}
              name="height"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.vitalInput}
                  placeholder="170"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                  keyboardType="decimal-pad"
                />
              )}
            />
            <View style={S.vitalUnitTag}>
              <Text style={S.vitalUnitText}>cm</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Auto Calculated BMI */}
      <View style={{ marginBottom: 16 }}>
        <Text style={S.vitalLabel}>BMI (kg/m²)</Text>
        <View style={S.bmiContainer}>
          <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary }}>
            {bmi || 'Auto-calculated'}
          </Text>
          <View style={S.bmiAutoTag}>
            <Text style={S.bmiAutoText}>AUTO</Text>
          </View>
        </View>
      </View>

      {/* Custom Vitals Section */}
      <View style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 10 }}>
          Custom Vitals
        </Text>
        {fields.map((fieldItem, index) => (
          <View key={fieldItem.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Controller
              control={control}
              name={`custom_vitals.${index}.name`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[S.consultInput, { flex: 1.5, marginRight: 8 }]}
                  placeholder="Name (e.g. Waist)"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name={`custom_vitals.${index}.value`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[S.consultInput, { flex: 1, marginRight: 8 }]}
                  placeholder="Value"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                />
              )}
            />
            <TouchableOpacity onPress={() => remove(index)} style={{ padding: 4 }}>
              <Text style={{ color: theme.colors.danger, fontSize: 18, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => append({ name: '', value: '' })}
          activeOpacity={0.8}
          style={S.addOutlineBtn}
        >
          <Text style={S.addOutlineBtnText}>+ Add Custom Vital</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VitalsStepForm;
