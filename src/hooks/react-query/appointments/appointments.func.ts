import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import {
  IAppointmentInfoRoot,
  IMyAppointmentsRoot,
} from '../../../typescripts/interfaces/appointments.interfaces';
import { ICreateAppointmentPayload } from '../auth/payload.interfaces';

export const getMyAppointments = async (doctorId: number | string) => {
  const res = await axiosInstance.get<IMyAppointmentsRoot>(
    `${endpoints.appointments.get}/${doctorId}`
  );
  return res.data;
};

export const getApptToken = async (appointmentId: number | string) => {
  const res = await axiosInstance.get<any>(`${endpoints.appointments.getToken(appointmentId)}`);
  return res.data;
};

export interface ISendHeartbeatPayload {
  appointment_id: string | number;
  role: 'doctor';
  call_timer_started_at: string;
  call_elapsed_seconds: number;
  call_timer_paused: boolean;
}

export interface IHeartbeatResponseData {
  appointmentId: number;
  appointment_status: string;
  call_elapsed_seconds: number;
  call_timer_paused: boolean;
  presence: {
    patient_active: boolean;
    doctor_active: boolean;
    stale_roles: string[];
  };
  remote_party_stale: boolean;
}

export interface IHeartbeatApiResponse {
  ok: boolean;
  message: string;
  timestamp: string;
  data: IHeartbeatResponseData;
}

export const sendHeartBeat = async (
  body: ISendHeartbeatPayload
): Promise<IHeartbeatApiResponse> => {
  const res = await axiosInstance.post(`${endpoints.appointments.heartbeat}`, body);
  return res.data;
};

export const changeAppointmentStatus = async (body: {
  appointmentId: number | string;
  appointment_status: string;
}) => {
  const res = await axiosInstance.patch(endpoints.appointments.statusChange(body.appointmentId), {
    appointment_status: body.appointment_status,
  });
  return res.data;
};

export const bookAppointments = async (body: ICreateAppointmentPayload) => {
  const res = await axiosInstance.post(endpoints.appointments.bookByDoc, body);
  return res.data;
};

export const getMyAppointmentInfo = async (id: number | string) => {
  const res = await axiosInstance.get<IAppointmentInfoRoot>(
    `${endpoints.appointments.getdetails(id)}`
  );
  return res.data;
};

export const rescheduleAppointment = async (id: number | string, body: any) => {
  const res = await axiosInstance.patch(endpoints.appointments.reschedule(id), body);
  return res.data;
};

export interface ISaveCallPayload {
  appointment_id: string | number;
  call_start_time: string;
  call_end_time: string;
  call_duration_seconds: number;
  accumulated_call_seconds: number;
  call_end_reason: 'time_up' | 'doctor_ended_early' | 'patient_left' | 'error';
  max_participants: number;
  mark_completed: boolean;
  call_timer_started_at?: string | null;
  call_elapsed_seconds?: number;
  call_timer_paused?: boolean;
  doctor_last_heartbeat?: string | null;
  patient_last_heartbeat?: string | null;
}

export const saveCall = async (body: ISaveCallPayload) => {
  const res = await axiosInstance.post(endpoints.appointments.saveCall, body);
  return res.data;
};

