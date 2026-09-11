import { useMutation, useQuery } from '@tanstack/react-query';
import { NotificationQueryKeys } from '../query.keys';
import {
  deleteNotification,
  getNotificationCount,
  getNotifications,
  markNoShowNotifications,
} from './notifications.func';

export const useNotifications = (params?: { doctorId?: number | string }) =>
  useQuery({
    queryKey: [NotificationQueryKeys.Notifications, params],
    queryFn: () => getNotifications(params?.doctorId!),
    enabled: !!params?.doctorId,
    select: v => {
      if (Array.isArray(v)) return v;
      if (Array.isArray(v?.notifications)) return v.notifications;
      return [];
    },
  });

export const useDeleteNotification = () => {
  return useMutation({
    mutationFn: (notificationId: number | string) => deleteNotification(notificationId),
  });
};

export const useNotificationCount = (params?: { doctorId?: number | string } | number | string) => {
  const doctorId = typeof params === 'object' ? params?.doctorId : params;
  return useQuery({
    queryKey: [NotificationQueryKeys.NotificationCount, doctorId],
    queryFn: () => getNotificationCount(doctorId!),
    enabled: !!doctorId,
  });
};

export const useMarkNoShowNotifications = () => {
  return useMutation({
    mutationFn: (userId: number | string) => markNoShowNotifications(userId),
  });
};
