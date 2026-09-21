export interface ILinkExistingPatientPayload {
  user_id: number | string;
  clinic_id: number | string;
}

export interface IUpdatePatientInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  blood_pressure: string;
  pulse: string;
  temperature: string;
  spo2: string;
  weight: string;
  height: string;
  bmi: string;
  medical_history: string;
  blood_type?: string;
}
