import React, { useEffect, useMemo, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  useCitiesBySId,
  useCountries,
  useStatesByCId,
} from '../../../../hooks/react-query/common/common.hooks';
import { TAddPatientSchemaType } from '../../../../lib/schemas/addPatient.schema';
import { theme } from '../../../../styled/theme.styled';

export interface ContactInfoFormProps {
  control: Control<TAddPatientSchemaType>;
  setValue: UseFormSetValue<TAddPatientSchemaType>;
  watch: UseFormWatch<TAddPatientSchemaType>;
  errors: FieldErrors<TAddPatientSchemaType>;
}

import { ContactInfoStyles } from '../../../../styled/AddPatientStyles.styled';
import ListPickerModal from '../Modals/ListPickerModal';

export const ContactInfoForm: React.FC<ContactInfoFormProps> = React.memo(
  ({ control, setValue, watch, errors }) => {
    const phone = watch('phone') || '';
    const country = watch('country') || 'India';
    const stateName = watch('state') || '';
    const cityName = watch('city') || '';

    const [showCountryModal, setShowCountryModal] = useState(false);
    const [showStateModal, setShowStateModal] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);

    const [selectedCountryId, setSelectedCountryId] = useState<number | undefined>();
    const [selectedStateId, setSelectedStateId] = useState<number | undefined>();

    const { data: rawCountries, isPending: loadingCountries } = useCountries();
    const { data: rawStates, isPending: loadingStates } = useStatesByCId(
      selectedCountryId ? { cId: selectedCountryId } : undefined
    );
    const { data: rawCities, isPending: loadingCities } = useCitiesBySId(
      selectedStateId ? { sId: selectedStateId } : undefined
    );

    const countries = useMemo(() => {
      if (!Array.isArray(rawCountries)) return [];
      return rawCountries.map((c: any) => ({
        id: Number(c.id) || c.id,
        name: c.name,
      }));
    }, [rawCountries]);

    const states = useMemo(() => {
      if (!Array.isArray(rawStates)) return [];
      return rawStates.map((ContactInfoStyles: any) => ({
        id: Number(ContactInfoStyles.id) || ContactInfoStyles.id,
        name: ContactInfoStyles.name,
      }));
    }, [rawStates]);

    const cities = useMemo(() => {
      if (!Array.isArray(rawCities)) return [];
      return rawCities.map((c: any) => ({
        id: Number(c.id) || c.id,
        name: c.name,
      }));
    }, [rawCities]);

    useEffect(() => {
      if (!selectedCountryId && country && countries.length > 0) {
        const found = countries.find((c: any) => c.name.toLowerCase() === country.toLowerCase());
        if (found) {
          setSelectedCountryId(Number(found.id));
        }
      }
    }, [country, countries, selectedCountryId]);

    useEffect(() => {
      if (!selectedStateId && stateName && states.length > 0) {
        const found = states.find(
          (ContactInfoStyles: any) =>
            ContactInfoStyles.name.toLowerCase() === stateName.toLowerCase()
        );
        if (found) {
          setSelectedStateId(Number(found.id));
        }
      }
    }, [stateName, states, selectedStateId]);

    return (
      <>
        <View style={ContactInfoStyles.group}>
          <Text style={ContactInfoStyles.lbl}>
            MOBILE NUMBER <Text style={ContactInfoStyles.req}>*</Text>
          </Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[
                  ContactInfoStyles.inp,
                  !!errors.phone && ContactInfoStyles.inpErr,
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
            <Text style={ContactInfoStyles.errTxt}>{String(errors.phone.message)}</Text>
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
        <View style={ContactInfoStyles.group}>
          <Text style={ContactInfoStyles.lbl}>EMAIL ADDRESS</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[ContactInfoStyles.inp, !!errors.email && ContactInfoStyles.inpErr]}
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
            <Text style={ContactInfoStyles.errTxt}>{String(errors.email.message)}</Text>
          )}
        </View>

        {/* Alt & WhatsApp */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={[ContactInfoStyles.group, { flex: 1 }]}>
            <Text style={ContactInfoStyles.lbl}>ALTERNATE NUMBER</Text>
            <Controller
              control={control}
              name="alternate_number"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[
                    ContactInfoStyles.inp,
                    !!errors.alternate_number && ContactInfoStyles.inpErr,
                  ]}
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
        <View style={ContactInfoStyles.group}>
          <Text style={ContactInfoStyles.lbl}>
            STREET ADDRESS <Text style={ContactInfoStyles.req}>*</Text>
          </Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[
                  ContactInfoStyles.inp,
                  { height: 'auto', minHeight: 70, textAlignVertical: 'top', paddingTop: 12 },
                  !!errors.address && ContactInfoStyles.inpErr,
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
            <Text style={ContactInfoStyles.errTxt}>{String(errors.address.message)}</Text>
          )}
        </View>

        {/* Country & State Pickers */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={[ContactInfoStyles.group, { flex: 1 }]}>
            <Text style={ContactInfoStyles.lbl}>
              COUNTRY <Text style={ContactInfoStyles.req}>*</Text>
            </Text>
            <TouchableOpacity
              style={[ContactInfoStyles.inpRow, !!errors.country && ContactInfoStyles.inpErr]}
              onPress={() => setShowCountryModal(true)}
              activeOpacity={0.7}
            >
              <Text style={country ? ContactInfoStyles.inpTxt : ContactInfoStyles.inpPh}>
                {country || 'Select Country'}
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>▼</Text>
            </TouchableOpacity>
          </View>
          <View style={[ContactInfoStyles.group, { flex: 1 }]}>
            <Text style={ContactInfoStyles.lbl}>STATE</Text>
            <TouchableOpacity
              style={ContactInfoStyles.inpRow}
              onPress={() => setShowStateModal(true)}
              activeOpacity={0.7}
            >
              <Text style={stateName ? ContactInfoStyles.inpTxt : ContactInfoStyles.inpPh}>
                {stateName || 'Select State'}
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* City & Postal Code */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={[ContactInfoStyles.group, { flex: 1 }]}>
            <Text style={ContactInfoStyles.lbl}>CITY</Text>
            <TouchableOpacity
              style={ContactInfoStyles.inpRow}
              onPress={() => setShowCityModal(true)}
              activeOpacity={0.7}
            >
              <Text style={cityName ? ContactInfoStyles.inpTxt : ContactInfoStyles.inpPh}>
                {cityName || 'Select City'}
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>▼</Text>
            </TouchableOpacity>
          </View>
          <View style={[ContactInfoStyles.group, { flex: 1 }]}>
            <Text style={ContactInfoStyles.lbl}>POSTAL CODE</Text>
            <Controller
              control={control}
              name="postal_code"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={ContactInfoStyles.inp}
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

        <View style={ContactInfoStyles.infoBox}>
          <Text style={{ fontSize: 15 }}>ℹ️</Text>
          <Text style={ContactInfoStyles.infoTxt}>
            <Text style={{ fontWeight: '800' }}>Note:</Text> Patient will receive login credentials
            via SMS/Email after registration.
          </Text>
        </View>

        {/* Pickers */}
        <ListPickerModal
          visible={showCountryModal}
          onClose={() => setShowCountryModal(false)}
          title="Select Country"
          items={countries}
          selected={country}
          isLoading={loadingCountries}
          onPick={it => {
            setValue('country', it.name, { shouldValidate: true });
            setSelectedCountryId(Number(it.id));
            setValue('state', '', { shouldValidate: true });
            setValue('city', '', { shouldValidate: true });
            setSelectedStateId(undefined);
          }}
        />
        <ListPickerModal
          visible={showStateModal}
          onClose={() => setShowStateModal(false)}
          title="Select State"
          items={states}
          selected={stateName}
          isLoading={loadingStates}
          onPick={it => {
            setValue('state', it.name, { shouldValidate: true });
            setSelectedStateId(Number(it.id));
            setValue('city', '', { shouldValidate: true });
          }}
        />
        <ListPickerModal
          visible={showCityModal}
          onClose={() => setShowCityModal(false)}
          title="Select City"
          items={cities}
          selected={cityName}
          isLoading={loadingCities}
          onPick={it => setValue('city', it.name, { shouldValidate: true })}
        />
      </>
    );
  }
);

export default ContactInfoForm;
