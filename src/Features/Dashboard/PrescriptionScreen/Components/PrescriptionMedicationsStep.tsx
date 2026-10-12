import React, { useState } from 'react';
import { Controller, FieldPath, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TrashIcon } from '../../../../components/ui/icons';
import { TCreatePrescriptionFormValues } from '../../../../lib/schemas/createPrescription.schema';
import { patientDetailsStyles } from '../../../../styled/PatientDetailsScreen.styled';
import theme from '../../../../styled/theme.styled';
import OptionPickerModal from '../Modals/OptionPickerModal';

const DOSAGE_OPTIONS = ['1-0-1', '1-1-1', '0-1-0', '0-0-1', '1-0-0', 'Custom'];
const TIMING_OPTIONS = [
  'Before food',
  'After food',
  'With food',
  'Empty stomach',
  'Custom',
];
const STRENGTH_UNITS = ['mg', 'ml', 'g', 'mcg', 'IU', '%', 'Custom'];
const DURATION_UNITS = ['days', 'weeks', 'months'];

type TMedicationPickerField = 'dosage' | 'timing' | 'strengthUnit' | 'durationUnit';

export const PrescriptionMedicationsStep: React.FC = () => {
  const { control, setValue } = useFormContext<TCreatePrescriptionFormValues>();
  const medications = useWatch({ control, name: 'medications' }) ?? [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });

  const [pickerModal, setPickerModal] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    index: number;
    field: TMedicationPickerField;
  }>({
    visible: false,
    title: '',
    options: [],
    index: 0,
    field: 'dosage',
  });

  const openPicker = (
    index: number,
    field: TMedicationPickerField,
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
    setValue(`medications.${index}.${field}` as FieldPath<TCreatePrescriptionFormValues>, val, {
      shouldDirty: true,
    });
  };

  return (
    <View style={{ gap: 14 }}>
      {fields.map((fieldItem, index) => (
        <View key={fieldItem.id} style={patientDetailsStyles.consultSectionCard}>
          <View style={patientDetailsStyles.medCardHead}>
            <View style={patientDetailsStyles.medNumBadge}>
              <Text style={patientDetailsStyles.medNumText}>{index + 1}</Text>
            </View>
            <Text style={patientDetailsStyles.medCardTitle}>Medication</Text>
            <TouchableOpacity
              onPress={() => remove(index)}
              activeOpacity={0.7}
              style={patientDetailsStyles.medRemoveBtn}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <TrashIcon size={13} color={theme.colors.danger} />
              <Text style={patientDetailsStyles.medRemoveBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
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
                    {medications[index]?.strengthUnit || 'mg'} ▾
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
                  {medications[index]?.dosage || 'Select'}
                </Text>
                <Text style={{ color: theme.colors.primary, fontSize: 12 }}>▾</Text>
              </TouchableOpacity>
            </View>
          </View>

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
                    {medications[index]?.durationUnit || 'days'} ▾
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
                  {medications[index]?.timing || 'Select'}
                </Text>
                <Text style={{ color: theme.colors.primary, fontSize: 12 }}>▾</Text>
              </TouchableOpacity>
            </View>
          </View>

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

      <OptionPickerModal
        visible={pickerModal.visible}
        title={pickerModal.title}
        options={pickerModal.options}
        selected={medications[pickerModal.index]?.[pickerModal.field]}
        onSelect={selectOption}
        onClose={() => setPickerModal(p => ({ ...p, visible: false }))}
      />
    </View>
  );
};

export default PrescriptionMedicationsStep;
