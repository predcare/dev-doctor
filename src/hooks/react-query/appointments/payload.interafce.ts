export interface IMyApptQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  consultation_type?: string;
  date_range?: string;
  appointment_date?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  payment_status?: string;
}

export interface IRescheduleAppointment {
  appointment_date: string;
  start_time: string;
  end_time: string;
  availability_id: string[];
  clinic_id: string;
  appointment_duration: number;
  reason: string;
  appointment_slot_time: {
    start: string;
    end: string;
  }[];
}
