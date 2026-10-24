import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import PredDatePickerModal from '../../../../components/commons/PredDatePickerModal/PredDatePickerModal';
import { formatDate } from '../../../../lib/commons/common.utils';
import { TCreatePrescriptionFormValues } from '../../../../lib/schemas/createPrescription.schema';
import { patientDetailsStyles } from '../../../../styled/PatientDetailsScreen.styled';
import theme from '../../../../styled/theme.styled';
import CalendarCheckIcon from '../../../../components/ui/icons/CalendarCheckIcon';

export const PrescriptionAdviceStep: React.FC = () => {
  const { control, setValue, getValues } = useFormContext<TCreatePrescriptionFormValues>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View style={{ gap: 14 }}>
      <View style={patientDetailsStyles.consultSectionCard}>
        <Text style={patientDetailsStyles.consultSectionTitle}>Follow-up & General Advice</Text>

        <View style={{ marginBottom: 14 }}>
          <Text style={patientDetailsStyles.vitalLabel}>Scheduled Follow-up Date</Text>
          <TouchableOpacity
            style={patientDetailsStyles.consultDateBtn}
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
            <Text style={{ fontSize: 16 }}><CalendarCheckIcon/></Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={patientDetailsStyles.vitalLabel}>General Advice</Text>
          <Controller
            control={control}
            name="general_advice"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={patientDetailsStyles.consultTextArea}
                placeholder="Advice for Patient (Diet, Rest, Precautions)..."
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
      <View style={patientDetailsStyles.consultSectionCard}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={patientDetailsStyles.consultSectionTitle}>Referral Information</Text>
          <Text style={{ fontSize: 10, fontWeight: '700', color: theme.colors.textMuted }}>
            OPTIONAL
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={patientDetailsStyles.vitalLabel}>Specialist</Text>
          <Controller
            control={control}
            name="referral_specialist"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={patientDetailsStyles.consultInput}
                placeholder="e.g. Cardiologist, Neurologist..."
                placeholderTextColor={theme.colors.textMuted}
                value={value || ''}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={patientDetailsStyles.vitalLabel}>Hospital</Text>
          <Controller
            control={control}
            name="referral_doctor_hospital"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={patientDetailsStyles.consultInput}
                placeholder="Referred Hospital Name..."
                placeholderTextColor={theme.colors.textMuted}
                value={value || ''}
                onChangeText={onChange}
              />
            )}
          />
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={patientDetailsStyles.vitalLabel}>Doctor</Text>
          <Controller
            control={control}
            name="referral_doctor_name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={patientDetailsStyles.consultInput}
                placeholder="Referred Doctor Name..."
                placeholderTextColor={theme.colors.textMuted}
                value={value || ''}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <View>
          <Text style={patientDetailsStyles.vitalLabel}>Reason for Referral</Text>
          <Controller
            control={control}
            name="referral_reason"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={patientDetailsStyles.consultTextArea}
                placeholder="Describe Reason for Referral..."
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
