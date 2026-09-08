import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PatientLocationSelectModal from '../../components/Modules/PatientDetails/PatientProfile/PatientLocationSelectModal';
import BloodGroupModal from '../../components/Modules/Patients/Modals/BloodGroupModal';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import EditPatientSkeleton from '../../components/Skeletons/EditPatientSkeleton';
import {
  useCitiesBySId,
  useCountries,
  useStatesByCId,
} from '../../hooks/react-query/common/common.hooks';
import {
  useMyPatientInfo,
  useUpdatePatientInfo,
} from '../../hooks/react-query/patients/patients.hooks';
import { PatientsQueryKeys } from '../../hooks/react-query/query.keys';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { showErrorToast, showSuccessToast } from '../../lib/common/toast.utils';
import { EditPatientSchema, TEditPatientSchemaType } from '../../lib/schemas/editPatient.schema';
import type { EditPatientScreenProps } from '../../route';
import { editPatientStyles } from '../../styled/EditPatientScreen.styled';
import theme from '../../styled/theme.styled';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const LockedField = ({ label, value }: { label: string; value: string }) => (
  <View style={editPatientStyles.inputGroup}>
    <Text style={editPatientStyles.label}>{label}</Text>
    <View style={editPatientStyles.lockedInput}>
      <Text style={editPatientStyles.lockedText}>{value || '—'}</Text>
    </View>
  </View>
);

