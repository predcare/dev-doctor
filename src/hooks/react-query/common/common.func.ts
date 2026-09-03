import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { ICommonRoot } from '../../../typescripts/interfaces/common.interfaces';

export const getCountries = async () => {
  const res = await axiosInstance.get<ICommonRoot>(`${endpoints.commons.country}`);
  return res.data;
};

export const getStates = async (countryId: number) => {
  const res = await axiosInstance.get<ICommonRoot>(`${endpoints.commons.states}${countryId}`);
  return res.data;
};

export const getCities = async (stateId: number) => {
  const res = await axiosInstance.get<ICommonRoot>(`${endpoints.commons.states}${stateId}`);
  return res.data;
};
