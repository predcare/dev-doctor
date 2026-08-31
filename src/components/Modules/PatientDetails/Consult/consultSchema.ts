import * as yup from 'yup';

export const consultFormSchema = yup.object().shape({
  // Step 1: Diagnosis
  chief_complaints: yup.string().optional(),
  examination_notes: yup.string().optional(),
  diagnosis: yup.string().optional(),
  treatment_plan: yup.string().optional(),

  // Step 2: Vitals
  blood_pressure: yup.string().optional(),
  pulse: yup.string().optional(),
  temperature: yup.string().optional(),
  spo2: yup.string().optional(),
  weight: yup.string().optional(),
  height: yup.string().optional(),
  bmi: yup.string().optional(),
  custom_vitals: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().optional(),
        value: yup.string().optional(),
      })
    )
    .optional(),

  // Step 3: Medications
  medications: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.mixed().optional(),
        name: yup.string().optional(),
        strength: yup.string().optional(),
        strengthUnit: yup.string().default('mg'),
        dosage: yup.string().optional(),
        timing: yup.string().optional(),
        durationNum: yup.string().default('30'),
        durationUnit: yup.string().default('days'),
        instructions: yup.string().optional(),
      })
    )
    .optional(),

  // Step 4: Lab Tests
  lab_tests_structured: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().optional(),
        instructions: yup.string().optional(),
      })
    )
    .optional(),

  // Step 5: Advice
  general_advice: yup.string().optional(),
  follow_up_date: yup.string().optional(),
  referral_specialist: yup.string().optional(),
  referral_doctor_hospital: yup.string().optional(),
  referral_reason: yup.string().optional(),
  notes: yup.string().optional(),
});

export type ConsultFormValues = yup.InferType<typeof consultFormSchema>;
