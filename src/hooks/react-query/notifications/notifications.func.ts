import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { ICommonRoot } from '../../../typescripts/interfaces/common.interfaces';
import {
  INotificationClearResponse,
  INotificationCountResponse,
  INotificationRoot,
} from '../../../typescripts/interfaces/notification.interfaces';

export const getNotifications = async (userId: number | string) => {
  const res = await axiosInstance.get<INotificationRoot>(
    `${endpoints.notifications.getAll}${userId}`
  );
  return res.data;
};

export const deleteNotification = async (notificationId: number | string) => {
  const res = await axiosInstance.delete<ICommonRoot>(
    `${endpoints.notifications.delete}${notificationId}`
  );
  return res.data;
};

export const getNotificationCount = async (userId: number | string) => {
  const res = await axiosInstance.get<INotificationCountResponse>(
    endpoints.notifications.counts(userId)
  );
  return res.data;
};

export const markNoShowNotifications = async (userId: number | string) => {
  const res = await axiosInstance.post<INotificationClearResponse>(
    endpoints.notifications.clearNotify(userId)
  );
  return res.data;
};
