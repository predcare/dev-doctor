import axiosInstance from '../../../services/api/apiClient';
import { endpoints } from '../../../services/api/endpoints';
import { TStatsInfoRoot } from '../../../typescripts/interfaces/stats.interfaces';

export const getDoctorStats = async (params: { date_filter: string; clinic_id: number }) => {
  const res = await axiosInstance.get<TStatsInfoRoot>(`${endpoints.stats.get}`, {
    params: params,
  });
  return res.data;
};
