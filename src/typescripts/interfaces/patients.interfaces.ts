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

export interface IPatientFamilyMemberRoot {
  success: boolean;
  members: IPatientFamilyMember[];
  count: number;
}

export interface IMyPatientDoc {
  id: string;
  user_id: string;
  patient_id: string;
  name: string;
  email: string;
  phone_number: string;
  alternate_phone: string;
  whatsapp_number: string;
  gender: string;
  date_of_birth: string;
  status: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  profile_image: any;
  medical_history: string;
  created_at: any;
  blood_pressure: any;
  pulse: any;
  temperature: any;
  spo2: any;
  weight: any;
  height: any;
  bmi: any;
  drug_allergies: any;
  total_appointments: number;
  last_appointment_date: any;
  age_display?: string;
  gender_display?: string;
  blood_type?: any;
}

export interface IPatientBasicInfo {
  patient_id: string;
  name: string;
  user_id: string | number;
  email?: string;
  phone_number?: string;
}

export interface IPatientFamilyMember {
  user_id: number;
  name: string;
  relation: string;
  gender: string;
  date_of_birth: string;
  phone: string;
  email: string;
  patient_record_id: number;
  patient_id: string;
  profile_image: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  profile_picture: string;
}
