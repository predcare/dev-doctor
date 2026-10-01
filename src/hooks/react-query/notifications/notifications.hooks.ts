import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
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

export const useInfiniteNotifications = (params?: { limit?: number }) =>
  useInfiniteQuery({
    queryKey: [NotificationQueryKeys.Notifications, 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      getNotifications({
        page: Number(pageParam),
        limit: params?.limit ?? 15,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage?.meta?.hasNextPage) {
        return (lastPage?.meta?.page || 1) + 1;
      }
      return undefined;
    },
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
    staleTime: 120000,
  });
};

export const useMarkNoShowNotifications = () => {
  return useMutation({
    mutationFn: () => markNoShowNotifications(),
  });
};
