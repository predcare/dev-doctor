export interface IMyProfileRoot {
  success: boolean;
  doctor: IMyProfileDoc;
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
  clinic_address:string
}
