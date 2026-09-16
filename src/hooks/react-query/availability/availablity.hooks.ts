import { useMutation, useQuery } from '@tanstack/react-query';
import { AvailbilityQueryKeys } from '../query.keys';
import {
  createAvailability,
  deleteAvailability,
  getAvailablity,
  getDocBookingAvails,
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
