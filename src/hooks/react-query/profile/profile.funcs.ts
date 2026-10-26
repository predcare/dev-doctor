import axiosInstance from '../../../services/api/apiClient';
import { endpoints } from '../../../services/api/endpoints';
import { ICommonRoot, IRootResponse } from '../../../typescripts/interfaces/common.interfaces';
import { IMyProfileDoc, TMyClinicsRoot } from '../../../typescripts/interfaces/profile.interfaces';

export const getProfile = async () => {
  const res = await axiosInstance.get<IRootResponse<IMyProfileDoc>>(`${endpoints.profile.get}`);
  return res.data;
};

export const getDoctorClinics = async () => {
  const res = await axiosInstance.get<TMyClinicsRoot>(`${endpoints.profile.doctorClinics}`);
  return res.data;
};

export const switchClinic = async (body: { clinic_id: string }) => {
  const res = await axiosInstance.post<ICommonRoot>(`${endpoints.profile.switchClinic}`, body);
  return res.data;
};
