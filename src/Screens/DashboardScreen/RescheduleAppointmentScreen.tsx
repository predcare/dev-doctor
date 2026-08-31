import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Path from 'react-native-svg/src/elements/Path';
import Svg from 'react-native-svg/src/elements/Svg';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { showSuccessToast } from '../../lib/commons/toast.utils';
import {
  MOCK_APPOINTMENTS,
  MOCK_AVAILABLE_DATES,
  MOCK_SLOTS_BY_PERIOD,
  MockAppointment,
  MockTimeSlot,
} from '../../resources/mockData';
import type { RescheduleAppointmentScreenProps } from '../../route';
import { rescheduleAppointmentStyles as S } from '../../styled/RescheduleAppointmentScreen.styled';

const PERIOD_ORDER = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];

export const RescheduleAppointmentScreen: React.FC<RescheduleAppointmentScreenProps> = ({
  navigation,
  route,
}) => {
  const appointmentId = route?.params?.appointmentId ?? 101;
  const appointment: MockAppointment =
    MOCK_APPOINTMENTS.find(a => a.id === appointmentId) ?? MOCK_APPOINTMENTS[0];

  const [selectedDate, setSelectedDate] = useState<string>(MOCK_AVAILABLE_DATES[0].date);
  const [selectedSlot, setSelectedSlot] = useState<MockTimeSlot | null>(null);
  const [visitReason, setVisitReason] = useState<string>(appointment.reason || '');
  const [symptoms, setSymptoms] = useState<string>(appointment.symptoms || '');
  const [rescheduleReason, setRescheduleReason] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(2026, 7, 1)); // August 2026

  const handleConfirmReschedule = () => {
    if (!selectedSlot) return;
    showSuccessToast(
      `Appointment rescheduled to ${selectedDate} at ${selectedSlot.start}`,
      'Rescheduled'
    );
    navigation?.navigate('DoctorAppointments', { refresh: true });
  };

  const changeCalendarMonth = (offset: number) => {
    const next = new Date(calendarMonth);
    next.setMonth(next.getMonth() + offset);
    setCalendarMonth(next);
  };

  // Calendar days builder
  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayIndex = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `2026-08-${d < 10 ? '0' + d : d}`;
    const isAvailable = [18, 19, 20, 21, 22].includes(d);
    const isSelected = dateStr === selectedDate;
    const isToday = d === 18;
    calendarDays.push({ d, dateStr, isAvailable, isSelected, isToday });
  }

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={S.headerWrap}>
        <TouchableOpacity style={S.backPill} onPress={() => navigation?.goBack()}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18L9 12L15 6" stroke="#00685D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={S.headerTitle}>Reschedule</Text>
      </View>

      <ScrollView contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Current Appointment Box */}
        <View style={S.currentCard}>
          <Text style={S.cardLabel}>CURRENT APPOINTMENT DETAILS</Text>
          <View style={S.patientInfoRow}>
            <View style={S.avatarCircle}>
              <Text style={S.avatarText}>{appointment.patient_name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={S.patientName}>{appointment.patient_name}</Text>
              <Text style={S.patientSub}>
                {appointment.patient_gender} / {appointment.patient_age} · ID: {appointment.patient_record_id}
              </Text>
            </View>
          </View>

          <View style={S.divider} />

          <View style={S.detailRow}>
            <Text style={S.detailLabel}>Current Date & Time</Text>
            <Text style={S.detailValue}>
              {appointment.appointment_date} · {appointment.start_time} - {appointment.end_time}
            </Text>
          </View>

          <View style={S.detailRow}>
            <Text style={S.detailLabel}>Consultation Type</Text>
            <Text style={S.detailValue}>
              {appointment.consultation_type === 'video' ? '📹 Video Call' : '🏥 In-Clinic'}
            </Text>
          </View>
        </View>

        {/* 1. Select Date */}
        <Text style={S.sectionTitle}>Select New Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={S.dateStrip}>
            {MOCK_AVAILABLE_DATES.map(d => {
              const selected = d.date === selectedDate;
              return (
                <TouchableOpacity
                  key={d.date}
                  style={[S.dateCard, selected && S.dateCardActive]}
                  onPress={() => setSelectedDate(d.date)}
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

        {/* 2. Select New Time */}
        <Text style={S.sectionTitle}>Select New Time</Text>

        {PERIOD_ORDER.map(period => {
          const slots = MOCK_SLOTS_BY_PERIOD[period] || [];
          return (
            <View key={period} style={{ marginBottom: 14 }}>
              <Text style={S.periodHeader}>{period}</Text>
              <View style={S.slotsGrid}>
                {slots.map((slot, idx) => {
                  const isSelected = selectedSlot?.start === slot.start;
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
                      onPress={() => setSelectedSlot(slot)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          S.timeChipText,
                          isBooked && S.timeChipTextBooked,
                          isSelected && S.timeChipTextActive,
                        ]}
                      >
                        {slot.start} - {slot.end}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* 3. Visit Details Inputs */}
        <View style={{ marginTop: 10 }}>
          <Text style={S.fieldLabel}>Reason to Visit</Text>
          <TextInput
            style={S.fieldInput}
            multiline
            numberOfLines={2}
            placeholder="e.g. Chest pain, follow-up..."
            placeholderTextColor="#AABAB8"
            value={visitReason}
            onChangeText={setVisitReason}
          />

          <Text style={S.fieldLabel}>Symptoms</Text>
          <TextInput
            style={S.fieldInput}
            multiline
            numberOfLines={3}
            placeholder="Describe how you are feeling..."
            placeholderTextColor="#AABAB8"
            value={symptoms}
            onChangeText={setSymptoms}
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
            value={rescheduleReason}
            onChangeText={setRescheduleReason}
          />
        </View>

        {/* New Schedule vs Previous Summary Strip */}
        <View style={S.bookingButtonRow}>
          <View style={S.bookingButton}>
            <Text style={S.bookingButtonText}>New Schedule</Text>
            {selectedSlot ? (
              <>
                <Text style={S.bookingButtonValue}>{selectedDate}</Text>
                <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '600', marginTop: 2 }}>
                  {selectedSlot.start} - {selectedSlot.end}
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
            <Text style={S.bookingButtonValue}>{appointment.appointment_date}</Text>
            <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '600', marginTop: 2 }}>
              {appointment.start_time} - {appointment.end_time}
            </Text>
          </View>
        </View>

        {/* Confirm Reschedule Button */}
        <TouchableOpacity
          style={[S.bookBtn, !selectedSlot && S.bookBtnDisabled]}
          disabled={!selectedSlot}
          onPress={handleConfirmReschedule}
          activeOpacity={0.85}
        >
          <Text style={S.bookBtnText}>Confirm Reschedule</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal visible={showCalendar} animationType="slide" transparent onRequestClose={() => setShowCalendar(false)}>
        <View style={S.modalOverlay}>
          <View style={S.modalBox}>
            <View style={S.modalHead}>
              <Text style={S.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Text style={S.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={S.calendarInner}>
              <View style={S.calNav}>
                <TouchableOpacity style={S.calNavBtn} onPress={() => changeCalendarMonth(-1)}>
                  <Text style={S.calNavText}>‹</Text>
                </TouchableOpacity>
                <Text style={S.calMonthLabel}>August 2026</Text>
                <TouchableOpacity style={S.calNavBtn} onPress={() => changeCalendarMonth(1)}>
                  <Text style={S.calNavText}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={S.calWeekRow}>
                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
                  <Text key={d} style={S.calWeekDay}>{d}</Text>
                ))}
              </View>

              <View style={S.calGrid}>
                {calendarDays.map((item, idx) => {
                  if (!item) return <View key={`empty-${idx}`} style={S.calCell} />;
                  return (
                    <TouchableOpacity
                      key={item.dateStr}
                      disabled={!item.isAvailable}
                      style={[
                        S.calCell,
                        !item.isAvailable && S.calCellPast,
                        item.isAvailable && S.calCellAvail,
                        item.isToday && S.calCellToday,
                        item.isSelected && S.calCellSelected,
                      ]}
                      onPress={() => {
                        setSelectedDate(item.dateStr);
                        setShowCalendar(false);
                      }}
                    >
                      <Text
                        style={[
                          S.calCellText,
                          !item.isAvailable && S.calCellTextPast,
                          item.isAvailable && S.calCellTextAvail,
                          item.isToday && S.calCellTextToday,
                          item.isSelected && S.calCellTextSelected,
                        ]}
                      >
                        {item.d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={S.calLegend}>
                <View style={S.legendItem}>
                  <View style={[S.legendDot, { backgroundColor: '#00685D' }]} />
                  <Text style={S.legendText}>Available</Text>
                </View>
                <View style={S.legendItem}>
                  <View style={[S.legendDot, { backgroundColor: '#B2DFDB' }]} />
                  <Text style={S.legendText}>Unavailable</Text>
                </View>
                <View style={S.legendItem}>
                  <View style={[S.legendDot, { backgroundColor: '#00695C' }]} />
                  <Text style={S.legendText}>Today</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
};

export default RescheduleAppointmentScreen;
