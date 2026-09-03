import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonConfirmModal from '../../components/commons/CommonConfirmModal/CommonConfirmModal';
import NotificationCard from '../../components/Modules/Notifications/NotificationCard';
import NotificationEmptyCard from '../../components/Modules/Notifications/NotificationEmptyCard';
import NotificationErrorCard from '../../components/Modules/Notifications/NotificationErrorCard';
import NotificationSkeleton from '../../components/Skeletons/NotificationSkeleton';
import {
  BellIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ClockIcon,
  FileTextIcon,
  PillIcon,
  ProfileIcon,
} from '../../components/ui/icons';
import SafeAreaWrapper from '../../Layout/SafeAreaWrapper';
import type { NotificationsScreenProps } from '../../route';
import { notificationsStyles as styles } from '../../styled/NotificationsScreen.styled';
import { theme } from '../../styled/theme.styled';
import { INotificationDoc } from '../../typescripts/interfaces/notification.interfaces';

const MOCK_INITIAL_NOTIFICATIONS: INotificationDoc[] = [
  {
    id: 101,
    notification_id: 1001,
    user_id: 1,
    user_type: 'doctor',
    event_category: 'appointment',
    event_action: 'New Appointment Booked',
    type: 'appointment',
    description: 'Eleanor Vance scheduled a Video Consultation for Today at 10:30 AM.',
    message: 'Eleanor Vance scheduled a Video Consultation for Today at 10:30 AM.',
    metadata: {
      patient_name: 'Eleanor Vance',
      consultation_type: 'Video Consult',
      appointment_slot_time: '10:30 AM',
    },
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago (TODAY)
  },
  {
    id: 102,
    notification_id: 1002,
    user_id: 1,
    user_type: 'doctor',
    event_category: 'prescription',
    event_action: 'Prescription Refill Requested',
    type: 'prescription',
    description: 'Marcus Thorne requested an urgent refill for Amoxicillin 500mg.',
    message: 'Marcus Thorne requested an urgent refill for Amoxicillin 500mg.',
    metadata: {
      patient_name: 'Marcus Thorne',
      medications_count: 2,
    },
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago (TODAY)
  },
  {
    id: 103,
    notification_id: 1003,
    user_id: 1,
    user_type: 'doctor',
    event_category: 'emr_management',
    event_action: 'Lab Results Uploaded',
    type: 'emr_management',
    description: 'New Blood Panel & Thyroid diagnostic report available for Sophia Martinez.',
    message: 'New Blood Panel & Thyroid diagnostic report available for Sophia Martinez.',
    metadata: {
      patient_name: 'Sophia Martinez',
      document_type: 'Lab Report',
    },
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hours ago (TODAY)
  },
  {
    id: 104,
    notification_id: 1004,
    user_id: 1,
    user_type: 'doctor',
    event_category: 'availability_management',
    event_action: 'Slot Rescheduled',
    type: 'availability_management',
    description: 'Patient Daniel Craig rescheduled his consultation to Tomorrow at 3:00 PM.',
    message: 'Patient Daniel Craig rescheduled his consultation to Tomorrow at 3:00 PM.',
    metadata: {
      patient_name: 'Daniel Craig',
      new_date: new Date(Date.now() + 86400000).toISOString(),
    },
    created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), // Yesterday
  },
  {
    id: 105,
    notification_id: 1005,
    user_id: 1,
    user_type: 'doctor',
    event_category: 'patient_management',
    event_action: 'Patient Profile Updated',
    type: 'patient_management',
    description: 'Olivia Wilde updated clinical allergy notes (Penicillin) in EMR history.',
    message: 'Olivia Wilde updated clinical allergy notes (Penicillin) in EMR history.',
    metadata: {
      patient_name: 'Olivia Wilde',
    },
    created_at: new Date(Date.now() - 32 * 3600 * 1000).toISOString(), // Yesterday
  },
  {
    id: 106,
    notification_id: 1006,
    user_id: 1,
    user_type: 'doctor',
    event_category: 'emr_management',
    event_action: 'EMR Summary Shared',
    type: 'emr_management',
    description: 'Dr. Robert Chen shared cardiology consultation history for Arthur Pendelton.',
    message: 'Dr. Robert Chen shared cardiology consultation history for Arthur Pendelton.',
    metadata: {
      doctor_name: 'Dr. Robert Chen',
      patient_name: 'Arthur Pendelton',
      document_type: 'EMR Summary',
    },
    created_at: new Date(Date.now() - 3 * 86400 * 1000).toISOString(), // Earlier
  },
];

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading] = useState(false);
  const [hasError] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [notificationsData, setNotificationsData] = useState<INotificationDoc[]>(
    MOCK_INITIAL_NOTIFICATIONS
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const handleDeleteNotification = (notificationId: number) => {
    setDeleteTargetId(notificationId);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    setNotificationsData(prev => prev.filter(item => item.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  const getNotificationIcon = (category: string): React.ReactNode => {
    switch (category) {
      case 'patient_management':
      case 'us_patient_management':
      case 'user':
        return <ProfileIcon size={20} color={theme.colors.primary} />;
      case 'prescription':
      case 'prescription_management':
        return <PillIcon size={20} color="#0D9488" />;
      case 'emr_management':
      case 'us_emr_management':
        return <FileTextIcon size={20} color="#0284C7" />;
      case 'appointment':
      case 'appointment_management':
        return <CalendarIcon size={20} color={theme.colors.primary} />;
      case 'availability_management':
        return <ClockIcon size={20} color="#F59E0B" />;
      default:
        return <BellIcon size={20} color={theme.colors.primary} />;
    }
  };

  const groups = useMemo(() => {
    if (!notificationsData || notificationsData.length === 0) return [];
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    const groupList: { label: string; data: INotificationDoc[] }[] = [];
    const today: INotificationDoc[] = [];
    const yesterday: INotificationDoc[] = [];
    const older: INotificationDoc[] = [];

    notificationsData.forEach(n => {
      const time = new Date(n.created_at).getTime();
      if (time >= todayStart) {
        today.push(n);
      } else if (time >= yesterdayStart) {
        yesterday.push(n);
      } else {
        older.push(n);
      }
    });

    if (today.length) groupList.push({ label: 'TODAY', data: today });
    if (yesterday.length) groupList.push({ label: 'YESTERDAY', data: yesterday });
    if (older.length) groupList.push({ label: 'EARLIER', data: older });
    return groupList;
  }, [notificationsData]);

  if (isLoading) {
    return <NotificationSkeleton />;
  }

  if (hasError) {
    return <NotificationErrorCard onRetry={onRefresh} />;
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
            <View style={{ width: 44 }} />
          </View>
        </SafeAreaView>

        {!notificationsData || notificationsData.length === 0 ? (
          <NotificationEmptyCard />
        ) : (
          <FlatList
            data={groups}
            keyExtractor={g => g.label}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            renderItem={({ item: group }) => (
              <View>
                <Text style={styles.groupLabel}>{group.label}</Text>
                {group.data.map(notif => (
                  <View key={notif.id} style={{ marginBottom: 10 }}>
                    <NotificationCard
                      item={notif}
                      onDelete={() => handleDeleteNotification(notif.id)}
                      icon={getNotificationIcon(notif.event_category)}
                    />
                  </View>
                ))}
              </View>
            )}
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
