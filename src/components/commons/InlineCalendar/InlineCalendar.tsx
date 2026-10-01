import React, { useState } from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import theme from '../../../styled/theme.styled';
import { ChevronLeftIcon, ChevronRightIcon } from '../../ui/icons';
import S from './InlineCalendar.styled';

export interface InlineCalendarProps {
  selectedDate?: Date | null;
  onSelectDate: (date: Date) => void;
  initialMonth?: Date;
  style?: StyleProp<ViewStyle>;
}

const isSameDay = (d1: Date | null | undefined, d2: Date | null | undefined): boolean => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const getMonthCalendarDays = (monthDate: Date): (Date | null)[] => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
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

export const InlineCalendar: React.FC<InlineCalendarProps> = React.memo(
  ({ selectedDate, onSelectDate, initialMonth, style }) => {
    const [calMonth, setCalMonth] = useState<Date>(
      initialMonth || selectedDate || new Date(2026, 8, 1)
    );

    const handlePrevMonth = () => {
      const nm = new Date(calMonth);
      nm.setMonth(calMonth.getMonth() - 1);
      setCalMonth(nm);
    };

    const handleNextMonth = () => {
      const nm = new Date(calMonth);
      nm.setMonth(calMonth.getMonth() + 1);
      setCalMonth(nm);
    };

    const daysList = getMonthCalendarDays(calMonth);

    return (
      <View style={[S.inlineCalCard, style]}>
        {/* Navigation Header */}
        <View style={S.inlineCalHeader}>
          <TouchableOpacity
            onPress={handlePrevMonth}
            style={S.inlineCalNavBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeftIcon size={18} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={S.inlineCalMonthTitle}>
            {calMonth.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <TouchableOpacity
            onPress={handleNextMonth}
            style={S.inlineCalNavBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronRightIcon size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Weekday Row */}
        <View style={S.inlineCalWeekRow}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
            <Text key={w} style={S.inlineCalWeekTxt}>
              {w}
            </Text>
          ))}
        </View>

        {/* Days Grid */}
        <View style={S.inlineCalDaysGrid}>
          {daysList.map((day, idx) => {
            if (!day) {
              return <View key={`empty-${idx}`} style={S.inlineCalDayCell} />;
            }
            const isSelected = isSameDay(day, selectedDate);

            return (
              <TouchableOpacity
                key={day.toISOString()}
                style={S.inlineCalDayCell}
                onPress={() => onSelectDate(day)}
                activeOpacity={0.7}
              >
                <View style={[S.inlineCalDayInner, isSelected && S.inlineCalDaySelected]}>
                  <Text style={[S.inlineCalDayTxt, isSelected && S.inlineCalDayTxtSelected]}>
                    {day.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
);

InlineCalendar.displayName = 'InlineCalendar';
export default InlineCalendar;
