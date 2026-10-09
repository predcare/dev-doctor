import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CommonErrorCard from '../../../components/commons/CommonErrorCard/CommonErrorCard';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import {
    CalendarIcon,
    CheckIcon,
    ClinicIcon,
    ClockIcon,
    InfoCircleIcon,
    InvoiceIcon,
    PlayCircleIcon,
    ProfileIcon,
    VideoIcon,
} from '../../../components/ui/icons';
import useDevicePermissions from '../../../hooks/commons/useDevicePermissions';
import {
    useChangeAppointmentStatus,
    useMyAppointmentInfo,
} from '../../../hooks/react-query/appointments/appointments.hooks';
import { MyAppointmentsQueryKeys } from '../../../hooks/react-query/query.keys';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import {
    _toTitleCase,
    capitalize,
    formatDate,
    formatTimeSlot,
} from '../../../lib/commons/common.utils';
import { showInfoToast } from '../../../lib/commons/toast.utils';
import { canGoBack } from '../../../navigation/navigationRef';
import { AppRoute } from '../../../route';
import { appointmentDetailsStyles } from '../../../styled/DoctorAppointmentsScreen.styled';
import theme from '../../../styled/theme.styled';
import { useAlertStore } from '../../../zustand/stores/useAlertStore';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../../zustand/stores/useMeetingStore';
import AppointmentDetailsSkeleton from './Skeletons/AppointmentDetailsSkeleton';

