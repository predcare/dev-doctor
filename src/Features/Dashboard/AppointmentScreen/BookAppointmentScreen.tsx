import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import CalendarDatePickerModal from '../../../components/commons/CalendarDatePickerModal/CalendarDatePickerModal';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import { useBookAppointments } from '../../../hooks/react-query/appointments/appointments.hooks';
import { ICreateAppointmentPayload } from '../../../hooks/react-query/auth/payload.interfaces';
import {
    useDoctorAvailDates,
    useDoctorTimingsByDate,
} from '../../../hooks/react-query/availability/availablity.hooks';
import { MyAppointmentsQueryKeys } from '../../../hooks/react-query/query.keys';
import {
    areSlotsConsecutive,
    formatTime12h,
    getSlotPeriod,
    ISlotItem,
    normalizeApiTime,
    SlotPeriod,
} from '../../../lib/commons/availability.utils';
import { capitalize } from '../../../lib/commons/common.utils';
import { showErrorToast } from '../../../lib/commons/toast.utils';
import { AppRoute } from '../../../route';
import bookAppointmentStyles from '../../../styled/BookAppointmentScreen.styled';
import theme from '../../../styled/theme.styled';
import { ConsultType } from '../../../typescripts/enums';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import BookingPatientSelectModal from './Modals/BookingPatientSelectModal';
import BookingSlotsSkeleton from './Skeletons/BookingSlotsSkeleton';

export interface ISelectedPatients {
    name: string;
    patientGenId: string;
    id: number;
    Phone: number;
    gender?: string;
    age?: string;
}

export interface IFormStates {
    selectedDate: string;
    consultationType: 'clinic' | 'video' | 'in-person' | string;
    reason: string;
    selectedSlots: ISlotItem[] | null;
}

const PeriodIcon = ({ period }: { period: string }) => {
    switch (period) {
        case 'MORNING':
            return <Text style={{ fontSize: 18 }}>🌅</Text>;
        case 'AFTERNOON':
            return <Text style={{ fontSize: 18 }}>☀️</Text>;
        case 'EVENING':
            return <Text style={{ fontSize: 18 }}>🌇</Text>;
        case 'NIGHT':
            return <Text style={{ fontSize: 18 }}>🌙</Text>;
        default:
            return <Text style={{ fontSize: 18 }}>⏰</Text>;
    }
};

const PeriodSeries: SlotPeriod[] = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];

