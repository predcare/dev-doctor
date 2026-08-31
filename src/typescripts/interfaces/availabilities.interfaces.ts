export interface IMyAvailabilityDoc {
  id: string;
  created_from: string;
  created_by: string;
  google_event_id: any;
  clinic_id: string;
  doctor_id: string;
  date_selection_mode: string;
  selected_dates: string[];
  recurring_days: string[];
  recurring_start_date: string;
  recurring_end_date: string;
  recurring_dates: string[];
  leave_dates: any[];
  slot_duration: number;
  from_time: string;
  to_time: string;
  time_slots: ITimeSlot[];
  booked_slots: any[];
  consultation_type: string;
  in_person_fee: number;
  video_fee: number;
  hide_fee: boolean;
  require_payment: boolean;
  status: boolean;
  created_at: string;
  updated_at: string;
  clinic: IClinic;
}

export interface ITimeSlot {
  end: string;
  start: string;
}

export interface IClinic {
  id: string;
  name: string;
  email: string;
  status: string;
}
