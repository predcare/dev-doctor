import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import CommonEmptyCard from '../../../components/commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../../components/commons/CommonErrorCard/CommonErrorCard';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import {
    BellIcon,
    CalendarIcon,
    ClockIcon,
    FileTextIcon,
    PillIcon,
    ProfileIcon,
    VideoIcon,
} from '../../../components/ui/icons';
import {
    useDeleteNotification,
    useInfiniteNotifications,
    useMarkNoShowNotifications,
} from '../../../hooks/react-query/notifications/notifications.hooks';
import { NotificationQueryKeys } from '../../../hooks/react-query/query.keys';
import { resolveNotificationModalNavigation } from '../../../lib/commons/notificationModal.utils';
import { showSuccessToast } from '../../../lib/commons/toast.utils';
import notificationsStyles from '../../../styled/NotificationsScreen.styled';
import theme from '../../../styled/theme.styled';
import { INotificationDoc } from '../../../typescripts/interfaces/notification.interfaces';
import { useAlertStore } from '../../../zustand/stores/useAlertStore';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import NotificationCard from './Componenets/NotificationCard';
import { NotificationSkeleton } from './Skeletons/NotificationSkeleton';

const getNotificationIcon = (category?: string, action?: string): React.ReactNode => {
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
};

const NotificationScreen: React.FC = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

    const { showLoader, hideLoader } = useLoadingStore(state => state);
    const { showConfirm } = useAlertStore(state => state);

    const {
        data: notificationResponse,
        isLoading: isNotifyLoading,
        isError: isNotifyError,
        refetch: notifyRefetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteNotifications({
        limit: 15,
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
                    showLoader('Deleting notification...');
                    deleteNotificationMutate(notificationId, {
                        onSuccess: async res => {
                            if (res?.success) {
                                setDeletedIds(prev => new Set(prev).add(idStr));
                                await queryClient.invalidateQueries({
                                    queryKey: [NotificationQueryKeys.NotificationCount],
                                });
                                await notifyRefetch();
                                hideLoader();
                                showSuccessToast('Notification deleted successfully');
                            }
                        },
                        onSettled: () => {
                            hideLoader();
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
                            await notifyRefetch();
                            hideLoader();
                            showSuccessToast('All notifications cleared');
                        }
                    },
                    onSettled: () => {
                        hideLoader();
                    },
                });
            },
        });
    }, [showConfirm, showLoader, hideLoader, mutateNotificationClear, notifyRefetch]);

    const activeNotifications = useMemo(() => {
        const pages = notificationResponse?.pages ?? [];
        const rawList: INotificationDoc[] = pages.flatMap(p => (Array.isArray(p?.data) ? p.data : []));

        return rawList.filter(
            n =>
                !deletedIds.has(String(n.id)) &&
                (!n.notification_id || !deletedIds.has(String(n.notification_id)))
        );
    }, [notificationResponse?.pages, deletedIds]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const keyExtractor = useCallback(
        (item: INotificationDoc) => String(item.id || item.notification_id),
        []
    );

    const handleNotificationPress = useCallback(
        (item: any) => {
            const target = resolveNotificationModalNavigation(item);
            if (target?.name) {
                (navigation.navigate as any)(target.name, target.params);
            }
        },
        [navigation]
    );

    return (
        <SafeAreaWrapper
            showBottomBar
            header={
                <Header
                    title="Notifications"
                    description="View and manage your alerts"
                    isBackBtn
                    onBackPress={() => navigation.goBack()}
                    rightAction={
                        activeNotifications?.length > 0 ? (
                            <TouchableOpacity
                                style={notificationsStyles.markReadButton}
                                activeOpacity={0.75}
                                onPress={handleClearAll}
                            >
                                <Text style={notificationsStyles.markReadText}>Clear All</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 10 }} />
                        )
                    }
                />
            }
        >
            <View style={notificationsStyles.container}>
                {isNotifyLoading && activeNotifications?.length === 0 ? (
                    <NotificationSkeleton />
                ) : isNotifyError && activeNotifications?.length === 0 ? (
                    <View style={notificationsStyles.emptyWrapper}>
                        <CommonErrorCard
                            title="Failed to Load Notifications"
                            message="Something went wrong while fetching notification alerts."
                            onRetry={notifyRefetch}
                        />
                    </View>
                ) : (
                    <FlatList
                        data={activeNotifications}
                        keyExtractor={keyExtractor}
                        renderItem={({ item }) => (
                            <NotificationCard
                                item={item}
                                onDelete={() => handleDeleteNotification(item.id)}
                                onPress={() => handleNotificationPress(item)}
                                icon={getNotificationIcon(item.event_category, item.event_action)}
                            />
                        )}
                        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                        contentContainerStyle={[
                            notificationsStyles.listContainer,
                            activeNotifications.length === 0 && { flex: 1, justifyContent: 'center' },
                        ]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            isFetchingNextPage ? (
                                <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color={theme.colors.primary} />
                                </View>
                            ) : undefined
                        }
                        ListEmptyComponent={
                            <CommonEmptyCard
                                title="No Notifications"
                                message="You're all caught up! There are no alerts or notifications at this time."
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

export default NotificationScreen;
