import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { MyAppointmentsQueryKeys } from '../query.keys';
import {
  bookAppointments,
  changeAppointmentStatus,
  getApptToken,
  getMyAppointmentInfo,
  getMyAppointments,
  getMyAppointmentStats,
  ISaveCallPayload,
  rescheduleAppointment,
  saveCall,
  sendHeartBeat,
} from './appointments.func';
import { IMyApptQueryParams, IRescheduleAppointment } from './payload.interafce';


export const useMyAppointments = (params: IMyApptQueryParams) =>
  useQuery({
    queryKey: [MyAppointmentsQueryKeys.MyAppointments, params],
    queryFn: () => getMyAppointments(params),
  });

export const useMyInfiniteAppointments = (params: IMyApptQueryParams) =>
  useInfiniteQuery({
    queryKey: [MyAppointmentsQueryKeys.MyAppointments, 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      getMyAppointments({
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

export const useMyAppointmentStats = (params?: { date?: string }) =>
  useQuery({
    queryKey: [MyAppointmentsQueryKeys.MyAppointmentsStats, params],
    queryFn: () => getMyAppointmentStats(params),
    select: v => v.data,
  });

export const useApptToken = (params?: { appointmentId?: number | string }) =>
  useQuery({
    queryKey: [MyAppointmentsQueryKeys.Token, params?.appointmentId],
    queryFn: () => getApptToken(params?.appointmentId!),
    enabled: !!params?.appointmentId,
  });

export const useSendHeartBeat = () =>
  useMutation({
    mutationFn: sendHeartBeat,
  });

export const useChangeAppointmentStatus = () => {
  return useMutation({
    mutationFn: (payload: {
      appointmentId: number | string;
      status: number | string;
      call_end_reason?: string;
    }) => changeAppointmentStatus(payload),
  });
};

export const useBookAppointments = () =>
  useMutation({
    mutationFn: bookAppointments,
  });

export const useMyAppointmentInfo = (params?: { id?: number | string }) =>
  useQuery({
    queryKey: [MyAppointmentsQueryKeys.MyAppointmentsInfo, params],
    queryFn: () => getMyAppointmentInfo(params?.id!),
    enabled: !!params?.id,
    select: v => {
      if (v) return v?.data;
      return null;
    },
  });

export const useRescheduleAppointment = () =>
  useMutation({
    mutationFn: (params: { id: number | string; body: IRescheduleAppointment }) =>
      rescheduleAppointment(params.id, params.body),
  });


export const useSaveCall = () =>
  useMutation({
    mutationFn: (body: ISaveCallPayload) => saveCall(body),
  });

export const useSaveCalled = () =>
  useMutation({
    mutationFn: (params?: { body?: ISaveCallPayload }) => saveCall(params?.body!),
  });
