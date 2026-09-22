import { useMutation, useQuery } from '@tanstack/react-query';
import { MyAppointmentsQueryKeys } from '../query.keys';
import {
  bookAppointments,
  changeAppointmentStatus,
  getApptToken,
  getMyAppointmentInfo,
  getMyAppointments,
  getMyAppointmentStats,
  rescheduleAppointment,
  saveCall,
  sendHeartBeat,
} from './appointments.func';
import { IMyApptQueryParams } from './payload.interafce';

export const useMyAppointments = (params: IMyApptQueryParams) =>
  useQuery({
    queryKey: [MyAppointmentsQueryKeys.MyAppointments, params],
    queryFn: () => getMyAppointments(params),
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
      if (v) return v?.appointment;
      return null;
    },
  });

export const useRescheduleAppointment = () =>
  useMutation({
    mutationFn: (params?: { id?: number | string; body?: any }) =>
      rescheduleAppointment(params?.id!, params?.body!),
  });

import { ISaveCallPayload } from './appointments.func';

export const useSaveCall = () =>
  useMutation({
    mutationFn: (body: ISaveCallPayload) => saveCall(body),
  });

export const useSaveCalled = () =>
  useMutation({
    mutationFn: (params?: { body?: ISaveCallPayload }) => saveCall(params?.body!),
  });
