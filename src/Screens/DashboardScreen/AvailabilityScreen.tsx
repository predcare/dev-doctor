import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonEmptyCard from '../../components/commons/CommonEmptyCard/CommonEmptyCard';
import PopupAlert from '../../components/commons/PopupAlert/PopupAlert';
import ExistingSlotCard, {
  AvailabilitySlotItem,
} from '../../components/Modules/Availability/ExistingSlotCard';
import SlotEditorCard from '../../components/Modules/Availability/SlotEditorCard';
import { TimeValue } from '../../components/Modules/Availability/TimeAndFeeConfig';
import ChevronLeftIcon from '../../components/ui/icons/ChevronLeftIcon';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import type {
  ProfileScreenNavigationProp,
  ProfileScreenRouteProp,
} from '../../route';
import { availabilityStyles as S } from '../../styled/DoctorAvailabilityScreen.styled';
import { theme } from '../../styled/theme.styled';

export interface AvailabilityScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

const mockSlots: AvailabilitySlotItem[] = [
  {
    id: 1,
    date_selection_mode: 'specific',
    selected_dates: [
      '2026-08-15',
      '2026-08-16',
      '2026-08-20',
      '2026-08-22',
      '2026-08-25',
    ],
    recurring_days: [],
    leave_dates: ['2026-08-18'],
    from_time: '09:00 AM',
    to_time: '01:00 PM',
    consultation_type: 'both',
    slot_duration: 30,
    in_person_fee: 500,
    video_fee: 400,
  },
];

