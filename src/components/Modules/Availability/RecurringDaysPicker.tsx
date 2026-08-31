import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../styled/theme.styled';

export interface RecurringDaysPickerProps {
  recurringDays: string[];
  startDate?: string | null;
  endDate?: string | null;
  onToggleDay: (dayKey: string) => void;
  onChangeStartDate?: (dateStr: string) => void;
  onChangeEndDate?: (dateStr: string) => void;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: (Date | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  return days;
};

const formatDateStr = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const RecurringDaysPicker: React.FC<RecurringDaysPickerProps> = React.memo(
  ({
    recurringDays,
    startDate,
    endDate,
    onToggleDay,
    onChangeStartDate,
    onChangeEndDate,
  }) => {
    const [modalState, setModalState] = useState<{
      visible: boolean;
      type?: 'start' | 'end';
    }>({ visible: false });

    const [calendarMonth, setCalendarMonth] = useState(new Date());

    const days = getDaysInMonth(calendarMonth);

    const prevMonth = () => {
      const nm = new Date(calendarMonth);
      nm.setMonth(calendarMonth.getMonth() - 1);
      setCalendarMonth(nm);
    };

    const nextMonth = () => {
      const nm = new Date(calendarMonth);
      nm.setMonth(calendarMonth.getMonth() + 1);
      setCalendarMonth(nm);
    };

    const handleSelectDate = (dateStr: string) => {
      if (modalState.type === 'start' && onChangeStartDate) {
        onChangeStartDate(dateStr);
      } else if (modalState.type === 'end' && onChangeEndDate) {
        onChangeEndDate(dateStr);
      }
      setModalState({ visible: false });
    };

    return (
      <View style={s.container}>
        {/* Date Range Selectors */}
        <View style={s.rangeRow}>
          <View style={s.rangeCell}>
            <Text style={s.label}>START DATE</Text>
            <TouchableOpacity
              style={s.dateBtn}
              onPress={() => setModalState({ visible: true, type: 'start' })}
              activeOpacity={0.7}
            >
              <Text style={startDate ? s.dateTxt : s.phTxt}>
                {startDate || 'Select Start Date'}
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>📅</Text>
            </TouchableOpacity>
          </View>

          <View style={s.rangeCell}>
            <Text style={s.label}>END DATE</Text>
            <TouchableOpacity
              style={s.dateBtn}
              onPress={() => setModalState({ visible: true, type: 'end' })}
              activeOpacity={0.7}
            >
              <Text style={endDate ? s.dateTxt : s.phTxt}>
                {endDate || 'Select End Date'}
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>📅</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Days of Week Pills */}
        <View style={{ marginTop: 12 }}>
          <Text style={s.label}>RECURRING DAYS</Text>
          <View style={s.daysRow}>
            {DAYS_OF_WEEK.map(d => {
              const isSel = recurringDays.includes(d.key);
              return (
                <TouchableOpacity
                  key={d.key}
                  style={[s.dayPill, isSel && s.dayPillSel]}
                  onPress={() => onToggleDay(d.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.dayPillTxt, isSel && s.dayPillTxtSel]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Calendar Picker Modal */}
        <Modal
          visible={modalState.visible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalState({ visible: false })}
        >
          <View style={s.modalOverlay}>
            <View style={s.modalCard}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>
                  Select {modalState.type === 'start' ? 'Start' : 'End'} Date
                </Text>
                <TouchableOpacity
                  onPress={() => setModalState({ visible: false })}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={s.modalCloseX}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Month Navigation */}
              <View style={s.calHeader}>
                <TouchableOpacity onPress={prevMonth} style={s.navBtn} activeOpacity={0.7}>
                  <Text style={s.navTxt}>◀</Text>
                </TouchableOpacity>
                <Text style={s.monthTitle}>
                  {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={nextMonth} style={s.navBtn} activeOpacity={0.7}>
                  <Text style={s.navTxt}>▶</Text>
                </TouchableOpacity>
              </View>

              {/* Weekday Headers */}
              <View style={s.weekRow}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <Text key={d} style={s.weekTxt}>{d}</Text>
                ))}
              </View>

              {/* Days Grid */}
              <View style={s.grid}>
                {days.map((day, idx) => {
                  if (!day) {
                    return <View key={`empty-${idx}`} style={s.dayCell} />;
                  }

                  const dateStr = formatDateStr(day);
                  const isSelected =
                    modalState.type === 'start' ? startDate === dateStr : endDate === dateStr;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPast = day < today;

                  return (
                    <TouchableOpacity
                      key={dateStr}
                      style={[s.dayCell, isPast && s.pastCell]}
                      onPress={() => {
                        if (!isPast) handleSelectDate(dateStr);
                      }}
                      disabled={isPast}
                      activeOpacity={0.7}
                    >
                      <View style={[s.dayInner, isSelected && s.daySelected]}>
                        <Text
                          style={[
                            s.dayTxt,
                            isSelected && s.dayTxtSelected,
                            isPast && s.dayTxtPast,
                          ]}
                        >
                          {day.getDate()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
);

const s = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginTop: 8,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rangeCell: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  dateBtn: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  dateTxt: {
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.dark,
  },
  phTxt: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  dayPill: {
    flex: 1,
    minWidth: 40,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  dayPillSel: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayPillTxt: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSlate,
  },
  dayPillTxtSel: {
    color: theme.colors.surface,
    fontWeight: theme.fontWeight.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 18,
    width: '92%',
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  modalCloseX: {
    fontSize: 18,
    color: theme.colors.textMuted,
    fontWeight: 'bold',
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTxt: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  weekRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  weekTxt: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  pastCell: {
    opacity: 0.3,
  },
  dayInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: theme.colors.primary,
  },
  dayTxt: {
    fontSize: 13,
    color: theme.colors.dark,
  },
  dayTxtSelected: {
    color: theme.colors.surface,
    fontWeight: theme.fontWeight.bold,
  },
  dayTxtPast: {
    color: theme.colors.textMuted,
  },
});

export default RecurringDaysPicker;
