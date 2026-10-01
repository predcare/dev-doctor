export interface IHomeStatsRoot {
  success: boolean;
  stats: IHomeStatsDoc;
}

export interface IUpcomingApptsRoot {
  success: boolean;
  count: number;
  appointments: IUpcomingApptsDoc[];
}

export interface IHomeStatsDoc {
  todayAppointments: number;
  totalPatients: number;
  todayRevenue: number;
  upcomingAppointments: number;
  period: string;
  range_start: string;
  range_end: string;
}

export interface IUpcomingApptsDoc {
  id: number;
  appointment_id: string;
  patient_id: number;
  doctor_id: number;
  consultation_type: string;
  specialization: any;
  appointment_date: string;
  appointment_slot_time: IUpcomingApptsSlot[];
  start_time: string;
  end_time: string;
  appointment_fee: string;
  fee_type: string;
  appointment_type: string;
  appointment_status: string;
  payment_status: string;
  payment_type: any;
  symptoms: string;
  medications: string;
  reason: string;
  meeting_id: any;
  token: any;
  call_start_time: any;
  call_end_time: any;
  call_duration_seconds: any;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_gender: string;
  gender: string;
  patient_date_of_birth: string;
  patient_dob: string;
  date_of_birth: string;
  patient_alphanumeric_id: string;
  patient_record_id: number;
}

export interface IUpcomingApptsSlot {
  end: string;
  start: string;
  booked: boolean;
}
