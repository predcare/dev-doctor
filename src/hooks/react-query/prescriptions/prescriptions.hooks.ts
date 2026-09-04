import { useMutation, useQuery } from '@tanstack/react-query';
import { PrescriptionQueryKeys } from '../query.keys';
import {
  ICreatePrescriptionPayload,
  IUpdatePrescriptionPayload,
  IUpsertDraftPrescriptionPayload,
} from './payload.interfaces';
import {
  createPrescription,
  downloadPrescriptionPdf,
  getAllPrescriptionsForDoctor,
  getPrescriptionDetails,
  resendPrescriptionEmail,
  updatePrescription,
  upsertDraftPrescription,
} from './prescriptions.funcs';

export const useCreatePrescription = () => {
  return useMutation({
    mutationKey: [PrescriptionQueryKeys.Create],
    mutationFn: (payload: ICreatePrescriptionPayload) => createPrescription(payload),
  });
};

export const useUpsertDraftPrescription = () => {
  return useMutation({
    mutationKey: [PrescriptionQueryKeys.UpsertDraft],
    mutationFn: ({
      id,
      payload,
    }: {
      id?: number | string;
      payload: IUpsertDraftPrescriptionPayload;
    }) => upsertDraftPrescription({ id, payload }),
  });
};

export const useUpdatePrescription = () => {
  return useMutation({
    mutationKey: [PrescriptionQueryKeys.Update],
    mutationFn: ({ id, payload }: { id: number | string; payload: IUpdatePrescriptionPayload }) =>
      updatePrescription({ id, payload }),
  });
};

export const useGetPrescriptionDetails = (params: { id: string | number }) => {
  return useQuery({
    queryKey: [PrescriptionQueryKeys.GetPresciptionInfo, params?.id],
    queryFn: () => getPrescriptionDetails(params?.id),
    enabled: !!params?.id,
  });
};

export const useResendPrescriptionEmail = () => {
  return useMutation({
    mutationKey: [PrescriptionQueryKeys.SendEmail],
    mutationFn: (id: string | number) => resendPrescriptionEmail(id),
  });
};

export const useDownloadPrescriptionPdf = () => {
  return useMutation({
    mutationKey: [PrescriptionQueryKeys.Pdf],
    mutationFn: ({
      id,
      onProgress,
    }: {
      id: string | number;
      onProgress?: (progress: number) => void;
    }) => downloadPrescriptionPdf({ id, onProgress }),
  });
};
export const useGetAllPrescriptions = (doctorId: string | number) => {
  return useQuery({
    queryKey: [PrescriptionQueryKeys.GetAllPrescriptions, doctorId],
    queryFn: () => getAllPrescriptionsForDoctor(doctorId),
    enabled: !!doctorId,
  });
};
