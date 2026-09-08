import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PopupAlert from '../../components/commons/PopupAlert/PopupAlert';
import StepIndicator from '../../components/Modules/Patients/Components/StepIndicator';
import BasicInfoForm from '../../components/Modules/Patients/Forms/BasicInfoForm';
import ContactInfoForm from '../../components/Modules/Patients/Forms/ContactInfoForm';
import MedicalInfoForm from '../../components/Modules/Patients/Forms/MedicalInfoForm';
import { MockUserItem } from '../../components/Modules/Patients/Modals/UserPickerModal';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import ChevronLeftIcon from '../../components/ui/icons/ChevronLeftIcon';
import {
  useCreateNewPatient,
  useLinkExistingPatient,
  useSendPatientCredentials,
} from '../../hooks/react-query/patients/patients.hooks';
import { PatientsQueryKeys } from '../../hooks/react-query/query.keys';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { formatDateToYYYYMMDD, maskValue } from '../../lib/common/common.utils';
import { AddPatientSchema, TAddPatientSchemaType } from '../../lib/schemas/addPatient.schema';
import type { ProfileScreenNavigationProp, ProfileScreenRouteProp } from '../../route';
import { AddPatientStyles } from '../../styled/AddPatientStyles.styled';
import { theme } from '../../styled/theme.styled';
import { useAuthStore } from '../../zustand/stores/useAuthStore';

