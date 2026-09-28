import { IRootResponse } from './common.interfaces';

export type TMyAppointmentRoot = IRootResponse<IMyAppointmentDoc[]>;
export type THomeMyAppointmentsRoot = IRootResponse<IMyAppointmentDoc[]>;
export type IPatientConsultApptRoot = IRootResponse<IMyAppointmentDoc[]>;
export type TMyAppointmentStats = IRootResponse<IMyApptStatus>;
export type TGetApptTokenRoot = IRootResponse<IGetApptTokenDoc>;
export type TMyAppointmentInfoRoot = IRootResponse<IApptInfoDoc>;

export interface IAppointmentInfoRoot {
  success: boolean;
  appointment: IAppointmentDoc;
}

export interface IAppointmentDoc {
  id: number;
  appointment_id: string;
  patient_id: number;
  doctor_id: number;
  consultation_type: string;
  specialization?: string;
  appointment_date: string;
  appointment_slot_time?: IAppointmentSlotTime[];
  start_time?: string;
  end_time?: string;
  appointment_fee?: string;
  fee_type?: string;
  appointment_type: string;
  appointment_status: string;
  payment_status: string;
  payment_type: any;
  symptoms?: string;
  medications?: string;
  reason?: string;
  doctor_note?: string;
  meeting_id?: string;
  token?: string;
  call_start_time?: string;
  call_end_time?: string;
  call_duration_seconds?: number;
  call_end_reason?: string;
  max_participants: number;
  participant_join_times?: IParticipantJoinTime[];
  created_at: string;
  updated_at: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_alphanumeric_id: string;
  patient_record_id: number;
  patient_date_of_birth: string;
  patient_dob: string;
  patient_gender: string;
  date_of_birth: string;
}

export interface IAppointmentSlotTime {
  end: string;
  start: string;
  booked: boolean;
}

export interface IParticipantJoinTime {
  role: string;
  source: string;
  left_at: string;
  joined_at: string;
  display_name: string;
  leave_reason: ILeaveReason;
  participant_id: string;
}

export interface ILeaveReason {
  code: number;
  message: string;
}

export interface IChangeAppointmentStatusPayload {
  appointmentId: number | string;
  appointment_status: 'completed' | 'in_progress' | 'cancelled' | 'pending' | 'confirmed' | string;
}

// New Response
export interface IMyAppointmentDoc {
  id: string;
  created_from: string;
  created_by: string;
  appointment_id: string;
  patient_id: string;
  added_by: string;
  consultation_type: string;
  doctor_id: string;
  clinic_id: string;
  specialization: string;
  appointment_date: string;
  appointment_slot_time: IAppointmentSlotTime[];
  start_time: string;
  end_time: string;
  appointment_fee: number;
  fee_type: string;
  appointment_type: string;
  appointment_status: string;
  doctor_note: any;
  payment_type: string;
  payment_status: string;
  transaction_id?: string;
  reason: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  call_end_time?: string;
  meeting_id?: string;
  token?: string;
  call_duration_seconds?: number;
  doctorInfo: IDoctorInfo;
  clinicInfo: IClinicInfo;
  patientInfo: IPatientInfo;
}

export interface IDoctorInfo {
  name: string;
  doctorId: number;
  profileImage: any;
}

export interface IClinicInfo {
  name: string;
  clinicId: number;
  fulladdress: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface IPatientInfo {
  name: string;
  patientId: string;
  displayPatientId: string;
  profileImage: any;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
}

export interface IMyApptStatus {
  date: string;
  today_count: number;
  upcoming_3h_count: number;
  total_appointments: number;
  confirmed_count: number;
  in_progress_count: number;
  completed_count: number;
  cancelled_count: number;
  pending_count: number;
}

export interface IGetApptTokenDoc {
  token: string;
  meeting_id: string;
  appointment: ITokenAppt;
}

export interface ITokenAppt {
  id: string;
  appointment_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  slot_duration: number;
}

// Appointment Info
export interface IApptInfoDoc {
  id: string;
  created_from: string;
  created_by: string;
  google_event_id: any;
  appointment_id: string;
  patient_id: string;
  added_by: string;
  consultation_type: string;
  doctor_id: string;
  clinic_id: string;
  specialization: string;
  appointment_date: string;
  appointment_slot_time: IAppointmentSlotTime[];
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  appointment_fee: number;
  fee_type: string;
  appointment_type: string;
  appointment_status: string;
  doctor_note: string;
  meeting_id: any;
  token: any;
  call_start_time: any;
  call_timer_started_at: any;
  call_elapsed_seconds: number;
  call_timer_paused: boolean;
  doctor_last_heartbeat: any;
  patient_last_heartbeat: any;
  call_end_time: any;
  call_duration_seconds: any;
  call_end_reason: any;
  max_participants: number;
  participant_join_times: any;
  payment_type: any;
  payment_status: string;
  transaction_id: any;
  reason: string;
  is_active: boolean;
  symptoms: any;
  medications: any;
  reminder_sent_at: any;
  created_at: string;
  updated_at: string;
  doctor: IApptInfoDoctor;
  patient: IApptInfoPatient;
  clinic: IApptInfoClinic;
}

export interface IApptInfoDoctor {
  id: string;
  user_id: string;
  doctor_id: string;
  name: string;
  email: string;
  phone_number: string;
  profile_image: any;
  gender: string;
  specialization: string;
  sub_specializations: any;
  qualifications: string;
  experience_years: number;
  bio: string;
  languages_spoken: string[];
  license_number: string;
  rating: any;
  reviews_count: number;
}

export interface IApptInfoPatient {
  id: string;
  user_id: string;
  patient_id: string;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  age: number;
  profile_image: string;
  blood_type: any;
  blood_pressure: any;
  pulse: any;
  temperature: any;
  spo2: any;
  weight: any;
  height: any;
  bmi: any;
  drug_allergies: any;
  medical_history: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_dependent: boolean;
  relation: string;
}

export interface IApptInfoClinic {
  id: string;
  name: string;
  email: string;
  contact_numbers: any;
  full_address: string;
  line1: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  location: {
    lat: number;
    lng: number;
  };
  clinic_reg_number: string;
  gst_number: string;
  about: string;
}
