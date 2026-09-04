import React, { useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TCreatePrescriptionFormValues } from '../../../lib/schemas/createPrescription.schema';
import { patientDetailsStyles as S } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';

const DOSAGE_OPTIONS = ['1-0-1', '1-1-1', '0-1-0', '0-0-1', '1-0-0', '1-1-0', '0-1-1'];
const TIMING_OPTIONS = [
  'Before food',
  'After food',
  'With food',
  'Empty stomach',
  'At bedtime',
  'In morning',
  'As needed',
];
const STRENGTH_UNITS = ['mg', 'mcg', 'g', 'ml', 'IU', '%'];
const DURATION_UNITS = ['days', 'weeks', 'months'];

export const PrescriptionMedicationsStep: React.FC = () => {
  const { control, setValue, getValues } = useFormContext<TCreatePrescriptionFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });

  const [pickerModal, setPickerModal] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    index: number;
    field: 'dosage' | 'timing' | 'strengthUnit' | 'durationUnit';
  }>({
    visible: false,
    title: '',
    options: [],
    index: 0,
    field: 'dosage',
  });

  const openPicker = (
    index: number,
    field: 'dosage' | 'timing' | 'strengthUnit' | 'durationUnit',
    title: string,
    options: string[]
  ) => {
    setPickerModal({
      visible: true,
      title,
      options,
      index,
      field,
    });
  };

  const selectOption = (val: string) => {
    const { index, field } = pickerModal;
    setValue(`medications.${index}.${field}` as any, val);
    setPickerModal(prev => ({ ...prev, visible: false }));
  };

  return (
    <View style={{ gap: 14 }}>
      {fields.map((fieldItem, index) => (
        <View key={fieldItem.id} style={S.consultSectionCard}>
          {/* Card Header */}
          <View style={S.medCardHead}>
            <View style={S.medNumBadge}>
              <Text style={S.medNumText}>{index + 1}</Text>
            </View>
            <Text style={S.medCardTitle}>Medication {index + 1}</Text>
            <TouchableOpacity onPress={() => remove(index)} activeOpacity={0.7}>
              <Text style={S.removeText}>✕ Remove</Text>
            </TouchableOpacity>
          </View>

          {/* Medicine Name */}
          <View style={{ marginBottom: 12 }}>
            <Text style={S.vitalLabel}>
              Medicine Name <Text style={{ color: theme.colors.danger }}>*</Text>
            </Text>
            <Controller
              control={control}
              name={`medications.${index}.name`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.consultInput}
                  placeholder="Search or type medicine name..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View style={S.vitalsRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={S.vitalLabel}>Strength</Text>
              <View style={{ flexDirection: 'row' }}>
                <Controller
                  control={control}
                  name={`medications.${index}.strength`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        S.consultInput,
                        { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 },
                      ]}
                      placeholder="50"
                      placeholderTextColor={theme.colors.textMuted}
                      value={value || ''}
                      onChangeText={onChange}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                <TouchableOpacity
                  style={S.unitSelectBtn}
                  onPress={() => openPicker(index, 'strengthUnit', 'Select Unit', STRENGTH_UNITS)}
                >
                  <Text style={S.unitSelectText}>
                    {getValues(`medications.${index}.strengthUnit`) || 'mg'} ▾
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={S.vitalLabel}>
                Dosage <Text style={{ color: theme.colors.danger }}>*</Text>
              </Text>
              <TouchableOpacity
                style={S.pickerSelectBtn}
                onPress={() => openPicker(index, 'dosage', 'Select Dosage', DOSAGE_OPTIONS)}
              >
                <Text style={S.pickerSelectText}>
                  {getValues(`medications.${index}.dosage`) || 'Select'}
                </Text>
                <Text style={{ color: theme.colors.primary, fontSize: 12 }}>▾</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration & Timing Row */}
          <View style={S.vitalsRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={S.vitalLabel}>Duration</Text>
              <View style={{ flexDirection: 'row' }}>
                <Controller
                  control={control}
                  name={`medications.${index}.durationNum`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        S.consultInput,
                        { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 },
                      ]}
                      placeholder="30"
                      placeholderTextColor={theme.colors.textMuted}
                      value={value || ''}
                      onChangeText={onChange}
                      keyboardType="decimal-pad"
                    />
                  )}
                />
                <TouchableOpacity
                  style={S.unitSelectBtn}
                  onPress={() =>
                    openPicker(index, 'durationUnit', 'Select Duration Unit', DURATION_UNITS)
                  }
                >
                  <Text style={S.unitSelectText}>
                    {getValues(`medications.${index}.durationUnit`) || 'days'} ▾
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={S.vitalLabel}>Timing</Text>
              <TouchableOpacity
                style={S.pickerSelectBtn}
                onPress={() => openPicker(index, 'timing', 'Select Timing', TIMING_OPTIONS)}
              >
                <Text style={S.pickerSelectText}>
                  {getValues(`medications.${index}.timing`) || 'Select'}
                </Text>
                <Text style={{ color: theme.colors.primary, fontSize: 12 }}>▾</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Instructions */}
          <View>
            <Text style={S.vitalLabel}>Instructions</Text>
            <Controller
              control={control}
              name={`medications.${index}.instructions`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.consultInput}
                  placeholder="e.g. Take with water after meal"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
      ))}

      {/* Add Medication Button */}
      <TouchableOpacity
        onPress={() =>
          append({
            name: '',
            strength: '',
            strengthUnit: 'mg',
            dosage: '1-0-1',
            timing: 'After food',
            durationNum: '7',
            durationUnit: 'days',
            instructions: '',
          })
        }
        activeOpacity={0.85}
        style={S.addPrimaryBtn}
      >
        <Text style={S.addPrimaryBtnText}>+ Add Medication</Text>
      </TouchableOpacity>

      {/* Picker Modal */}
      <Modal
        visible={pickerModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerModal(p => ({ ...p, visible: false }))}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
          activeOpacity={1}
          onPress={() => setPickerModal(p => ({ ...p, visible: false }))}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              width: '85%',
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: theme.colors.textPrimary,
                marginBottom: 14,
              }}
            >
              {pickerModal.title}
            </Text>
            {pickerModal.options.map(opt => (
              <TouchableOpacity
                key={opt}
                onPress={() => selectOption(opt)}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.surfaceSecondary,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary }}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PrescriptionMedicationsStep;
