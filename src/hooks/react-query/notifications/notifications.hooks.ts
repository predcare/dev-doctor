import { useMutation, useQuery } from '@tanstack/react-query';
import { NotificationQueryKeys } from '../query.keys';
import {
  deleteNotification,
  getNotificationCount,
  getNotifications,
  markNoShowNotifications,
} from './notifications.func';

export const useNotifications = (params?: { page: number; limit: number }) =>
  useQuery({
    queryKey: [NotificationQueryKeys.Notifications, params],
    queryFn: () => getNotifications(params),
  });

export const useDeleteNotification = () => {
  return useMutation({
    mutationFn: (notificationId: number | string) => deleteNotification(notificationId),
  });
};

export const useNotificationCount = () => {
  return useQuery({
    queryKey: [NotificationQueryKeys.NotificationCount],
    queryFn: () => getNotificationCount(),
  });
};

export const useMarkNoShowNotifications = () => {
  return useMutation({
    mutationFn: () => markNoShowNotifications(),
  });
};
