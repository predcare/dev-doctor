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
import CalendarDatePickerModal from '../../components/commons/CalendarDatePickerModal/CalendarDatePickerModal';
import { BookingPatientSelectModal } from '../../components/Modules/Appointments/Modals/BookingPatientSelectModal';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import { BookingSlotsSkeleton } from '../../components/Skeletons/BookingSlotsSkeleton';
import { ChevronLeftIcon } from '../../components/ui/icons';
import { useBookAppointments } from '../../hooks/react-query/appointments/appointments.hooks';
import { ICreateAppointmentPayload } from '../../hooks/react-query/auth/payload.interfaces';
import {
  useDoctorAvailDates,
  useDoctorTimingsByDate,
} from '../../hooks/react-query/availability/availablity.hooks';
import { MyAppointmentsQueryKeys } from '../../hooks/react-query/query.keys';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { capitalize } from '../../lib/common/common.utils';
import { showErrorToast } from '../../lib/common/toast.utils';
import { AppRoute, type BookAppointmentScreenProps } from '../../route';
import { bookAppointmentStyles as S } from '../../styled/BookAppointmentScreen.styled';
import theme from '../../styled/theme.styled';
import { ConsultType } from '../../typescripts/enums';
import {
  areSlotsConsecutive,
  formatTime12h,
  getSlotPeriod,
  ISlotItem,
  normalizeApiTime,
  SlotPeriod,
} from '../../utils/availabilityUtils';
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';

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

