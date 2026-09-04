export interface IPatientPrescriptionListRoot {
  success: boolean;
  count: number;
  prescriptions: IPatientPrescriptionDoc[];
}

export interface IPatientPrescriptionInfoRoot {
  success: boolean;
  prescription: IPatientPrescriptionDoc;
}

export interface IPatientPrescriptionDoc {
  id: number;
  created_from: string;
  created_by: number;
  prescription_id: string;
  doctor_id: number;
  patient_id: number;
  appointment_id: number;
  clinic_id?: number;
  type: string;
  clinic_name?: string;
  consultation_date?: string;
  clinic_address?: string;
  consultation_mode?: string;
  patient_name: string;
  patient_age?: string;
  patient_gender?: string;
  drug_allergies?: string;
  chronic_conditions?: string;
  blood_pressure?: string;
  pulse?: string;
  temperature?: string;
  spo2?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  custom_vitals?: IPatientCustomVital[];
  chief_complaints?: string;
  examination_notes?: string;
  diagnosis: string;
  treatment_plan?: string;
  symptoms: string;
  medications: IPatientMedication[];
  lab_tests?: IPatientLabTest[];
  general_advice?: string;
  follow_up?: string;
  follow_up_date?: string;
  referral_specialist?: string;
  referral_doctor_hospital?: string;
  referral_reason?: string;
  notes?: string;
  digital_signature: any;
  status: string;
  pdf_path: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  pdf_url: string;
  doctor_name: string;
  doctor_specialization: string;
  appointment_date: string;
  doctor_email: string;
  doctor_phone: string;
  resolved_clinic_name: any;
  resolved_clinic_address: any;
}

export interface IPatientCustomVital {
  name: string;
  value: string;
}

export interface IPatientMedication {
  id: number;
  name: string;
  dosage: string;
  timing: string;
  strength: string;
  durationNum: string;
  durationUnit: string;
  instructions: string;
  strengthUnit: string;
}

export interface IPatientLabTest {
  text?: string;
  name?: string;
  instructions?: string;
}
