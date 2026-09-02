import { useMutation, useQuery } from '@tanstack/react-query';
import { AvailbilityQueryKeys } from '../query.keys';
import {
  createAvailability,
  deleteAvailability,
  getAvailablity,
  updateAvailability,
} from './availablity.funcs';

export const useAvailablityList = (params?: { doctorId?: number | string }) =>
  useQuery({
    queryKey: [AvailbilityQueryKeys.GetAvailablity, params],
    queryFn: () => getAvailablity(params?.doctorId!),
    enabled: !!params?.doctorId,
    select: v => {
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
    mutationFn: ({ doctorId, body }: { doctorId: number | string; body: any }) =>
      createAvailability(doctorId, body),
  });

// update
export const useUpdateAvailability = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: any }) => updateAvailability(id, body),
  });
