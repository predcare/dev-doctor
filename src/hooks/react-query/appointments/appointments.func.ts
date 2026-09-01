import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { IMyAppointmentsRoot } from '../../../typescripts/interfaces/appointments.interfaces';

export const getMyAppointments = async (doctorId: number | string) => {
  const res = await axiosInstance.get<IMyAppointmentsRoot>(
    `${endpoints.appointments.get}/${doctorId}`
  );
  return res.data;
};
