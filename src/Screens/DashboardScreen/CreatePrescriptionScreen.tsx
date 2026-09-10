import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonErrorCard from '../../components/commons/CommonErrorCard/CommonErrorCard';
import PrescriptionAdviceStep from '../../components/Modules/Prescription/PrescriptionAdviceStep';
import PrescriptionClinicalNotesStep from '../../components/Modules/Prescription/PrescriptionClinicalNotesStep';
import PrescriptionDiagnosisStep from '../../components/Modules/Prescription/PrescriptionDiagnosisStep';
import PrescriptionLabsStep from '../../components/Modules/Prescription/PrescriptionLabsStep';
import PrescriptionMedicationsStep from '../../components/Modules/Prescription/PrescriptionMedicationsStep';
import PrescriptionPatientHeaderCard from '../../components/Modules/Prescription/PrescriptionPatientHeaderCard';
import PrescriptionVitalsStep from '../../components/Modules/Prescription/PrescriptionVitalsStep';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import CreatePrescriptionSkeleton from '../../components/Skeletons/CreatePrescriptionSkeleton';
import ChevronLeftIcon from '../../components/ui/icons/ChevronLeftIcon';
import { useMyPatientInfo } from '../../hooks/react-query/patients/patients.hooks';
import type {
  ICreatePrescriptionPayload,
  IUpdatePrescriptionPayload,
} from '../../hooks/react-query/prescriptions/payload.interfaces';
import {
  useCreatePrescription,
  useGetPrescriptionDetails,
  useResendPrescriptionEmail,
  useUpdatePrescription,
} from '../../hooks/react-query/prescriptions/prescriptions.hooks';
import { PatientsQueryKeys, PrescriptionQueryKeys } from '../../hooks/react-query/query.keys';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { getAge } from '../../lib/common/common.utils';
import { showErrorToast, showSuccessToast } from '../../lib/common/toast.utils';
import {
  createPrescriptionSchema,
  TCreatePrescriptionFormValues,
} from '../../lib/schemas/createPrescription.schema';
import { AppRoute, type CreatePrescriptionScreenProps } from '../../route';
import { createPrescriptionStyles as S } from '../../styled/CreatePrescriptionScreen.styled';
import { theme } from '../../styled/theme.styled';
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../zustand/stores/useMeetingStore';

export type PrescriptionStep =
  | 'clinical'
  | 'diagnosis'
  | 'vitals'
  | 'medications'
  | 'labs'
  | 'advice';

export interface PrescriptionStepItem {
  id: PrescriptionStep;
  title: string;
  stepNum: number;
}

const PrescriptionSteps: PrescriptionStepItem[] = [
  { id: 'clinical', title: 'Clinical Notes', stepNum: 1 },
  { id: 'diagnosis', title: 'Diagnosis', stepNum: 2 },
  { id: 'vitals', title: 'Vitals', stepNum: 3 },
  { id: 'medications', title: 'Medications', stepNum: 4 },
  { id: 'labs', title: 'Lab Tests', stepNum: 5 },
  { id: 'advice', title: 'Advice', stepNum: 6 },
];

const defaultFormValues: TCreatePrescriptionFormValues = {
  chief_complaints: '',
  examination_notes: '',
  diagnosis: '',
  treatment_plan: '',
  chronic_conditions: '',
  drug_allergies: '',
  blood_pressure: '',
  pulse: '',
  temperature: '',
  spo2: '',
  weight: '',
  height: '',
  bmi: '',
  custom_vitals: [],
  medications: [
    {
      name: '',
      strength: '',
      strengthUnit: 'mg',
      dosage: '',
      timing: '',
      durationNum: '',
      durationUnit: 'days',
      instructions: '',
    },
  ],
  lab_tests_structured: [],
  general_advice: '',
  follow_up_date: '',
  referral_specialist: '',
  referral_doctor_hospital: '',
  referral_reason: '',
  notes: '',
};