export const AvailabilityScreen: React.FC<AvailabilityScreenProps> = ({
  navigation,
}) => {
  const [existingSlots, setExistingSlots] =
    useState<AvailabilitySlotItem[]>(mockSlots);
  const [showExistingSlots, setShowExistingSlots] = useState(true);
  const [showNewSlotForm, setShowNewSlotForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editor State for Slot Form
  const [editorTab, setEditorTab] = useState<
    'specific' | 'recurring' | 'leave'
  >('specific');
  const [selectedDates, setSelectedDates] = useState<string[]>([
    '2026-08-28',
    '2026-08-29',
  ]);
  const [recurringDays, setRecurringDays] = useState<string[]>([
    'tuesday',
    'thursday',
  ]);
  const [startDate, setStartDate] = useState<string | null>('2026-09-01');
  const [endDate, setEndDate] = useState<string | null>('2026-12-31');
  const [leaveDates, setLeaveDates] = useState<string[]>([]);
  const [fromTime, setFromTime] = useState<TimeValue>({
    hour: '09',
    minute: '00',
    period: 'AM',
  });
  const [toTime, setToTime] = useState<TimeValue>({
    hour: '05',
    minute: '00',
    period: 'PM',
  });
  const [consultationType, setConsultationType] = useState<
    'in-person' | 'video' | 'both'
  >('in-person');
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [inPersonFee, setInPersonFee] = useState<string>('500');
  const [videoFee, setVideoFee] = useState<string>('400');
  const [hideFee, setHideFee] = useState<boolean>(false);
  const [requirePayment, setRequirePayment] = useState<boolean>(false);

  // Popup Alert State
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message?: string;
    onPress?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    onPress?: () => void,
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      onPress: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        if (onPress) onPress();
      },
    });
  };

  const handleToggleDate = (dateStr: string) => {
    setSelectedDates(prev =>
      prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr],
    );
  };

  const handleToggleLeaveDate = (dateStr: string) => {
    setLeaveDates(prev =>
      prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr],
    );
  };

  const handleToggleRecurringDay = (dayKey: string) => {
    setRecurringDays(prev =>
      prev.includes(dayKey)
        ? prev.filter(d => d !== dayKey)
        : [...prev, dayKey],
    );
  };

  const handleDeleteSlot = (id: number) => {
    setExistingSlots(prev => prev.filter(s => s.id !== id));
    showAlert('info', 'Slot Removed', 'Availability slot has been removed.');
  };

  const handleSave = (goBack: boolean) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (showNewSlotForm) {
        const newSlot: AvailabilitySlotItem = {
          id: Date.now(),
          date_selection_mode:
            editorTab === 'recurring' ? 'recurring' : 'specific',
          selected_dates: selectedDates,
          recurring_days: recurringDays.map(
            d => d.charAt(0).toUpperCase() + d.slice(1),
          ),
          leave_dates: leaveDates,
          from_time: `${fromTime.hour}:${fromTime.minute} ${fromTime.period}`,
          to_time: `${toTime.hour}:${toTime.minute} ${toTime.period}`,
          consultation_type: consultationType,
          slot_duration: slotDuration,
          in_person_fee: inPersonFee || '500',
          video_fee: videoFee || '400',
        };
        setExistingSlots(prev => [...prev, newSlot]);
        setShowNewSlotForm(false);
      }

      showAlert(
        'success',
        'Availability Saved ✅',
        'Doctor availability schedule updated successfully.',
        () => {
          if (goBack && navigation && navigation.canGoBack()) {
            navigation.goBack();
          }
        },
      );
    }, 600);
  };

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <View style={S.container}>
        {/* Header */}
        <View style={S.header}>
          <TouchableOpacity
            style={S.backBtn}
            onPress={() => {
              if (navigation && navigation.canGoBack()) navigation.goBack();
            }}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon color={theme.colors.textSecondary} size={18} />
          </TouchableOpacity>
          <Text style={S.headerTitle}>Doctor Availability</Text>
        </View>

        <ScrollView
          style={S.scroll}
          contentContainerStyle={S.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Existing Slots Accordion Header */}
          <TouchableOpacity
            style={S.sectionHeader}
            onPress={() => setShowExistingSlots(!showExistingSlots)}
            activeOpacity={0.75}
          >
            <Text style={S.sectionHeaderText}>
              Your Current Availability ({existingSlots.length})
            </Text>
            <Text style={S.sectionHeaderIcon}>
              {showExistingSlots ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {/* List of Existing Availability Slots */}
          {showExistingSlots && (
            <View>
              {existingSlots.length === 0 ? (
                <CommonEmptyCard
                  title="No Availability Slots"
                  message="You haven't added any clinical sessions yet. Tap '+ Add New Slot' to start accepting patient appointments."
                />
              ) : (
                existingSlots.map(slot => (
                  <ExistingSlotCard
                    key={slot.id}
                    slot={slot}
                    onEdit={() => {
                      setShowNewSlotForm(true);
                      setShowExistingSlots(false);
                    }}
                    onDelete={handleDeleteSlot}
                  />
                ))
              )}
            </View>
          )}

          {/* "+ Add New Slot" Toggle Button */}
          {!showNewSlotForm && (
            <TouchableOpacity
              style={S.addSlotBtn}
              onPress={() => {
                setShowNewSlotForm(true);
                setShowExistingSlots(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={S.addSlotBtnTxt}>+ Add New Slot</Text>
            </TouchableOpacity>
          )}

          {/* New / Edit Availability Slot Form Card */}
          {showNewSlotForm && (
            <SlotEditorCard
              slotIndex={existingSlots.length}
              activeTab={editorTab}
              selectedDates={selectedDates}
              recurringDays={recurringDays}
              startDate={startDate}
              endDate={endDate}
              leaveDates={leaveDates}
              fromTime={fromTime}
              toTime={toTime}
              consultationType={consultationType}
              slotDuration={slotDuration}
              inPersonFee={inPersonFee}
              videoFee={videoFee}
              hideFee={hideFee}
              requirePayment={requirePayment}
              onChangeStartDate={setStartDate}
              onChangeEndDate={setEndDate}
              onTabChange={setEditorTab}
              onToggleDate={handleToggleDate}
              onToggleLeaveDate={handleToggleLeaveDate}
              onToggleRecurringDay={handleToggleRecurringDay}
              onChangeFromTime={(field, value) =>
                setFromTime(prev => ({ ...prev, [field]: value }))
              }
              onChangeToTime={(field, value) =>
                setToTime(prev => ({ ...prev, [field]: value }))
              }
              onChangeConsultationType={setConsultationType}
              onChangeDuration={setSlotDuration}
              onChangeInPersonFee={setInPersonFee}
              onChangeVideoFee={setVideoFee}
              onToggleHideFee={setHideFee}
              onToggleRequirePayment={setRequirePayment}
              onRemoveSlot={() => setShowNewSlotForm(false)}
            />
          )}

          {/* Bottom Action Save & Cancel Buttons */}
          <View style={S.actionRow}>
            <TouchableOpacity
              style={[S.saveBtn, isSaving && { opacity: 0.6 }]}
              onPress={() => handleSave(false)}
              disabled={isSaving}
              activeOpacity={0.85}
            >
              {isSaving ? (
                <ActivityIndicator color={theme.colors.surface} />
              ) : (
                <Text style={S.saveBtnTxt}>💾 Save Availability</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={S.cancelBtn}
              onPress={() => {
                setShowNewSlotForm(false);
                setShowExistingSlots(true);
              }}
              activeOpacity={0.75}
            >
              <Text style={S.cancelBtnTxt}>✕ Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Popup Alert Modal */}
      <PopupAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onPress={alertConfig.onPress}
        onCancel={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
      />
    </SafeAreaWrapper>
  );
};

export default AvailabilityScreen;
