import { useNavigation } from '@react-navigation/native';
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
import {
  AvailableDateItem,
  BookingDateSelectModal,
} from '../../components/Modules/Appointments/Modals/BookingDateSelectModal';
import { BookingPatientSelectModal } from '../../components/Modules/Appointments/Modals/BookingPatientSelectModal';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import { ChevronLeftIcon } from '../../components/ui/icons';
import { useBookAppointments } from '../../hooks/react-query/appointments/appointments.hooks';
import { ICreateAppointmentPayload } from '../../hooks/react-query/auth/payload.interfaces';
import { useBookingAvailablities } from '../../hooks/react-query/availability/availablity.hooks';
import { MyAppointmentsQueryKeys } from '../../hooks/react-query/query.keys';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { capitalize } from '../../lib/common/common.utils';
import { showErrorToast } from '../../lib/common/toast.utils';
import { AppRoute, type BookAppointmentScreenProps } from '../../route';
import { bookAppointmentStyles as S } from '../../styled/BookAppointmentScreen.styled';
import theme from '../../styled/theme.styled';
import {
  formatTime12h,
  groupBookingSlotsByPeriod,
  ISlotItem,
  normalizeApiTime,
  parseBookingAvailableDates,
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
  formattedDate?: string;
  appointmentFee: number;
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
    formattedDate: '',
    appointmentFee: 0,
    consultationType: 'clinic',
    reason: '',
    selectedSlots: null,
  });

  const {
    data: bookingAvailablities,
    isFetching: bookingAvailPending,
    refetch: refetchBookingAvailablities,
  } = useBookingAvailablities({
    clinicId: userData?.clinic_id || 0,
    doctorId: userData?.user_id || 0,
  });

  const { mutate: bookAppt, isPending: bookApptPending } = useBookAppointments();

  const availableDates = useMemo<AvailableDateItem[]>(() => {
    return parseBookingAvailableDates(bookingAvailablities);
  }, [bookingAvailablities]);

  const periodWiseSlots = useMemo(() => {
    if (!formStates.selectedDate || !bookingAvailablities?.dates) {
      return null;
    }
    const matchingDateObj = bookingAvailablities.dates.find(
      d => d.date === formStates.selectedDate
    );
    if (!matchingDateObj) return null;
    return groupBookingSlotsByPeriod(matchingDateObj.slots, formStates.selectedDate);
  }, [formStates.selectedDate, bookingAvailablities]);

  const { totalAmount } = useMemo(() => {
    if (!formStates.appointmentFee || !formStates?.selectedSlots?.length) {
      return {
        consultationFee: 0,
        totalAmount: 0,
      };
    }

    const fee = Number(formStates.appointmentFee) * formStates?.selectedSlots.length;

    return {
      consultationFee: fee,
      totalAmount: fee,
    };
  }, [formStates.appointmentFee, formStates?.selectedSlots]);

  const updateFormState = (patch: Partial<IFormStates>) => {
    setFormState(prev => ({ ...prev, ...patch }));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchBookingAvailablities();
    } finally {
      setRefreshing(false);
    }
  }, [refetchBookingAvailablities]);

  const areSlotsConsecutive = (slots: ISlotItem[]): boolean => {
    if (slots.length <= 1) return true;
    const sorted = [...slots].sort((a, b) => a.start.localeCompare(b.start));
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].end !== sorted[i + 1].start) {
        return false;
      }
    }
    return true;
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
    if (!userData?.user_id || !userData?.clinic_id) return showErrorToast('Doctor ID is missing');

    if (formStates?.selectedSlots.some(s => s.booked)) {
      showErrorToast('One or more selected slots are already booked. Please choose another.');
      return;
    }
    const sorted = [...formStates?.selectedSlots].sort((a, b) => a.start.localeCompare(b.start));

    const firstSlot = sorted[0];
    const lastSlot = sorted[sorted.length - 1];

    const slotTimeJson = JSON.stringify(
      sorted.map(s => ({ start: s.start, end: s.end, booked: false }))
    );
    showLoader('Please Wait....');
    const payload: ICreateAppointmentPayload = {
      doctor_id: userData.user_id,
      patient_id: selectedPatient.id,
      appointment_date: formStates.selectedDate,
      start_time: normalizeApiTime(firstSlot.start),
      end_time: normalizeApiTime(lastSlot.end),
      consultation_type: 'in-person',
      appointment_fee: formStates.appointmentFee || 0,
      appointment_type: 'first_visit',
      appointment_status: 'confirmed',
      payment_status: 'pending',
      reason: formStates.reason.trim() || null,
      symptoms: null,
      appointment_slot_time: slotTimeJson,
      clinic_id: userData?.clinic_id ?? 1,
    };
    bookAppt(payload, {
      onSuccess: async () => {
        updateFormState({
          appointmentFee: 0,
          consultationType: 'clinic',
          formattedDate: '',
          reason: '',
          selectedDate: '',
          selectedSlots: null,
        });
        await queryClient.invalidateQueries({ queryKey: [MyAppointmentsQueryKeys.MyAppointments] });
        hideLoader();
        navigation.navigate(AppRoute.MAIN_TABS, { screen: AppRoute.SCHEDULE });
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => selectedPatient?.patientGenId && onRefresh()}
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
            <TouchableOpacity
              style={[S.selectButton, bookingAvailPending && { opacity: 0.7 }]}
              onPress={() => {
                if (bookingAvailPending) return;
                if (!selectedPatient?.patientGenId) return showErrorToast('Select Patient First');
                !bookingAvailPending && setShowDatePicker(true);
              }}
              disabled={bookingAvailPending}
              activeOpacity={0.8}
            >
              <View style={S.selectButtonContent}>
                {bookingAvailPending ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                    <Text style={S.placeholderText}>Loading available dates...</Text>
                  </View>
                ) : formStates.selectedDate ? (
                  <Text style={S.selectedText}>
                    📅 {formStates.formattedDate || formStates.selectedDate}
                  </Text>
                ) : (
                  <Text style={S.placeholderText}>Select appointment date</Text>
                )}
                {!bookingAvailPending && <Text style={S.selectButtonIcon}>▼</Text>}
              </View>
            </TouchableOpacity>
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
                    <Text style={S.legendText}>Booked</Text>
                  </View>
                </View>

                {formStates.selectedSlots &&
                  formStates.selectedSlots.length > 0 &&
                  (() => {
                    const sorted = [...formStates.selectedSlots!].sort((a, b) =>
                      a.start.localeCompare(b.start)
                    );
                    return (
                      <View style={S.slotSummaryBox}>
                        <Text style={S.slotSummaryText}>
                          <Text style={{ fontWeight: '700' }}>
                            {formStates.selectedSlots!.length} Slot
                            {formStates.selectedSlots!.length > 1 ? 's' : ''} Selected
                          </Text>{' '}
                          ({formatTime12h(sorted[0].start)} →{' '}
                          {formatTime12h(sorted[sorted.length - 1].end)})
                        </Text>
                        <TouchableOpacity onPress={() => updateFormState({ selectedSlots: null })}>
                          <Text style={S.slotClearText}>Clear</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })()}

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
        onSelectPatient={patient => setSelectedPatient(patient)}
        doctorId={String(userData?.user_id)}
      />

      <BookingDateSelectModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={formStates.selectedDate}
        availableDates={availableDates}
        onSelectDate={dateObj => {
          const apptFee = dateObj.in_person_fee || 0;
          updateFormState({
            selectedDate: dateObj.date,
            formattedDate: dateObj.formattedDate,
            appointmentFee: apptFee,
            selectedSlots: null,
          });
        }}
      />
    </SafeAreaWrapper>
  );
};

export default BookAppointmentScreen;
