import React, { useState } from 'react';
import {
  FlatList,
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
import { showSuccessToast } from '../../lib/common/toast.utils';
import {
  MOCK_AVAILABLE_DATES,
  MOCK_PATIENTS,
  MOCK_SLOTS_BY_PERIOD,
  MockAvailableDate,
  MockPatient,
  MockTimeSlot,
} from '../../resources/mockData';
import type { BookAppointmentScreenProps } from '../../route';
import { bookAppointmentStyles as S, TEAL } from '../../styled/BookAppointmentScreen.styled';

const ChevronLeftIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={TEAL}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

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

const PERIOD_ORDER = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];

export const BookAppointmentScreen: React.FC<BookAppointmentScreenProps> = ({ navigation }) => {
  const [selectedPatient, setSelectedPatient] = useState<MockPatient | null>(MOCK_PATIENTS[0]);
  const [consultationType, setConsultationType] = useState<'clinic' | 'video'>('clinic');
  const [selectedDateObj, setSelectedDateObj] = useState<MockAvailableDate | null>(
    MOCK_AVAILABLE_DATES[0]
  );
  const [selectedDate, setSelectedDate] = useState<string>(MOCK_AVAILABLE_DATES[0].date);
  const [selectedSlots, setSelectedSlots] = useState<MockTimeSlot[]>([]);
  const [reason, setReason] = useState('');

  // Modals visibility
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');

  const appointmentFee =
    consultationType === 'video'
      ? selectedDateObj?.video_fee || 300
      : selectedDateObj?.in_person_fee || 500;

  const filteredPatients = MOCK_PATIENTS.filter(
    p =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.patientId.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.phone.includes(patientSearch)
  );

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleBookAppointment = () => {
    showSuccessToast(
      `Appointment booked for ${selectedPatient?.name} on ${selectedDateObj?.formattedDate}`,
      'Booking Confirmed'
    );
    navigation?.goBack();
  };

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity style={S.backButton} onPress={() => navigation?.goBack()}>
          <ChevronLeftIcon />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Book Appointment</Text>
      </View>

      <ScrollView style={S.scrollView} showsVerticalScrollIndicator={false}>
        <View style={S.content}>
          {/* STEP 1: Select Patient */}
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
                    {selectedPatient.name} ({selectedPatient.patientId})
                  </Text>
                ) : (
                  <Text style={S.placeholderText}>Select a patient</Text>
                )}
                <Text style={S.selectButtonIcon}>▼</Text>
              </View>
            </TouchableOpacity>

            {selectedPatient && (
              <View style={S.patientInfo}>
                <Text style={S.patientInfoText}>
                  👤 {selectedPatient.gender}, {selectedPatient.age}
                </Text>
                <Text style={S.patientInfoText}>📞 {selectedPatient.phone}</Text>
              </View>
            )}
          </View>

          {/* STEP 2: Consultation Type */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>2. Consultation Type</Text>
            <View style={S.typeRow}>
              <TouchableOpacity
                style={[S.typeButton, consultationType === 'clinic' && S.typeButtonActive]}
                onPress={() => {
                  setConsultationType('clinic');
                  setSelectedSlots([]);
                }}
                activeOpacity={0.8}
              >
                <Text style={S.typeButtonIcon}>🏥</Text>
                <Text
                  style={[
                    S.typeButtonText,
                    consultationType === 'clinic' && S.typeButtonTextActive,
                  ]}
                >
                  In-Clinic
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[S.typeButton, consultationType === 'video' && S.typeButtonActive]}
                onPress={() => {
                  setConsultationType('video');
                  setSelectedSlots([]);
                }}
                activeOpacity={0.8}
              >
                <Text style={S.typeButtonIcon}>📹</Text>
                <Text
                  style={[S.typeButtonText, consultationType === 'video' && S.typeButtonTextActive]}
                >
                  Video Call
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* STEP 3: Select Date */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>3. Select Date</Text>
            <TouchableOpacity
              style={S.selectButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <View style={S.selectButtonContent}>
                {selectedDateObj ? (
                  <Text style={S.selectedText}>📅 {selectedDateObj.formattedDate}</Text>
                ) : (
                  <Text style={S.placeholderText}>Select appointment date</Text>
                )}
                <Text style={S.selectButtonIcon}>▼</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* STEP 4: Select Time Slot(s) */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>4. Select Time Slot</Text>

            {/* Legend */}
            <View style={S.legendRow}>
              <View style={S.legendItem}>
                <View
                  style={[S.legendDot, { backgroundColor: '#EBEBEB', borderColor: '#C8D8D8' }]}
                />
                <Text style={S.legendText}>Available</Text>
              </View>
              <View style={S.legendItem}>
                <View style={[S.legendDot, { backgroundColor: '#FFFFFF', borderColor: TEAL }]} />
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

            {/* Selected slots summary box */}
            {selectedSlots.length > 0 &&
              (() => {
                const sorted = [...selectedSlots].sort((a, b) => a.start.localeCompare(b.start));
                return (
                  <View style={S.slotSummaryBox}>
                    <Text style={S.slotSummaryText}>
                      <Text style={{ fontWeight: '700' }}>
                        {selectedSlots.length} Slot{selectedSlots.length > 1 ? 's' : ''} Selected
                      </Text>{' '}
                      ({formatTime(sorted[0].start)} → {formatTime(sorted[sorted.length - 1].end)})
                    </Text>
                    <TouchableOpacity onPress={() => setSelectedSlots([])}>
                      <Text style={S.slotClearText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                );
              })()}

            {/* Period-Grouped Slots */}
            {PERIOD_ORDER.map(period => {
              const periodSlots = MOCK_SLOTS_BY_PERIOD[period];
              if (!periodSlots || periodSlots.length === 0) return null;

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
                      const isSelected = selectedSlots.some(s => s.start === slot.start);
                      const isBooked = slot.booked === true;

                      const handleSlotPress = () => {
                        if (isBooked) return;
                        if (isSelected) {
                          setSelectedSlots(prev => prev.filter(s => s.start !== slot.start));
                          return;
                        }
                        if (selectedSlots.length === 0) {
                          setSelectedSlots([slot]);
                          return;
                        }
                        const sorted = [...selectedSlots].sort((a, b) =>
                          a.start.localeCompare(b.start)
                        );
                        const first = sorted[0];
                        const last = sorted[sorted.length - 1];
                        const isBeforeFirst = slot.end === first.start;
                        const isAfterLast = slot.start === last.end;

                        if (isAfterLast || isBeforeFirst) {
                          setSelectedSlots(prev => [...prev, slot]);
                        } else {
                          setSelectedSlots([slot]);
                        }
                      };

                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            S.slotButton,
                            isBooked && S.slotButtonBooked,
                            isSelected && S.slotButtonSelected,
                          ]}
                          onPress={handleSlotPress}
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
                            {formatTime(slot.start)} - {formatTime(slot.end)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>

          {/* STEP 5: Fee */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>5. Appointment Fee</Text>
            <View style={S.feeDisplay}>
              <Text style={S.feeLabel}>Consultation Fee</Text>
              <Text style={S.feeAmount}>₹{appointmentFee}</Text>
            </View>
            <Text style={S.feeNote}>
              {consultationType === 'video' ? 'Video consultation' : 'In-clinic consultation'} fee
            </Text>
          </View>

          {/* Reason for Visit */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>Reason for Visit (Optional)</Text>
            <TextInput
              style={S.input}
              placeholder="e.g., Follow-up, Routine Check-up"
              placeholderTextColor="#94A3B8"
              value={reason}
              onChangeText={setReason}
            />
          </View>

          {/* Book Button */}
          <TouchableOpacity
            style={[
              S.bookButton,
              (!selectedPatient || !selectedDate || selectedSlots.length === 0) &&
                S.bookButtonDisabled,
            ]}
            onPress={handleBookAppointment}
            disabled={!selectedPatient || !selectedDate || selectedSlots.length === 0}
            activeOpacity={0.85}
          >
            <Text style={S.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Patient Picker Modal */}
      <Modal visible={showPatientPicker} transparent animationType="slide">
        <View style={S.modalOverlay}>
          <View style={S.modalContent}>
            <View style={S.modalHeader}>
              <Text style={S.modalTitle}>Select Patient</Text>
              <TouchableOpacity onPress={() => setShowPatientPicker(false)}>
                <Text style={S.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={S.searchInput}
              placeholder="Search patient by name or ID..."
              placeholderTextColor="#94A3B8"
              value={patientSearch}
              onChangeText={setPatientSearch}
            />

            <FlatList
              data={filteredPatients}
              keyExtractor={item => item.id}
              style={S.patientList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={S.patientItem}
                  onPress={() => {
                    setSelectedPatient(item);
                    setShowPatientPicker(false);
                  }}
                >
                  <View style={[S.patientAvatar, { backgroundColor: item.avatarBgColor || TEAL }]}>
                    <Text style={S.patientAvatarText}>{item.name.charAt(0)}</Text>
                  </View>
                  <View style={S.patientDetails}>
                    <Text style={S.patientName}>{item.name}</Text>
                    <Text style={S.patientId}>
                      ID: {item.patientId} · {item.gender}, {item.age}
                    </Text>
                    <Text style={S.patientPhone}>{item.phone}</Text>
                  </View>
                  {selectedPatient?.id === item.id && <Text style={S.dateItemCheck}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={S.modalOverlay}>
          <View style={S.dateModalContent}>
            <View style={S.modalHeader}>
              <Text style={S.modalTitle}>Select Available Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={S.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={MOCK_AVAILABLE_DATES}
              keyExtractor={item => item.date}
              style={S.dateList}
              renderItem={({ item }) => {
                const isSelected = selectedDate === item.date;
                return (
                  <TouchableOpacity
                    style={[S.dateItem, isSelected && S.dateItemSelected]}
                    onPress={() => {
                      setSelectedDate(item.date);
                      setSelectedDateObj(item);
                      setShowDatePicker(false);
                    }}
                  >
                    <View style={S.dateItemContent}>
                      <Text style={S.dateItemIcon}>📅</Text>
                      <View style={S.dateItemText}>
                        <Text style={[S.dateItemDate, isSelected && S.dateItemDateSelected]}>
                          {item.formattedDate}
                        </Text>
                        <Text style={[S.dateItemType, isSelected && S.dateItemTypeSelected]}>
                          Fee: ₹{consultationType === 'video' ? item.video_fee : item.in_person_fee}
                        </Text>
                      </View>
                    </View>
                    {isSelected && <Text style={S.dateItemCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
};

export default BookAppointmentScreen;
