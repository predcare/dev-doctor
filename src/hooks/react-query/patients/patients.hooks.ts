import { useMutation, useQuery } from '@tanstack/react-query';
import { PatientsQueryKeys } from '../query.keys';
import {
  createNewPatient,
  deletePatient,
  getMyPatientsInfo,
  getMyPatientsList,
  linkExistingPatient,
  sendPatientCredentials,
} from './patients.funcs';
import {
  ICreatePatientPayload,
  ILinkExistingPatientPayload,
  ISendPatientCredentialsPayload,
} from './payload.interfaces';

export const useMyPatientList = (params?: { doctorId?: number | string }) =>
  useQuery({
    queryKey: [PatientsQueryKeys.PatientsList, params],
    queryFn: () => getMyPatientsList(params?.doctorId!),
    enabled: !!params?.doctorId,
    select: v => {
      if (Array.isArray(v)) return v;
      if (Array.isArray(v?.patients)) return v.patients;
      return [];
    },
  });

export const useDeletePatient = () => {
  return useMutation({
    mutationFn: (patientId: number | string) => deletePatient(patientId),
  });
};

export const useLinkExistingPatient = () => {
  return useMutation({
    mutationKey: [PatientsQueryKeys.LinkExisting],
    mutationFn: (payload: ILinkExistingPatientPayload) => linkExistingPatient(payload),
  });
};

export const useCreateNewPatient = () => {
  return useMutation({
    mutationKey: [PatientsQueryKeys.NewCreate],
    mutationFn: (payload: ICreatePatientPayload) => createNewPatient(payload),
  });
};

export const useSendPatientCredentials = () => {
  return useMutation({
    mutationKey: [PatientsQueryKeys.SendCred],
    mutationFn: (payload: ISendPatientCredentialsPayload) => sendPatientCredentials(payload),
  });
};

export const useMyPatientInfo = (params?: { patientId?: number | string }) =>
  useQuery({
    queryKey: [PatientsQueryKeys.PatientInfo, params],
    queryFn: () => getMyPatientsInfo(params?.patientId!),
    enabled: !!params?.patientId,
    select: v => (!v?.patient ? null : v.patient),
  });
