import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { consultTabStyles as S } from '../../../../styled/ConsultTabPanel.styled';
import AdviceStepForm from './AdviceStepForm';
import { consultFormSchema, ConsultFormValues } from './consultSchema';
import DiagnosisStepForm from './DiagnosisStepForm';
import LabsStepForm from './LabsStepForm';
import MedicationsStepForm from './MedicationsStepForm';
import VitalsStepForm from './VitalsStepForm';
import { showSuccessToast } from '../../../../lib/commons/toast.utils';

export type ConsultStep =
  | 'diagnosis'
  | 'vitals'
  | 'medications'
  | 'labs'
  | 'advice';

export interface ConsultStepItem {
  id: ConsultStep;
  title: string;
}

const CONSULT_STEPS: ConsultStepItem[] = [
  { id: 'diagnosis', title: 'Diagnosis' },
  { id: 'vitals', title: 'Vitals' },
  { id: 'medications', title: 'Medications' },
  { id: 'labs', title: 'Lab Tests' },
  { id: 'advice', title: 'Advice' },
];

export interface ConsultTabPanelProps {
  onCompletePrescription?: (values: ConsultFormValues) => void;
  onCancelConsult?: () => void;
}

export const ConsultTabPanel: React.FC<ConsultTabPanelProps> = ({
  onCompletePrescription,
  onCancelConsult,
}) => {
  const [activeStep, setActiveStep] = useState<ConsultStep>('diagnosis');

  const methods = useForm<ConsultFormValues>({
    resolver: yupResolver(consultFormSchema),
    defaultValues: {
      chief_complaints: 'Chest tightness & fatigue since 3 days',
      examination_notes: 'Normal S1/S2 heart sounds, mild tachycardia',
      diagnosis: 'Atypical Chest Pain & Essential Hypertension',
      treatment_plan: 'Oral antihypertensives & lifestyle modification',
      blood_pressure: '135/85',
      pulse: '84',
      temperature: '36.8',
      spo2: '98',
      weight: '68',
      height: '165',
      bmi: '25.0',
      custom_vitals: [],
      medications: [
        {
          id: 1,
          name: 'Amlodipine',
          strength: '5',
          strengthUnit: 'mg',
          dosage: '1-0-0',
          timing: 'Before food',
          durationNum: '30',
          durationUnit: 'days',
          instructions: 'Take in morning with water',
        },
      ],
      lab_tests_structured: [
        { name: 'Complete Blood Count (CBC)', instructions: 'Fasting sample' },
        { name: 'ECG 12-Lead', instructions: 'Resting state' },
      ],
      general_advice:
        'Low salt diet, 30 minutes daily walking, avoid caffeine.',
      follow_up_date: 'In 2 Weeks (26 Aug 2026)',
      referral_specialist: '',
      referral_doctor_hospital: '',
      referral_reason: '',
      notes: '',
    },
  });

  const stepIndex = CONSULT_STEPS.findIndex(s => s.id === activeStep);
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === CONSULT_STEPS.length - 1;

  const handleNextStep = () => {
    if (!isLastStep) {
      setActiveStep(CONSULT_STEPS[stepIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    if (!isFirstStep) {
      setActiveStep(CONSULT_STEPS[stepIndex - 1].id);
    }
  };

  const handleFinalSubmit = (data: ConsultFormValues) => {
    showSuccessToast(
      'Prescription completed and saved!',
      'Consultation Completed',
    );
    onCompletePrescription?.(data);
  };

  const renderStepForm = () => {
    switch (activeStep) {
      case 'diagnosis':
        return <DiagnosisStepForm />;
      case 'vitals':
        return <VitalsStepForm />;
      case 'medications':
        return <MedicationsStepForm />;
      case 'labs':
        return <LabsStepForm />;
      case 'advice':
        return <AdviceStepForm />;
      default:
        return <DiagnosisStepForm />;
    }
  };

  return (
    <FormProvider {...methods}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Step Navigation Bar - Fits 5 Tabs Cleanly in One Screen */}
        <View style={S.consultStepBarWrapper}>
          {CONSULT_STEPS.map(step => {
            const active = step.id === activeStep;
            return (
              <TouchableOpacity
                key={step.id}
                style={[S.consultStepTab, active && S.consultStepTabActive]}
                onPress={() => setActiveStep(step.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    S.consultStepTabTitle,
                    active && S.consultStepTabTitleActive,
                  ]}
                >
                  {step.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step Form Body Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStepForm()}
        </ScrollView>

        {/* Sticky Bottom Action Navigation Bar */}
        <View style={S.consultStickyBottomBar}>
          <View style={S.autoSaveRow}>
            <View style={S.autoSaveDot} />
            <Text style={S.autoSaveText}>Auto-save active</Text>
          </View>

          <View style={S.bottomBtnRow}>
            {/* Previous Button */}
            <TouchableOpacity
              style={[S.btnPrev, isFirstStep && { opacity: 0.4 }]}
              onPress={handlePrevStep}
              disabled={isFirstStep}
              activeOpacity={0.7}
            >
              <Text style={S.btnPrevText}>‹ Previous</Text>
            </TouchableOpacity>

            {/* Next or Complete Button */}
            {isLastStep ? (
              <TouchableOpacity
                style={S.btnComplete}
                onPress={() => methods.handleSubmit(handleFinalSubmit)}
                activeOpacity={0.85}
              >
                <Text style={S.btnCompleteText}>✓ Complete</Text>
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
          </View>
        </View>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};

export default ConsultTabPanel;
