import { useMutation, useQuery } from '@tanstack/react-query';
import { PatientsQueryKeys } from '../query.keys';
import {
  createNewPatient,
  deletePatient,
  getMyPatientsEmrs,
  getMyPatientsInfo,
  getMyPatientsList,
  getMyPatientsPrescriptions,
  linkExistingPatient,
  sendPatientCredentials,
  shareEmrDocument,
  sharePrescription,
  uploadEmr,
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

export const useMyPatientEmrs = (params?: { patientId?: number | string }) =>
  useQuery({
    queryKey: [PatientsQueryKeys.EmrRecords, params],
    queryFn: () => getMyPatientsEmrs(params?.patientId!),
    enabled: !!params?.patientId,
    select: v => {
      if (Array.isArray(v)) return v;
      if (Array.isArray(v?.documents)) return v.documents;
      return [];
    },
  });

export const useMyPatientPrescriptions = (params?: { patientId?: number | string }) =>
  useQuery({
    queryKey: [PatientsQueryKeys.Prescriptions, params],
    queryFn: () => getMyPatientsPrescriptions(params?.patientId!),
    enabled: !!params?.patientId,
    select: v => {
      if (Array.isArray(v)) return v;
      if (Array.isArray(v?.prescriptions)) return v.prescriptions;
      return [];
    },
  });

export const useShareEmrDocument = () => {
  return useMutation({
    mutationFn: ({
      docId,
      body,
    }: {
      docId: string | number;
      body: { visible_to_patient: number };
    }) => shareEmrDocument(docId, body),
  });
};

export const useSharePrescription = () => {
  return useMutation({
    mutationFn: ({
      presId,
      body,
    }: {
      presId: string | number;
      body: { visible_to_patient: number };
    }) => sharePrescription(presId, body),
  });
};

export const useUploadEmr = () => {
  return useMutation({
    mutationFn: (body: FormData) => uploadEmr(body),
  });
};
