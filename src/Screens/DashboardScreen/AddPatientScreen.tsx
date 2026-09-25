import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import StepIndicator from '../../components/Modules/Patients/Components/StepIndicator';
import BasicInfoForm from '../../components/Modules/Patients/Forms/BasicInfoForm';
import ContactInfoForm from '../../components/Modules/Patients/Forms/ContactInfoForm';
import MedicalInfoForm from '../../components/Modules/Patients/Forms/MedicalInfoForm';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import ChevronLeftIcon from '../../components/ui/icons/ChevronLeftIcon';
import {
  useCreateNewPatient,
  useLinkExistingPatient,
} from '../../hooks/react-query/patients/patients.hooks';
import { PatientsQueryKeys } from '../../hooks/react-query/query.keys';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { formatDateToYYYYMMDD, maskValue } from '../../lib/common/common.utils';
import { showErrorToast } from '../../lib/common/toast.utils';
import { AddPatientSchema, TAddPatientSchemaType } from '../../lib/schemas/addPatient.schema';
import {
  AppRoute,
  type ProfileScreenNavigationProp,
  type ProfileScreenRouteProp,
} from '../../route';
import { AddPatientStyles } from '../../styled/AddPatientStyles.styled';
import { theme } from '../../styled/theme.styled';
import { IAllPatientsDoc } from '../../typescripts/interfaces/patients.interfaces';
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';

export interface AddPatientScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export const AddPatientScreen: React.FC<AddPatientScreenProps> = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuthStore(state => state);
  const { hideLoader, showLoader } = useLoadingStore(state => state);

  const [selectedUser, setSelectedUser] = useState<IAllPatientsDoc | null>(null);

  const { mutate: createNewPatientMutation } = useCreateNewPatient();
  const { mutate: linkExistingPatientMutation } = useLinkExistingPatient();

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
      assigned_doctor_id: String(userData?.id) || '',
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

  const selectionMode = watch('selectionMode');

  const handleNext = useCallback(async () => {
    if (!userData?.clinic?.id) return showErrorToast('Clinic not found');
    if (selectionMode === 'existing_user') {
      const isStep1Valid = await trigger(['selectionMode', 'selected_user_id']);
      if (!isStep1Valid || !selectedUser) {
        showErrorToast('Please select an existing user');
        return;
      }
      setLoading(true);
      showLoader('Please Wait... ');
      linkExistingPatientMutation(
        {
          user_id: selectedUser.id,
          clinic_id: userData?.clinic?.id || '',
        },
        {
          onSuccess: async res => {
            if (res?.success) {
              await queryClient.invalidateQueries({
                queryKey: [PatientsQueryKeys.PatientsList],
              });
              hideLoader();
              setLoading(false);
              navigation?.navigate(AppRoute.PATIENTS);
            } else {
              hideLoader();
              setLoading(false);
            }
          },
          onError: () => {
            hideLoader();
            setLoading(false);
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
    if (!userData?.clinic?.id) return showErrorToast('Clinic Not Found');
    setLoading(true);

    const payload = new FormData();
    payload.append('name', formData.name?.trim() || '');
    payload.append('phone', formData.phone?.trim() || '');
    payload.append('gender', formData.gender || '');
    payload.append('address', formData.address?.trim() || '');
    payload.append('clinic_id', String(userData?.clinic?.id || ''));

    if (formData.email?.trim()) {
      payload.append('email', formData.email.trim());
    }
    if (formData.alternate_number?.trim()) {
      payload.append('alternate_phone', formData.alternate_number.trim());
      payload.append('alternate_number', formData.alternate_number.trim());
    }
    if (formData.whatsapp_number?.trim()) {
      payload.append('whatsapp_number', formData.whatsapp_number.trim());
    }
    if (formData.date_of_birth) {
      payload.append('date_of_birth', formatDateToYYYYMMDD(formData.date_of_birth));
    }
    if (formData.city?.trim()) {
      payload.append('city', formData.city.trim());
    }
    if (formData.state?.trim()) {
      payload.append('state', formData.state.trim());
    }
    if (formData.postal_code?.trim()) {
      payload.append('postal_code', formData.postal_code.trim());
    }
    if (formData.country?.trim()) {
      payload.append('country', formData.country.trim());
    }
    if (formData.status) {
      payload.append('status', formData.status);
    }
    if (formData.medical_history?.trim()) {
      payload.append('medical_history', formData.medical_history.trim());
    }

    if (formData.profile_image) {
      const img = formData.profile_image as any;
      if (typeof img === 'object' && img?.uri) {
        payload.append('profile_image', {
          uri: img.uri,
          name: img.name || `profile_${Date.now()}.jpg`,
          type: img.type || 'image/jpeg',
        } as any);
      } else if (typeof img === 'string' && img.length > 0) {
        payload.append('profile_image', {
          uri: img,
          name: `profile_${Date.now()}.jpg`,
          type: 'image/jpeg',
        } as any);
      }
    }

    showLoader('Creating Patient ...');
    createNewPatientMutation(payload, {
      async onSuccess(res) {
        if (res.success) {
          await queryClient.invalidateQueries({
            queryKey: [PatientsQueryKeys.PatientsList],
          });
          setLoading(false);
          hideLoader();
          navigation?.navigate(AppRoute.PATIENTS);
        } else {
          setLoading(false);
          hideLoader();
        }
      },
      onError: () => {
        setLoading(false);
        hideLoader();
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
                selectedUser={selectedUser}
                setSelectedUser={data => {
                  setSelectedUser(data);
                  setValue('selected_user_id', Number(data?.id) || null);
                }}
              />
            )}

            {selectionMode === 'create_new' && step === 2 && <MedicalInfoForm control={control} />}

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
                  <Text style={AddPatientStyles.confirmVal}>{maskValue(selectedUser?.email)}</Text>
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
              style={[AddPatientStyles.nextBtn]}
              onPress={handleNext}
              disabled={loading || (selectionMode === 'existing_user' && !selectedUser)}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.surface} />
              ) : (
                <Text style={AddPatientStyles.nextTxt}>
                  {selectionMode === 'existing_user'
                    ? 'Add to My Clinic'
                    : step === 3
                    ? 'Submit Patient'
                    : 'Next Step →'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 36 }} />
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default AddPatientScreen;