export interface AddPatientScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export const AddPatientScreen: React.FC<AddPatientScreenProps> = ({ navigation, route }) => {
  const user = route?.params ? (route.params as any)?.user : undefined;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuthStore(state => state);
  // Popup Alert State
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message?: string;
    onPress?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    onPress?: () => void
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      onPress: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        if (onPress) onPress();
      },
    });
  };

  const { mutate: createNewPatientMutation, isPending: createNewPatientPending } =
    useCreateNewPatient();
  const { mutate: sendCred, isPending: sendPending } = useSendPatientCredentials();
  const { mutate: linkExistingPatientMutation, isPending: linkPending } = useLinkExistingPatient();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<TAddPatientSchemaType>({
    resolver: yupResolver(AddPatientSchema),
    mode: 'onBlur',
    defaultValues: {
      selectionMode: 'create_new',
      selected_user_id: null,
      profile_image: undefined,
      assigned_doctor_id: user?.id || 'DR-101',
      name: '',
      email: '',
      phone: '',
      alternate_number: '',
      whatsapp_number: '',
      date_of_birth: new Date(2000, 0, 1),
      gender: '',
      blood_group: '',
      status: 'active',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      medical_history: '',
    },
  });

  const [selectedUser, setSelectedUser] = useState<MockUserItem | null>(null);

  const selectionMode = watch('selectionMode');

  const handleNext = useCallback(async () => {
    if (selectionMode === 'existing_user') {
      const isStep1Valid = await trigger(['selectionMode', 'selected_user_id']);
      if (!isStep1Valid || !selectedUser) {
        showAlert('warning', 'Required', 'Please select an existing user');
        return;
      }
      setLoading(true);
      linkExistingPatientMutation(
        {
          user_id: selectedUser.id,
          doctor_id: userData?.user_id || '',
        },
        {
          onSuccess: async (res: any) => {
            setLoading(false);
            await queryClient.invalidateQueries({
              queryKey: [PatientsQueryKeys.PatientsList],
            });
            showAlert(
              'success',
              'Patient Linked ✅',
              `${selectedUser.name} has been added to your clinic.`,
              () => {
                if (navigation && navigation.canGoBack()) navigation.goBack();
              }
            );
          },
          onError: (err: any) => {
            setLoading(false);
            const msg =
              err?.response?.data?.message || err?.message || 'Failed to link existing patient';
            showAlert('error', 'Linking Failed', msg);
          },
        }
      );
      return;
    }

    if (step === 1) {
      const isStep1Valid = await trigger(['name', 'gender']);
      if (!isStep1Valid) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      const isStep2Valid = await trigger(['medical_history']);
      if (!isStep2Valid) return;
      setStep(3);
      return;
    }

    if (step === 3) {
      const isStep3Valid = await trigger(['phone', 'address', 'country']);
      if (!isStep3Valid) return;
      handleSubmit(onSubmitNew)();
      return;
    }
  }, [
    step,
    selectionMode,
    selectedUser,
    trigger,
    handleSubmit,
    linkExistingPatientMutation,
    userData?.user_id,
    navigation,
  ]);

  const handleBack = useCallback(() => {
    if (step > 1 && selectionMode === 'create_new') setStep(p => p - 1);
    else if (navigation && navigation.canGoBack()) navigation.goBack();
  }, [step, selectionMode, navigation]);

  const onSubmitNew = (formData: TAddPatientSchemaType) => {
    setLoading(true);

    const payload = {
      name: formData.name?.trim() || '',
      email: formData.email?.trim() || null,
      phone: formData.phone?.trim() || '',
      alternate_number: formData.alternate_number?.trim() || null,
      whatsapp_number: formData.whatsapp_number?.trim() || null,
      gender: formData.gender || '',
      date_of_birth: formData.date_of_birth ? formatDateToYYYYMMDD(formData.date_of_birth) : '',
      address: formData.address?.trim() || '',
      city: formData.city?.trim() || null,
      state: formData.state?.trim() || null,
      postal_code: formData.postal_code?.trim() || null,
      country: formData.country?.trim() || null,
      status: formData.status || 'active',
      medical_history: formData.medical_history?.trim() || null,
      doctor_id: userData?.user_id || '',
      profile_image: undefined,
    };
    createNewPatientMutation(payload, {
      onSuccess(res) {
        if (res.success) {
          const patId = res?.patient?.patient_id;
          const patEmail = res?.patient?.email || formData.email?.trim();
          const patName = res?.patient?.name || formData.name?.trim();
          const patPhone = res?.patient?.phone_number || formData.phone?.trim();

          if (patEmail && patId) {
            sendCred(
              {
                patient_id: patId,
                email: patEmail,
                name: patName,
                phone: patPhone,
              },
              {
                onSuccess: async () => {
                  await queryClient.invalidateQueries({
                    queryKey: [PatientsQueryKeys.PatientsList],
                  });
                  setLoading(false);
                  showAlert(
                    'success',
                    'Patient Registered ✅',
                    `${formData.name} registered and login credentials sent.`,
                    () => {
                      if (navigation && navigation.canGoBack()) navigation.goBack();
                    }
                  );
                },
                onError: async () => {
                  await queryClient.invalidateQueries({
                    queryKey: [PatientsQueryKeys.PatientsList],
                  });
                  setLoading(false);
                  showAlert(
                    'success',
                    'Patient Registered ✅',
                    `${formData.name} registered successfully.`,
                    () => {
                      if (navigation && navigation.canGoBack()) navigation.goBack();
                    }
                  );
                },
              }
            );
          } else {
            queryClient.invalidateQueries({
              queryKey: [PatientsQueryKeys.PatientsList],
            });
            setLoading(false);
            showAlert(
              'success',
              'Patient Registered ✅',
              `${formData.name} registered successfully.`,
              () => {
                if (navigation && navigation.canGoBack()) navigation.goBack();
              }
            );
          }
        } else {
          setLoading(false);
          showAlert('error', 'Registration Failed', res.message || 'Failed to create patient');
        }
      },
      onError: (error: any) => {
        setLoading(false);
        const msg =
          error?.response?.data?.message || error?.message || 'Error creating patient registration';
        showAlert('error', 'Error', msg);
      },
    });
  };

  return (
    <SafeAreaWrapper>
      <View style={AddPatientStyles.outer}>
        <View style={AddPatientStyles.header}>
          <TouchableOpacity
            style={AddPatientStyles.backBtn}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon color={theme.colors.primary} size={18} />
          </TouchableOpacity>
          <View>
            <Text style={AddPatientStyles.hTitle}>Add New Patient</Text>
            <Text style={AddPatientStyles.hSub}>PRED CARE • REGISTRATION</Text>
          </View>
        </View>
        {selectionMode === 'create_new' && (
          <View style={AddPatientStyles.stepWrap}>
            <StepIndicator step={step} />
          </View>
        )}

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={AddPatientStyles.scroll}
            contentContainerStyle={AddPatientStyles.formContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={AddPatientStyles.cardContainer}>
              {(step === 1 || selectionMode === 'existing_user') && (
                <BasicInfoForm
                  control={control}
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                  doctorName="Dr. Sarah Jenkins"
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                />
              )}

              {selectionMode === 'create_new' && step === 2 && (
                <MedicalInfoForm control={control} />
              )}

              {selectionMode === 'create_new' && step === 3 && (
                <ContactInfoForm
                  control={control}
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                />
              )}
            </View>

            {selectionMode === 'existing_user' && selectedUser && (
              <View style={AddPatientStyles.confirmCard}>
                <Text style={AddPatientStyles.confirmTitle}>Patient Summary</Text>
                <View style={AddPatientStyles.confirmRow}>
                  <Text style={AddPatientStyles.confirmLbl}>Name</Text>
                  <Text style={AddPatientStyles.confirmVal}>{selectedUser?.name}</Text>
                </View>
                {selectedUser?.email ? (
                  <View style={AddPatientStyles.confirmRow}>
                    <Text style={AddPatientStyles.confirmLbl}>Email</Text>
                    <Text style={AddPatientStyles.confirmVal}>
                      {maskValue(selectedUser?.email)}
                    </Text>
                  </View>
                ) : null}
                {selectedUser?.phone_number ? (
                  <View style={AddPatientStyles.confirmRow}>
                    <Text style={AddPatientStyles.confirmLbl}>Phone</Text>
                    <Text style={AddPatientStyles.confirmVal}>
                      {maskValue(selectedUser?.phone_number)}
                    </Text>
                  </View>
                ) : null}
                {selectedUser?.gender ? (
                  <View style={AddPatientStyles.confirmRow}>
                    <Text style={AddPatientStyles.confirmLbl}>Gender</Text>
                    <Text style={AddPatientStyles.confirmVal}>{selectedUser?.gender}</Text>
                  </View>
                ) : null}
                <View style={AddPatientStyles.confirmInfoBox}>
                  <Text style={AddPatientStyles.confirmInfoTxt}>
                    ✓ All existing data (contact, medical history, address) will be used as-is from
                    the database. Only clinic registration is needed.
                  </Text>
                </View>
              </View>
            )}

            <View style={AddPatientStyles.btnRow}>
              {selectionMode === 'create_new' && step > 1 && (
                <TouchableOpacity
                  style={AddPatientStyles.backSecBtn}
                  onPress={handleBack}
                  activeOpacity={0.8}
                >
                  <Text style={AddPatientStyles.backSecTxt}>← Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  AddPatientStyles.nextBtn,
                  (selectionMode === 'existing_user' || step === 1) && { flex: 1 },
                  (loading || (selectionMode === 'existing_user' && !selectedUser)) && {
                    opacity: 0.55,
                  },
                ]}
                onPress={handleNext}
                disabled={loading || (selectionMode === 'existing_user' && !selectedUser)}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.surface} />
                ) : (
                  <Text style={AddPatientStyles.nextTxt}>
                    {selectionMode === 'existing_user'
                      ? 'Add to My Clinic ✓'
                      : step === 3
                      ? 'Submit Patient ✓'
                      : 'Next Step →'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ height: 36 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* Popup Alert Modal */}
      <PopupAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onPress={alertConfig.onPress}
        onCancel={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
      />
    </SafeAreaWrapper>
  );
};

export default AddPatientScreen;
