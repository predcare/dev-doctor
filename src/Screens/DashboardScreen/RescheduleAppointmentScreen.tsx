import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppointmentCalendarModal } from '../../components/Modules/Appointments/Modals/AppointmentCalendarModal';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import { RescheduleSkeleton } from '../../components/Skeletons/RescheduleSkeleton';
import { ChevronLeftIcon } from '../../components/ui/icons';
import {
  useMyAppointmentInfo,
  useRescheduleAppointment,
} from '../../hooks/react-query/appointments/appointments.hooks';
import { useBookingAvailablities } from '../../hooks/react-query/availability/availablity.hooks';
import { MyAppointmentsQueryKeys } from '../../hooks/react-query/query.keys';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { formatDate, formatTimeSlot, getAge, getInitials } from '../../lib/common/common.utils';
import { showErrorToast } from '../../lib/common/toast.utils';
import { AppRoute, type RescheduleAppointmentScreenProps } from '../../route';
import { rescheduleAppointmentStyles as S } from '../../styled/RescheduleAppointmentScreen.styled';
import theme from '../../styled/theme.styled';
import {
  areSlotsConsecutive,
  groupBookingSlotsByPeriod,
  ISlotItem,
  normalizeApiTime,
  parseBookingAvailableDates,
  ParsedAvailableDate,
  SlotPeriod,
} from '../../utils/availabilityUtils';
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';

const PERIOD_ORDER: SlotPeriod[] = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];