export const CreatePrescriptionScreen: React.FC<CreatePrescriptionScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const patientId = route?.params?.patientId;
  const prescriptionId = route?.params?.prescriptionId;
  const [activeStep, setActiveStep] = useState<PrescriptionStep>('clinical');
  const { userData } = useAuthStore(state => state);
  const currentPrescriptionId = useRef<number | null>(
    prescriptionId ? Number(prescriptionId) : null
  );
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    'idle' | 'typing' | 'saving' | 'saved' | 'error'
  >('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);

  const { showLoader, hideLoader } = useLoadingStore(state => state);
  const { appointmentId, apptIdforInPerson, clearInPersonAppointment } = useMeetingStore(
    state => state
  );
  const {
    data: patientInfo,
    isFetching: patientInfoPending,
    isError: isPatientInfoError,
    error: patientInfoError,
    refetch: refetchPatientInfo,
  } = useMyPatientInfo({
    patientId: patientId,
  });

  const {
    data: prescriptionInfo,
    isFetching: prescriptionInfoLoading,
    isError: isPrescriptionInfoError,
    error: prescriptionInfoError,
    refetch: refetchPrescriptionInfo,
  } = useGetPrescriptionDetails({
    id: Number(prescriptionId),
  });

  const { mutate: createPrescription, isPending: createPrescriptionPending } =
    useCreatePrescription();
  const { mutate: updatePrescription, isPending: updatePrescriptionPending } =
    useUpdatePrescription();
  const { mutate: resendEmailMutation, isPending: resendEmailLoading } =
    useResendPrescriptionEmail();

  const methods = useForm<TCreatePrescriptionFormValues>({
    resolver: yupResolver(createPrescriptionSchema),
    defaultValues: defaultFormValues,
  });

  const stepIndex = PrescriptionSteps.findIndex(s => s.id === activeStep);
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === PrescriptionSteps.length - 1;

  const handleNextStep = () => {
    if (!isLastStep) {
      setActiveStep(PrescriptionSteps[stepIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    if (!isFirstStep) {
      setActiveStep(PrescriptionSteps[stepIndex - 1].id);
    }
  };

  const hasAnyContent = (_data: TCreatePrescriptionFormValues) => {
    const validMedications = _data?.medications?.filter(m => m?.name && m.name.trim() !== '');
    const validCustomVitals = _data?.custom_vitals?.filter(
      v => (v?.name && v.name.trim() !== '') || (v?.value && v.value.trim() !== '')
    );
    const validLabTests = _data?.lab_tests_structured?.filter(l => l?.name && l.name.trim() !== '');

    return Boolean(
      _data?.chief_complaints?.trim() ||
        _data?.examination_notes?.trim() ||
        _data?.diagnosis?.trim() ||
        _data?.treatment_plan?.trim() ||
        _data?.chronic_conditions?.trim() ||
        _data?.drug_allergies?.trim() ||
        _data?.blood_pressure?.trim() ||
        _data?.pulse?.trim() ||
        _data?.temperature?.trim() ||
        _data?.spo2?.trim() ||
        _data?.weight?.trim() ||
        _data?.height?.trim() ||
        _data?.bmi?.trim() ||
        _data?.general_advice?.trim() ||
        _data?.follow_up_date?.trim() ||
        _data?.referral_specialist?.trim() ||
        _data?.referral_doctor_hospital?.trim() ||
        _data?.referral_reason?.trim() ||
        _data?.notes?.trim() ||
        (validMedications && validMedications.length > 0) ||
        (validCustomVitals && validCustomVitals.length > 0) ||
        (validLabTests && validLabTests.length > 0)
    );
  };

  const buildPrescriptionPayload = (
    _data: TCreatePrescriptionFormValues,
    status: 'draft' | 'completed' = 'draft'
  ): ICreatePrescriptionPayload => {
    const rx = prescriptionInfo?.prescription;
    const validMedications = _data?.medications?.filter(m => m?.name && m.name.trim() !== '');
    const validCustomVitals = _data?.custom_vitals?.filter(
      v => (v?.name && v.name.trim() !== '') || (v?.value && v.value.trim() !== '')
    );
    const validLabTests = _data?.lab_tests_structured?.filter(l => l?.name && l.name.trim() !== '');

    const rawPayload: Record<string, any> = {
      doctor_id: userData?.user_id || '',
      patient_id: patientId ?? rx?.patient_id ?? '',
      appointment_id: apptIdforInPerson || appointmentId || '',
      type: 'doctor',
      patient_name: patientInfo?.name ?? route?.params?.patientName ?? rx?.patient_name,
      patient_age: patientInfo?.date_of_birth ? getAge(patientInfo.date_of_birth) : rx?.patient_age,
      patient_gender: patientInfo?.gender ?? rx?.patient_gender,
      chief_complaints: _data?.chief_complaints,
      diagnosis: _data?.diagnosis,
      symptoms: _data?.chief_complaints,
      examination_notes: _data?.examination_notes,
      treatment_plan: _data?.treatment_plan,
      drug_allergies: _data?.drug_allergies || patientInfo?.drug_allergies,
      chronic_conditions: _data?.chronic_conditions || patientInfo?.medical_history,
      blood_pressure: _data?.blood_pressure,
      pulse: _data?.pulse,
      temperature: _data?.temperature,
      spo2: _data?.spo2,
      weight: _data?.weight,
      height: _data?.height,
      bmi: _data?.bmi,
      custom_vitals: validCustomVitals,
      medications: validMedications,
      lab_tests: validLabTests,
      lab_tests_structured: validLabTests,
      general_advice: _data?.general_advice,
      follow_up: _data?.follow_up_date,
      follow_up_date: _data?.follow_up_date,
      referral_specialist: _data?.referral_specialist,
      referral_doctor_hospital: _data?.referral_doctor_hospital,
      referral_reason: _data?.referral_reason,
      notes: _data?.notes,
      status: status,
      clinic_name: userData?.clinic_name,
      clinic_address: userData?.clinic_address,
    };

    return Object.fromEntries(
      Object.entries(rawPayload).filter(([_, val]) => {
        if (val === null || val === undefined || val === '') return false;
        if (Array.isArray(val) && val.length === 0) return false;
        return true;
      })
    ) as unknown as ICreatePrescriptionPayload;
  };

  const triggerAutoSave = (formValues: TCreatePrescriptionFormValues) => {
    if (!hasAnyContent(formValues)) return;

    setAutoSaveStatus('saving');
    const payload = buildPrescriptionPayload(formValues, 'draft');
    const activeId =
      currentPrescriptionId.current || (prescriptionId ? Number(prescriptionId) : null);

    const getFormattedTime = () => {
      const date = new Date();
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (activeId) {
      updatePrescription(
        {
          id: activeId,
          payload: payload as unknown as IUpdatePrescriptionPayload,
        },
        {
          onSuccess: () => {
            setAutoSaveStatus('saved');
            setLastSavedAt(getFormattedTime());
          },
          onError: () => {
            setAutoSaveStatus('error');
          },
        }
      );
    } else {
      createPrescription(payload, {
        onSuccess: response => {
          const createId = response?.id;
          if (createId) {
            currentPrescriptionId.current = Number(createId);
          }
          queryClient.invalidateQueries({
            queryKey: [PrescriptionQueryKeys.GetPresciptionInfo],
          });
          queryClient.invalidateQueries({
            queryKey: [PatientsQueryKeys.Prescriptions],
          });
          setAutoSaveStatus('saved');
          setLastSavedAt(getFormattedTime());
        },
        onError: () => {
          setAutoSaveStatus('error');
        },
      });
    }
  };

  const handleFinalSubmit = (_data: TCreatePrescriptionFormValues) => {
    if (!hasAnyContent(_data)) {
      showErrorToast(
        'Please enter at least one detail (e.g. Diagnosis, Symptoms, Vitals, or Medications) to complete the prescription.',
        'Prescription Empty'
      );
      return;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    const payload = buildPrescriptionPayload(_data, 'completed');
    const activeId =
      currentPrescriptionId.current || (prescriptionId ? Number(prescriptionId) : null);

    if (activeId) {
      showLoader('Updating prescription...');
      updatePrescription(
        {
          id: activeId,
          payload: payload as unknown as IUpdatePrescriptionPayload,
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: [PrescriptionQueryKeys.GetPresciptionInfo],
            });
            await queryClient.invalidateQueries({
              queryKey: [PatientsQueryKeys.Prescriptions],
            });
            clearInPersonAppointment();
            showSuccessToast('Prescription updated successfully');
            hideLoader();
            (navigation as any).replace(AppRoute.PRESCRIPTION_VIEW, {
              rxId: String(activeId),
              patientName: patientInfo?.name || route?.params?.patientName || '',
            });
          },
          onError: () => {
            hideLoader();
          },
        }
      );
    } else {
      showLoader('Creating new prescription...');
      createPrescription(payload, {
        onSuccess: async response => {
          const createId = response?.id;
          if (createId) {
            currentPrescriptionId.current = Number(createId);
          }
          await queryClient.invalidateQueries({
            queryKey: [PrescriptionQueryKeys.GetPresciptionInfo],
          });
          await queryClient.invalidateQueries({
            queryKey: [PatientsQueryKeys.Prescriptions],
          });
          clearInPersonAppointment();
          showSuccessToast('Prescription created successfully');
          hideLoader();
          (navigation as any).replace(AppRoute.PRESCRIPTION_VIEW, {
            rxId: String(createId || currentPrescriptionId.current),
            patientName: patientInfo?.name || route?.params?.patientName || '',
          });
        },
        onError: () => {
          hideLoader();
        },
      });
    }
  };

  const handleSendAndComplete = (_data: TCreatePrescriptionFormValues) => {
    if (!hasAnyContent(_data)) {
      showErrorToast(
        'Please enter at least one detail (e.g. Diagnosis, Symptoms, Vitals, or Medications) to complete and send the prescription.',
        'Prescription Empty'
      );
      return;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    const payload = buildPrescriptionPayload(_data, 'completed');
    const activeId =
      currentPrescriptionId.current || (prescriptionId ? Number(prescriptionId) : null);

    showLoader('Sending prescription to patient...');

    const triggerEmailAndNavigate = (rxId: string | number) => {
      resendEmailMutation(rxId, {
        onSuccess: async res => {
          await queryClient.invalidateQueries({
            queryKey: [PrescriptionQueryKeys.GetPresciptionInfo],
          });
          await queryClient.invalidateQueries({
            queryKey: [PatientsQueryKeys.Prescriptions],
          });
          clearInPersonAppointment();
          showSuccessToast(res?.message || "Prescription completed & sent to patient's email.");
          hideLoader();
          (navigation as any).replace(AppRoute.PRESCRIPTION_VIEW, {
            rxId: String(rxId),
            patientName: patientInfo?.name || route?.params?.patientName || '',
          });
        },
        onError: async (e: any) => {
          await queryClient.invalidateQueries({
            queryKey: [PrescriptionQueryKeys.GetPresciptionInfo],
          });
          await queryClient.invalidateQueries({
            queryKey: [PatientsQueryKeys.Prescriptions],
          });
          clearInPersonAppointment();
          const msg =
            e?.response?.data?.message || 'Prescription completed, but failed to send email.';
          showErrorToast(msg, 'Email Error');
          hideLoader();
          (navigation as any).replace(AppRoute.PRESCRIPTION_VIEW, {
            rxId: String(rxId),
            patientName: patientInfo?.name || route?.params?.patientName || '',
          });
        },
      });
    };

    if (activeId) {
      updatePrescription(
        {
          id: activeId,
          payload: payload as unknown as IUpdatePrescriptionPayload,
        },
        {
          onSuccess: () => {
            triggerEmailAndNavigate(activeId);
          },
          onError: () => {
            hideLoader();
          },
        }
      );
    } else {
      createPrescription(payload, {
        onSuccess: response => {
          const createId = response?.id;
          if (createId) {
            currentPrescriptionId.current = Number(createId);
          }
          triggerEmailAndNavigate(createId || currentPrescriptionId.current || '');
        },
        onError: () => {
          hideLoader();
        },
      });
    }
  };

  const renderStepForm = () => {
    switch (activeStep) {
      case 'clinical':
        return <PrescriptionClinicalNotesStep />;
      case 'diagnosis':
        return <PrescriptionDiagnosisStep />;
      case 'vitals':
        return <PrescriptionVitalsStep />;
      case 'medications':
        return <PrescriptionMedicationsStep />;
      case 'labs':
        return <PrescriptionLabsStep />;
      case 'advice':
        return <PrescriptionAdviceStep />;
      default:
        return <PrescriptionClinicalNotesStep />;
    }
  };

  const isLoadingData =
    (Boolean(patientId) && patientInfoPending) ||
    (Boolean(prescriptionId) && prescriptionInfoLoading);

  const isFormError =
    (Boolean(patientId) && isPatientInfoError) ||
    (Boolean(prescriptionId) && isPrescriptionInfoError);

  const displayPatientName =
    patientInfo?.name ||
    route?.params?.patientName ||
    prescriptionInfo?.prescription?.patient_name ||
    '';

  const subtitle = isLoadingData
    ? 'Loading details...'
    : isFormError
    ? 'Error loading information'
    : displayPatientName
    ? `Patient: ${displayPatientName}`
    : prescriptionId
    ? 'Edit Existing Prescription'
    : 'Create New Prescription';

  const currentAutoSave = useMemo(() => {
    switch (autoSaveStatus) {
      case 'typing':
        return {
          color: '#F59E0B',
          text: 'Auto-save active',
        };
      case 'saving':
        return {
          color: '#3B82F6',
          text: 'Saving draft...',
        };
      case 'saved':
        return {
          color: theme.colors.success,
          text: lastSavedAt ? `Saved at ${lastSavedAt}` : 'Draft saved',
        };
      case 'error':
        return {
          color: theme.colors.danger || '#EF4444',
          text: 'Auto-save failed',
        };
      default:
        return {
          color: theme.colors.success,
          text: 'Auto-save active',
        };
    }
  }, [autoSaveStatus, lastSavedAt]);

  useEffect(() => {
    setActiveStep('clinical');
    if (prescriptionId && prescriptionInfo?.prescription) {
      const rx = prescriptionInfo.prescription;
      currentPrescriptionId.current = Number(prescriptionId);
      methods.reset({
        chief_complaints: rx.chief_complaints || rx.symptoms || '',
        examination_notes: rx.examination_notes || '',
        diagnosis: rx.diagnosis || '',
        treatment_plan: rx.treatment_plan || '',
        chronic_conditions: rx.chronic_conditions || '',
        drug_allergies: rx.drug_allergies || '',
        blood_pressure: rx.blood_pressure || '',
        pulse: rx.pulse || '',
        temperature: rx.temperature || '',
        spo2: rx.spo2 || '',
        weight: rx.weight || '',
        height: rx.height || '',
        bmi: rx.bmi || '',
        custom_vitals: rx.custom_vitals || [],
        medications:
          Array.isArray(rx.medications) && rx.medications.length > 0
            ? rx.medications.map(m => ({
                name: m.name || '',
                strength: m.strength || '',
                strengthUnit: m.strengthUnit || 'mg',
                dosage: m.dosage || '',
                timing: m.timing || '',
                durationNum: m.durationNum || '',
                durationUnit: m.durationUnit || 'days',
                instructions: m.instructions || '',
              }))
            : [
                {
                  name: '',
                  strength: '',
                  strengthUnit: 'mg',
                  dosage: '',
                  timing: '',
                  durationNum: '',
                  durationUnit: 'days',
                  instructions: '',
                },
              ],
        lab_tests_structured: Array.isArray(rx.lab_tests)
          ? rx.lab_tests.map(l => ({
              name: l.name || l.text || '',
              instructions: l.instructions || '',
            }))
          : [],
        general_advice: rx.general_advice || '',
        follow_up_date: rx.follow_up_date || rx.follow_up || '',
        referral_specialist: rx.referral_specialist || '',
        referral_doctor_hospital: rx.referral_doctor_hospital || '',
        referral_reason: rx.referral_reason || '',
        notes: rx.notes || '',
      });
    } else if (!prescriptionId) {
      currentPrescriptionId.current = null;
      setAutoSaveStatus('idle');
      setLastSavedAt(null);
      methods.reset(defaultFormValues);
    }
  }, [prescriptionId, prescriptionInfo?.prescription, methods]);

  useEffect(() => {
    if (isLoadingData) {
      isInitialLoadRef.current = true;
      return;
    }
    const timer = setTimeout(() => {
      isInitialLoadRef.current = false;
    }, 1000);
    return () => clearTimeout(timer);
  }, [isLoadingData]);

  useEffect(() => {
    const subscription = methods.watch(value => {
      if (isInitialLoadRef.current || isLoadingData) return;
      if (!hasAnyContent(value as TCreatePrescriptionFormValues)) return;

      setAutoSaveStatus('typing');

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        triggerAutoSave(methods.getValues());
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [methods, isLoadingData]);

  return (
    <SafeAreaWrapper>
      <View style={S.headerContainer}>
        <TouchableOpacity
          style={S.backButton}
          onPress={() => {
            if (prescriptionId) {
              navigation?.navigate(AppRoute.PRESCRIPTION_VIEW, {
                rxId: Number(prescriptionId),
                patientName: patientInfo?.name,
              });
            } else if (apptIdforInPerson) {
              if (navigation && navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation?.navigate(AppRoute.DOCTOR_APPOINTMENTS as any);
              }
            } else {
              navigation?.navigate(AppRoute.PATIENT_DETAILS, {
                patientId: patientId,
                patientName: patientInfo?.name,
              });
            }
          }}
          activeOpacity={0.8}
        >
          <ChevronLeftIcon size={22} color={theme.colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>

        <View style={S.headerTitleGroup}>
          <Text style={S.headerTitle}>
            {prescriptionId ? 'Edit Prescription' : 'Create Prescription'}
          </Text>
          <Text style={S.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>

      {isLoadingData ? (
        <CreatePrescriptionSkeleton />
      ) : isFormError ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 40, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <CommonErrorCard
            title="Failed to Load Data"
            message={
              (patientInfoError as any)?.message ||
              (prescriptionInfoError as any)?.message ||
              'Something went wrong while fetching details.'
            }
            onRetry={() => {
              if (patientId) refetchPatientInfo();
              if (prescriptionId) refetchPrescriptionInfo();
            }}
          />
        </ScrollView>
      ) : (
        <>
          <PrescriptionPatientHeaderCard
            name={patientInfo?.name || '-'}
            patientId={patientInfo?.patient_id || '-'}
            age={getAge(patientInfo?.date_of_birth || '') || patientInfo?.age_display || ''}
            bloodGroup={patientInfo?.blood_type || ''}
            gender={patientInfo?.gender || '-'}
            profileImg={patientInfo?.profile_image || ''}
          />
          <FormProvider {...methods}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <View style={S.stepBarWrapper}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={S.stepBarContent}
                >
                  {PrescriptionSteps.map(step => {
                    const active = step.id === activeStep;
                    return (
                      <TouchableOpacity
                        key={step.id}
                        style={[S.stepTab, active && S.stepTabActive]}
                        onPress={() => setActiveStep(step.id)}
                        activeOpacity={0.75}
                      >
                        <View style={[S.stepTabBadge, active && S.stepTabBadgeActive]}>
                          <Text style={[S.stepTabBadgeText, active && S.stepTabBadgeTextActive]}>
                            {step.stepNum}
                          </Text>
                        </View>
                        <Text style={[S.stepTabTitle, active && S.stepTabTitleActive]}>
                          {step.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {renderStepForm()}
              </ScrollView>
              <View style={S.stickyBottomBar}>
                <View style={S.autoSaveRow}>
                  <View style={[S.autoSaveDot, { backgroundColor: currentAutoSave.color }]} />
                  <Text style={S.autoSaveText}>{currentAutoSave.text}</Text>
                </View>
                <View style={S.bottomBtnRow}>
                  <TouchableOpacity
                    style={[S.btnPrev, isFirstStep && { opacity: 0.4 }]}
                    onPress={handlePrevStep}
                    disabled={isFirstStep}
                    activeOpacity={0.7}
                  >
                    <Text style={S.btnPrevText}>‹ Previous</Text>
                  </TouchableOpacity>

                  {isLastStep ? (
                    <TouchableOpacity
                      style={S.btnComplete}
                      onPress={methods.handleSubmit(handleFinalSubmit)}
                      disabled={
                        createPrescriptionPending || updatePrescriptionPending || resendEmailLoading
                      }
                      activeOpacity={0.85}
                    >
                      <Text style={S.btnCompleteText}>
                        {createPrescriptionPending || updatePrescriptionPending
                          ? 'Saving...'
                          : prescriptionId
                          ? '✓ Update Prescription'
                          : '✓ Complete'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={S.btnNext}
                      onPress={handleNextStep}
                      activeOpacity={0.85}
                    >
                      <Text style={S.btnNextText}>Next ›</Text>
                    </TouchableOpacity>
                  )}
                  {isLastStep && (
                    <TouchableOpacity
                      style={S.btnComplete}
                      onPress={methods.handleSubmit(handleSendAndComplete)}
                      disabled={
                        createPrescriptionPending || updatePrescriptionPending || resendEmailLoading
                      }
                      activeOpacity={0.85}
                    >
                      <Text style={S.btnCompleteText}>
                        {resendEmailLoading ? 'Sending...' : 'Send'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </KeyboardAvoidingView>
          </FormProvider>
        </>
      )}
    </SafeAreaWrapper>
  );
};

export default CreatePrescriptionScreen;
