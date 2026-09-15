import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { ICommonRoot, IRootResponse } from '../../../typescripts/interfaces/common.interfaces';
import { IMyProfileDoc } from '../../../typescripts/interfaces/profile.interfaces';
import { ILoginVerifyOtpPayload } from './payload.interfaces';

export const sendOtp = async (body: { email?: string; phone?: string; user_type?: string }) => {
  const res = await axiosInstance.post<ICommonRoot>(endpoints.auth.sendOtp, body);
  return res.data;
};

export const reSendOtp = async (body: { email?: string; phone?: string; user_type?: string }) => {
  const res = await axiosInstance.post<ICommonRoot>(endpoints.auth.resendOtp, body);
  return res.data;
};
export const verifyOtp = async (body: ILoginVerifyOtpPayload) => {
  const res = await axiosInstance.post<IRootResponse<IMyProfileDoc>>(
    endpoints.auth.verifyOtp,
    body
  );
  return res.data;
};

export const fetchAllUsers = async (doctorId?: string | number) => {
  const res = await axiosInstance.get<any>(endpoints.auth.users, {
    params: doctorId ? { doctor_id: doctorId } : undefined,
  });
  return res.data;
};
