import { useMutation, useQuery } from '@tanstack/react-query';
import { AvailbilityQueryKeys, DoctorAvailabilityQueryKeys } from '../query.keys';
import {
  createAvailability,
  deleteAvailability,
  getAvailablity,
  getDocBookingAvails,
  getDoctorAvailDates,
  getDoctorTimingsByDate,
  updateAvailability,
} from './availablity.funcs';

export const useAvailablityList = () =>
  useQuery({
    queryKey: [AvailbilityQueryKeys.GetAvailablity],
    queryFn: () => getAvailablity(),
    select: v => {
      console.log('vvvvv', v);
      if (Array.isArray(v)) return v;
      if (Array.isArray(v?.data)) return v.data;
      return [];
    },
  });

// delete
export const useDeleteAvailability = () =>
  useMutation({
    mutationFn: (id: number | string) => deleteAvailability(id),
  });

// create
export const useCreateAvailability = () =>
  useMutation({
    mutationFn: ({ body }: { body: any }) => createAvailability(body),
  });

// update
export const useUpdateAvailability = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: any }) => updateAvailability(id, body),
  });

export const useBookingAvailablities = (params: { doctorId: number; clinicId: number }) =>
  useQuery({
    queryKey: [AvailbilityQueryKeys.GetMyAvailablity, params],
    queryFn: () => getDocBookingAvails(params?.doctorId, params?.clinicId),
    enabled: !!params?.doctorId && !!params?.clinicId,
  });

export const useDoctorAvailDates = (params: {
  doctorId: number;
  consultation_type: string;
  clinicId: number;
}) =>
  useQuery({
    queryKey: [DoctorAvailabilityQueryKeys.GET_AVAIL_DATES, params],
    queryFn: () =>
      getDoctorAvailDates({
        doctor_id: params?.doctorId,
        consultation_type: params?.consultation_type,
        clinic_id: params?.clinicId,
      }),
    select: v => v.data,
    enabled: Boolean(params?.doctorId),
  });

export const useDoctorTimingsByDate = (params: {
  doctorId: number;
  date: string;
  consultation_type: string;
  clinicId?: number;
}) =>
  useQuery({
    queryKey: [DoctorAvailabilityQueryKeys.GET_SLOTS_BY_DATE, params],
    queryFn: () =>
      getDoctorTimingsByDate({
        doctor_id: params?.doctorId,
        date: params?.date,
        consultation_type: params?.consultation_type,
        clinic_id: params?.clinicId,
      }),
    select: v => {
      return v.data;
    },
    enabled: Boolean(params?.doctorId && params?.date),
  });
