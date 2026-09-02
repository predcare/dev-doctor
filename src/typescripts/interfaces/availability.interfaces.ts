export interface IMyAvailabilityRoot {
  success: boolean;
  count: number;
  data: IMyAvailabilityDoc[];
}

export interface IMyAvailabilityDoc {
  id: number;
  created_from: string;
  created_by: number;
  google_event_id: string | null;
  clinic_id: number;
  doctor_id: number;
  date_selection_mode: 'recurring' | 'specific' | string;
  selected_dates: string[];
  recurring_days: string[];
  recurring_start_date: string | null;
  recurring_end_date: string | null;
  recurring_dates: string[];
  leave_dates: string[];
  slot_duration: number;
  from_time: string;
  to_time: string;
  time_slots: TimeSlot[];
  booked_slots: BookedSlots;
  consultation_type: 'in-person' | 'video' | 'both' | string;
  in_person_fee: string;
  video_fee: string;
  hide_fee: number;
  require_payment: number;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface BookedSlots {
  [date: string]: string[];
}
