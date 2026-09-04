export interface IMyProfileRoot {
  success: boolean;
  doctor: IMyProfileDoc;
}

export interface IPatientEMRRoot {
  success: boolean;
  count: number;
  documents: IPatientEMRDoc[];
}

export interface IMyProfileDoc {
  doctor_id: number;
  email: string;
  id: number;
  name: string;
  phone_number: string;
  role: string;
  status: string;
  user_id: number;
  specialization: string;
  qualifications: string;
  experience_years: number;
  license_number: string;
  bio: string;
  google_calendar_connected: boolean;
  clinic_id: number;
  clinic_name: string;
  clinic_association_status: string;
  clinic_address: string;
  clinic_phone: string;
  clinic_email: string;
  clinic_gstin: string;
}

export interface IPatientEMRDoc {
  id: number;
  patient_id: number;
  doctor_id: number;
  document_type: string;
  title: string;
  document_path: string;
  description: string;
  visible_to_patient: number;
  document_url: string;
  appointment_id?: number;
  uploaded_during_call: number;
  created_at: string;
  updated_at: string;
  specialization: string;
  doctor_name: string;
  appointment_date?: string;
  patient_record_id: number;
  patient_user_id: number;
  notes: string;
  shared_doctor_ids: number[];
}
