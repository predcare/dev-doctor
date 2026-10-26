import { useQuery } from '@tanstack/react-query';
import { DoctorStatsQueryKeys } from '../query.keys';
import { getDoctorStats } from './stats.funcs';

export const useDoctorStats = (params: { date_filter: string; clinic_id: number }) =>
  useQuery({
    queryKey: [DoctorStatsQueryKeys.DOCTOR_STATS, params],
    queryFn: () => getDoctorStats(params),
    select: v => v.data,
  });
