import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthQueryKey } from '../query.keys';
import { fetchAllUsers, sendOtp, verifyOtp } from './auth.funcs';

export const useSendOtp = () =>
  useMutation({
    mutationFn: sendOtp,
    mutationKey: [AuthQueryKey.SEND_OTP],
  });
export const useVerifyOTP = () =>
  useMutation({
    mutationFn: verifyOtp,
    mutationKey: [AuthQueryKey.VERIFY_OTP],
  });

export const useGetAllUsers = (doctorId?: string | number, enabled: boolean = true) =>
  useQuery({
    queryKey: [AuthQueryKey.GET_USERS, doctorId],
    queryFn: () => fetchAllUsers(doctorId),
    enabled,
    select: v => v.users,
  });
