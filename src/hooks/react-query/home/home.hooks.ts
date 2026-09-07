import { useQuery } from '@tanstack/react-query';
import { HomeApiQuery } from '../query.keys';
import { getHomeStats, getHomeUpcomingAppts } from './home.funcs';

export const useHomeStats = (params: { doctorId: number | string; period: string }) =>
  useQuery({
    queryKey: [HomeApiQuery.STATS, params],
    queryFn: () =>
      getHomeStats({
        userId: params?.doctorId,
        period: params?.period,
      }),
    enabled: !!params?.doctorId,
    select: v => v?.stats || null,
  });

export const useHomeUpcomingAppts = (params: { doctorId: number | string }) =>
  useQuery({
    queryKey: [HomeApiQuery.STATS, params],
    queryFn: () =>
      getHomeUpcomingAppts({
        userId: params?.doctorId,
      }),
    enabled: !!params?.doctorId,
    select: v => v?.appointments || null,
  });
