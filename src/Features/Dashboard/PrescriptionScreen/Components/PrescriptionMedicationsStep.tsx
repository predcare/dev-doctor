import React, { useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TCreatePrescriptionFormValues } from '../../../../lib/schemas/createPrescription.schema';
import { patientDetailsStyles } from '../../../../styled/PatientDetailsScreen.styled';
import theme from '../../../../styled/theme.styled';

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
        <View key={fieldItem.id} style={patientDetailsStyles.consultSectionCard}>
          {/* Card Header */}
          <View style={patientDetailsStyles.medCardHead}>
            <View style={patientDetailsStyles.medNumBadge}>
              <Text style={patientDetailsStyles.medNumText}>{index + 1}</Text>
            </View>
            <Text style={patientDetailsStyles.medCardTitle}>Medication {index + 1}</Text>
            <TouchableOpacity onPress={() => remove(index)} activeOpacity={0.7}>
              <Text style={patientDetailsStyles.removeText}>✕ Remove</Text>
            </TouchableOpacity>
          </View>

          {/* Medicine Name */}
          <View style={{ marginBottom: 12 }}>
            <Text style={patientDetailsStyles.vitalLabel}>
              Medicine Name <Text style={{ color: theme.colors.danger }}>*</Text>
            </Text>
            <Controller
              control={control}
              name={`medications.${index}.name`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={patientDetailsStyles.consultInput}
                  placeholder="Search or type medicine name..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View style={patientDetailsStyles.vitalsRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={patientDetailsStyles.vitalLabel}>Strength</Text>
              <View style={{ flexDirection: 'row' }}>
                <Controller
                  control={control}
                  name={`medications.${index}.strength`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        patientDetailsStyles.consultInput,
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
                  style={patientDetailsStyles.unitSelectBtn}
                  onPress={() => openPicker(index, 'strengthUnit', 'Select Unit', STRENGTH_UNITS)}
                >
                  <Text style={patientDetailsStyles.unitSelectText}>
                    {getValues(`medications.${index}.strengthUnit`) || 'mg'} ▾
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={patientDetailsStyles.vitalLabel}>
                Dosage <Text style={{ color: theme.colors.danger }}>*</Text>
              </Text>
              <TouchableOpacity
                style={patientDetailsStyles.pickerSelectBtn}
                onPress={() => openPicker(index, 'dosage', 'Select Dosage', DOSAGE_OPTIONS)}
              >
                <Text style={patientDetailsStyles.pickerSelectText}>
                  {getValues(`medications.${index}.dosage`) || 'Select'}
                </Text>
                <Text style={{ color: theme.colors.primary, fontSize: 12 }}>▾</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration & Timing Row */}
          <View style={patientDetailsStyles.vitalsRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={patientDetailsStyles.vitalLabel}>Duration</Text>
              <View style={{ flexDirection: 'row' }}>
                <Controller
                  control={control}
                  name={`medications.${index}.durationNum`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        patientDetailsStyles.consultInput,
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
                  style={patientDetailsStyles.unitSelectBtn}
                  onPress={() =>
                    openPicker(index, 'durationUnit', 'Select Duration Unit', DURATION_UNITS)
                  }
                >
                  <Text style={patientDetailsStyles.unitSelectText}>
                    {getValues(`medications.${index}.durationUnit`) || 'days'} ▾
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={patientDetailsStyles.vitalLabel}>Timing</Text>
              <TouchableOpacity
                style={patientDetailsStyles.pickerSelectBtn}
                onPress={() => openPicker(index, 'timing', 'Select Timing', TIMING_OPTIONS)}
              >
                <Text style={patientDetailsStyles.pickerSelectText}>
                  {getValues(`medications.${index}.timing`) || 'Select'}
                </Text>
                <Text style={{ color: theme.colors.primary, fontSize: 12 }}>▾</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Instructions */}
          <View>
            <Text style={patientDetailsStyles.vitalLabel}>Instructions</Text>
            <Controller
              control={control}
              name={`medications.${index}.instructions`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={patientDetailsStyles.consultInput}
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
        style={patientDetailsStyles.addPrimaryBtn}
      >
        <Text style={patientDetailsStyles.addPrimaryBtnText}>+ Add Medication</Text>
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
