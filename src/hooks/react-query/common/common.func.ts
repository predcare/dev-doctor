import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { IAllUsersRoot } from '../../../typescripts/interfaces/allUsers.interfaces';
import { IRootResponse } from '../../../typescripts/interfaces/common.interfaces';
import { ILocationDoc } from '../../../typescripts/interfaces/locations.interfaces';

export const getCountries = async () => {
  const res = await axiosInstance.get<IRootResponse<ILocationDoc[]>>(
    `${endpoints.commons.country}`
  );
  return res.data;
};

export const getStates = async (countryId: number) => {
  const res = await axiosInstance.get<IRootResponse<ILocationDoc[]>>(
    `${endpoints.commons.states(countryId)}`
  );
  return res.data;
};

export const getCities = async (stateId: number) => {
  const res = await axiosInstance.get<IRootResponse<ILocationDoc[]>>(
    `${endpoints.commons.cities(stateId)}`
  );
  return res.data;
};

export const fetchAllUsers = async (doctorId?: string | number) => {
  const res = await axiosInstance.get<IAllUsersRoot>(endpoints.commons.users, {
    params: doctorId ? { doctor_id: doctorId } : undefined,
  });
  return res.data;
};
