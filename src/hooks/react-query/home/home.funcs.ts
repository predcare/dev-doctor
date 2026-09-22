import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { THomeMyAppointmentsRoot } from '../../../typescripts/interfaces/appointments.interfaces';
import { IHomeStatsRoot } from '../../../typescripts/interfaces/homes.interfaces';
import { IMyApptQueryParams } from '../appointments/payload.interafce';

export const getHomeStats = async (params: { userId: number | string; period: string }) => {
  const res = await axiosInstance.get<IHomeStatsRoot>(`${endpoints.homes.stats(params?.userId)}`, {
    params: { period: params?.period },
  });
  return res.data;
};

export const getHomeUpcomingAppts = async (params: IMyApptQueryParams) => {
  const res = await axiosInstance.get<THomeMyAppointmentsRoot>(`${endpoints.homes.upcomingAppts}`, {
    params,
  });
  return res.data;
};
