import { useQuery } from '@tanstack/react-query';
import { CommonQueryKeys } from '../query.keys';
import { fetchAllUsers, getCities, getCountries, getStates } from './common.func';

export const useCountries = () =>
  useQuery({
    queryKey: [CommonQueryKeys.Countries],
    queryFn: () => getCountries(),
    select: (v: any) => {
      if (Array.isArray(v)) return v;
      if (Array.isArray(v?.countries)) return v.countries;
      return [];
    },
  });

export const useStatesByCId = (params?: { cId?: number }) =>
  useQuery({
    queryKey: [CommonQueryKeys.States, params],
    queryFn: () => getStates(params?.cId!),
    enabled: !!params?.cId,
    select: (v: any) => {
      if (Array.isArray(v)) return v;
      if (Array.isArray(v?.states)) return v.states;
      return [];
    },
  });

export const useCitiesBySId = (params?: { sId?: number }) =>
  useQuery({
    queryKey: [CommonQueryKeys.Cities, params],
    queryFn: () => getCities(params?.sId!),
    enabled: !!params?.sId,
    select: (v: any) => {
      if (Array.isArray(v)) return v;
      if (Array.isArray(v?.cities)) return v.cities;
      return [];
    },
  });

export const useGetAllUsers = (doctorId?: string | number, enabled: boolean = true) =>
  useQuery({
    queryKey: [CommonQueryKeys.GET_ALL_USERS, doctorId],
    queryFn: () => fetchAllUsers(doctorId),
    enabled,
    select: v => v.users,
  });
