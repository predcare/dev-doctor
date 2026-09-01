export interface ILinkExistingPatientPayload {
  user_id: number | string;
  doctor_id: number | string;
}

export interface ICreatePatientPayload {
  name: string;
  email?: string | null;
  phone: string;
  alternate_number?: string | null;
  whatsapp_number?: string | null;
  gender: string;
  date_of_birth: string;
  address?: string;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  status?: string;
  medical_history?: string | null;
  doctor_id: number | string;
  profile_image?: string | null;
}

export interface ISendPatientCredentialsPayload {
  patient_id: string | number;
  email: string;
  name?: string;
  phone?: string;
}
