export interface IPrescriptionCustomVital {
  name?: string;
  value?: string;
}

export interface IPrescriptionMedication {
  id?: number | string | any;
  name?: string;
  strength?: string;
  strengthUnit?: string;
  dosage?: string;
  timing?: string;
  durationNum?: string;
  durationUnit?: string;
  instructions?: string;
}

export interface IPrescriptionLabTestStructured {
  name?: string;
  instructions?: string;
}

export interface ICreatePrescriptionPayload {
  doctor_id: number | string;
  patient_id: number | string;
  appointment_id?: number | string;
  type?: string;
  patient_name?: string;
  patient_age?: number | string;
  patient_gender?: string;
  chief_complaints?: string;
  diagnosis?: string;
  symptoms?: string;
  examination_notes?: string;
  treatment_plan?: string;
  drug_allergies?: string | null;
  chronic_conditions?: string | null;
  blood_pressure?: string;
  pulse?: string;
  temperature?: string;
  spo2?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  custom_vitals?: IPrescriptionCustomVital[];
  medications?: IPrescriptionMedication[];
  lab_tests?: string;
  lab_tests_structured?: IPrescriptionLabTestStructured[];
  general_advice?: string;
  follow_up?: string;
  follow_up_date?: string;
  referral_specialist?: string;
  referral_doctor_hospital?: string;
  referral_reason?: string;
  notes?: string;
  clinic_name?: string | null;
  clinic_address?: string | null;
  consultation_date?: string | null;
  consultation_mode?: string;
  header_text?: string | null;
  footer_text?: string | null;
  status?: 'draft' | 'completed' | string;
}

export interface IUpsertDraftPrescriptionPayload extends Omit<ICreatePrescriptionPayload, 'status'> {
  status: 'draft';
}

export interface IUpdatePrescriptionPayload extends Partial<ICreatePrescriptionPayload> {
  status?: 'draft' | 'completed' | string;
}
