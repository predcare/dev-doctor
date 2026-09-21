import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { IPatientConsultApptRoot } from '../../../typescripts/interfaces/appointments.interfaces';
import { ICommonRoot, IRootResponse } from '../../../typescripts/interfaces/common.interfaces';
import {
  AllPatientRoot,
  ILinkExistingPatientResponse,
  IMyPatientDoc,
  IPatientFamilyMember,
} from '../../../typescripts/interfaces/patients.interfaces';
import { IPatientPrescriptionDoc } from '../../../typescripts/interfaces/prescriptions.interfaces';
import { IPatientEMRDoc } from '../../../typescripts/interfaces/profile.interfaces';
import { ILinkExistingPatientPayload, IUpdatePatientInfo } from './payload.interfaces';

export interface IGetMyPatientsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getMyPatientsList = async (params?: IGetMyPatientsParams) => {
  const queryParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
    search: params?.search,
  };
  const res = await axiosInstance.get<IRootResponse<IMyPatientDoc[]>>(`${endpoints.patients.get}`, {
    params: queryParams,
  });
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

export const createNewPatient = async (payload: FormData) => {
  const res = await axiosInstance.post<ICommonRoot>(endpoints.patients.newCreate, payload);
  return res.data;
};

export const getMyPatientsInfo = async (patientId: number) => {
  const res = await axiosInstance.get<IRootResponse<IMyPatientDoc>>(
    `${endpoints.patients.details(patientId)}`
  );
  return res.data;
};

export const getMyPatientsEmrs = async (patientId: number | string) => {
  const res = await axiosInstance.get<IRootResponse<IPatientEMRDoc[]>>(
    `${endpoints.patients.emrRecords(patientId)}`
  );
  return res.data;
};

export const getMyPatientsPrescriptions = async (patientId: number | string) => {
  const res = await axiosInstance.get<IRootResponse<IPatientPrescriptionDoc[]>>(
    `${endpoints.patients.prescriptions(patientId)}`
  );
  return res.data;
};

export const shareEmrDocument = async (
  docId: string | number,
  body: { visible_to_patient: boolean }
) => {
  const res = await axiosInstance.patch<ICommonRoot>(endpoints.patients.emrShare(docId), body);
  return res.data;
};

export const sharePrescription = async (
  presId: string | number,
  body: { visible_to_patient: number }
) => {
  const res = await axiosInstance.patch<ICommonRoot>(
    endpoints.patients.prescriptionsShare(presId),
    body
  );
  return res.data;
};

export const uploadEmr = async (body: FormData) => {
  const res = await axiosInstance.post<ICommonRoot>(endpoints.patients.emrUpload, body);
  return res.data;
};

export const getMyPatientsConsults = async (params: {
  page: number;
  limit: number;
  patientId: string | number;
  status?: string;
}) => {
  const res = await axiosInstance.get<IPatientConsultApptRoot>(
    `${endpoints.patients.consults(params?.patientId)}`,
    { params }
  );
  return res.data;
};

export const getPatientsFamilyMembers = async (patientId: number | string) => {
  const res = await axiosInstance.get<IRootResponse<IPatientFamilyMember[]>>(
    `${endpoints.patients.familyMembers(patientId)}`
  );
  return res.data;
};

export const updatePatient = async (body: IUpdatePatientInfo) => {
  const res = await axiosInstance.put<ICommonRoot>(endpoints.patients.patientUpdate, body);
  return res.data;
};

export const getAllPatients = async (params?: {
  page: number;
  limit: number;
  user_type: string;
  search?: string;
}) => {
  const res = await axiosInstance.get<AllPatientRoot>(`${endpoints.profile.allPatients}`, {
    params,
  });
  return res.data;
};
