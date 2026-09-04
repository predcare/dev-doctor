import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TCreatePrescriptionFormValues } from '../../../lib/schemas/createPrescription.schema';
import { patientDetailsStyles as S } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';

export const PrescriptionClinicalNotesStep: React.FC = () => {
  const { control, watch, setValue } = useFormContext<TCreatePrescriptionFormValues>();
  const [chronicInput, setChronicInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');

  const chronicConditionsValue = watch('chronic_conditions') || '';
  const drugAllergiesValue = watch('drug_allergies') || '';

  const addChronicCondition = () => {
    if (!chronicInput.trim()) return;
    const list = chronicConditionsValue
      ? chronicConditionsValue
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      : [];
    if (!list.includes(chronicInput.trim())) {
      list.push(chronicInput.trim());
    }
    setValue('chronic_conditions', list.join(', '));
    setChronicInput('');
  };

  const removeChronicCondition = (index: number) => {
    const list = chronicConditionsValue
      ? chronicConditionsValue
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      : [];
    list.splice(index, 1);
    setValue('chronic_conditions', list.join(', '));
  };

  const addDrugAllergy = () => {
    if (!allergyInput.trim()) return;
    const list = drugAllergiesValue
      ? drugAllergiesValue
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      : [];
    if (!list.includes(allergyInput.trim())) {
      list.push(allergyInput.trim());
    }
    setValue('drug_allergies', list.join(', '));
    setAllergyInput('');
  };

  const removeDrugAllergy = (index: number) => {
    const list = drugAllergiesValue
      ? drugAllergiesValue
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      : [];
    list.splice(index, 1);
    setValue('drug_allergies', list.join(', '));
  };

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

      {/* Chronic Conditions */}
      <View style={S.consultSectionCard}>
        <Text style={S.consultSectionTitle}>Chronic Conditions</Text>
        <View style={localStyles.inputAddRow}>
          <TextInput
            style={[localStyles.inputField, { flex: 1 }]}
            placeholder="Enter chronic condition (e.g. Hypertension)..."
            placeholderTextColor={theme.colors.textMuted}
            value={chronicInput}
            onChangeText={setChronicInput}
            onSubmitEditing={addChronicCondition}
            onBlur={addChronicCondition}
            returnKeyType="done"
          />
          <TouchableOpacity style={localStyles.addChipBtn} onPress={addChronicCondition}>
            <Text style={localStyles.addChipBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
        {Boolean(chronicConditionsValue) && (
          <View style={localStyles.chipsContainer}>
            {chronicConditionsValue
              .split(',')
              .map(st => st.trim())
              .filter(Boolean)
              .map((item, idx) => (
                <View key={`chronic-${idx}`} style={localStyles.chronicChipBadge}>
                  <Text style={localStyles.chronicChipText}>{item}</Text>
                  <TouchableOpacity
                    onPress={() => removeChronicCondition(idx)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={localStyles.chronicChipRemove}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        )}
      </View>

      {/* Drug Allergies */}
      <View style={S.consultSectionCard}>
        <Text style={S.consultSectionTitle}>Drug Allergies</Text>
        <View style={localStyles.inputAddRow}>
          <TextInput
            style={[localStyles.inputField, { flex: 1 }]}
            placeholder="Enter drug allergy (e.g. Penicillin)..."
            placeholderTextColor={theme.colors.textMuted}
            value={allergyInput}
            onChangeText={setAllergyInput}
            onSubmitEditing={addDrugAllergy}
            onBlur={addDrugAllergy}
            returnKeyType="done"
          />
          <TouchableOpacity style={localStyles.addChipBtn} onPress={addDrugAllergy}>
            <Text style={localStyles.addChipBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
        {Boolean(drugAllergiesValue) && (
          <View style={localStyles.chipsContainer}>
            {drugAllergiesValue
              .split(',')
              .map(st => st.trim())
              .filter(Boolean)
              .map((item, idx) => (
                <View key={`allergy-${idx}`} style={localStyles.allergyChipBadge}>
                  <Text style={localStyles.allergyChipText}>{item}</Text>
                  <TouchableOpacity
                    onPress={() => removeDrugAllergy(idx)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={localStyles.allergyChipRemove}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        )}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  inputAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  inputField: {
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    fontSize: 14,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
  },
  addChipBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChipBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chronicChipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
    gap: 6,
  },
  chronicChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#92400E',
  },
  chronicChipRemove: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
  },
  allergyChipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    gap: 6,
  },
  allergyChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#991B1B',
  },
  allergyChipRemove: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#991B1B',
  },
});

export default PrescriptionClinicalNotesStep;
