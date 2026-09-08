import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { TAddPatientSchemaType } from '../../../../lib/schemas/addPatient.schema';
import { MedicalInfoStyles } from '../../../../styled/AddPatientStyles.styled';
import { theme } from '../../../../styled/theme.styled';

export interface MedicalInfoFormProps {
  control?: Control<TAddPatientSchemaType>;
  medical?: string;
  onMedical?: (v: string) => void;
}

export const MedicalInfoForm: React.FC<MedicalInfoFormProps> = React.memo(
  ({ control, medical, onMedical }) => (
    <>
      <View style={MedicalInfoStyles.group}>
        <Text style={MedicalInfoStyles.lbl}>MEDICAL HISTORY & ALLERGIES</Text>
        {control ? (
          <Controller
            control={control}
            name="medical_history"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[
                  MedicalInfoStyles.inp,
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
              MedicalInfoStyles.inp,
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
      <View style={MedicalInfoStyles.infoBox}>
        <Text style={{ fontSize: 15 }}>ℹ️</Text>
        <Text style={MedicalInfoStyles.infoTxt}>
          <Text style={{ fontWeight: '800' }}>Note:</Text> Medical history is optional but helps
          doctors provide better personalized clinical care.
        </Text>
      </View>
    </>
  )
);

export default MedicalInfoForm;
