import React from 'react';
import { Controller, Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TAddPatientSchemaType } from '../../../../lib/schemas/addPatient.schema';
import { theme } from '../../../../styled/theme.styled';

export interface ContactInfoFormProps {
  control: Control<TAddPatientSchemaType>;
  setValue: UseFormSetValue<TAddPatientSchemaType>;
  watch: UseFormWatch<TAddPatientSchemaType>;
  errors: FieldErrors<TAddPatientSchemaType>;
}

import ListPickerModal from '../Modals/ListPickerModal';

const mockCountries = [
  { id: 1, name: 'India' },
  { id: 2, name: 'United States' },
  { id: 3, name: 'United Kingdom' },
  { id: 4, name: 'Canada' },
  { id: 5, name: 'Australia' },
];

const mockStates = [
  { id: 10, name: 'Karnataka' },
  { id: 11, name: 'Maharashtra' },
  { id: 12, name: 'Delhi' },
  { id: 13, name: 'Tamil Nadu' },
  { id: 14, name: 'California' },
];

const mockCities = [
  { id: 100, name: 'Bengaluru' },
  { id: 101, name: 'Mumbai' },
  { id: 102, name: 'New Delhi' },
  { id: 103, name: 'Chennai' },
  { id: 104, name: 'Los Angeles' },
];

