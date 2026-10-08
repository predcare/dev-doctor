import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import CalendarDatePickerModal from '../../../components/commons/CalendarDatePickerModal/CalendarDatePickerModal';
import CommonErrorCard from '../../../components/commons/CommonErrorCard/CommonErrorCard';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import { CalendarIcon, CheckBadgeIcon, VideoIcon } from '../../../components/ui/icons';
import {
    useMyAppointmentInfo,
    useRescheduleAppointment,
} from '../../../hooks/react-query/appointments/appointments.hooks';
import { IRescheduleAppointment } from '../../../hooks/react-query/appointments/payload.interafce';
import {
    useDoctorRescheduledAvailDates,
    useDoctorTimingsByDate,
} from '../../../hooks/react-query/availability/availablity.hooks';
import { MyAppointmentsQueryKeys } from '../../../hooks/react-query/query.keys';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { getInitials } from '../../../lib/commons/common.utils';
import { showErrorToast, showSuccessToast } from '../../../lib/commons/toast.utils';
import { RescheduleAppointmentScreenRouteProp } from '../../../route';
import { mediaPaths } from '../../../services/api/endpoints';
import rescheduleAppointmentStyles from '../../../styled/RescheduleAppointmentScreen.styled';
import theme from '../../../styled/theme.styled';
import { ITimeSlotsDoc } from '../../../typescripts/interfaces/availability.interfaces';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import BookingSlotsSkeleton from './Skeletons/BookingSlotsSkeleton';

const SLOT_GROUPS = [
    { key: 'morning', title: 'Morning' },
    { key: 'afternoon', title: 'Afternoon' },
    { key: 'evening', title: 'Evening' },
] as const;

type SlotGroupKey = (typeof SLOT_GROUPS)[number]['key'];

const formatDateChip = (dateStr: string) => {
    if (!dateStr) return { labelTop: '', labelBottom: '', full: '' };
    const d = dayjs(dateStr);
    if (!d.isValid()) return { labelTop: '', labelBottom: dateStr, full: dateStr };
    return {
        labelTop: d.format('ddd'),
        labelBottom: d.format('MMM D'),
        full: d.format('ddd, D MMM YYYY'),
    };
};

const formatTime12h = (timeStr: string): string => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1] || '00';
    if (isNaN(hours)) return timeStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    return `${formattedHours}:${minutes} ${ampm}`;
};

const withSeconds = (timeStr: string) => (timeStr.length === 5 ? `${timeStr}:00` : timeStr);

const isSameSlot = (a: ITimeSlotsDoc, b: ITimeSlotsDoc) => a.from === b.from && a.to === b.to;

const isSlotOpen = (slot: ITimeSlotsDoc) => {
    const statusOpen = slot.status === 'available' || !slot.status;
    return statusOpen && slot.is_available !== false && slot.is_past !== true;
};

interface IFormStates {
    selectedDate: string;
    selectedSlot: ITimeSlotsDoc | null;
    reason: string;
    showCalendarModal: boolean;
}

