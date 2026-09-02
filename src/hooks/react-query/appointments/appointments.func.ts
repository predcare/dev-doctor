import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { IMyAppointmentsRoot } from '../../../typescripts/interfaces/appointments.interfaces';

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

export const sendHeartBeat = async (body: {
  appointment_id: string | number;
  role: 'doctor';
  call_timer_started_at: string;
  call_elapsed_seconds: number;
  call_timer_paused: boolean;
}) => {
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
