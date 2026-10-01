export interface IPatientRegisterPayload {
  name: string;
  email: string;
  phone_number: string;
  source: 'app';
  created_from: 'app';
}
export interface IPatientVerifyOtpPayload {
  email: string;
  phone_number: string;
  otp: string;
  device_id: string;
  device_name: string;
  platform: 'android' | 'ios';
  os_version: string;
  app_version: string;
  fcm_token: string;
}

export interface IResendOtpPayload {
  user_type: 'patient';
  email?: string;
  phone_number?: string;
}

export interface ILoginSendOtpPayload {
  email?: string;
  phone_number?: string;
  user_type: 'patient' | 'doctor';
}

export interface ILoginVerifyOtpPayload {
  email?: string;
  phone_number?: string;
  otp: string;
  user_type: 'patient' | 'doctor';
  device_id: string;
  device_name: string;
  platform: 'android' | 'ios';
  os_version: string;
  app_version: string;
  fcm_token: string;
}

export interface ILogoutPayload {
  device_id: string;
  all_devices: boolean;
}

export interface ICreateAppointmentPayload {
  doctor_id: number | string;
  patient_id: number | string;
  clinic_id: number | string;
  availability_id: (string | number)[];
  appointment_date: string;
  start_time: string;
  end_time: string;
  consultation_type: 'video' | 'in-person' | string;
  appointment_type: 'first_visit' | string;
  reason: string | null;
  symptoms?: string | null;
  medications?: string | null;
  appointment_slot_time:
    | Array<{
        start: string;
        end: string;
        booked?: boolean;
      }>
    | string;
  appointment_fee?: number;
  appointment_status?: string;
  payment_status?: string;
}
