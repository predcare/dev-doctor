import * as yup from 'yup';

export const EditPatientSchema = yup.object().shape({
  address: yup.string().trim().optional(),
  country: yup.string().trim().required('Country is required'),
  state: yup.string().trim().optional(),
  city: yup.string().trim().optional(),
  postal_code: yup
    .string()
    .trim()
    .optional()
    .test('postal-code', 'Postal code must be 6 digits', val => !val || /^\d{6}$/.test(val)),
  blood_pressure: yup
    .string()
    .trim()
    .optional()
    .test(
      'bp-format',
      'Blood pressure format should be e.g. 120/80',
      val => !val || /^\d{2,3}\/\d{2,3}$/.test(val)
    ),
  pulse: yup.string().trim().optional(),
  temperature: yup.string().trim().optional(),
  spo2: yup.string().trim().optional(),
  weight: yup.string().trim().optional(),
  height: yup.string().trim().optional(),
  bmi: yup.string().trim().optional(),
  medical_history: yup.string().trim().optional(),
  blood_type: yup.string().trim().optional(),
});

export type TEditPatientSchemaType = yup.InferType<typeof EditPatientSchema>;
