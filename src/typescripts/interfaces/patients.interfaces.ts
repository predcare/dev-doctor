export interface IMyPatientListRoot {
  success: boolean;
  count: number;
  patients: IMyPatientDoc[];
}

export interface IPatientInfoRoot {
  success: boolean;
  patient: IMyPatientDoc;
}

export interface ILinkExistingPatientResponse {
  success: boolean;
  message?: string;
  patient?: IPatientBasicInfo;
}

export interface ICreatePatientResponse {
  success: boolean;
  message?: string;
  patient?: IPatientBasicInfo;
}

export interface IMyPatientDoc {
  id: number;
  user_id: number;
  patient_id: string;
  name: string;
  email: string;
  phone_number: string;
  alternate_phone?: string;
  whatsapp_number: any;
  gender: string;
  date_of_birth: string;
  status: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  profile_image?: string;
  medical_history?: string;
  created_at: string;
  blood_pressure: any;
  pulse: any;
  temperature: any;
  blood_type: any;
  spo2: any;
  weight: any;
  height: any;
  bmi: any;
  total_appointments: number;
  last_appointment_date?: string;
  created_from: string;
  created_by: number;
  drug_allergies: any;
  verified_at: any;
  verified_by: any;
  updated_at: string;
  deleted_at: any;
  age_display: string;
  age_years: number;
  gender_display: string;
  appointments: any[];
}

export interface IPatientBasicInfo {
  patient_id: string;
  name: string;
  user_id: string | number;
  email?: string;
  phone_number?: string;
}