export const RescheduleAppointmentScreen: React.FC<RescheduleAppointmentScreenProps> = ({
  navigation,
  route,
}) => {
  const { appointmentId } = route?.params as {
    appointmentId?: number;
    patientId?: string;
  };
  const { userData } = useAuthStore(state => state);
  const { showLoader, hideLoader } = useLoadingStore(state => state);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [formStates, setFormStates] = useState<{
    selectedDate: string;
    selectedSlot: ISlotItem[] | null;
    visitReason: string;
    symptoms: string;
    rescheduleReason: string;
  }>({
    selectedDate: '',
    selectedSlot: null,
    visitReason: '',
    symptoms: '',
    rescheduleReason: '',
  });

  const {
    data: apptInfo,
    isFetching: apptInfoPending,
    refetch: refetchApptInfo,
  } = useMyAppointmentInfo({
    id: appointmentId,
  });

  const {
    data: bookingAvailablities,
    isFetching: bookingAvailPending,
    refetch: refetchBookingAvailablities,
  } = useBookingAvailablities({
    clinicId: userData?.clinic_id || 0,
    doctorId: userData?.user_id || 0,
  });

  const { mutate: rescheduleAppointment, isPending: reschedulePending } =
    useRescheduleAppointment();

  const isLoading = apptInfoPending || bookingAvailPending;

  const updateFormState = (
    key: keyof typeof formStates,
    value: (typeof formStates)[keyof typeof formStates]
  ) => {
    setFormStates(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchBookingAvailablities(), refetchApptInfo()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchBookingAvailablities, refetchApptInfo]);

  const availableDates = useMemo<ParsedAvailableDate[]>(() => {
    return parseBookingAvailableDates(bookingAvailablities);
  }, [bookingAvailablities]);

  const availableDateStrings = useMemo<string[]>(() => {
    return availableDates.map(d => d.date);
  }, [availableDates]);

  const periodWiseSlots = useMemo(() => {
    if (!formStates?.selectedDate || !bookingAvailablities?.dates) {
      return null;
    }
    const matchingDateObj = bookingAvailablities.dates.find(
      d => d.date === formStates?.selectedDate
    );
    if (!matchingDateObj || !matchingDateObj.slots) return null;

    const existingFee = apptInfo?.appointment_fee
      ? parseFloat(String(apptInfo.appointment_fee))
      : null;

    const filteredSlots = matchingDateObj.slots.filter(slot => {
      if (existingFee !== null && existingFee > 0) {
        const inPersonFee = parseFloat(String(slot.in_person_fee || 0));
        const videoFee = parseFloat(String(slot.video_fee || 0));
        const matchesFee = inPersonFee === existingFee || videoFee === existingFee;
        if (!matchesFee) return false;
      }
      return true;
    });

    return groupBookingSlotsByPeriod(filteredSlots, formStates?.selectedDate);
  }, [formStates?.selectedDate, bookingAvailablities, apptInfo?.appointment_fee]);

  const hasAnySlots = useMemo(() => {
    if (!periodWiseSlots) return false;
    return PERIOD_ORDER.some(period => (periodWiseSlots[period]?.length || 0) > 0);
  }, [periodWiseSlots]);

  const handleSlotPress = (slot: ISlotItem) => {
    if (slot.booked) return;

    const currentSelected = formStates?.selectedSlot || [];
    const isSelected = currentSelected.some(selectedSlot => selectedSlot.start === slot.start);

    if (isSelected) {
      const updated = currentSelected.filter(selectedSlot => selectedSlot.start !== slot.start);

      if (updated.length > 0 && !areSlotsConsecutive(updated)) {
        showErrorToast('Please select consecutive slots only.');
        return;
      }

      setFormStates(prev => ({
        ...prev,
        selectedSlot: updated.length > 0 ? updated : null,
      }));

      return;
    }

    if (currentSelected.length === 0) {
      setFormStates(prev => ({
        ...prev,
        selectedSlot: [slot],
      }));
      return;
    }

    const sorted = [...currentSelected].sort((a, b) => a.start.localeCompare(b.start));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const isBeforeFirst = slot.end === first.start;
    const isAfterLast = slot.start === last.end;

    if (isAfterLast || isBeforeFirst) {
      setFormStates(prev => ({
        ...prev,
        selectedSlot: [...currentSelected, slot],
      }));
    } else {
      showErrorToast('Please select consecutive slots only.');
    }
  };

  const handleConfirmReschedule = () => {
    if (!formStates?.selectedSlot || formStates.selectedSlot.length === 0)
      return showErrorToast('Please select at least one slot');
    if (!areSlotsConsecutive(formStates.selectedSlot))
      return showErrorToast('Please select consecutive slots only.');
    if (!userData?.user_id) return showErrorToast('Doctor not found');
    if (!appointmentId) return showErrorToast('Appointment not found');
    if (!apptInfo?.appointment_type) return showErrorToast('Appointment type not found');

    const sorted = [...formStates.selectedSlot].sort((a, b) => a.start.localeCompare(b.start));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const slotTimeJson = JSON.stringify(
      sorted.map(s => ({ start: s.start, end: s.end, booked: false }))
    );

    const payload = {
      new_date: formStates?.selectedDate,
      new_start_time: normalizeApiTime(first.start),
      new_end_time: normalizeApiTime(last.end),
      new_slot_time: slotTimeJson,
      // new_consultation_type: apptInfo?.appointment_type,
      new_doctor_id: userData?.user_id,
      symptoms: formStates?.symptoms.trim() || '',
      reason: formStates?.visitReason.trim() || formStates?.rescheduleReason.trim() || '',
    };

    console.log('payload', payload);
    showLoader('Rescheduling appointment...');

    rescheduleAppointment(
      {
        id: appointmentId,
        body: payload,
      },
      {
        onSuccess: async () => {
          try {
            await queryClient.invalidateQueries({
              queryKey: [MyAppointmentsQueryKeys.MyAppointments],
            });
          } finally {
            hideLoader();
            navigation?.navigate(AppRoute.MAIN_TABS, {
              screen: AppRoute.SCHEDULE,
              params: {
                refresh: true,
              },
            });
          }
        },
        onError: () => {
          hideLoader();
        },
      }
    );
  };

  useEffect(() => {
    if (apptInfo) {
      setFormStates(prev => ({
        ...prev,
        visitReason: prev.visitReason || apptInfo.reason || '',
        symptoms: prev.symptoms || apptInfo.symptoms || '',
      }));
    }
  }, [apptInfo]);

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <View style={S.headerWrap}>
          <TouchableOpacity style={S.backPill} onPress={() => navigation?.goBack()}>
            <ChevronLeftIcon size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <Text style={S.headerTitle}>Reschedule</Text>
        </View>
        <RescheduleSkeleton />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={S.headerWrap}>
        <TouchableOpacity style={S.backPill} onPress={() => navigation?.goBack()}>
          <ChevronLeftIcon size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Reschedule</Text>
      </View>

      <ScrollView
        contentContainerStyle={S.scrollContent}
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
        <View style={S.currentCard}>
          <Text style={S.cardLabel}>CURRENT APPOINTMENT DETAILS</Text>
          <View style={S.patientInfoRow}>
            <View style={S.avatarCircle}>
              <Text style={S.avatarText}>{getInitials(apptInfo?.patient_name || '')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={S.patientName}>{apptInfo?.patient_name || 'N/A'}</Text>
              <Text style={S.patientSub}>
                {apptInfo?.patient_gender || ''}{' '}
                {apptInfo?.patient_dob ? `/ ${getAge(apptInfo?.patient_dob, { large: true })}` : ''}
              </Text>
            </View>
          </View>
          <View style={S.divider} />
          <View style={S.detailRow}>
            <Text style={S.detailLabel}>Current Date & Time</Text>
            <Text style={S.detailValue} numberOfLines={1} ellipsizeMode="tail">
              {formatDate(apptInfo?.appointment_date)} ·{' '}
              {formatTimeSlot(apptInfo?.start_time, apptInfo?.end_time)}
            </Text>
          </View>

          <View style={S.detailRow}>
            <Text style={S.detailLabel}>Consultation Type</Text>
            <Text style={S.detailValue} numberOfLines={1} ellipsizeMode="tail">
              {apptInfo?.consultation_type === 'video' ? '📹 Video Call' : '🏥 In-Clinic'}
            </Text>
          </View>
        </View>

        <Text style={S.sectionTitle}>Select New Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={S.dateStrip}>
            {availableDates?.slice(0, 3).map(d => {
              const selected = d.date === formStates?.selectedDate;
              return (
                <TouchableOpacity
                  key={d.date}
                  style={[S.dateCard, selected && S.dateCardActive]}
                  onPress={() => {
                    setFormStates(prev => ({
                      ...prev,
                      selectedDate: d.date,
                      selectedSlot: null,
                    }));
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[S.dateDayLabel, selected && S.dateDayLabelActive]}>
                    {d.formattedDate.split(',')[0]}
                  </Text>
                  <Text style={[S.dateNum, selected && S.dateNumActive]}>
                    {d.formattedDate.split(',')[1]?.trim()}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={S.calendarPillBtn}
              onPress={() => setShowCalendar(true)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 16 }}>📅</Text>
              <Text style={S.calendarPillTxt}>Custom Date</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Text style={S.sectionTitle}>Select New Time</Text>
        {!hasAnySlots ? (
          <View style={S.emptySlotsCard}>
            <Text style={{ fontSize: 28, marginBottom: 4 }}>📅</Text>
            <Text style={S.emptySlotsTitle}>No slots available for this date</Text>
            <Text style={S.emptySlotsSubtext}>
              Please select another date from above or choose a custom date from the calendar.
            </Text>
          </View>
        ) : (
          PERIOD_ORDER.map(period => {
            const slots = periodWiseSlots?.[period] || [];
            if (slots.length === 0) return null;

            return (
              <View key={period} style={{ marginBottom: 14 }}>
                <Text style={S.periodHeader}>{period}</Text>
                <View style={S.slotsGrid}>
                  {slots.map((slot, idx) => {
                    const isSelected = formStates?.selectedSlot?.some(s => s.start === slot.start);
                    const isBooked = slot.booked;
                    return (
                      <TouchableOpacity
                        key={idx}
                        disabled={isBooked}
                        style={[
                          S.timeChip,
                          isBooked && S.timeChipBooked,
                          isSelected && S.timeChipActive,
                        ]}
                        onPress={() => handleSlotPress(slot)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            S.timeChipText,
                            isBooked && S.timeChipTextBooked,
                            isSelected && S.timeChipTextActive,
                          ]}
                        >
                          {slot.displayTime || `${slot.start} - ${slot.end}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}

        <View style={{ marginTop: 10 }}>
          <Text style={S.fieldLabel}>Reason to Visit</Text>
          <TextInput
            style={S.fieldInput}
            multiline
            numberOfLines={2}
            placeholder="e.g. Chest pain, follow-up..."
            placeholderTextColor="#AABAB8"
            value={formStates?.visitReason}
            onChangeText={text => updateFormState('visitReason', text)}
          />

          <Text style={S.fieldLabel}>Symptoms</Text>
          <TextInput
            style={S.fieldInput}
            multiline
            numberOfLines={3}
            placeholder="Describe how you are feeling..."
            placeholderTextColor="#AABAB8"
            value={formStates?.symptoms}
            onChangeText={text => updateFormState('symptoms', text)}
          />

          <Text style={S.fieldLabel}>
            Reason for Rescheduling <Text style={S.fieldOptional}>(optional)</Text>
          </Text>
          <TextInput
            style={S.fieldInput}
            multiline
            numberOfLines={2}
            placeholder="Why are you changing this appointment?"
            placeholderTextColor="#AABAB8"
            value={formStates?.rescheduleReason}
            onChangeText={text => updateFormState('rescheduleReason', text)}
          />
        </View>
        <View style={S.bookingButtonRow}>
          <View style={S.bookingButton}>
            <Text style={S.bookingButtonText}>New Schedule</Text>
            {formStates?.selectedSlot && formStates.selectedSlot.length > 0 ? (
              <>
                <Text style={S.bookingButtonValue}>{formStates?.selectedDate}</Text>
                <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '600', marginTop: 2 }}>
                  {(() => {
                    const sorted = [...formStates.selectedSlot].sort((a, b) =>
                      a.start.localeCompare(b.start)
                    );
                    const first = sorted[0];
                    const last = sorted[sorted.length - 1];
                    return `${first.start} - ${last.end}`;
                  })()}
                </Text>
              </>
            ) : (
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                Not selected
              </Text>
            )}
          </View>

          <View style={S.dottedDivider} />

          <View style={S.bookingButton}>
            <Text style={S.bookingButtonText}>Previous</Text>
            <Text style={S.bookingButtonValue}>{formatDate(apptInfo?.appointment_date)}</Text>
            <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '600', marginTop: 2 }}>
              {formatTimeSlot(apptInfo?.start_time, apptInfo?.end_time)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            S.bookBtn,
            (!formStates?.selectedSlot ||
              formStates.selectedSlot.length === 0 ||
              reschedulePending) &&
              S.bookBtnDisabled,
          ]}
          disabled={
            !formStates?.selectedSlot || formStates.selectedSlot.length === 0 || reschedulePending
          }
          onPress={handleConfirmReschedule}
          activeOpacity={0.85}
        >
          <Text style={S.bookBtnText}>Confirm Reschedule</Text>
        </TouchableOpacity>
      </ScrollView>

      <AppointmentCalendarModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        selectedDate={formStates?.selectedDate}
        onSelectDate={dateStr => {
          setFormStates(prev => ({
            ...prev,
            selectedDate: dateStr,
            selectedSlot: null,
          }));
        }}
        availableDateStrings={availableDateStrings}
      />
    </SafeAreaWrapper>
  );
};

export default RescheduleAppointmentScreen;