export const AppointmentDetailsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const apptId = route.params?.appointmentId;
    const isComingFromNotification = route.params?.isComingFromNotification;
    const [refreshing, setRefreshing] = useState(false);
    const { showConfirm } = useAlertStore(state => state);
    const { showLoader, hideLoader } = useLoadingStore(state => state);
    const { setMeetingSession, setInPersonAppointment } = useMeetingStore(state => state);
    const { requestAudioVideoPermissions } = useDevicePermissions();
    const { mutate: changeStatus } = useChangeAppointmentStatus();

    const {
        data: apptInfo,
        isFetching: apptInfoIsPending,
        isError: apptInfoIsError,
        refetch: refetchApptInfo,
    } = useMyAppointmentInfo({ id: apptId });

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetchApptInfo();
        setRefreshing(false);
    }, [refetchApptInfo]);

    const handleBack = useCallback(() => {
        if (isComingFromNotification || !canGoBack()) {
            navigation.reset({
                index: 0,
                routes: [{ name: AppRoute.HOME }],
            });
        } else {
            navigation.navigate(AppRoute.APPOINTMENTS);
        }
    }, [isComingFromNotification, navigation]);

    const handleJoinVideoCall = useCallback(
        async (appointment: any) => {
            if (!appointment) return;

            showInfoToast('Video call will be available at the scheduled time.', 'Call yet to start');
        },
        [navigation, setMeetingSession, requestAudioVideoPermissions]
    );

    const handleMarkCompleted = useCallback(
        (appointmentId: number | string) => {
            showLoader('Loading...');
            changeStatus(
                {
                    appointmentId,
                    status: 'completed',
                    call_end_reason: 'Call ended and Booking Completed by Doctor',
                },
                {
                    onSuccess: async () => {
                        await Promise.all([
                            queryClient.invalidateQueries({
                                queryKey: [MyAppointmentsQueryKeys.MyAppointments],
                            }),
                            queryClient.invalidateQueries({
                                queryKey: [MyAppointmentsQueryKeys.MyAppointmentsInfo],
                            }),
                        ]);
                        hideLoader();
                        refetchApptInfo();
                    },
                    onError: () => {
                        hideLoader();
                    },
                }
            );
        },
        [changeStatus, showLoader, hideLoader, refetchApptInfo]
    );

    const handleStartConsulation = useCallback(
        (
            appointmentId: number | string,
            patientId: number | string,
            patientName: string,
            status: string
        ) => {
            if (status?.toLowerCase() === 'confirmed') {
                showLoader('Loading...');
                changeStatus(
                    { appointmentId, status: 'in_progress' },
                    {
                        onSuccess: async () => {
                            await Promise.all([
                                queryClient.invalidateQueries({
                                    queryKey: [MyAppointmentsQueryKeys.MyAppointments],
                                }),
                                queryClient.invalidateQueries({
                                    queryKey: [MyAppointmentsQueryKeys.MyAppointmentsInfo],
                                }),
                            ]);
                            hideLoader();
                            setInPersonAppointment({
                                apptIdforInPerson: String(appointmentId),
                                patientIdforInPerson: String(patientId),
                                patientNameforInPerson: String(patientName),
                                statusforInPerson: String(status),
                            });
                            refetchApptInfo();
                            navigation?.navigate(AppRoute.CREATE_PRESCRIPTION, {
                                patientId: Number(patientId),
                                patientName: patientName,
                                appointmentId: appointmentId,
                            });
                        },
                        onError: () => {
                            hideLoader();
                        },
                    }
                );
            } else {
                setInPersonAppointment({
                    apptIdforInPerson: String(appointmentId),
                    patientIdforInPerson: String(patientId),
                    patientNameforInPerson: String(patientName),
                    statusforInPerson: String(status),
                });
                navigation.navigate(AppRoute.CREATE_PRESCRIPTION, {
                    patientId: Number(patientId),
                    patientName: patientName,
                    appointmentId: appointmentId,
                });
            }
        },
        [changeStatus, showLoader, hideLoader, setInPersonAppointment, navigation, refetchApptInfo]
    );

    const paymentStatusConfig = useMemo(() => {
        const status = (apptInfo?.payment_status || 'PENDING').toUpperCase();
        if (status === 'PAID' || status === 'COMPLETED' || status === 'SUCCESS') {
            return { bg: theme.colors.successLight, text: theme.colors.success, label: 'Paid' };
        }
        if (status === 'REFUNDED') {
            return { bg: theme.colors.warningLight, text: theme.colors.warning, label: 'Refunded' };
        }
        return { bg: theme.colors.dangerSoft, text: theme.colors.danger, label: 'Pending' };
    }, [apptInfo?.payment_status]);

    const isOnline = apptInfo?.consultation_type === 'video';

    const status = (apptInfo?.appointment_status || '').toLowerCase();
    const isInProgress = status === 'in_progress' || status === 'in-progress';
    const isConfirmed = status === 'confirmed';
    const isJoinedOnce = isInProgress;

    const meetingStoreState = useMeetingStore(state => state);
    const isCallActive =
        (meetingStoreState.callState === 'CONNECTED' || meetingStoreState.callState === 'CONNECTING') &&
        Boolean(meetingStoreState.token && meetingStoreState.meetingId);

    const isCurrentApptInCall =
        isOnline &&
        isCallActive &&
        (String(meetingStoreState.appointmentId) === String(apptInfo?.id) ||
            (Boolean(apptInfo?.appointment_id) &&
                meetingStoreState.appointmentGeneratedId === apptInfo?.appointment_id));

    return (
        <SafeAreaWrapper
            showBottomBar
            header={
                <Header
                    title="Appointment Details"
                    description={
                        apptInfo?.appointment_id ? `#${apptInfo.appointment_id}` : 'Consultation Overview'
                    }
                    isBackBtn
                    onBackPress={handleBack}
                />
            }
        >
            {apptInfoIsPending && !apptInfo ? (
                <ScrollView
                    style={appointmentDetailsStyles.container}
                    contentContainerStyle={appointmentDetailsStyles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <AppointmentDetailsSkeleton />
                </ScrollView>
            ) : apptInfoIsError || !apptInfo ? (
                <ScrollView
                    style={appointmentDetailsStyles.container}
                    contentContainerStyle={appointmentDetailsStyles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                >
                    <CommonErrorCard
                        title="Appointment Not Found"
                        message="Could not load appointment details. Please pull down to refresh or try again later."
                        onRetry={refetchApptInfo}
                    />
                </ScrollView>
            ) : (
                <ScrollView
                    style={appointmentDetailsStyles.container}
                    contentContainerStyle={appointmentDetailsStyles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                >
                    <View style={appointmentDetailsStyles.statusCard}>
                        <View style={appointmentDetailsStyles.statusTopRow}>
                            <View style={appointmentDetailsStyles.apptIdContainer}>
                                <Text style={appointmentDetailsStyles.apptIdLabel}>ID:</Text>
                                <Text style={appointmentDetailsStyles.apptIdValue}>
                                    {apptInfo.appointment_id || `#${apptInfo.id}`}
                                </Text>
                            </View>

                            <View style={[appointmentDetailsStyles.statusBadge]}>
                                <View style={[appointmentDetailsStyles.statusDot]} />
                                <Text style={[appointmentDetailsStyles.statusBadgeText]}>
                                    {_toTitleCase(apptInfo?.appointment_status)}
                                </Text>
                            </View>
                        </View>
                        <View style={appointmentDetailsStyles.statusDivider} />
                        <View style={appointmentDetailsStyles.statusInfoRow}>
                            <Text style={appointmentDetailsStyles.statusInfoText}>
                                Created on{' '}
                                <Text style={appointmentDetailsStyles.statusInfoBold}>
                                    {formatDate(apptInfo.created_at || new Date(), 'DD MMM YYYY')}
                                </Text>
                            </Text>

                            {apptInfo.appointment_type ? (
                                <Text style={appointmentDetailsStyles.statusInfoText}>
                                    Type:{' '}
                                    <Text style={appointmentDetailsStyles.statusInfoBold}>
                                        {capitalize(apptInfo.appointment_type)}
                                    </Text>
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    <View style={appointmentDetailsStyles.card}>
                        <View style={appointmentDetailsStyles.cardHeader}>
                            <View style={appointmentDetailsStyles.cardTitleRow}>
                                <ProfileIcon size={18} color={theme.colors.primary} />
                                <Text style={appointmentDetailsStyles.cardTitle}>Patient Details</Text>
                            </View>
                        </View>

                        <View style={appointmentDetailsStyles.patientInfoGrid}>
                            <View style={appointmentDetailsStyles.patientInfoRow}>
                                <Text style={appointmentDetailsStyles.patientInfoLabel}>Patient Name</Text>
                                <Text style={appointmentDetailsStyles.patientInfoVal}>
                                    {apptInfo?.patient?.name || 'N/A'}
                                </Text>
                            </View>

                            {apptInfo?.patient?.patient_id ? (
                                <View style={appointmentDetailsStyles.patientInfoRow}>
                                    <Text style={appointmentDetailsStyles.patientInfoLabel}>Patient ID</Text>
                                    <Text style={appointmentDetailsStyles.patientInfoVal}>
                                        {apptInfo?.patient?.patient_id}
                                    </Text>
                                </View>
                            ) : null}

                            {apptInfo?.patient?.gender || apptInfo?.patient?.date_of_birth ? (
                                <View style={appointmentDetailsStyles.patientInfoRow}>
                                    <Text style={appointmentDetailsStyles.patientInfoLabel}>Gender & Age</Text>
                                    <Text style={appointmentDetailsStyles.patientInfoVal}>
                                        {capitalize(apptInfo?.patient?.gender || '')}
                                        {apptInfo?.patient?.date_of_birth
                                            ? ` (${formatDate(apptInfo.patient.date_of_birth, 'DD MMM YYYY')})`
                                            : ''}
                                    </Text>
                                </View>
                            ) : null}

                            {apptInfo?.patient?.phone_number ? (
                                <View style={appointmentDetailsStyles.patientInfoRow}>
                                    <Text style={appointmentDetailsStyles.patientInfoLabel}>Phone Number</Text>
                                    <Text style={appointmentDetailsStyles.patientInfoVal}>
                                        {apptInfo?.patient?.phone_number}
                                    </Text>
                                </View>
                            ) : null}

                            {apptInfo?.patient?.email ? (
                                <View style={[appointmentDetailsStyles.patientInfoRow, { borderBottomWidth: 0 }]}>
                                    <Text style={appointmentDetailsStyles.patientInfoLabel}>Email</Text>
                                    <Text style={appointmentDetailsStyles.patientInfoVal}>
                                        {apptInfo?.patient?.email}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    </View>

                    {/* 3. Schedule & Consultation Mode */}
                    <View style={appointmentDetailsStyles.card}>
                        <View style={appointmentDetailsStyles.cardHeader}>
                            <View style={appointmentDetailsStyles.cardTitleRow}>
                                <CalendarIcon size={18} color={theme.colors.primary} />
                                <Text style={appointmentDetailsStyles.cardTitle}>Date & Time</Text>
                            </View>
                        </View>

                        <View style={appointmentDetailsStyles.gridContainer}>
                            <View style={appointmentDetailsStyles.detailRow}>
                                <View style={appointmentDetailsStyles.detailIconWrap}>
                                    <CalendarIcon size={20} color={theme.colors.primary} />
                                </View>
                                <View style={appointmentDetailsStyles.detailContent}>
                                    <Text style={appointmentDetailsStyles.detailLabel}>Appointment Date</Text>
                                    <Text style={appointmentDetailsStyles.detailValue}>
                                        {formatDate(apptInfo.appointment_date, 'dddd, DD MMMM YYYY')}
                                    </Text>
                                </View>
                            </View>

                            <View style={appointmentDetailsStyles.detailRow}>
                                <View style={appointmentDetailsStyles.detailIconWrap}>
                                    <ClockIcon size={20} color={theme.colors.primary} />
                                </View>
                                <View style={appointmentDetailsStyles.detailContent}>
                                    <Text style={appointmentDetailsStyles.detailLabel}>Slot Timing</Text>
                                    <Text style={appointmentDetailsStyles.detailValue}>
                                        {apptInfo.start_time
                                            ? formatTimeSlot(apptInfo.start_time, apptInfo.end_time)
                                            : 'Time not specified'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={appointmentDetailsStyles.card}>
                        <View style={appointmentDetailsStyles.cardHeader}>
                            <View style={appointmentDetailsStyles.cardTitleRow}>
                                {isOnline ? (
                                    <VideoIcon size={18} color={theme.colors.primary} />
                                ) : (
                                    <ClinicIcon size={18} color={theme.colors.primary} />
                                )}
                                <Text style={appointmentDetailsStyles.cardTitle}>Consultation Mode</Text>
                            </View>
                        </View>

                        <View style={appointmentDetailsStyles.detailRow}>
                            <View style={appointmentDetailsStyles.detailIconWrap}>
                                {isOnline ? (
                                    <VideoIcon size={20} color={theme.colors.primary} />
                                ) : (
                                    <ClinicIcon size={20} color={theme.colors.primary} />
                                )}
                            </View>
                            <View style={appointmentDetailsStyles.detailContent}>
                                <Text style={appointmentDetailsStyles.detailLabel}>Mode</Text>
                                <Text style={appointmentDetailsStyles.detailValue}>
                                    {isOnline ? 'Video' : 'In-Person'}
                                </Text>
                                <Text style={appointmentDetailsStyles.detailSubValue}>
                                    {isOnline
                                        ? 'Consultation conducted securely through high-definition video.'
                                        : 'Physical consultation conducted at the registered clinic premises.'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {apptInfo.reason ? (
                        <View style={appointmentDetailsStyles.card}>
                            <View style={appointmentDetailsStyles.cardHeader}>
                                <View style={appointmentDetailsStyles.cardTitleRow}>
                                    <InfoCircleIcon size={18} color={theme.colors.primary} />
                                    <Text style={appointmentDetailsStyles.cardTitle}>Clinical Notes & Reason</Text>
                                </View>
                            </View>

                            <View style={{ gap: 12 }}>
                                {apptInfo.reason ? (
                                    <View>
                                        <Text style={appointmentDetailsStyles.detailLabel}>
                                            Reason for Consultation
                                        </Text>
                                        <Text
                                            style={[
                                                appointmentDetailsStyles.detailValue,
                                                { marginTop: 4, fontWeight: '400' },
                                            ]}
                                        >
                                            {typeof apptInfo.reason === 'string'
                                                ? apptInfo.reason
                                                : JSON.stringify(apptInfo.reason)}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    ) : null}
                    <View style={appointmentDetailsStyles.card}>
                        <View style={appointmentDetailsStyles.cardHeader}>
                            <View style={appointmentDetailsStyles.cardTitleRow}>
                                <InvoiceIcon size={18} color={theme.colors.primary} />
                                <Text style={appointmentDetailsStyles.cardTitle}>Payment Summary</Text>
                            </View>
                        </View>

                        <View style={appointmentDetailsStyles.billRow}>
                            <Text style={appointmentDetailsStyles.billLabel}>Consultation Fee</Text>
                            <Text style={appointmentDetailsStyles.billValue}>
                                ₹{Number(apptInfo.appointment_fee || 0).toFixed(2)}
                            </Text>
                        </View>

                        {apptInfo.fee_type ? (
                            <View style={appointmentDetailsStyles.billRow}>
                                <Text style={appointmentDetailsStyles.billLabel}>Fee Type</Text>
                                <Text style={appointmentDetailsStyles.billValue}>
                                    {apptInfo.fee_type.replace(/_/g, ' ').toUpperCase()}
                                </Text>
                            </View>
                        ) : null}

                        <View style={appointmentDetailsStyles.billTotalRow}>
                            <Text style={appointmentDetailsStyles.billTotalLabel}>Total Amount</Text>
                            <Text style={appointmentDetailsStyles.billTotalValue}>
                                ₹{Number(apptInfo.appointment_fee || 0).toFixed(2)}
                            </Text>
                        </View>

                        <View style={appointmentDetailsStyles.paymentBadgeRow}>
                            <View>
                                <Text style={appointmentDetailsStyles.paymentBadgeLabel}>
                                    Payment Mode: {capitalize(apptInfo.payment_type || 'N/A')}
                                </Text>
                            </View>

                            <View
                                style={[
                                    appointmentDetailsStyles.paymentStatusBadge,
                                    { backgroundColor: paymentStatusConfig.bg },
                                ]}
                            >
                                <Text
                                    style={[
                                        appointmentDetailsStyles.paymentStatusText,
                                        { color: paymentStatusConfig.text },
                                    ]}
                                >
                                    {paymentStatusConfig.label}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={appointmentDetailsStyles.cardFooterActions}>
                        <View
                            style={[
                                appointmentDetailsStyles.actionRow,
                                !isInProgress && { flexDirection: 'column' },
                            ]}
                        >
                            {isConfirmed && (
                                <TouchableOpacity
                                    style={[
                                        appointmentDetailsStyles.joinButton,
                                        isOnline && isCurrentApptInCall && { backgroundColor: theme.colors.primary },
                                        isOnline && isJoinedOnce && { backgroundColor: theme.colors.primaryDark },
                                    ]}
                                    onPress={() =>
                                        isOnline
                                            ? handleJoinVideoCall(apptInfo)
                                            : handleStartConsulation(
                                                apptInfo.id,
                                                apptInfo.patient?.patient_id || apptInfo.patient_id,
                                                apptInfo.patient?.name || '',
                                                apptInfo.appointment_status
                                            )
                                    }
                                    activeOpacity={0.85}
                                >
                                    <PlayCircleIcon size={20} color="#FFFFFF" />
                                    <Text style={appointmentDetailsStyles.joinButtonText}>
                                        {isOnline
                                            ? isCurrentApptInCall
                                                ? 'Already in Call'
                                                : isJoinedOnce
                                                    ? 'Re-join Call'
                                                    : 'Join Call'
                                            : 'Start Consultation'}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {isInProgress && (
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <TouchableOpacity
                                        style={appointmentDetailsStyles.completeButton}
                                        onPress={() => {
                                            showConfirm({
                                                title: 'Complete Appointment',
                                                message: 'Are you sure you want to mark this appointment as completed?',
                                                buttonText: 'Yes, Complete',
                                                cancelText: 'Cancel',
                                                onConfirm: () => handleMarkCompleted(apptInfo.id),
                                            });
                                        }}
                                        activeOpacity={0.85}
                                    >
                                        <CheckIcon size={18} color="#FFFFFF" />
                                        <Text style={appointmentDetailsStyles.joinButtonText}>Completed</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {isCurrentApptInCall && (
                            <Text style={appointmentDetailsStyles.activeCallNotice}>
                                Reschedule & Cancel unavailable while call is active.
                            </Text>
                        )}
                    </View>
                </ScrollView>
            )}
        </SafeAreaWrapper>
    );
};

export default AppointmentDetailsScreen;
