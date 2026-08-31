import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { patientDetailsStyles as S } from '../../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../../styled/theme.styled';
import { ConsultFormValues } from './consultSchema';
import { showSuccessToast } from '../../../../lib/commons/toast.utils';

export const AdviceStepForm: React.FC = () => {
  const { control, setValue, getValues } = useFormContext<ConsultFormValues>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dates = [
    'Tomorrow',
    'In 3 Days (15 Aug 2026)',
    'In 1 Week (19 Aug 2026)',
    'In 2 Weeks (26 Aug 2026)',
    'In 1 Month (12 Sep 2026)',
  ];

  const handleSaveDraft = () => {
    showSuccessToast('Prescription draft saved successfully', 'Draft Saved');
  };

  return (
    <View style={{ gap: 14 }}>
      {/* Follow-up & General Advice */}
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
                fontFamily: 'Inter_400Regular',
              }}
            >
              {getValues('follow_up_date') || 'Tap to select follow-up date'}
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
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              color: theme.colors.textMuted,
            }}
          >
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
        <Text style={S.consultSectionTitle}>Additional Notes</Text>
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

      {/* Save Draft Button */}
      <TouchableOpacity
        style={S.draftBtn}
        onPress={handleSaveDraft}
        activeOpacity={0.8}
      >
        <Text style={S.draftBtnText}>💾 Save Draft</Text>
      </TouchableOpacity>

      {/* Follow-up Date Modal Picker */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
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
          onPress={() => setShowDatePicker(false)}
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
                fontFamily: 'Inter_700Bold',
              }}
            >
              Select Follow-up Date
            </Text>
            {dates.map(d => (
              <TouchableOpacity
                key={d}
                onPress={() => {
                  setValue('follow_up_date', d);
                  setShowDatePicker(false);
                }}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.surfaceSecondary,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.colors.textPrimary,
                    fontFamily: 'Inter_600SemiBold',
                  }}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default AdviceStepForm;
