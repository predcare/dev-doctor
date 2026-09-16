import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import {
  IDocBookingAvailRoot,
  IMyAvailabilityDoc,
} from '../../../typescripts/interfaces/availability.interfaces';
import { ICommonRoot, IRootResponse } from '../../../typescripts/interfaces/common.interfaces';

// get all my availability
export const getAvailablity = async () => {
  const res = await axiosInstance.get<IRootResponse<IMyAvailabilityDoc[]>>(
    `${endpoints.availablity.get}`
  );
  return res.data;
};

// delete
export const deleteAvailability = async (id: number | string) => {
  const res = await axiosInstance.delete<ICommonRoot>(`${endpoints.availablity.delete}${id}`);
  return res.data;
};

// create
export const createAvailability = async (body: any) => {
  const res = await axiosInstance.post<ICommonRoot>(`${endpoints.availablity.create}`, body);
  return res.data;
};

// update
export const updateAvailability = async (id: number | string, body: any) => {
  const res = await axiosInstance.put<ICommonRoot>(`${endpoints.availablity.update}/${id}`, body);
  return res.data;
};

export const getDocBookingAvails = async (doctorId: number, clinicId: number) => {
  const res = await axiosInstance.get<IDocBookingAvailRoot>(
    `${endpoints.availablity.fullAvailability}?doctor_id=${doctorId}&clinic_id=${clinicId}`
  );
  return res.data;
};