export const EditPatientScreen: React.FC<EditPatientScreenProps> = ({ route, navigation }) => {
  const routeParams = route?.params;
  const paramPatientId = routeParams?.patientId;
  const paramPatientName = routeParams?.patientName;

  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showBloodGroupModal, setShowBloodGroupModal] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<number | undefined>();
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>();

  const { hideLoader, showLoader } = useLoadingStore(state => state);

  const { data: patientInfo, isPending: fetchingPatientInfo } = useMyPatientInfo({
    patientId: paramPatientId,
  });

  const { data: rawCountries, isPending: loadingCountries } = useCountries();
  const { data: rawStates, isPending: loadingStates } = useStatesByCId(
    selectedCountryId ? { cId: selectedCountryId } : undefined
  );
  const { data: rawCities, isPending: loadingCities } = useCitiesBySId(
    selectedStateId ? { sId: selectedStateId } : undefined
  );
  const { mutate: updatePatient, isPending: patientUpdatePending } = useUpdatePatientInfo();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TEditPatientSchemaType>({
    resolver: yupResolver(EditPatientSchema),
    defaultValues: {
      address: '',
      country: 'India',
      state: '',
      city: '',
      postal_code: '',
      blood_pressure: '',
      pulse: '',
      temperature: '',
      spo2: '',
      weight: '',
      height: '',
      bmi: '',
      medical_history: '',
      blood_type: '',
    },
  });

  const weightVal = useWatch({ control, name: 'weight' });
  const heightVal = useWatch({ control, name: 'height' });
  const countryName = useWatch({ control, name: 'country' });
  const stateName = useWatch({ control, name: 'state' });
  const cityName = useWatch({ control, name: 'city' });
  const bloodGroupVal = useWatch({ control, name: 'blood_type' });

  const roName = patientInfo?.name || paramPatientName || 'N/A';
  const roEmail = patientInfo?.email || 'N/A';
  const roPhone = patientInfo?.phone_number || 'N/A';
  const roGender = patientInfo?.gender_display || patientInfo?.gender || 'N/A';
  const roDob = patientInfo?.date_of_birth || 'N/A';
  const displayPatientId = patientInfo?.patient_id || '';

  const countries = useMemo(() => {
    if (!Array.isArray(rawCountries)) return [];
    return rawCountries.map((c: any) => ({
      id: Number(c.id) || c.id,
      name: c.name,
    }));
  }, [rawCountries]);

  const states = useMemo(() => {
    if (!Array.isArray(rawStates)) return [];
    return rawStates.map((s: any) => ({
      id: Number(s.id) || s.id,
      name: s.name,
    }));
  }, [rawStates]);

  const cities = useMemo(() => {
    if (!Array.isArray(rawCities)) return [];
    return rawCities.map((c: any) => ({
      id: Number(c.id) || c.id,
      name: c.name,
    }));
  }, [rawCities]);

  const calculatedBmi = useMemo(() => {
    const w = parseFloat(weightVal || '');
    const h = parseFloat(heightVal || '');
    if (w > 0 && h > 0) {
      return (w / Math.pow(h / 100, 2)).toFixed(2);
    }
    return patientInfo?.bmi ? String(patientInfo.bmi) : '';
  }, [weightVal, heightVal, patientInfo?.bmi]);

  const onSubmit = (data: TEditPatientSchemaType) => {
    if (!paramPatientId) return showErrorToast('No patient ID found');
    const trim = (v: string | null | undefined) => (v?.trim() ? v.trim() : null);
    const payload = {
      address: trim(data.address) || '',
      city: trim(data.city) || '',
      state: trim(data.state) || '',
      country: trim(data.country) || 'India',
      postal_code: trim(data.postal_code) || '',
      blood_pressure: trim(data.blood_pressure) || '',
      pulse: trim(data.pulse) || '',
      temperature: trim(data.temperature) || '',
      spo2: trim(data.spo2) || '',
      weight: trim(data.weight) || '',
      height: trim(data.height) || '',
      bmi: trim(calculatedBmi) || '',
      medical_history: trim(data.medical_history) || '',
      blood_type: trim(data.blood_type) || '',
    };
    updatePatient(
      {
        body: payload,
        patientId: paramPatientId,
      },
      {
        onSuccess: async () => {
          showSuccessToast('Patient information updated successfully!');
          showLoader('Please Wait...');
          await queryClient.invalidateQueries({ queryKey: [PatientsQueryKeys.PatientInfo] });
          hideLoader();
          navigation?.goBack();
        },
        onError: () => {
          hideLoader();
        },
      }
    );
  };

  useEffect(() => {
    if (patientInfo) {
      reset({
        address: patientInfo.address || '',
        country: patientInfo.country || 'India',
        state: patientInfo.state || '',
        city: patientInfo.city || '',
        postal_code: patientInfo.postal_code ? String(patientInfo.postal_code) : '',
        blood_pressure: patientInfo.blood_pressure ? String(patientInfo.blood_pressure) : '',
        pulse: patientInfo.pulse ? String(patientInfo.pulse) : '',
        temperature: patientInfo.temperature ? String(patientInfo.temperature) : '',
        spo2: patientInfo.spo2 ? String(patientInfo.spo2) : '',
        weight: patientInfo.weight ? String(patientInfo.weight) : '',
        height: patientInfo.height ? String(patientInfo.height) : '',
        bmi: patientInfo.bmi ? String(patientInfo.bmi) : '',
        medical_history: patientInfo.medical_history || '',
        blood_type: patientInfo.blood_type || '',
      });
    }
  }, [patientInfo, reset]);

  useEffect(() => {
    if (countryName && countries.length > 0) {
      const found = countries.find((c: any) => c.name.toLowerCase() === countryName.toLowerCase());
      if (found) {
        setSelectedCountryId(Number(found.id));
      }
    }
  }, [countryName, countries]);

  useEffect(() => {
    if (stateName && states.length > 0) {
      const found = states.find((s: any) => s.name.toLowerCase() === stateName.toLowerCase());
      if (found) {
        setSelectedStateId(Number(found.id));
      }
    }
  }, [stateName, states]);

  if (fetchingPatientInfo) {
    return <EditPatientSkeleton />;
  }

  return (
    <SafeAreaWrapper>
      <View style={editPatientStyles.header}>
        <TouchableOpacity
          style={editPatientStyles.backCircle}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.8}
        >
          <Text style={editPatientStyles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={editPatientStyles.headerTitle}>Edit Profile</Text>
        <View style={editPatientStyles.idBadge}>
          <Text style={editPatientStyles.idBadgeTxt} numberOfLines={1}>
            #{displayPatientId}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={editPatientStyles.sectionRow}>
          <View style={[editPatientStyles.sectionBar, { backgroundColor: '#6366F1' }]} />
          <Text style={editPatientStyles.sectionTitle}>Personal Information</Text>
          <View style={editPatientStyles.cantEditBadge}>
            <Text style={editPatientStyles.cantEditTxt}>🔒 Doctor cannot edit</Text>
          </View>
        </View>

        <View style={editPatientStyles.card}>
          <LockedField label="Full Name" value={roName} />
          <LockedField label="Email Address" value={roEmail} />
          <LockedField label="Phone Number" value={roPhone} />
          <LockedField label="Gender" value={roGender} />
          <LockedField label="Date of Birth" value={roDob} />
        </View>
        <View style={editPatientStyles.sectionRow}>
          <View style={[editPatientStyles.sectionBar, { backgroundColor: theme.colors.primary }]} />
          <Text style={editPatientStyles.sectionTitle}>Address Information</Text>
        </View>

        <View style={editPatientStyles.card}>
          <View style={editPatientStyles.inputGroup}>
            <Text style={editPatientStyles.label}>Address</Text>
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[editPatientStyles.input, editPatientStyles.textArea]}
                  placeholder="Enter street address"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#9CA3AF"
                  textAlignVertical="top"
                />
              )}
            />
            {errors.address && (
              <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                {errors.address.message}
              </Text>
            )}
          </View>

          <View style={editPatientStyles.inputGroup}>
            <Text style={editPatientStyles.label}>Country</Text>
            <TouchableOpacity
              style={editPatientStyles.picker}
              onPress={() => setShowCountryModal(true)}
              activeOpacity={0.7}
            >
              <Text style={editPatientStyles.pickerTxt}>{countryName || 'Select Country'}</Text>
              <Text style={editPatientStyles.chevron}>▼</Text>
            </TouchableOpacity>
            {errors.country && (
              <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                {errors.country.message}
              </Text>
            )}
          </View>

          <View style={editPatientStyles.inputGroup}>
            <Text style={editPatientStyles.label}>State</Text>
            <TouchableOpacity
              style={editPatientStyles.picker}
              onPress={() => setShowStateModal(true)}
              activeOpacity={0.7}
            >
              <Text style={editPatientStyles.pickerTxt}>{stateName || 'Select State'}</Text>
              <Text style={editPatientStyles.chevron}>▼</Text>
            </TouchableOpacity>
            {errors.state && (
              <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                {errors.state.message}
              </Text>
            )}
          </View>

          <View style={editPatientStyles.row}>
            <View style={[editPatientStyles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={editPatientStyles.label}>City</Text>
              <TouchableOpacity
                style={editPatientStyles.picker}
                onPress={() => setShowCityModal(true)}
                activeOpacity={0.7}
              >
                <Text style={editPatientStyles.pickerTxt} numberOfLines={1}>
                  {cityName || 'Select City'}
                </Text>
                <Text style={editPatientStyles.chevron}>▼</Text>
              </TouchableOpacity>
              {errors.city && (
                <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                  {errors.city.message}
                </Text>
              )}
            </View>

            <View style={[editPatientStyles.inputGroup, { flex: 1 }]}>
              <Text style={editPatientStyles.label}>Postal Code</Text>
              <Controller
                control={control}
                name="postal_code"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={editPatientStyles.input}
                    placeholder="560001"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
              {errors.postal_code && (
                <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                  {errors.postal_code.message}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={editPatientStyles.sectionRow}>
          <View style={[editPatientStyles.sectionBar, { backgroundColor: '#EF4444' }]} />
          <Text style={editPatientStyles.sectionTitle}>Vital Signs</Text>
        </View>

        <View style={editPatientStyles.card}>
          <View style={editPatientStyles.row}>
            <View style={[editPatientStyles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={editPatientStyles.label}>Blood Pressure</Text>
              <Controller
                control={control}
                name="blood_pressure"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={editPatientStyles.input}
                    placeholder="120/80"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
              {errors.blood_pressure && (
                <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                  {errors.blood_pressure.message}
                </Text>
              )}
            </View>
            <View style={[editPatientStyles.inputGroup, { flex: 1 }]}>
              <Text style={editPatientStyles.label}>Pulse (bpm)</Text>
              <Controller
                control={control}
                name="pulse"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={editPatientStyles.input}
                    placeholder="72"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
              {errors.pulse && (
                <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                  {errors.pulse.message}
                </Text>
              )}
            </View>
          </View>

          <View style={editPatientStyles.row}>
            <View style={[editPatientStyles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={editPatientStyles.label}>Temperature (°F)</Text>
              <Controller
                control={control}
                name="temperature"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={editPatientStyles.input}
                    placeholder="98.6"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
              {errors.temperature && (
                <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                  {errors.temperature.message}
                </Text>
              )}
            </View>
            <View style={[editPatientStyles.inputGroup, { flex: 1 }]}>
              <Text style={editPatientStyles.label}>SpO2 (%)</Text>
              <Controller
                control={control}
                name="spo2"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={editPatientStyles.input}
                    placeholder="98"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                    maxLength={3}
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
              {errors.spo2 && (
                <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                  {errors.spo2.message}
                </Text>
              )}
            </View>
          </View>

          <View style={editPatientStyles.row}>
            <View style={[editPatientStyles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={editPatientStyles.label}>Weight (kg)</Text>
              <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={editPatientStyles.input}
                    placeholder="70"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
              {errors.weight && (
                <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                  {errors.weight.message}
                </Text>
              )}
            </View>
            <View style={[editPatientStyles.inputGroup, { flex: 1 }]}>
              <Text style={editPatientStyles.label}>Height (cm)</Text>
              <Controller
                control={control}
                name="height"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={editPatientStyles.input}
                    placeholder="170"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
              {errors.height && (
                <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                  {errors.height.message}
                </Text>
              )}
            </View>
          </View>

          {!!calculatedBmi && (
            <View style={[editPatientStyles.inputGroup, { marginBottom: 16 }]}>
              <Text style={editPatientStyles.label}>BMI (Auto-calculated)</Text>
              <View style={editPatientStyles.bmiBox}>
                <Text style={editPatientStyles.bmiVal}>{calculatedBmi}</Text>
                <Text style={editPatientStyles.bmiUnit}>kg/m²</Text>
              </View>
            </View>
          )}

          <View style={[editPatientStyles.inputGroup, { marginBottom: 0 }]}>
            <Text style={editPatientStyles.label}>Blood Group</Text>
            <TouchableOpacity
              style={editPatientStyles.picker}
              onPress={() => setShowBloodGroupModal(true)}
              activeOpacity={0.7}
            >
              <Text style={editPatientStyles.pickerTxt}>
                {bloodGroupVal || 'Select Blood Group'}
              </Text>
              <Text style={editPatientStyles.chevron}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={editPatientStyles.sectionRow}>
          <View style={[editPatientStyles.sectionBar, { backgroundColor: '#F59E0B' }]} />
          <Text style={editPatientStyles.sectionTitle}>Medical Information</Text>
        </View>

        <View style={editPatientStyles.card}>
          <View style={[editPatientStyles.inputGroup, { marginBottom: 0 }]}>
            <Text style={editPatientStyles.label}>Medical History</Text>
            <Controller
              control={control}
              name="medical_history"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[editPatientStyles.input, editPatientStyles.textArea]}
                  placeholder="Chronic conditions, past surgeries..."
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#9CA3AF"
                  textAlignVertical="top"
                />
              )}
            />
            {errors.medical_history && (
              <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>
                {errors.medical_history.message}
              </Text>
            )}
          </View>
        </View>

        <View style={editPatientStyles.btnRow}>
          <TouchableOpacity
            style={editPatientStyles.cancelBtn}
            onPress={() => navigation?.goBack()}
            disabled={patientUpdatePending}
          >
            <Text style={editPatientStyles.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[editPatientStyles.saveBtn, patientUpdatePending && { opacity: 0.6 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={patientUpdatePending}
            activeOpacity={0.85}
          >
            {patientUpdatePending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={editPatientStyles.saveTxt}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <PatientLocationSelectModal
        visible={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        title="Select Country"
        items={countries}
        selected={countryName || ''}
        isLoading={loadingCountries}
        onPick={it => {
          setValue('country', it.name, { shouldValidate: true });
          setSelectedCountryId(Number(it.id));
          setValue('state', '', { shouldValidate: true });
          setValue('city', '', { shouldValidate: true });
          setSelectedStateId(undefined);
        }}
      />
      <PatientLocationSelectModal
        visible={showStateModal}
        onClose={() => setShowStateModal(false)}
        title="Select State"
        items={states}
        selected={stateName || ''}
        isLoading={loadingStates}
        onPick={it => {
          setValue('state', it.name, { shouldValidate: true });
          setSelectedStateId(Number(it.id));
          setValue('city', '', { shouldValidate: true });
        }}
      />
      <PatientLocationSelectModal
        visible={showCityModal}
        onClose={() => setShowCityModal(false)}
        title="Select City"
        items={cities}
        selected={cityName || ''}
        isLoading={loadingCities}
        onPick={it => setValue('city', it.name, { shouldValidate: true })}
      />
      <BloodGroupModal
        visible={showBloodGroupModal}
        selectedGroup={bloodGroupVal || ''}
        onClose={() => setShowBloodGroupModal(false)}
        onSelect={bg => {
          setValue('blood_type', bg, { shouldValidate: true });
        }}
      />
    </SafeAreaWrapper>
  );
};

export default EditPatientScreen;