export const BookAppointmentScreen: React.FC = () => {
    const navigation = useNavigation();
    const { userData } = useAuthStore(state => state);
    const [selectedPatient, setSelectedPatient] = useState<ISelectedPatients | null>(null);
    const [showPatientPicker, setShowPatientPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { showLoader, hideLoader } = useLoadingStore();
    const [formStates, setFormState] = useState<IFormStates>({
        selectedDate: '',
        consultationType: 'clinic',
        reason: '',
        selectedSlots: null,
    });

    console.log('selectedPatient', selectedPatient);

    const doctorId = Number(userData?.id || userData?.user_id || 0);
    const clinicId = Number(userData?.clinic?.id || userData?.clinic_id || 0);

    const {
        data: availDates,
        isFetching: availableDatesPending,
        refetch: refetchAvailDates,
    } = useDoctorAvailDates({
        clinicId,
        consultation_type: ConsultType.IN_PERSON,
        doctorId,
    });

    const {
        data: timingsData,
        isFetching: timingsPending,
        refetch: refetchTimings,
    } = useDoctorTimingsByDate({
        doctorId,
        clinicId,
        consultation_type: ConsultType.IN_PERSON,
        date: formStates.selectedDate,
    });

    const { mutate: bookAppt, isPending: bookApptPending } = useBookAppointments();

    const periodWiseSlots = useMemo(() => {
        if (!timingsData?.slots || timingsData.slots.length === 0) {
            return null;
        }

        const result: Record<SlotPeriod, ISlotItem[]> = {
            MORNING: [],
            AFTERNOON: [],
            EVENING: [],
            NIGHT: [],
        };

        timingsData.slots.forEach(slot => {
            const period = getSlotPeriod(slot.from);
            const isBooked =
                slot.is_available === false ||
                slot.is_past === true ||
                (slot.status && slot.status.toLowerCase() !== 'available');
            const startFormatted = formatTime12h(slot.from);
            const endFormatted = formatTime12h(slot.to);

            result[period].push({
                start: slot.from,
                end: slot.to,
                displayTime: `${startFormatted} - ${endFormatted}`,
                period,
                booked: Boolean(isBooked),
                availability_id: slot.availability_id,
            });
        });

        return result;
    }, [timingsData?.slots]);

    const singleSlotFee = useMemo(() => {
        if (!timingsData?.slots || timingsData.slots.length === 0) return 0;
        const firstSlot = timingsData.slots[0];
        return parseFloat(String(firstSlot.in_person_fee || 0)) || 0;
    }, [timingsData?.slots]);

    const totalAmount = useMemo(() => {
        if (!formStates.selectedSlots || formStates.selectedSlots.length === 0) {
            return singleSlotFee;
        }
        return singleSlotFee * formStates.selectedSlots.length;
    }, [singleSlotFee, formStates.selectedSlots]);

    const dateDetails = useMemo(() => {
        if (!formStates.selectedDate) return null;
        const d = dayjs(formStates.selectedDate);
        const dayNum = d.format('DD');
        const monthStr = d.format('MMM');
        const fullDate = d.format('dddd, DD MMMM YYYY');

        const today = dayjs().startOf('day');
        const selected = d.startOf('day');
        const diffDays = selected.diff(today, 'day');

        let relativeLabel = '';
        if (diffDays === 0) relativeLabel = 'Today';
        else if (diffDays === 1) relativeLabel = 'Tomorrow';
        else if (diffDays === -1) relativeLabel = 'Yesterday';
        else if (diffDays > 1) relativeLabel = `In ${diffDays} days`;
        else relativeLabel = `${Math.abs(diffDays)} days ago`;

        return {
            dayNum,
            monthStr,
            fullDate,
            relativeLabel,
        };
    }, [formStates.selectedDate]);

    const updateFormState = (patch: Partial<IFormStates>) => {
        setFormState(prev => ({ ...prev, ...patch }));
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refetchAvailDates();
            if (formStates.selectedDate) {
                await refetchTimings();
            }
        } finally {
            setRefreshing(false);
        }
    }, [refetchAvailDates, refetchTimings, formStates.selectedDate]);

    const handleSelectDateFromCalendar = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        updateFormState({
            selectedDate: dateStr,
            selectedSlots: null,
        });
    };

    const handleSlotPress = (slot: ISlotItem, currentSelected: ISlotItem[]) => {
        if (slot.booked) return;

        const isSelected = currentSelected.some(selectedSlot => selectedSlot.start === slot.start);

        if (isSelected) {
            const updated = currentSelected.filter(selectedSlot => selectedSlot.start !== slot.start);

            if (updated.length > 0 && !areSlotsConsecutive(updated)) {
                showErrorToast('Please select consecutive slots only.');
                return;
            }

            updateFormState({
                selectedSlots: updated.length > 0 ? updated : null,
            });

            return;
        }
        if (currentSelected.length === 0) {
            updateFormState({
                selectedSlots: [slot],
            });

            return;
        }
        const sorted = [...currentSelected].sort((a, b) => a.start.localeCompare(b.start));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];

        const isBeforeFirst = slot.end === first.start;
        const isAfterLast = slot.start === last.end;

        if (isAfterLast || isBeforeFirst) {
            updateFormState({
                selectedSlots: [...currentSelected, slot],
            });
        } else {
            showErrorToast('Please select consecutive slots only.');
        }
    };

    const handleBookAppointment = () => {
        if (!selectedPatient?.patientGenId) return showErrorToast('Select Patient First');
        if (!formStates.selectedDate) return showErrorToast('Select Appointment Date');
        if (!formStates.selectedSlots || formStates.selectedSlots.length === 0) {
            return showErrorToast('Select at least one Time Slot');
        }
        if (!areSlotsConsecutive(formStates.selectedSlots)) {
            return showErrorToast('Please select consecutive slots only.');
        }
        if (!doctorId || !clinicId) return showErrorToast('Doctor/Clinic information is missing');

        if (formStates.selectedSlots.some(s => s.booked)) {
            showErrorToast('One or more selected slots are already booked. Please choose another.');
            return;
        }
        const sorted = [...formStates.selectedSlots].sort((a, b) => a.start.localeCompare(b.start));

        const firstSlot = sorted[0];
        const lastSlot = sorted[sorted.length - 1];

        const availabilityIds = sorted.map(s => String(s.availability_id || ''));
        const slotTimeArray = sorted.map(s => ({
            start: normalizeApiTime(s.start),
            end: normalizeApiTime(s.end),
            booked: true,
        }));

        showLoader('Please Wait. While Booking Appointment...');
        const payload: ICreateAppointmentPayload = {
            doctor_id: String(doctorId),
            patient_id: String(selectedPatient.id),
            clinic_id: String(clinicId),
            availability_id: availabilityIds,
            appointment_date: formStates.selectedDate,
            start_time: normalizeApiTime(firstSlot.start),
            end_time: normalizeApiTime(lastSlot.end),
            consultation_type: 'in-person',
            appointment_type: 'first_visit',
            reason: formStates.reason.trim() || null,
            symptoms: null,
            medications: null,
            appointment_slot_time: slotTimeArray,
            appointment_fee: totalAmount || singleSlotFee || 0,
            appointment_status: 'confirmed',
            payment_status: 'pending',
        };
        bookAppt(payload, {
            onSuccess: async res => {
                if (res?.success) {
                    updateFormState({
                        consultationType: 'clinic',
                        reason: '',
                        selectedDate: '',
                        selectedSlots: null,
                    });
                    await queryClient.invalidateQueries({
                        queryKey: [MyAppointmentsQueryKeys.MyAppointments],
                    });
                    hideLoader();
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: AppRoute.APPOINTMENTS,
                            },
                        ],
                    });
                } else {
                    hideLoader();
                }
            },
            onError: () => {
                hideLoader();
            },
        });
    };

    return (
        <SafeAreaWrapper
            header={
                <Header
                    title="Book Appointment"
                    description="Schedule an in-clinic consultation"
                    isBackBtn
                    onBackPress={() => navigation?.goBack()}
                />
            }
        >

            <ScrollView
                style={bookAppointmentStyles.scrollView}
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
                <View style={bookAppointmentStyles.content}>
                    <View style={bookAppointmentStyles.section}>
                        <Text style={bookAppointmentStyles.sectionTitle}>1. Select Patient</Text>
                        <TouchableOpacity
                            style={bookAppointmentStyles.selectButton}
                            onPress={() => setShowPatientPicker(true)}
                            activeOpacity={0.8}
                        >
                            <View style={bookAppointmentStyles.selectButtonContent}>
                                {selectedPatient ? (
                                    <Text style={bookAppointmentStyles.selectedText}>
                                        {selectedPatient.name} ({selectedPatient.patientGenId})
                                    </Text>
                                ) : (
                                    <Text style={bookAppointmentStyles.placeholderText}>Select a patient</Text>
                                )}
                                <Text style={bookAppointmentStyles.selectButtonIcon}>▼</Text>
                            </View>
                        </TouchableOpacity>

                        {selectedPatient?.patientGenId && (
                            <View style={bookAppointmentStyles.patientInfo}>
                                <Text style={bookAppointmentStyles.patientInfoText}>
                                    👤 {selectedPatient.name}, {capitalize(selectedPatient?.gender || '')}
                                </Text>
                                <Text style={bookAppointmentStyles.patientInfoText}>
                                    📞 {selectedPatient.Phone}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={bookAppointmentStyles.section}>
                        <Text style={bookAppointmentStyles.sectionTitle}>2. Consultation Type</Text>
                        <View style={bookAppointmentStyles.typeRow}>
                            <TouchableOpacity
                                style={[bookAppointmentStyles.typeButton, bookAppointmentStyles.typeButtonActive]}
                                onPress={() => {
                                    updateFormState({
                                        consultationType: 'clinic',
                                        selectedSlots: null,
                                    });
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={bookAppointmentStyles.typeButtonIcon}>🏥</Text>
                                <Text
                                    style={[
                                        bookAppointmentStyles.typeButtonText,
                                        bookAppointmentStyles.typeButtonTextActive,
                                    ]}
                                >
                                    In-Clinic
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={bookAppointmentStyles.section}>
                        <Text style={bookAppointmentStyles.sectionTitle}>3. Select Date</Text>
                        {availableDatesPending ? (
                            <TouchableOpacity style={bookAppointmentStyles.selectButton} disabled>
                                <View style={bookAppointmentStyles.selectButtonContent}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <ActivityIndicator size="small" color={theme.colors.primary} />
                                        <Text style={bookAppointmentStyles.placeholderText}>
                                            Loading available dates...
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) : formStates.selectedDate && dateDetails ? (
                            <TouchableOpacity
                                style={bookAppointmentStyles.dateSelectedCard}
                                onPress={() => setShowDatePicker(true)}
                                activeOpacity={0.85}
                            >
                                <View style={bookAppointmentStyles.dateLeafBadge}>
                                    <Text style={bookAppointmentStyles.dateLeafDay}>{dateDetails.dayNum}</Text>
                                    <Text style={bookAppointmentStyles.dateLeafMonth}>{dateDetails.monthStr}</Text>
                                </View>

                                <View style={bookAppointmentStyles.dateDetailsWrap}>
                                    <Text style={bookAppointmentStyles.dateDetailsFull}>{dateDetails.fullDate}</Text>
                                    <Text style={bookAppointmentStyles.dateDetailsRel}>
                                        {dateDetails.relativeLabel} • In-Clinic Consultation
                                    </Text>
                                </View>

                                <View style={bookAppointmentStyles.dateChangeBtn}>
                                    <Text style={bookAppointmentStyles.dateChangeBtnText}>Change</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={bookAppointmentStyles.selectButton}
                                onPress={() => {
                                    if (!selectedPatient?.patientGenId) return showErrorToast('Select Patient First');
                                    setShowDatePicker(true);
                                }}
                                activeOpacity={0.8}
                            >
                                <View style={bookAppointmentStyles.selectButtonContent}>
                                    <Text style={bookAppointmentStyles.placeholderText}>
                                        📅 Select appointment date
                                    </Text>
                                    <Text style={bookAppointmentStyles.selectButtonIcon}>▼</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={bookAppointmentStyles.section}>
                        <Text style={bookAppointmentStyles.sectionTitle}>4. Select Time Slot</Text>

                        {!formStates.selectedDate ? (
                            <View style={bookAppointmentStyles.emptyState}>
                                <Text style={bookAppointmentStyles.emptyStateText}>No Date Selected</Text>
                                <Text style={bookAppointmentStyles.emptyStateSubtext}>
                                    Please select an available date above to view available time slots.
                                </Text>
                            </View>
                        ) : timingsPending ? (
                            <BookingSlotsSkeleton />
                        ) : !timingsData?.slots || timingsData.slots.length === 0 ? (
                            <View style={bookAppointmentStyles.emptyState}>
                                <Text style={bookAppointmentStyles.emptyStateText}>No Slots Available</Text>
                                <Text style={bookAppointmentStyles.emptyStateSubtext}>
                                    No appointment time slots are configured for this date. Please choose another
                                    date.
                                </Text>
                            </View>
                        ) : (
                            <>
                                <View style={bookAppointmentStyles.legendRow}>
                                    <View style={bookAppointmentStyles.legendItem}>
                                        <View
                                            style={[
                                                bookAppointmentStyles.legendDot,
                                                { backgroundColor: '#EBEBEB', borderColor: '#C8D8D8' },
                                            ]}
                                        />
                                        <Text style={bookAppointmentStyles.legendText}>Available</Text>
                                    </View>
                                    <View style={bookAppointmentStyles.legendItem}>
                                        <View
                                            style={[
                                                bookAppointmentStyles.legendDot,
                                                { backgroundColor: '#FFFFFF', borderColor: theme.colors.primary },
                                            ]}
                                        />
                                        <Text style={bookAppointmentStyles.legendText}>Selected</Text>
                                    </View>
                                    <View style={bookAppointmentStyles.legendItem}>
                                        <View
                                            style={[
                                                bookAppointmentStyles.legendDot,
                                                { backgroundColor: '#EBEBEB', opacity: 0.4, borderColor: '#8E9A97' },
                                            ]}
                                        />
                                        <Text style={bookAppointmentStyles.legendText}>Booked / Past</Text>
                                    </View>
                                </View>

                                {formStates.selectedSlots && formStates.selectedSlots.length > 0 && (
                                    <View style={bookAppointmentStyles.slotSummaryBox}>
                                        <Text style={bookAppointmentStyles.slotSummaryText}>
                                            <Text style={{ fontWeight: '700' }}>
                                                {formStates.selectedSlots.length} Slot
                                                {formStates.selectedSlots.length > 1 ? 's' : ''} Selected
                                            </Text>{' '}
                                            ({formatTime12h(formStates.selectedSlots[0].start)} →{' '}
                                            {formatTime12h(
                                                formStates.selectedSlots[formStates.selectedSlots.length - 1].end
                                            )}
                                            )
                                        </Text>
                                        <TouchableOpacity onPress={() => updateFormState({ selectedSlots: null })}>
                                            <Text style={bookAppointmentStyles.slotClearText}>Clear</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {periodWiseSlots &&
                                    PeriodSeries.map(period => {
                                        const periodSlots = periodWiseSlots[period] || [];
                                        if (periodSlots.length === 0) return null;
                                        return (
                                            <View key={period} style={bookAppointmentStyles.periodSection}>
                                                <View style={bookAppointmentStyles.periodHeader}>
                                                    <PeriodIcon period={period} />
                                                    <Text style={bookAppointmentStyles.periodTitle}>
                                                        {period.charAt(0) + period.slice(1).toLowerCase()}
                                                    </Text>
                                                </View>

                                                <View style={bookAppointmentStyles.slotsGrid}>
                                                    {periodSlots.map((slot, index) => {
                                                        const currentSelected = formStates.selectedSlots || [];
                                                        const isSelected = currentSelected.some(
                                                            selectedSlot => selectedSlot.start === slot.start
                                                        );
                                                        const isBooked = slot.booked;
                                                        return (
                                                            <TouchableOpacity
                                                                key={index}
                                                                style={[
                                                                    bookAppointmentStyles.slotButton,
                                                                    isBooked && bookAppointmentStyles.slotButtonBooked,
                                                                    isSelected && bookAppointmentStyles.slotButtonSelected,
                                                                ]}
                                                                onPress={() => handleSlotPress(slot, currentSelected)}
                                                                disabled={isBooked}
                                                                activeOpacity={0.7}
                                                            >
                                                                <Text
                                                                    style={[
                                                                        bookAppointmentStyles.slotButtonText,
                                                                        isBooked && bookAppointmentStyles.slotButtonTextBooked,
                                                                        isSelected && bookAppointmentStyles.slotButtonTextSelected,
                                                                    ]}
                                                                >
                                                                    {slot.displayTime}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                        );
                                    })}
                            </>
                        )}
                    </View>

                    <View style={bookAppointmentStyles.section}>
                        <Text style={bookAppointmentStyles.sectionTitle}>5. Appointment Fee</Text>
                        <View style={bookAppointmentStyles.feeDisplay}>
                            <Text style={bookAppointmentStyles.feeLabel}>Consultation Fee</Text>
                            <Text style={bookAppointmentStyles.feeAmount}>₹{totalAmount || 0}</Text>
                        </View>
                        <Text style={bookAppointmentStyles.feeNote}>In-clinic consultation fee</Text>
                    </View>

                    <View style={bookAppointmentStyles.section}>
                        <Text style={bookAppointmentStyles.sectionTitle}>Reason for Visit (Optional)</Text>
                        <TextInput
                            style={bookAppointmentStyles.input}
                            placeholder="e.g., Follow-up, Routine Check-up"
                            placeholderTextColor="#94A3B8"
                            value={formStates.reason}
                            onChangeText={text => updateFormState({ reason: text })}
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            bookAppointmentStyles.bookButton,
                            (!selectedPatient?.patientGenId || bookApptPending) &&
                            bookAppointmentStyles.bookButtonDisabled,
                        ]}
                        onPress={handleBookAppointment}
                        activeOpacity={0.85}
                        disabled={!selectedPatient?.patientGenId || bookApptPending}
                    >
                        {bookApptPending ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={bookAppointmentStyles.bookButtonText}>Book Appointment</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <BookingPatientSelectModal
                visible={showPatientPicker}
                onClose={() => setShowPatientPicker(false)}
                selectedPatient={selectedPatient || null}
                onSelectPatient={patient => {
                    setSelectedPatient(patient);
                    updateFormState({
                        reason: '',
                        selectedDate: '',
                        selectedSlots: null,
                    });
                }}
            />

            <CalendarDatePickerModal
                visible={showDatePicker}
                availableDates={availDates || []}
                initialDate={formStates.selectedDate ? new Date(formStates.selectedDate) : new Date()}
                onSelectDate={handleSelectDateFromCalendar}
                onClose={() => setShowDatePicker(false)}
            />
        </SafeAreaWrapper>
    );
};

export default BookAppointmentScreen;
