import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { IAllUsersRoot } from '../../../typescripts/interfaces/allUsers.interfaces';
import {
  ICitiesRoot,
  ICountryRoot,
  IStatesRoot,
} from '../../../typescripts/interfaces/locations.interfaces';

export const getCountries = async () => {
  const res = await axiosInstance.get<ICountryRoot>(`${endpoints.commons.country}`);
  return res.data;
};

export const getStates = async (countryId: number) => {
  const res = await axiosInstance.get<IStatesRoot>(`${endpoints.commons.states}${countryId}`);
  return res.data;
};

export const getCities = async (stateId: number) => {
  const res = await axiosInstance.get<ICitiesRoot>(`${endpoints.commons.cities}${stateId}`);
  return res.data;
};

export const fetchAllUsers = async (doctorId?: string | number) => {
  const res = await axiosInstance.get<IAllUsersRoot>(endpoints.commons.users, {
    params: doctorId ? { doctor_id: doctorId } : undefined,
  });
  return res.data;
};
