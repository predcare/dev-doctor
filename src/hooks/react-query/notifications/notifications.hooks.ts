import { useMutation, useQuery } from '@tanstack/react-query';
import { NotificationQueryKeys } from '../query.keys';
import { deleteNotification, getNotifications } from './notifications.func';

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
