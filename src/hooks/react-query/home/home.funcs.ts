import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import {
  IHomeStatsRoot,
  IUpcomingApptsRoot,
} from '../../../typescripts/interfaces/homes.interfaces';

export const getHomeStats = async (params: { userId: number | string; period: string }) => {
  const res = await axiosInstance.get<IHomeStatsRoot>(`${endpoints.homes.stats(params?.userId)}`, {
    params: { period: params?.period },
  });
  return res.data;
};

export const getHomeUpcomingAppts = async (params: { userId: number | string }) => {
  const res = await axiosInstance.get<IUpcomingApptsRoot>(
    `${endpoints.homes.upcomingAppts(params?.userId)}`
  );
  return res.data;
};
