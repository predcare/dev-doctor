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
