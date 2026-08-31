import { IRootResponse } from './common.interfaces';

export type TMyProfileRoot = IRootResponse<IMyProfileDoc>;

export interface ILoginResponse {
  success: boolean;
  status?: number;
  statusCode?: number;
  message: string;
  data: IMyProfileDoc;
  token: string;
}

export interface IMyProfileDoc {
  id: string;
  parent_user_id: any;
  relation: any;
  is_dependent: boolean;
  can_login: boolean;
  salutation: string;
  country_code: number;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  alternate_number: string;
  whatsapp_number: string;
  name: string;
  email: string;
  email_verified_at: string;
  status: string;
  user_type: string;
  max_active_devices: number;
  device_limit_override: any;
  is_superadmin: boolean;
  created_from: string;
  last_login_at: string;
  created_at: string;
  updated_at: string;
  result_type: string;
  doctor_id: string;
  doctor_number: string;
  doctor_status: string;
  doctor_name: string;
  doctor_email: string;
  doctor_phone_number: string;
  doctor_country_code: number;
  doctor_salutation: string;
  doctor_gender: string;
  specialization: string;
  sub_specializations: SubSpecializations;
  qualifications: string;
  experience_years: number;
  bio: string;
  languages_spoken: string[];
  license_number: string;
  license_state: any;
  license_valid_until: any;
  verification_status: string;
  doctor_verified_at: string;
  rating: any;
  reviews_count: number;
  accepts_new_patients: boolean;
  approval_required: boolean;
  booking_type: string;
  profile_image: any;
  certificates: any;
  current_clinic: any;
  clinic: Clinic;
}

export interface SubSpecializations {
  Anesthesiology: string[];
  'Aviation Medicine': string[];
  'Allergy & Immunology': string[];
}

export interface Clinic {
  in_person_fee: any;
  video_fee: any;
  home_visit_fee: any;
  in_person_duration: number;
  video_duration: number;
  home_visit_duration: number;
  offers_in_person: boolean;
  offers_video: boolean;
  offers_home_visit: boolean;
  clinic_id: string;
  clinic_name: string;
  clinic_email: string;
  about: string;
  line1: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  contact_numbers: string[];
  status: string;
  clinic_reg_number: string;
  email: string;
}
