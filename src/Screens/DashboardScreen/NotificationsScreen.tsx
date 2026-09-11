import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import CommonConfirmModal from '../../components/commons/CommonConfirmModal/CommonConfirmModal';
import NotificationCard from '../../components/Modules/Notifications/NotificationCard';
import NotificationEmptyCard from '../../components/Modules/Notifications/NotificationEmptyCard';
import NotificationErrorCard from '../../components/Modules/Notifications/NotificationErrorCard';
import NotificationSkeleton from '../../components/Skeletons/NotificationSkeleton';
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ClockIcon,
  FileTextIcon,
  PillIcon,
  ProfileIcon,
  VideoIcon,
} from '../../components/ui/icons';
import {
  useDeleteNotification,
  useNotifications,
} from '../../hooks/react-query/notifications/notifications.hooks';
import SafeAreaWrapper from '../../Layout/SafeAreaWrapper';
import { showInfoToast } from '../../lib/common/toast.utils';
import { AppRoute, type NotificationsScreenProps } from '../../route';
import { notificationsStyles as styles } from '../../styled/NotificationsScreen.styled';
import { theme } from '../../styled/theme.styled';
import { IMetadata, INotificationDoc } from '../../typescripts/interfaces/notification.interfaces';
import { useAuthStore } from '../../zustand/stores/useAuthStore';

type FlatListItem =
  | { kind: 'header'; label: string; id: string }
  | { kind: 'item'; notif: INotificationDoc; id: string };

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  const { userData } = useAuthStore(state => state);
  const doctorId = userData?.user_id;

  const {
    data: allNotifications,
    isPending: notificationPending,
    isError: isNotifyError,
    refetch: notifyRefetch,
  } = useNotifications({
    doctorId,
  });

  const { mutate: deleteNotificationMutate } = useDeleteNotification();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await notifyRefetch();
    } finally {
      setRefreshing(false);
    }
  }, [notifyRefetch]);

  const handleDeleteNotification = useCallback((notificationId: number) => {
    setDeleteTargetId(notificationId);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTargetId) return;
    const targetId = deleteTargetId;
    setDeletedIds(prev => new Set(prev).add(targetId));
    setDeleteTargetId(null);

    deleteNotificationMutate(targetId, {
      onSuccess: () => {
        notifyRefetch();
      },
      onError: () => {
        setDeletedIds(prev => {
          const next = new Set(prev);
          next.delete(targetId);
          return next;
        });
      },
    });
  }, [deleteTargetId, deleteNotificationMutate, notifyRefetch]);

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

  const flatListData = useMemo(() => {
    if (!allNotifications || !Array.isArray(allNotifications)) return [];

    const activeNotifications = allNotifications.filter(
      n => !deletedIds.has(n.id) && !deletedIds.has(n.notification_id)
    );
    if (activeNotifications.length === 0) return [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    const today: INotificationDoc[] = [];
    const yesterday: INotificationDoc[] = [];
    const older: INotificationDoc[] = [];

    activeNotifications.forEach(n => {
      const time = n.created_at ? new Date(n.created_at).getTime() : 0;
      if (time >= todayStart) {
        today.push(n);
      } else if (time >= yesterdayStart) {
        yesterday.push(n);
      } else {
        older.push(n);
      }
    });

    const list: FlatListItem[] = [];
    if (today.length) {
      list.push({ kind: 'header', label: 'TODAY', id: 'header-today' });
      today.forEach(n =>
        list.push({ kind: 'item', notif: n, id: `item-${n.id || n.notification_id}` })
      );
    }
    if (yesterday.length) {
      list.push({ kind: 'header', label: 'YESTERDAY', id: 'header-yesterday' });
      yesterday.forEach(n =>
        list.push({ kind: 'item', notif: n, id: `item-${n.id || n.notification_id}` })
      );
    }
    if (older.length) {
      list.push({ kind: 'header', label: 'EARLIER', id: 'header-earlier' });
      older.forEach(n =>
        list.push({ kind: 'item', notif: n, id: `item-${n.id || n.notification_id}` })
      );
    }

    return list;
  }, [allNotifications, deletedIds]);

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

  const renderFlatListItem = useCallback(
    ({ item }: { item: FlatListItem }) => {
      if (item.kind === 'header') {
        return <Text style={styles.groupLabel}>{item.label}</Text>;
      }

      const notifId = item.notif.id || item.notif.notification_id;
      return (
        <View style={{ marginBottom: 10 }}>
          <NotificationCard
            item={item.notif}
            onDelete={() => handleDeleteNotification(notifId)}
            onPress={() => handleNotificationPress(item.notif)}
            icon={getNotificationIcon(item.notif.event_category, item.notif.event_action)}
          />
        </View>
      );
    },
    [handleDeleteNotification, handleNotificationPress, getNotificationIcon]
  );

  const keyExtractor = useCallback((item: FlatListItem) => item.id, []);

  if (notificationPending) {
    return <NotificationSkeleton />;
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
            <TouchableOpacity
              style={styles.markReadButton}
              activeOpacity={0.75}
              onPress={() => showInfoToast('This Features is Under Development!.')}
            >
              <CheckIcon size={14} color="#0D9488" />
              <Text style={styles.markReadText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {flatListData.length === 0 ? (
          <NotificationEmptyCard
            title="No Notifications"
            message="You're all caught up! New notifications will appear here."
            actionText="Refresh"
            onAction={onRefresh}
          />
        ) : (
          <FlatList
            data={flatListData}
            keyExtractor={keyExtractor}
            renderItem={renderFlatListItem}
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

        <CommonConfirmModal
          visible={!!deleteTargetId}
          title="Delete Notification"
          message="Are you sure you want to delete this notification? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTargetId(null)}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default NotificationsScreen;
