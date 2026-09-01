import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
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
import ChevronLeftIcon from '../../components/ui/icons/ChevronLeftIcon';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { AddPatientSchema, TAddPatientSchemaType } from '../../lib/schemas/addPatient.schema';
import type { ProfileScreenNavigationProp, ProfileScreenRouteProp } from '../../route';
import { theme } from '../../styled/theme.styled';

export interface AddPatientScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export const AddPatientScreen: React.FC<AddPatientScreenProps> = ({ navigation, route }) => {
  const user = route?.params ? (route.params as any)?.user : undefined;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

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

  // Step Navigation & Validation
  const handleNext = useCallback(async () => {
    if (selectionMode === 'existing_user') {
      const isStep1Valid = await trigger(['selectionMode', 'selected_user_id']);
      if (!isStep1Valid || !selectedUser) {
        showAlert('warning', 'Required', 'Please select an existing user');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        showAlert(
          'success',
          'Patient Linked ✅',
          `${selectedUser.name} has been added to your clinic.\n\nPatient ID: PAT-1012`,
          () => {
            if (navigation && navigation.canGoBack()) navigation.goBack();
          }
        );
      }, 800);
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
  }, [step, selectionMode, selectedUser, trigger, handleSubmit]);

  const handleBack = useCallback(() => {
    if (step > 1 && selectionMode === 'create_new') setStep(p => p - 1);
    else if (navigation && navigation.canGoBack()) navigation.goBack();
  }, [step, selectionMode, navigation]);

  const onSubmitNew = (formData: TAddPatientSchemaType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showAlert(
        'success',
        'Patient Registered ✅',
        `Patient ${formData.name || 'Record'} added successfully!\n\nPatient ID: PAT-1011\nPhone: ${
          formData.phone
        }`,
        () => {
          if (navigation && navigation.canGoBack()) {
            navigation.goBack();
          }
        }
      );
    }, 800);
  };

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      <View style={s.outer}>
        {/* Header Bar */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={handleBack} activeOpacity={0.7}>
            <ChevronLeftIcon color={theme.colors.primary} size={18} />
          </TouchableOpacity>
          <View>
            <Text style={s.hTitle}>Add New Patient</Text>
            <Text style={s.hSub}>PRED CARE • REGISTRATION</Text>
          </View>
        </View>

        {/* Step Indicator Bar */}
        {selectionMode === 'create_new' && (
          <View style={s.stepWrap}>
            <StepIndicator step={step} />
          </View>
        )}

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.formContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Form Card Container */}
            <View style={s.cardContainer}>
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

              {/* Step 2: Medical Info */}
              {selectionMode === 'create_new' && step === 2 && (
                <MedicalInfoForm control={control} />
              )}

              {/* Step 3: Contact Info */}
              {selectionMode === 'create_new' && step === 3 && (
                <ContactInfoForm
                  control={control}
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                />
              )}
            </View>

            {/* Patient Summary Card for Existing User */}
            {selectionMode === 'existing_user' && selectedUser && (
              <View style={s.confirmCard}>
                <Text style={s.confirmTitle}>Patient Summary</Text>
                <View style={s.confirmRow}>
                  <Text style={s.confirmLbl}>Name</Text>
                  <Text style={s.confirmVal}>{selectedUser.name}</Text>
                </View>
                {selectedUser.email ? (
                  <View style={s.confirmRow}>
                    <Text style={s.confirmLbl}>Email</Text>
                    <Text style={s.confirmVal}>{selectedUser.email}</Text>
                  </View>
                ) : null}
                {selectedUser.phone_number ? (
                  <View style={s.confirmRow}>
                    <Text style={s.confirmLbl}>Phone</Text>
                    <Text style={s.confirmVal}>{selectedUser.phone_number}</Text>
                  </View>
                ) : null}
                {selectedUser.gender ? (
                  <View style={s.confirmRow}>
                    <Text style={s.confirmLbl}>Gender</Text>
                    <Text style={s.confirmVal}>{selectedUser.gender}</Text>
                  </View>
                ) : null}
                <View style={s.confirmInfoBox}>
                  <Text style={s.confirmInfoTxt}>
                    ✓ All existing data (contact, medical history, address) will be used as-is from
                    the database. Only clinic registration is needed.
                  </Text>
                </View>
              </View>
            )}

            {/* Action Buttons Row */}
            <View style={s.btnRow}>
              {selectionMode === 'create_new' && step > 1 && (
                <TouchableOpacity style={s.backSecBtn} onPress={handleBack} activeOpacity={0.8}>
                  <Text style={s.backSecTxt}>← Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  s.nextBtn,
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
                  <Text style={s.nextTxt}>
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

const s = StyleSheet.create({
  outer: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: theme.colors.surface,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
    elevation: 2,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  hTitle: {
    fontSize: 19,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    letterSpacing: 0.1,
  },
  hSub: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  stepWrap: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  scroll: { flex: 1 },
  formContent: { paddingHorizontal: 16, paddingTop: 16 },
  cardContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  backSecBtn: {
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backSecTxt: { fontSize: 15, fontWeight: theme.fontWeight.bold, color: theme.colors.textSlate },
  nextBtn: {
    flex: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextTxt: {
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
    letterSpacing: 0.4,
  },
  confirmCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  confirmTitle: {
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
  },
  confirmLbl: { fontSize: 13, fontWeight: '600', color: theme.colors.textMuted },
  confirmVal: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.dark,
    flex: 1,
    textAlign: 'right',
  },
  confirmInfoBox: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  confirmInfoTxt: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default AddPatientScreen;