export const RescheduleAppointmentScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RescheduleAppointmentScreenRouteProp>();
    const appointmentId = route.params?.appointmentId;
    const { userData } = useAuthStore(state => state);
    const { showLoader, hideLoader } = useLoadingStore(state => state);
    const { mutate: rescheduleAppt, isPending: isRescheduling } = useRescheduleAppointment();

    const {
        data: apptInfo,
        isFetching: apptInfoIsPending,
        isError: apptInfoIsError,
        refetch: refetchApptInfo,
    } = useMyAppointmentInfo({ id: appointmentId });

    const doctorId = Number(apptInfo?.doctor_id || userData?.doctor_id || userData?.id || 0);
    const clinicId = Number(apptInfo?.clinic_id || userData?.clinic_id || userData?.clinic?.id || 0);
    const slotDuration = Number(apptInfo?.slot_duration_minutes || 0);
    const consultationType = apptInfo?.consultation_type === 'video' ? 'video' : 'in-person';

    const [formStates, setFormStates] = useState<IFormStates>({
        selectedDate: '',
        selectedSlot: null,
        reason: '',
        showCalendarModal: false,
    });
    const [isRefreshing, setIsRefreshing] = useState(false);

    const {
        data: availableDatesRes,
        refetch: refetchAvailableDates,
        isFetching: isAvailableDatesPending,
    } = useDoctorRescheduledAvailDates({
        doctorId,
        consultation_type: consultationType,
        clinicId,
        slot_duration: slotDuration,
    });

    const { data: slotsRes, isFetching: isSlotsPending } = useDoctorTimingsByDate({
        doctorId,
        date: formStates.selectedDate,
        clinicId,
        consultation_type: consultationType,
    });

    const doctorName = apptInfo?.doctor?.name || userData?.name || 'Doctor';
    const clinicName = apptInfo?.clinic?.name || userData?.clinic?.name || userData?.clinic_name;
    const patientName = apptInfo?.patient?.name || 'Patient';
    const patientCode = apptInfo?.patient?.patient_id || 'N/A';
    const patientPhoto = mediaPaths(apptInfo?.patient?.profile_image);

    const groupedSlots = useMemo(() => {
        const groups: Record<SlotGroupKey, ITimeSlotsDoc[]> = {
            morning: [],
            afternoon: [],
            evening: [],
        };
        (slotsRes?.slots || []).forEach(slot => {
            if (!slot.from) return;
            const fromHour = parseInt(slot.from.split(':')[0], 10);
            if (isNaN(fromHour)) return;
            if (fromHour < 12) groups.morning.push(slot);
            else if (fromHour < 17) groups.afternoon.push(slot);
            else groups.evening.push(slot);
        });
        return groups;
    }, [slotsRes?.slots]);

    const updateForm = <K extends keyof IFormStates>(key: K, value: IFormStates[K]) => {
        setFormStates(prev => ({ ...prev, [key]: value }));
    };

    const handleDateChange = (date: string) => {
        setFormStates(prev => ({
            ...prev,
            selectedDate: date,
            selectedSlot: null,
        }));
    };

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await refetchApptInfo();
        await refetchAvailableDates();
        setIsRefreshing(false);
    }, [refetchApptInfo, refetchAvailableDates]);

    const handleSlotPress = (slot: ITimeSlotsDoc) => {
        if (!isSlotOpen(slot)) return;
        setFormStates(prev => {
            const isSelected = prev.selectedSlot ? isSameSlot(prev.selectedSlot, slot) : false;
            return {
                ...prev,
                selectedSlot: isSelected ? null : slot,
            };
        });
    };

    const handleProceed = () => {
        if (!appointmentId) return showErrorToast('Appointment id is missing');
        if (!formStates.selectedDate) return showErrorToast('Please select a date');
        if (!formStates.selectedSlot) return showErrorToast('Please select a time slot');

        const slot = formStates.selectedSlot;
        const payload: IRescheduleAppointment = {
            appointment_date: formStates.selectedDate,
            start_time: withSeconds(slot.from),
            end_time: withSeconds(slot.to),
            availability_id: [String(slot.availability_id)],
            clinic_id: String(clinicId),
            appointment_duration: slotDuration,
            reason: formStates.reason.trim(),
            appointment_slot_time: [
                {
                    start: slot.from,
                    end: slot.to,
                },
            ],
        };

        showLoader('Rescheduling appointment...');
        rescheduleAppt(
            { id: appointmentId, body: payload },
            {
                onSuccess: async res => {
                    if (res?.success) {
                        showSuccessToast(res?.message || 'Appointment rescheduled successfully');
                        await queryClient.invalidateQueries({
                            queryKey: [MyAppointmentsQueryKeys.MyAppointments],
                        });
                        await queryClient.invalidateQueries({
                            queryKey: [MyAppointmentsQueryKeys.MyAppointmentsInfo],
                        });
                        await queryClient.invalidateQueries({
                            queryKey: [MyAppointmentsQueryKeys.MyAppointmentsStats],
                        });
                        navigation.goBack();
                    } else {
                        showErrorToast(res?.message || 'Unable to reschedule appointment');
                    }
                },
                onSettled: () => {
                    hideLoader();
                },
            }
        );
    };

    useEffect(() => {
        if (typeof apptInfo?.reason === 'string') {
            setFormStates(prev => ({
                ...prev,
                reason: prev.reason || apptInfo.reason,
            }));
        }
    }, [apptInfo]);

    const canSubmit = Boolean(formStates.selectedDate && formStates.selectedSlot) && !isRescheduling;
    const previousTime = apptInfo?.start_time
        ? `${formatTime12h(apptInfo.start_time)}${apptInfo.end_time ? ` - ${formatTime12h(apptInfo.end_time)}` : ''
        }`
        : 'N/A';
    const newTime = formStates.selectedSlot
        ? `${formatTime12h(formStates.selectedSlot.from)} - ${formatTime12h(
            formStates.selectedSlot.to
        )}`
        : 'Not selected';

    return (
        <SafeAreaWrapper
            header={
                <Header
                    isBackBtn
                    title="Reschedule Appointment"
                    description="Pick a new date and time"
                    onBackPress={() => navigation.goBack()}
                />
            }
        >
            {!appointmentId || apptInfoIsError ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <CommonErrorCard
                        title="Appointment Details Not Found"
                        message="We could not load this appointment. Please try again."
                        onRetry={appointmentId ? () => refetchApptInfo() : undefined}
                    />
                </View>
            ) : (
                <>
                    <ScrollView
                        style={rescheduleAppointmentStyles.scroll}
                        contentContainerStyle={rescheduleAppointmentStyles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
                    >
                        {apptInfoIsPending ? (
                            <BookingSlotsSkeleton datesOnly />
                        ) : (
                            <>
                                <Text style={rescheduleAppointmentStyles.sectionLabel}>Patient</Text>
                                <View style={rescheduleAppointmentStyles.patientCard}>
                                    <View style={rescheduleAppointmentStyles.patientAvatarWrapper}>
                                        {patientPhoto ? (
                                            <Image
                                                source={{ uri: patientPhoto }}
                                                style={rescheduleAppointmentStyles.patientAvatar}
                                            />
                                        ) : (
                                            <View style={rescheduleAppointmentStyles.patientAvatar}>
                                                <Text style={rescheduleAppointmentStyles.patientAvatarText}>
                                                    {getInitials(patientName)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={rescheduleAppointmentStyles.patientDetails}>
                                        <Text style={rescheduleAppointmentStyles.patientName} numberOfLines={1}>
                                            {patientName}
                                        </Text>
                                        <View style={rescheduleAppointmentStyles.patientIdBadge}>
                                            <Text style={rescheduleAppointmentStyles.patientId} numberOfLines={1}>
                                                Patient ID • {patientCode}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={rescheduleAppointmentStyles.patientActiveBadge}>
                                        <CheckBadgeIcon size={10} color={theme.colors.primary} />
                                        <Text style={rescheduleAppointmentStyles.patientActiveText}>Active</Text>
                                    </View>
                                </View>

                                <Text style={rescheduleAppointmentStyles.sectionLabel}>Consultation Type</Text>
                                <View style={rescheduleAppointmentStyles.consultationRow}>
                                    <TouchableOpacity
                                        style={[
                                            rescheduleAppointmentStyles.consultationChip,
                                            consultationType === 'in-person' &&
                                            rescheduleAppointmentStyles.consultationChipActive,
                                        ]}
                                        disabled
                                        activeOpacity={0.8}
                                    >
                                        <CalendarIcon
                                            size={18}
                                            color={
                                                consultationType === 'in-person'
                                                    ? theme.colors.primaryDark
                                                    : theme.colors.textSecondary
                                            }
                                        />
                                        <Text
                                            style={[
                                                rescheduleAppointmentStyles.consultationChipText,
                                                consultationType === 'in-person' &&
                                                rescheduleAppointmentStyles.consultationChipTextActive,
                                            ]}
                                        >
                                            In-Person
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            rescheduleAppointmentStyles.consultationChip,
                                            consultationType === 'video' &&
                                            rescheduleAppointmentStyles.consultationChipActive,
                                        ]}
                                        disabled
                                        activeOpacity={0.8}
                                    >
                                        <VideoIcon
                                            size={18}
                                            color={
                                                consultationType === 'video'
                                                    ? theme.colors.primaryDark
                                                    : theme.colors.textSecondary
                                            }
                                        />
                                        <Text
                                            style={[
                                                rescheduleAppointmentStyles.consultationChipText,
                                                consultationType === 'video' &&
                                                rescheduleAppointmentStyles.consultationChipTextActive,
                                            ]}
                                        >
                                            Video Consult
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={rescheduleAppointmentStyles.fieldLabel}>
                                    Reason for Visit{' '}
                                    <Text style={rescheduleAppointmentStyles.optionalHint}>(optional)</Text>
                                </Text>
                                <TextInput
                                    placeholder="Describe the reason for this visit"
                                    placeholderTextColor={theme.colors.textMuted}
                                    style={rescheduleAppointmentStyles.reasonInput}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                    value={formStates.reason}
                                    onChangeText={text => updateForm('reason', text)}
                                />

                                {apptInfo?.appointment_date ? (
                                    <View style={rescheduleAppointmentStyles.summaryBox}>
                                        <Text style={rescheduleAppointmentStyles.summaryTitle}>
                                            Current Appointment
                                        </Text>
                                        <View style={rescheduleAppointmentStyles.summaryRow}>
                                            <Text style={rescheduleAppointmentStyles.summaryLabel}>Date</Text>
                                            <Text style={rescheduleAppointmentStyles.summaryValue}>
                                                {formatDateChip(apptInfo.appointment_date).full}
                                            </Text>
                                        </View>
                                        <View style={rescheduleAppointmentStyles.summaryRow}>
                                            <Text style={rescheduleAppointmentStyles.summaryLabel}>Time</Text>
                                            <Text style={rescheduleAppointmentStyles.summaryValue}>{previousTime}</Text>
                                        </View>
                                    </View>
                                ) : null}

                                <Text style={rescheduleAppointmentStyles.sectionLabel}>Select Date</Text>
                                {apptInfoIsPending || isAvailableDatesPending ? (
                                    <BookingSlotsSkeleton datesOnly />
                                ) : !availableDatesRes || availableDatesRes.length === 0 ? (
                                    <Text style={rescheduleAppointmentStyles.emptyText}>
                                        No dates available for this slot length
                                    </Text>
                                ) : (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        keyboardShouldPersistTaps="handled"
                                        contentContainerStyle={rescheduleAppointmentStyles.dateRow}
                                    >
                                        {availableDatesRes.slice(0, 3).map((dateStr, idx) => {
                                            const active = dateStr === formStates.selectedDate;
                                            const formatted = formatDateChip(dateStr);
                                            return (
                                                <TouchableOpacity
                                                    key={`${dateStr}-${idx}`}
                                                    style={[
                                                        rescheduleAppointmentStyles.dateChipCard,
                                                        active && rescheduleAppointmentStyles.dateChipCardActive,
                                                    ]}
                                                    onPress={() => handleDateChange(dateStr)}
                                                    activeOpacity={0.8}
                                                >
                                                    <Text
                                                        style={[
                                                            rescheduleAppointmentStyles.dateChipTopText,
                                                            active && rescheduleAppointmentStyles.dateChipTopTextActive,
                                                        ]}
                                                    >
                                                        {formatted.labelTop}
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            rescheduleAppointmentStyles.dateChipBottomText,
                                                            active && rescheduleAppointmentStyles.dateChipBottomTextActive,
                                                        ]}
                                                    >
                                                        {formatted.labelBottom}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                        <TouchableOpacity
                                            style={rescheduleAppointmentStyles.calendarIconBtn}
                                            onPress={() => updateForm('showCalendarModal', true)}
                                            activeOpacity={0.8}
                                        >
                                            <CalendarIcon size={22} color={theme.colors.primaryDark} />
                                        </TouchableOpacity>
                                    </ScrollView>
                                )}

                                {formStates.selectedDate ? (
                                    <>
                                        <Text style={rescheduleAppointmentStyles.sectionLabel}>Select Time</Text>
                                        {isSlotsPending ? (
                                            <BookingSlotsSkeleton />
                                        ) : !slotsRes?.slots?.length ? (
                                            <Text style={rescheduleAppointmentStyles.emptyText}>
                                                No slots available for this date
                                            </Text>
                                        ) : (
                                            SLOT_GROUPS.filter(group => groupedSlots[group.key].length > 0).map(group => (
                                                <View
                                                    key={group.key}
                                                    style={rescheduleAppointmentStyles.slotGroupContainer}
                                                >
                                                    <Text style={rescheduleAppointmentStyles.slotGroupTitle}>
                                                        {group.title}
                                                    </Text>
                                                    <View style={rescheduleAppointmentStyles.slotsGrid}>
                                                        {groupedSlots[group.key].map((slot, idx) => {
                                                            const open = isSlotOpen(slot);
                                                            const selected = formStates.selectedSlot
                                                                ? isSameSlot(formStates.selectedSlot, slot)
                                                                : false;
                                                            return (
                                                                <TouchableOpacity
                                                                    key={`${slot.from}-${slot.to}-${idx}`}
                                                                    style={[
                                                                        rescheduleAppointmentStyles.slotBtn,
                                                                        selected && rescheduleAppointmentStyles.slotBtnActive,
                                                                        !open && { opacity: 0.4, backgroundColor: '#F1F5F9' },
                                                                    ]}
                                                                    onPress={() => handleSlotPress(slot)}
                                                                    disabled={!open}
                                                                    activeOpacity={0.8}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            rescheduleAppointmentStyles.slotText,
                                                                            selected && rescheduleAppointmentStyles.slotTextActive,
                                                                            !open && { color: theme.colors.textMuted },
                                                                        ]}
                                                                    >
                                                                        {`${formatTime12h(slot.from)} - ${formatTime12h(slot.to)}`}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            );
                                                        })}
                                                    </View>
                                                </View>
                                            ))
                                        )}
                                    </>
                                ) : null}

                                <View style={rescheduleAppointmentStyles.summaryBox}>
                                    <Text style={rescheduleAppointmentStyles.summaryTitle}>Appointment Summary</Text>
                                    <View style={rescheduleAppointmentStyles.summaryRow}>
                                        <Text style={rescheduleAppointmentStyles.summaryLabel}>Doctor</Text>
                                        <Text style={rescheduleAppointmentStyles.summaryValue}>{doctorName}</Text>
                                    </View>
                                    <View style={rescheduleAppointmentStyles.summaryRow}>
                                        <Text style={rescheduleAppointmentStyles.summaryLabel}>Clinic</Text>
                                        <Text style={rescheduleAppointmentStyles.summaryValue}>
                                            {clinicName || 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={rescheduleAppointmentStyles.summaryRow}>
                                        <Text style={rescheduleAppointmentStyles.summaryLabel}>Consultation</Text>
                                        <Text style={rescheduleAppointmentStyles.summaryValue}>
                                            {consultationType === 'in-person' ? 'In-Person' : 'Video Call'}
                                        </Text>
                                    </View>
                                    <View style={rescheduleAppointmentStyles.summaryRow}>
                                        <Text style={rescheduleAppointmentStyles.summaryLabel}>Previous Date</Text>
                                        <Text style={rescheduleAppointmentStyles.summaryValue}>
                                            {apptInfo?.appointment_date
                                                ? formatDateChip(apptInfo.appointment_date).full
                                                : 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={rescheduleAppointmentStyles.summaryRow}>
                                        <Text style={rescheduleAppointmentStyles.summaryLabel}>Previous Time</Text>
                                        <Text style={rescheduleAppointmentStyles.summaryValue}>{previousTime}</Text>
                                    </View>
                                    <View style={rescheduleAppointmentStyles.summaryRow}>
                                        <Text style={rescheduleAppointmentStyles.summaryLabel}>New Date</Text>
                                        <Text style={rescheduleAppointmentStyles.summaryValue}>
                                            {formStates.selectedDate
                                                ? formatDateChip(formStates.selectedDate).full
                                                : 'Not selected'}
                                        </Text>
                                    </View>
                                    <View style={rescheduleAppointmentStyles.summaryRow}>
                                        <Text style={rescheduleAppointmentStyles.summaryLabel}>New Time</Text>
                                        <Text style={rescheduleAppointmentStyles.summaryValue}>{newTime}</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </ScrollView>

                    <View style={rescheduleAppointmentStyles.footer}>
                        <TouchableOpacity
                            style={[rescheduleAppointmentStyles.proceedBtn, !canSubmit && { opacity: 0.6 }]}
                            disabled={!canSubmit}
                            activeOpacity={0.85}
                            onPress={handleProceed}
                        >
                            <Text style={rescheduleAppointmentStyles.proceedBtnText}>Reschedule</Text>
                        </TouchableOpacity>
                    </View>

                    <CalendarDatePickerModal
                        visible={formStates.showCalendarModal}
                        availableDates={availableDatesRes || []}
                        onSelectDate={date => {
                            const yyyy = date.getFullYear();
                            const mm = String(date.getMonth() + 1).padStart(2, '0');
                            const dd = String(date.getDate()).padStart(2, '0');
                            handleDateChange(`${yyyy}-${mm}-${dd}`);
                        }}
                        onClose={() => updateForm('showCalendarModal', false)}
                    />
                </>
            )}
        </SafeAreaWrapper>
    );
};

export default RescheduleAppointmentScreen;
