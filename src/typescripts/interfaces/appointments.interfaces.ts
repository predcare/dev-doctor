import { IRootResponse } from './common.interfaces';

export type TMyAppointmentRoot = IRootResponse<IMyAppointmentDoc[]>;
export type THomeMyAppointmentsRoot = IRootResponse<IMyAppointmentDoc[]>;
export type IPatientConsultApptRoot = IRootResponse<IMyAppointmentDoc[]>;
export type TMyAppointmentStats = IRootResponse<IMyApptStatus>;
export type TGetApptTokenRoot = IRootResponse<IGetApptTokenDoc>;

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
