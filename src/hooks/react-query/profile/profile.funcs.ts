import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { IMyProfileRoot } from '../../../typescripts/interfaces/profile.interfaces';

export const getProfile = async () => {
  const res = await axiosInstance.get<IMyProfileRoot>(`${endpoints.profile.get}`);
  return res.data;
};
