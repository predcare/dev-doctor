import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { ICommonRoot } from '../../../typescripts/interfaces/common.interfaces';
import { INotificationRoot } from '../../../typescripts/interfaces/notification.interfaces';

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