export const ContactInfoForm: React.FC<ContactInfoFormProps> = React.memo(
  ({ control, setValue, watch, errors }) => {
    const phone = watch('phone') || '';
    const country = watch('country') || 'India';
    const stateName = watch('state') || '';
    const cityName = watch('city') || '';

    const [showCountryModal, setShowCountryModal] = React.useState(false);
    const [showStateModal, setShowStateModal] = React.useState(false);
    const [showCityModal, setShowCityModal] = React.useState(false);

    return (
      <>
        {/* Mobile Number */}
        <View style={s.group}>
          <Text style={s.lbl}>
            MOBILE NUMBER <Text style={s.req}>*</Text>
          </Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[
                  s.inp,
                  !!errors.phone && s.inpErr,
                  (value || '').length === 10 && { borderColor: theme.colors.success },
                ]}
                placeholder="e.g. 9845012345"
                placeholderTextColor={theme.colors.textMuted}
                value={value || ''}
                onChangeText={v => onChange(v.replace(/\D/g, '').slice(0, 10))}
                onBlur={onBlur}
                keyboardType="phone-pad"
                maxLength={10}
              />
            )}
          />
          {errors.phone?.message ? (
            <Text style={s.errTxt}>{String(errors.phone.message)}</Text>
          ) : phone.length > 0 ? (
            <Text
              style={{
                fontSize: 11,
                marginTop: 3,
                color: phone.length === 10 ? theme.colors.success : theme.colors.danger,
              }}
            >
              {phone.length === 10 ? '✓ Valid phone number' : `${phone.length}/10 digits`}
            </Text>
          ) : null}
        </View>

        {/* Email Address */}
        <View style={s.group}>
          <Text style={s.lbl}>EMAIL ADDRESS</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[s.inp, !!errors.email && s.inpErr]}
                placeholder="e.g. eleanor.vance@example.com"
                placeholderTextColor={theme.colors.textMuted}
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email?.message && (
            <Text style={s.errTxt}>{String(errors.email.message)}</Text>
          )}
        </View>

        {/* Alt & WhatsApp */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={[s.group, { flex: 1 }]}>
            <Text style={s.lbl}>ALT. NUMBER</Text>
            <Controller
              control={control}
              name="alternate_number"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[s.inp, !!errors.alternate_number && s.inpErr]}
                  placeholder="9876543210"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={v => onChange(v.replace(/\D/g, '').slice(0, 10))}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              )}
            />
          </View>

          <View style={[s.group, { flex: 1 }]}>
            <Text style={s.lbl}>WHATSAPP</Text>
            <Controller
              control={control}
              name="whatsapp_number"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[s.inp, !!errors.whatsapp_number && s.inpErr]}
                  placeholder="9876543210"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={v => onChange(v.replace(/\D/g, '').slice(0, 10))}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              )}
            />
          </View>
        </View>

        {/* Street Address */}
        <View style={s.group}>
          <Text style={s.lbl}>
            STREET ADDRESS <Text style={s.req}>*</Text>
          </Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[
                  s.inp,
                  { minHeight: 70, textAlignVertical: 'top', paddingTop: 12 },
                  !!errors.address && s.inpErr,
                ]}
                placeholder="Enter full street address"
                placeholderTextColor={theme.colors.textMuted}
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
              />
            )}
          />
          {errors.address?.message && (
            <Text style={s.errTxt}>{String(errors.address.message)}</Text>
          )}
        </View>

        {/* Country & State Pickers */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={[s.group, { flex: 1 }]}>
            <Text style={s.lbl}>
              COUNTRY <Text style={s.req}>*</Text>
            </Text>
            <TouchableOpacity
              style={[s.inpRow, !!errors.country && s.inpErr]}
              onPress={() => setShowCountryModal(true)}
              activeOpacity={0.7}
            >
              <Text style={country ? s.inpTxt : s.inpPh}>{country || 'Select Country'}</Text>
              <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>▼</Text>
            </TouchableOpacity>
          </View>
          <View style={[s.group, { flex: 1 }]}>
            <Text style={s.lbl}>STATE</Text>
            <TouchableOpacity
              style={s.inpRow}
              onPress={() => setShowStateModal(true)}
              activeOpacity={0.7}
            >
              <Text style={stateName ? s.inpTxt : s.inpPh}>{stateName || 'Select State'}</Text>
              <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* City & Postal Code */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={[s.group, { flex: 1 }]}>
            <Text style={s.lbl}>CITY</Text>
            <TouchableOpacity
              style={s.inpRow}
              onPress={() => setShowCityModal(true)}
              activeOpacity={0.7}
            >
              <Text style={cityName ? s.inpTxt : s.inpPh}>{cityName || 'Select City'}</Text>
              <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>▼</Text>
            </TouchableOpacity>
          </View>
          <View style={[s.group, { flex: 1 }]}>
            <Text style={s.lbl}>POSTAL CODE</Text>
            <Controller
              control={control}
              name="postal_code"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={s.inp}
                  placeholder="560001"
                  placeholderTextColor={theme.colors.textMuted}
                  value={value || ''}
                  onChangeText={v => onChange(v.replace(/\D/g, ''))}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                />
              )}
            />
          </View>
        </View>

        <View style={s.infoBox}>
          <Text style={{ fontSize: 15 }}>ℹ️</Text>
          <Text style={s.infoTxt}>
            <Text style={{ fontWeight: '800' }}>Note:</Text> Patient will receive login credentials via SMS/Email after registration.
          </Text>
        </View>

        {/* Pickers */}
        <ListPickerModal
          visible={showCountryModal}
          onClose={() => setShowCountryModal(false)}
          title="Select Country"
          items={mockCountries}
          selected={country}
          onPick={it => setValue('country', it.name, { shouldValidate: true })}
        />
        <ListPickerModal
          visible={showStateModal}
          onClose={() => setShowStateModal(false)}
          title="Select State"
          items={mockStates}
          selected={stateName}
          onPick={it => setValue('state', it.name, { shouldValidate: true })}
        />
        <ListPickerModal
          visible={showCityModal}
          onClose={() => setShowCityModal(false)}
          title="Select City"
          items={mockCities}
          selected={cityName}
          onPick={it => setValue('city', it.name, { shouldValidate: true })}
        />
      </>
    );
  }
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
  req: { color: theme.colors.danger },
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
  inpErr: {
    borderColor: theme.colors.danger,
  },
  inpRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  inpTxt: { fontSize: 15, fontWeight: '400', color: theme.colors.dark },
  inpPh: { fontSize: 15, fontWeight: '400', color: theme.colors.textMuted },
  errTxt: {
    fontSize: 12,
    color: theme.colors.danger,
    marginTop: 5,
    fontWeight: '500',
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

export default ContactInfoForm;
