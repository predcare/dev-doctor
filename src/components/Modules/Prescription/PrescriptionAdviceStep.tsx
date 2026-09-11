import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { formatDate } from '../../../lib/common/common.utils';
import { TCreatePrescriptionFormValues } from '../../../lib/schemas/createPrescription.schema';
import { patientDetailsStyles as S } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';
import PredDatePickerModal from '../../commons/PredDatePickerModal/PredDatePickerModal';

export const PrescriptionAdviceStep: React.FC = () => {
  const { control, setValue, getValues } = useFormContext<TCreatePrescriptionFormValues>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dates = ['Tomorrow', 'In 3 Days', 'In 1 Week', 'In 2 Weeks', 'In 1 Month'];

  return (
    <View style={{ gap: 14 }}>
      <View style={S.consultSectionCard}>
        <Text style={S.consultSectionTitle}>Follow-up & General Advice</Text>

        <View style={{ marginBottom: 14 }}>
          <Text style={S.vitalLabel}>Scheduled Follow-up Date</Text>
          <TouchableOpacity
            style={S.consultDateBtn}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 14,
                color: getValues('follow_up_date')
                  ? theme.colors.textPrimary
                  : theme.colors.textMuted,
              }}
            >
              {getValues('follow_up_date')
                ? formatDate(getValues('follow_up_date'))
                : 'Tap to select follow-up date'}
            </Text>
            <Text style={{ fontSize: 16 }}>📅</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={S.vitalLabel}>General Advice</Text>
          <Controller
            control={control}
            name="general_advice"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={S.consultTextArea}
                placeholder="Advice for patient (diet, rest, precautions)..."
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
      </View>

      {/* Referral Information */}
      <View style={S.consultSectionCard}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={S.consultSectionTitle}>Referral Information</Text>
          <Text style={{ fontSize: 10, fontWeight: '700', color: theme.colors.textMuted }}>
            OPTIONAL
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={S.vitalLabel}>Specialist</Text>
          <Controller
            control={control}
            name="referral_specialist"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={S.consultInput}
                placeholder="e.g. Cardiologist, Neurologist..."
                placeholderTextColor={theme.colors.textMuted}
                value={value || ''}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={S.vitalLabel}>Doctor / Hospital</Text>
          <Controller
            control={control}
            name="referral_doctor_hospital"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={S.consultInput}
                placeholder="Referred doctor or hospital name..."
                placeholderTextColor={theme.colors.textMuted}
                value={value || ''}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <View>
          <Text style={S.vitalLabel}>Reason for Referral</Text>
          <Controller
            control={control}
            name="referral_reason"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={S.consultTextArea}
                placeholder="Describe reason for referral..."
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

      {/* Additional Notes */}
      <View style={S.consultSectionCard}>
        <Text style={S.consultSectionTitle}>Doctor Note (Not Visible to patient)</Text>
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={S.consultTextArea}
              placeholder="Any additional internal clinical notes..."
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

      {/* Follow-up Date Modal Picker */}
      <PredDatePickerModal
        visible={showDatePicker}
        value={
          getValues('follow_up_date') &&
          !isNaN(new Date(getValues('follow_up_date') || '').getTime())
            ? new Date(getValues('follow_up_date') || '')
            : new Date()
        }
        title="Select Follow-up Date"
        onConfirm={selectedDate => {
          console.log('selectedDate', selectedDate);
          setValue('follow_up_date', formatDate(selectedDate, 'YYYY-MM-DD'), {
            shouldValidate: true,
            shouldDirty: true,
          });
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
        minYear={new Date().getFullYear()}
        maxYear={new Date().getFullYear() + 5}
      />
    </View>
  );
};

export default PrescriptionAdviceStep;
