import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { IMyAvailabilityRoot } from '../../../typescripts/interfaces/availability.interfaces';

// get
export const getAvailablity = async (doctorId: number | string) => {
  const res = await axiosInstance.get<IMyAvailabilityRoot>(
    `${endpoints.availablity.get}${doctorId}`
  );
  return res.data;
};

// delete
export const deleteAvailability = async (id: number | string) => {
  const res = await axiosInstance.delete(`${endpoints.availablity.delete}${id}`);
  return res.data;
};

// create
export const createAvailability = async (doctorId: number | string, body: any) => {
  const res = await axiosInstance.post(`${endpoints.availablity.create}${doctorId}`, body);
  return res.data;
};

// update
export const updateAvailability = async (id: number | string, body: any) => {
  const res = await axiosInstance.put(`${endpoints.availablity.update}${id}`, body);
  return res.data;
};
