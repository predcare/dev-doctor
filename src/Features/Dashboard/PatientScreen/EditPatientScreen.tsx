import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import {
    CalendarIcon,
    InfoCircleIcon,
    MailIcon,
    PatientGenderIcon,
    PhoneIcon,
} from '../../../components/ui/icons';
import { useCitiesBySId, useCountries, useStatesByCId } from '../../../hooks/react-query/common/common.hooks';
import { useMyPatientInfo, useUpdatePatientInfo } from '../../../hooks/react-query/patients/patients.hooks';
import { PatientsQueryKeys } from '../../../hooks/react-query/query.keys';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import {
    capitalize,
    formatDate,
    getInitials
} from '../../../lib/commons/common.utils';
import { showErrorToast } from '../../../lib/commons/toast.utils';
import { EditPatientSchema, TEditPatientSchemaType } from '../../../lib/schemas/editPatient.schema';
import { EditPatientScreenProps } from '../../../route';
import { editPatientStyles } from '../../../styled/EditPatientScreen.styled';
import theme from '../../../styled/theme.styled';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import BloodGroupModal from './Modals/BloodGroupModal';
import PatientLocationSelectModal from './Modals/PatientLocationSelectModal';
import EditPatientSkeleton from './Skeletons/EditPatientSkeleton';


export const EditPatientScreen: React.FC<EditPatientScreenProps> = ({ route, navigation }) => {
    const routeParams = route?.params;
    const paramPatientId = routeParams?.patientId;

    const [showCountryModal, setShowCountryModal] = useState(false);
    const [showStateModal, setShowStateModal] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);
    const [showBloodGroupModal, setShowBloodGroupModal] = useState(false);
    const [selectedCountryId, setSelectedCountryId] = useState<number | undefined>();
    const [selectedStateId, setSelectedStateId] = useState<number | undefined>();
    const [refreshing, setRefreshing] = useState(false);

    const { hideLoader, showLoader } = useLoadingStore(state => state);

    const {
        data: patientInfo,
        isPending: fetchingPatientInfo,
        refetch: refetchPatientInfo,
    } = useMyPatientInfo({
        patientId: Number(paramPatientId),
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

    const onRefresh = useCallback(async () => {
        if (refreshing) return;
        setRefreshing(true);
        await refetchPatientInfo();
        setRefreshing(false);
    }, [refetchPatientInfo, refreshing]);

    const onSubmit = (data: TEditPatientSchemaType) => {
        if (!paramPatientId) return showErrorToast('No patient ID found');
        const trim = (v: string | null | undefined) => (v?.trim() ? v.trim() : null);
        const payload = {
            patient_id: paramPatientId,
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
        showLoader("Updating Patient Information...")
        updatePatient(payload, {
            onSuccess: async res => {
                if (res?.success) {
                    await queryClient.invalidateQueries({ queryKey: [PatientsQueryKeys.PatientInfo] });
                    hideLoader();
                    navigation?.goBack();
                } else {
                    hideLoader();
                }
            },
            onSettled: () => {
                hideLoader();
            },
        });
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

    return (
        <SafeAreaWrapper
            header={
                <Header
                    title="Edit Profile"
                    description="View and update patient records"
                    isBackBtn
                    onBackPress={() => {
                        if (navigation?.canGoBack()) {
                            navigation.goBack();
                        }
                    }}
                    rightAction={
                        patientInfo?.patient_id ? (
                            <View style={editPatientStyles.idBadge}>
                                <Text style={editPatientStyles.idBadgeTxt} numberOfLines={1}>
                                    #{patientInfo.patient_id}
                                </Text>
                            </View>
                        ) : undefined
                    }
                />
            }
        >
            {fetchingPatientInfo ? (
                <EditPatientSkeleton />
            ) : (
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                >
                    <View style={editPatientStyles.sectionRow}>
                        <View style={[editPatientStyles.sectionBar, { backgroundColor: '#6366F1' }]} />
                        <Text style={editPatientStyles.sectionTitle}>Personal Information</Text>
                    </View>

                    <View style={editPatientStyles.readOnlyCard}>
                        <View style={editPatientStyles.readOnlyHeader}>
                            <View style={editPatientStyles.readOnlyAvatar}>
                                <Text style={editPatientStyles.readOnlyAvatarTxt}>
                                    {getInitials(patientInfo?.name || '')}
                                </Text>
                            </View>
                            <View style={editPatientStyles.readOnlyHeaderInfo}>
                                <Text style={editPatientStyles.readOnlyName} numberOfLines={1}>
                                    {patientInfo?.name || 'N/A'}
                                </Text>
                                <View style={editPatientStyles.readOnlySubRow}>
                                    <Text style={editPatientStyles.readOnlyId}>
                                        ID: #{patientInfo?.patient_id || '—'}
                                    </Text>
                                </View>
                            </View>
                            <View style={editPatientStyles.viewOnlyTag}>
                                <Text style={editPatientStyles.viewOnlyTagTxt}>Doctor Cannot Edit</Text>
                            </View>
                        </View>

                        <View style={editPatientStyles.readOnlyNotice}>
                            <InfoCircleIcon size={14} color="#6366F1" />
                            <Text style={editPatientStyles.readOnlyNoticeTxt}>
                                Personal details are managed by the patient and are view-only.
                            </Text>
                        </View>
                        <View style={editPatientStyles.readOnlyDetailsList}>
                            <View style={editPatientStyles.readOnlyRow}>
                                <View style={editPatientStyles.readOnlyIconWrap}>
                                    <MailIcon size={16} color="#6366F1" />
                                </View>
                                <View style={editPatientStyles.readOnlyMeta}>
                                    <Text style={editPatientStyles.readOnlyLabel}>Email Address</Text>
                                    <Text style={editPatientStyles.readOnlyValue} numberOfLines={1}>
                                        {patientInfo?.email || 'N/A'}
                                    </Text>
                                </View>
                            </View>

                            <View style={editPatientStyles.readOnlyRow}>
                                <View style={editPatientStyles.readOnlyIconWrap}>
                                    <PhoneIcon size={16} color="#6366F1" />
                                </View>
                                <View style={editPatientStyles.readOnlyMeta}>
                                    <Text style={editPatientStyles.readOnlyLabel}>Phone Number</Text>
                                    <Text style={editPatientStyles.readOnlyValue} numberOfLines={1}>
                                        {patientInfo?.phone_number || 'N/A'}
                                    </Text>
                                </View>
                            </View>

                            <View style={editPatientStyles.readOnlyGridRow}>
                                <View style={editPatientStyles.readOnlyGridItem}>
                                    <View style={editPatientStyles.readOnlyIconWrap}>
                                        <PatientGenderIcon size={16} width={16} color="#6366F1" />
                                    </View>
                                    <View style={editPatientStyles.readOnlyMeta}>
                                        <Text style={editPatientStyles.readOnlyLabel}>Gender</Text>
                                        <Text style={editPatientStyles.readOnlyValue} numberOfLines={1}>
                                            {capitalize(patientInfo?.gender || '') || 'N/A'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={editPatientStyles.readOnlyGridItem}>
                                    <View style={editPatientStyles.readOnlyIconWrap}>
                                        <CalendarIcon size={16} color="#6366F1" />
                                    </View>
                                    <View style={editPatientStyles.readOnlyMeta}>
                                        <Text style={editPatientStyles.readOnlyLabel}>Date of Birth</Text>
                                        <Text style={editPatientStyles.readOnlyValue} numberOfLines={1}>
                                            {formatDate(patientInfo?.date_of_birth || '') || 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
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
                            onPress={() => handleSubmit(onSubmit)()}
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
            )}
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
