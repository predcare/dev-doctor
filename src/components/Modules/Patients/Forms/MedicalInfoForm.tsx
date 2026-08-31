import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { TAddPatientSchemaType } from '../../../../lib/schemas/addPatient.schema';
import { theme } from '../../../../styled/theme.styled';

export interface MedicalInfoFormProps {
  control?: Control<TAddPatientSchemaType>;
  medical?: string;
  onMedical?: (v: string) => void;
}

export const MedicalInfoForm: React.FC<MedicalInfoFormProps> = React.memo(
  ({ control, medical, onMedical }) => (
    <>
      <View style={s.group}>
        <Text style={s.lbl}>MEDICAL HISTORY & ALLERGIES</Text>
        {control ? (
          <Controller
            control={control}
            name="medical_history"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[
                  s.inp,
                  { height: 160, textAlignVertical: 'top', paddingTop: 14 },
                ]}
                placeholder={
                  'Known medical conditions, allergies, past surgeries, current medications...'
                }
                placeholderTextColor={theme.colors.textMuted}
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
              />
            )}
          />
        ) : (
          <TextInput
            style={[
              s.inp,
              { height: 160, textAlignVertical: 'top', paddingTop: 14 },
            ]}
            placeholder={
              'Known medical conditions, allergies, past surgeries, current medications...'
            }
            placeholderTextColor={theme.colors.textMuted}
            value={medical || ''}
            onChangeText={onMedical}
            multiline
          />
        )}
      </View>
      <View style={s.infoBox}>
        <Text style={{ fontSize: 15 }}>ℹ️</Text>
        <Text style={s.infoTxt}>
          <Text style={{ fontWeight: '800' }}>Note:</Text> Medical history is optional but helps doctors provide better personalized clinical care.
        </Text>
      </View>
    </>
  )
);

const s = StyleSheet.create({
  group: { marginBottom: 18 },
  lbl: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 1.1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inp: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '400',
    color: theme.colors.dark,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  infoBox: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  infoTxt: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.primary,
    lineHeight: 20,
  },
});

export default MedicalInfoForm;
