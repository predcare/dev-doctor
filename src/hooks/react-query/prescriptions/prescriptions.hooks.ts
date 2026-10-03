import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { PrescriptionQueryKeys } from '../query.keys';
import {
  ICreatePrescriptionPayload,
  IGetDoctorPrescriptionsParams,
  IUpdatePrescriptionPayload,
} from './payload.interfaces';
import {
  createPrescription,
  downloadPrescriptionPdf,
  getAllPrescriptionsForDoctor,
  getPrescriptionDetails,
  resendPrescriptionEmail,
  updatePrescription,
} from './prescriptions.funcs';

export const useCreatePrescription = () => {
  return useMutation({
    mutationKey: [PrescriptionQueryKeys.Create],
    mutationFn: (payload: ICreatePrescriptionPayload) => createPrescription(payload),
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
export const useGetAllPrescriptions = (params?: IGetDoctorPrescriptionsParams) => {
  return useQuery({
    queryKey: [PrescriptionQueryKeys.GetAllPrescriptions, params],
    queryFn: () => getAllPrescriptionsForDoctor(params),
  });
};

export const useGetInfinitePrescriptions = (
  params?: Omit<IGetDoctorPrescriptionsParams, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: [PrescriptionQueryKeys.GetAllPrescriptions, 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      getAllPrescriptionsForDoctor({
        ...params,
        page: Number(pageParam),
        limit: params?.limit ?? 15,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage?.meta?.hasNextPage) {
        return (lastPage?.meta?.page || 1) + 1;
      }
      return undefined;
    },
  });
};
