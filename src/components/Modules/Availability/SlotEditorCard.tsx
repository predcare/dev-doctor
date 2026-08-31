import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../styled/theme.styled';
import RecurringDaysPicker from './RecurringDaysPicker';
import SlotCalendarPicker from './SlotCalendarPicker';
import TimeAndFeeConfig, { TimeValue } from './TimeAndFeeConfig';

export interface SlotEditorCardProps {
  slotIndex: number;
  activeTab: 'specific' | 'recurring' | 'leave';
  selectedDates: string[];
  recurringDays: string[];
  startDate?: string | null;
  endDate?: string | null;
  leaveDates: string[];
  fromTime: TimeValue;
  toTime: TimeValue;
  consultationType: 'in-person' | 'video' | 'both';
  slotDuration: number;
  inPersonFee: string;
  videoFee: string;
  hideFee?: boolean;
  requirePayment?: boolean;
  onToggleHideFee?: (val: boolean) => void;
  onToggleRequirePayment?: (val: boolean) => void;
  onChangeStartDate?: (dateStr: string) => void;
  onChangeEndDate?: (dateStr: string) => void;
  onTabChange: (tab: 'specific' | 'recurring' | 'leave') => void;
  onToggleDate: (dateStr: string) => void;
  onToggleLeaveDate: (dateStr: string) => void;
  onToggleRecurringDay: (dayKey: string) => void;
  onChangeFromTime: (field: keyof TimeValue, value: string) => void;
  onChangeToTime: (field: keyof TimeValue, value: string) => void;
  onChangeConsultationType: (type: 'in-person' | 'video' | 'both') => void;
  onChangeDuration: (dur: number) => void;
  onChangeInPersonFee: (fee: string) => void;
  onChangeVideoFee: (fee: string) => void;
  onRemoveSlot?: () => void;
}

export const SlotEditorCard: React.FC<SlotEditorCardProps> = React.memo(
  ({
    slotIndex,
    activeTab,
    selectedDates,
    recurringDays,
    startDate,
    endDate,
    leaveDates,
    fromTime,
    toTime,
    consultationType,
    slotDuration,
    inPersonFee,
    videoFee,
    hideFee,
    requirePayment,
    onToggleHideFee,
    onToggleRequirePayment,
    onChangeStartDate,
    onChangeEndDate,
    onTabChange,
    onToggleDate,
    onToggleLeaveDate,
    onToggleRecurringDay,
    onChangeFromTime,
    onChangeToTime,
    onChangeConsultationType,
    onChangeDuration,
    onChangeInPersonFee,
    onChangeVideoFee,
    onRemoveSlot,
  }) => {
    return (
      <View style={s.card}>
        {/* Editor Card Header */}
        <View style={s.cardHeader}>
          <Text style={s.slotTitle}>Slot Configuration #{slotIndex + 1}</Text>
          {onRemoveSlot && (
            <TouchableOpacity onPress={onRemoveSlot} style={s.removeBtn} activeOpacity={0.7}>
              <Text style={s.removeTxt}>✕ Remove</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Mode Tabs */}
        <View style={s.tabRow}>
          {(['specific', 'recurring', 'leave'] as const).map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[s.tab, isActive && s.tabActive]}
                onPress={() => onTabChange(tab)}
                activeOpacity={0.8}
              >
                <Text style={[s.tabTxt, isActive && s.tabTxtActive]}>
                  {tab === 'specific' ? 'Specific' : tab === 'recurring' ? 'Recurring' : 'Leave'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Mode Calendar / Schedule Config */}
        {activeTab === 'specific' && (
          <SlotCalendarPicker
            mode="specific"
            selectedDates={selectedDates}
            onToggleDate={onToggleDate}
          />
        )}

        {activeTab === 'recurring' && (
          <RecurringDaysPicker
            recurringDays={recurringDays}
            startDate={startDate}
            endDate={endDate}
            onToggleDay={onToggleRecurringDay}
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
          />
        )}

        {activeTab === 'leave' && (
          <SlotCalendarPicker
            mode="leave"
            selectedDates={leaveDates}
            onToggleDate={onToggleLeaveDate}
          />
        )}

        {/* Time, Mode, Duration & Fee Config */}
        <TimeAndFeeConfig
          fromTime={fromTime}
          toTime={toTime}
          consultationType={consultationType}
          slotDuration={slotDuration}
          inPersonFee={inPersonFee}
          videoFee={videoFee}
          hideFee={hideFee}
          requirePayment={requirePayment}
          onChangeFromTime={onChangeFromTime}
          onChangeToTime={onChangeToTime}
          onChangeConsultationType={onChangeConsultationType}
          onChangeDuration={onChangeDuration}
          onChangeInPersonFee={onChangeInPersonFee}
          onChangeVideoFee={onChangeVideoFee}
          onToggleHideFee={onToggleHideFee}
          onToggleRequirePayment={onToggleRequirePayment}
        />
      </View>
    );
  }
);

const s = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  slotTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
  },
  removeTxt: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.danger,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabTxt: {
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSlate,
  },
  tabTxtActive: {
    color: theme.colors.surface,
    fontWeight: theme.fontWeight.bold,
  },
});

export default SlotEditorCard;
