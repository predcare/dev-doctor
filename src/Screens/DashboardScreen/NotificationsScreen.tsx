import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import NotificationCard from '../../components/Modules/Notifications/NotificationCard';
import NotificationEmptyCard from '../../components/Modules/Notifications/NotificationEmptyCard';
import NotificationErrorCard from '../../components/Modules/Notifications/NotificationErrorCard';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import NotificationSkeleton from '../../components/Skeletons/NotificationSkeleton';
import {
  BellIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ClockIcon,
  FileTextIcon,
  PillIcon,
  ProfileIcon,
  VideoIcon,
} from '../../components/ui/icons';
import {
  useDeleteNotification,
  useMarkNoShowNotifications,
  useNotifications,
} from '../../hooks/react-query/notifications/notifications.hooks';
import { NotificationQueryKeys } from '../../hooks/react-query/query.keys';
import SafeAreaWrapper from '../../Layout/SafeAreaWrapper';
import { showErrorToast, showSuccessToast } from '../../lib/common/toast.utils';
import { AppRoute, type NotificationsScreenProps } from '../../route';
import { notificationsStyles as styles } from '../../styled/NotificationsScreen.styled';
import { theme } from '../../styled/theme.styled';
import { IMetadata, INotificationDoc } from '../../typescripts/interfaces/notification.interfaces';
import { useAlertStore } from '../../zustand/stores/useAlertStore';
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const showLoader = useLoadingStore(state => state.showLoader);
  const hideLoader = useLoadingStore(state => state.hideLoader);
  const showConfirm = useAlertStore(state => state.showConfirm);

  const { userData } = useAuthStore(state => state);
  const doctorId = userData?.id;

  const {
    data: notificationResponse,
    isFetching: notificationPending,
    isError: isNotifyError,
    refetch: notifyRefetch,
  } = useNotifications({
    page: 1,
    limit: 10,
  });

  const { mutate: deleteNotificationMutate } = useDeleteNotification();
  const { mutate: mutateNotificationClear } = useMarkNoShowNotifications();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await notifyRefetch();
    } finally {
      setRefreshing(false);
    }
  }, [notifyRefetch]);

  const handleDeleteNotification = useCallback(
    (notificationId: string | number) => {
      showConfirm({
        title: 'Delete Notification',
        message: 'Are you sure you want to delete this notification? This action cannot be undone.',
        buttonText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: () => {
          const idStr = String(notificationId);
          setDeletedIds(prev => new Set(prev).add(idStr));
          showLoader('Deleting notification...');
          deleteNotificationMutate(notificationId, {
            onSuccess: async res => {
              if (res?.success) {
                await queryClient.invalidateQueries({
                  queryKey: [NotificationQueryKeys.NotificationCount],
                });
                hideLoader();
                showSuccessToast('Notification deleted successfully');
                notifyRefetch();
              }
            },
            onError: () => {
              hideLoader();
              showErrorToast('Failed to delete notification');
              setDeletedIds(prev => {
                const next = new Set(prev);
                next.delete(idStr);
                return next;
              });
            },
          });
        },
      });
    },
    [showConfirm, showLoader, hideLoader, deleteNotificationMutate, notifyRefetch]
  );

  const handleClearAll = useCallback(() => {
    showConfirm({
      title: 'Clear All Notifications',
      message: 'Are you sure you want to clear all notifications? This action cannot be undone.',
      buttonText: 'Clear All',
      cancelText: 'Cancel',
      onConfirm: () => {
        showLoader('Clearing all notifications...');
        mutateNotificationClear(undefined, {
          onSuccess: async res => {
            if (res?.success) {
              await queryClient.invalidateQueries({
                queryKey: [NotificationQueryKeys.NotificationCount],
              });
              hideLoader();
              showSuccessToast('All notifications cleared');
              notifyRefetch();
            } else {
              hideLoader();
            }
          },
          onError: () => {
            hideLoader();
          },
        });
      },
    });
  }, [showConfirm, doctorId, showLoader, hideLoader, mutateNotificationClear, notifyRefetch]);

  const getNotificationIcon = useCallback((category?: string, action?: string): React.ReactNode => {
    const cat = (category || '').toLowerCase();
    const act = (action || '').toLowerCase();

    if (act.includes('meeting') || act.includes('video') || act.includes('call')) {
      return <VideoIcon size={20} color={theme.colors.primary} />;
    }
    if (act.includes('cancel')) {
      return <ClockIcon size={20} color="#EF4444" />;
    }
    if (cat.includes('patient') || cat.includes('user')) {
      return <ProfileIcon size={20} color={theme.colors.primary} />;
    }
    if (cat.includes('prescription') || act.includes('refill')) {
      return <PillIcon size={20} color="#0D9488" />;
    }
    if (
      cat.includes('emr') ||
      act.includes('emr') ||
      act.includes('document') ||
      act.includes('lab')
    ) {
      return <FileTextIcon size={20} color="#0284C7" />;
    }
    if (cat.includes('appointment') || act.includes('appointment') || act.includes('book')) {
      return <CalendarIcon size={20} color={theme.colors.primary} />;
    }
    if (cat.includes('availability') || act.includes('resched')) {
      return <ClockIcon size={20} color="#F59E0B" />;
    }
    return <BellIcon size={20} color={theme.colors.primary} />;
  }, []);

  const activeNotifications = useMemo(() => {
    const rawList: INotificationDoc[] = Array.isArray(notificationResponse?.data)
      ? notificationResponse.data
      : [];

    return rawList.filter(
      n =>
        !deletedIds.has(String(n.id)) &&
        (!n.notification_id || !deletedIds.has(String(n.notification_id)))
    );
  }, [notificationResponse?.data, deletedIds]);

  const handleNotificationPress = useCallback(
    (notif: INotificationDoc) => {
      if (!navigation) return;
      const metadata: IMetadata =
        typeof notif.metadata === 'string'
          ? (() => {
              try {
                return JSON.parse(notif.metadata);
              } catch {
                return {};
              }
            })()
          : notif.metadata || {};

      const meetingId = metadata.meeting_id;
      const appointmentId = notif.associate_appointment_id || metadata.appointment_db_id;
      const patientId = notif.associate_patient_id || metadata.patient_id;

      if (meetingId || notif.event_action === 'meeting_started') {
        navigation.navigate(AppRoute.DOCTOR_APPOINTMENTS, { refresh: true });
      } else if (appointmentId || notif.event_category === 'appointment') {
        navigation.navigate(AppRoute.DOCTOR_APPOINTMENTS, { refresh: true });
      } else if (patientId || notif.event_category === 'patient_management') {
        navigation.navigate(AppRoute.PATIENT_DETAILS, {
          patientId: patientId ? String(patientId) : '',
        });
      }
    },
    [navigation]
  );

  const renderNotificationItem = useCallback(
    ({ item }: { item: INotificationDoc }) => {
      const notifId = item.id || item.notification_id || '';
      return (
        <View style={{ marginBottom: 10 }}>
          <NotificationCard
            item={item}
            onDelete={() => handleDeleteNotification(notifId)}
            onPress={() => handleNotificationPress(item)}
            icon={getNotificationIcon(item.event_category, item.event_action)}
          />
        </View>
      );
    },
    [handleDeleteNotification, handleNotificationPress, getNotificationIcon]
  );

  const keyExtractor = useCallback(
    (item: INotificationDoc) => String(item.id || item.notification_id),
    []
  );

  if (notificationPending) {
    return (
      <SafeAreaWrapper>
        <NotificationSkeleton />
      </SafeAreaWrapper>
    );
  }

  if (isNotifyError) {
    return <NotificationErrorCard onRetry={notifyRefetch} onBack={() => navigation?.goBack()} />;
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack()}
              activeOpacity={0.8}
            >
              <View style={styles.backBtnCircle}>
                <ChevronLeftIcon size={18} color={theme.colors.primary} />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
            {activeNotifications.length > 0 && (
              <TouchableOpacity
                style={styles.markReadButton}
                activeOpacity={0.75}
                onPress={handleClearAll}
              >
                <Text style={styles.markReadText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>

        {activeNotifications.length === 0 ? (
          <NotificationEmptyCard
            title="No Notifications"
            message="You're all caught up! New notifications will appear here."
            actionText="Refresh"
            onAction={onRefresh}
          />
        ) : (
          <FlatList
            data={activeNotifications}
            keyExtractor={keyExtractor}
            renderItem={renderNotificationItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <NotificationEmptyCard
                title="No Notifications"
                message="You're all caught up! New notifications will appear here."
                actionText="Refresh"
                onAction={onRefresh}
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default NotificationsScreen;
