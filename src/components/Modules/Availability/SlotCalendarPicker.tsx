import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../styled/theme.styled';

export interface SlotCalendarPickerProps {
  mode: 'specific' | 'leave';
  selectedDates: string[];
  onToggleDate: (dateStr: string) => void;
}

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

const formatChipDate = (dateStr: string): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

export const SlotCalendarPicker: React.FC<SlotCalendarPickerProps> = React.memo(
  ({ mode, selectedDates, onToggleDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const days = getDaysInMonth(currentMonth);

    const prevMonth = () => {
      const nm = new Date(currentMonth);
      nm.setMonth(currentMonth.getMonth() - 1);
      setCurrentMonth(nm);
    };

    const nextMonth = () => {
      const nm = new Date(currentMonth);
      nm.setMonth(currentMonth.getMonth() + 1);
      setCurrentMonth(nm);
    };

    return (
      <View style={s.calendarContainer}>
        {/* Month Header Navigation */}
        <View style={s.header}>
          <TouchableOpacity onPress={prevMonth} style={s.navBtn} activeOpacity={0.7}>
            <Text style={s.navTxt}>◀</Text>
          </TouchableOpacity>
          <Text style={s.monthTitle}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={s.navBtn} activeOpacity={0.7}>
            <Text style={s.navTxt}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Week Days Header */}
        <View style={s.weekRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <Text key={d} style={s.weekTxt}>{d}</Text>
          ))}
        </View>

        {/* Calendar Days Grid */}
        <View style={s.grid}>
          {days.map((day, idx) => {
            if (!day) {
              return <View key={`empty-${idx}`} style={s.dayCell} />;
            }

            const dateStr = formatDateStr(day);
            const isSelected = selectedDates.includes(dateStr);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPast = day < today;

            return (
              <TouchableOpacity
                key={dateStr}
                style={[s.dayCell, isPast && s.pastCell]}
                onPress={() => {
                  if (!isPast) onToggleDate(dateStr);
                }}
                disabled={isPast}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    s.dayInner,
                    isSelected && (mode === 'specific' ? s.daySelected : s.dayLeave),
                  ]}
                >
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

        {/* Selected Dates Chips Row */}
        {selectedDates.length > 0 && (
          <View style={s.chipsSection}>
            <Text style={s.chipsTitle}>
              {mode === 'specific' ? `Selected Dates (${selectedDates.length}):` : `Leave Dates (${selectedDates.length}):`}
            </Text>
            <View style={s.chipsRow}>
              {selectedDates.map(dateStr => (
                <TouchableOpacity
                  key={dateStr}
                  style={[s.chipPill, mode === 'leave' && s.chipPillLeave]}
                  onPress={() => onToggleDate(dateStr)}
                  activeOpacity={0.8}
                >
                  <Text style={s.chipTxt}>{formatChipDate(dateStr)}</Text>
                  <Text style={s.chipX}>✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  }
);

const s = StyleSheet.create({
  calendarContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
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
    paddingVertical: 8,
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
  dayLeave: {
    backgroundColor: theme.colors.danger,
  },
  dayTxt: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.dark,
  },
  dayTxtSelected: {
    color: theme.colors.surface,
    fontWeight: theme.fontWeight.bold,
  },
  dayTxtPast: {
    color: theme.colors.textMuted,
  },
  chipsSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.bg,
  },
  chipsTitle: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipPill: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipPillLeave: {
    backgroundColor: theme.colors.danger,
  },
  chipTxt: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
  },
  chipX: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: 'rgba(255,255,255,0.8)',
  },
});

export default SlotCalendarPicker;
