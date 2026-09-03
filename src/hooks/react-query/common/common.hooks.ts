import { useQuery } from '@tanstack/react-query';
import { CommonQueryKeys } from '../query.keys';
import { getCities, getCountries, getStates } from './common.func';

export const useCountries = () =>
  useQuery({
    queryKey: [CommonQueryKeys.Countries],
    queryFn: () => getCountries(),
  });

export const useStatesByCId = (params: { cId: number }) =>
  useQuery({
    queryKey: [CommonQueryKeys.States, params],
    queryFn: () => getStates(params?.cId),
  });

export const useCitiesBySId = (params: { sId: number }) =>
  useQuery({
    queryKey: [CommonQueryKeys.Cities, params],
    queryFn: () => getCities(params?.sId),
  });
