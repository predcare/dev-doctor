import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import { ProfileQueryKeys } from '../query.keys';
import { getDoctorClinics, getProfile, switchClinic } from './profile.funcs';

type TQueryEnabled = {
  enabled?: boolean;
  refetchOnMount?: boolean | 'always';
  staleTime?: number;
};

export const useProfile = () =>
  useQuery({
    queryKey: [ProfileQueryKeys.Profile],
    queryFn: () => getProfile(),
    select: v => v.data,
  });

export const fetchProfileQuery = async (forceFetch = false) => {
  return await queryClient.fetchQuery({
    queryKey: [ProfileQueryKeys.Profile],
    queryFn: getProfile,
    staleTime: forceFetch ? 0 : undefined,
  });
};

export const useDoctorClinics = (options?: TQueryEnabled) =>
  useQuery({
    queryKey: [ProfileQueryKeys.DoctorClinics],
    queryFn: () => getDoctorClinics(),
    select: v => v.data,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
    refetchOnMount: options?.refetchOnMount,
  });

export const useSwitchClinic = (options?: TQueryEnabled) =>
  useMutation({
    mutationKey: [ProfileQueryKeys.SwitchClinic],
    mutationFn: switchClinic,
  });
