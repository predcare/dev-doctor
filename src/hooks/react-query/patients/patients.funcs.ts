import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { ICommonRoot } from '../../../typescripts/interfaces/common.interfaces';
import {
  ICreatePatientResponse,
  ILinkExistingPatientResponse,
  IMyPatientListRoot,
} from '../../../typescripts/interfaces/patients.interfaces';
import {
  ICreatePatientPayload,
  ILinkExistingPatientPayload,
  ISendPatientCredentialsPayload,
} from './payload.interfaces';

export const getMyPatientsList = async (doctorId: number | string) => {
  const res = await axiosInstance.get<IMyPatientListRoot>(`${endpoints.patients.get}${doctorId}`);
  return res.data;
};

export const deletePatient = async (patientId: number | string) => {
  const res = await axiosInstance.delete<ICommonRoot>(`${endpoints.patients.delete}${patientId}`);
  return res.data;
};

export const linkExistingPatient = async (payload: ILinkExistingPatientPayload) => {
  const res = await axiosInstance.post<ILinkExistingPatientResponse>(
    endpoints.patients.linkExisting,
    payload
  );
  return res.data;
};

export const createNewPatient = async (payload: ICreatePatientPayload) => {
  const res = await axiosInstance.post<ICreatePatientResponse>(
    endpoints.patients.newCreate,
    payload
  );
  return res.data;
};

export const sendPatientCredentials = async (payload: ISendPatientCredentialsPayload) => {
  const res = await axiosInstance.post<ICommonRoot>(endpoints.patients.sendCred, payload);
  return res.data;
};
