import { useQuery } from '@tanstack/react-query';
import { MyAppointmentsQueryKeys } from '../query.keys';
import { getMyAppointments } from './appointments.func';

export const useMyAppointments = (params?: { doctorId?: number | string }) =>
  useQuery({
    queryKey: [MyAppointmentsQueryKeys.MyAppointments, params],
    queryFn: () => getMyAppointments(params?.doctorId!),
    enabled: !!params?.doctorId,
    select: v => {
      if (Array.isArray(v)) return v;
      if (Array.isArray(v?.appointments)) return v.appointments;
      return [];
    },
  });