export const BookAppointmentScreen: React.FC<BookAppointmentScreenProps> = () => {
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

  console.log('selectedPatient', selectedPatient)

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
                name: AppRoute.SCHEDULE,
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
    <SafeAreaWrapper>
      <View style={S.header}>
        <TouchableOpacity style={S.backButton} onPress={() => navigation?.goBack()}>
          <ChevronLeftIcon />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Book Appointment</Text>
      </View>

      <ScrollView
        style={S.scrollView}
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
        <View style={S.content}>
          <View style={S.section}>
            <Text style={S.sectionTitle}>1. Select Patient</Text>
            <TouchableOpacity
              style={S.selectButton}
              onPress={() => setShowPatientPicker(true)}
              activeOpacity={0.8}
            >
              <View style={S.selectButtonContent}>
                {selectedPatient ? (
                  <Text style={S.selectedText}>
                    {selectedPatient.name} ({selectedPatient.patientGenId})
                  </Text>
                ) : (
                  <Text style={S.placeholderText}>Select a patient</Text>
                )}
                <Text style={S.selectButtonIcon}>▼</Text>
              </View>
            </TouchableOpacity>

            {selectedPatient?.patientGenId && (
              <View style={S.patientInfo}>
                <Text style={S.patientInfoText}>
                  👤 {selectedPatient.name}, {capitalize(selectedPatient?.gender || '')}
                </Text>
                <Text style={S.patientInfoText}>📞 {selectedPatient.Phone}</Text>
              </View>
            )}
          </View>

          <View style={S.section}>
            <Text style={S.sectionTitle}>2. Consultation Type</Text>
            <View style={S.typeRow}>
              <TouchableOpacity
                style={[S.typeButton, S.typeButtonActive]}
                onPress={() => {
                  updateFormState({
                    consultationType: 'clinic',
                    selectedSlots: null,
                  });
                }}
                activeOpacity={0.8}
              >
                <Text style={S.typeButtonIcon}>🏥</Text>
                <Text style={[S.typeButtonText, S.typeButtonTextActive]}>In-Clinic</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={S.section}>
            <Text style={S.sectionTitle}>3. Select Date</Text>
            {availableDatesPending ? (
              <TouchableOpacity style={S.selectButton} disabled>
                <View style={S.selectButtonContent}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                    <Text style={S.placeholderText}>Loading available dates...</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : formStates.selectedDate && dateDetails ? (
              <TouchableOpacity
                style={S.dateSelectedCard}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.85}
              >
                <View style={S.dateLeafBadge}>
                  <Text style={S.dateLeafDay}>{dateDetails.dayNum}</Text>
                  <Text style={S.dateLeafMonth}>{dateDetails.monthStr}</Text>
                </View>

                <View style={S.dateDetailsWrap}>
                  <Text style={S.dateDetailsFull}>{dateDetails.fullDate}</Text>
                  <Text style={S.dateDetailsRel}>
                    {dateDetails.relativeLabel} • In-Clinic Consultation
                  </Text>
                </View>

                <View style={S.dateChangeBtn}>
                  <Text style={S.dateChangeBtnText}>Change</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={S.selectButton}
                onPress={() => {
                  if (!selectedPatient?.patientGenId) return showErrorToast('Select Patient First');
                  setShowDatePicker(true);
                }}
                activeOpacity={0.8}
              >
                <View style={S.selectButtonContent}>
                  <Text style={S.placeholderText}>📅 Select appointment date</Text>
                  <Text style={S.selectButtonIcon}>▼</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={S.section}>
            <Text style={S.sectionTitle}>4. Select Time Slot</Text>

            {!formStates.selectedDate ? (
              <View style={S.emptyState}>
                <Text style={S.emptyStateText}>No Date Selected</Text>
                <Text style={S.emptyStateSubtext}>
                  Please select an available date above to view available time slots.
                </Text>
              </View>
            ) : timingsPending ? (
              <BookingSlotsSkeleton />
            ) : !timingsData?.slots || timingsData.slots.length === 0 ? (
              <View style={S.emptyState}>
                <Text style={S.emptyStateText}>No Slots Available</Text>
                <Text style={S.emptyStateSubtext}>
                  No appointment time slots are configured for this date. Please choose another
                  date.
                </Text>
              </View>
            ) : (
              <>
                <View style={S.legendRow}>
                  <View style={S.legendItem}>
                    <View
                      style={[S.legendDot, { backgroundColor: '#EBEBEB', borderColor: '#C8D8D8' }]}
                    />
                    <Text style={S.legendText}>Available</Text>
                  </View>
                  <View style={S.legendItem}>
                    <View
                      style={[
                        S.legendDot,
                        { backgroundColor: '#FFFFFF', borderColor: theme.colors.primary },
                      ]}
                    />
                    <Text style={S.legendText}>Selected</Text>
                  </View>
                  <View style={S.legendItem}>
                    <View
                      style={[
                        S.legendDot,
                        { backgroundColor: '#EBEBEB', opacity: 0.4, borderColor: '#8E9A97' },
                      ]}
                    />
                    <Text style={S.legendText}>Booked / Past</Text>
                  </View>
                </View>

                {formStates.selectedSlots && formStates.selectedSlots.length > 0 && (
                  <View style={S.slotSummaryBox}>
                    <Text style={S.slotSummaryText}>
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
                      <Text style={S.slotClearText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {periodWiseSlots &&
                  PeriodSeries.map(period => {
                    const periodSlots = periodWiseSlots[period] || [];
                    if (periodSlots.length === 0) return null;
                    return (
                      <View key={period} style={S.periodSection}>
                        <View style={S.periodHeader}>
                          <PeriodIcon period={period} />
                          <Text style={S.periodTitle}>
                            {period.charAt(0) + period.slice(1).toLowerCase()}
                          </Text>
                        </View>

                        <View style={S.slotsGrid}>
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
                                  S.slotButton,
                                  isBooked && S.slotButtonBooked,
                                  isSelected && S.slotButtonSelected,
                                ]}
                                onPress={() => handleSlotPress(slot, currentSelected)}
                                disabled={isBooked}
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    S.slotButtonText,
                                    isBooked && S.slotButtonTextBooked,
                                    isSelected && S.slotButtonTextSelected,
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

          <View style={S.section}>
            <Text style={S.sectionTitle}>5. Appointment Fee</Text>
            <View style={S.feeDisplay}>
              <Text style={S.feeLabel}>Consultation Fee</Text>
              <Text style={S.feeAmount}>₹{totalAmount || 0}</Text>
            </View>
            <Text style={S.feeNote}>In-clinic consultation fee</Text>
          </View>

          <View style={S.section}>
            <Text style={S.sectionTitle}>Reason for Visit (Optional)</Text>
            <TextInput
              style={S.input}
              placeholder="e.g., Follow-up, Routine Check-up"
              placeholderTextColor="#94A3B8"
              value={formStates.reason}
              onChangeText={text => updateFormState({ reason: text })}
            />
          </View>

          <TouchableOpacity
            style={[
              S.bookButton,
              (!selectedPatient?.patientGenId || bookApptPending) && S.bookButtonDisabled,
            ]}
            onPress={handleBookAppointment}
            activeOpacity={0.85}
            disabled={!selectedPatient?.patientGenId || bookApptPending}
          >
            {bookApptPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={S.bookButtonText}>Book Appointment</Text>
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
