export interface IMyAppointmentsRoot {
  success: boolean;
  count: number;
  appointments: IAppointmentDoc[];
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
