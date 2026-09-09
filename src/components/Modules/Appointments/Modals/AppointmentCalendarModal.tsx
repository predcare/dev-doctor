import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { rescheduleAppointmentStyles as S } from '../../../../styled/RescheduleAppointmentScreen.styled';

export interface AppointmentCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  availableDateStrings: string[];
}

export const AppointmentCalendarModal: React.FC<AppointmentCalendarModalProps> = ({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
  availableDateStrings = [],
}) => {
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    if (selectedDate) {
      const d = dayjs(selectedDate);
      if (d.isValid()) return d.toDate();
    }
    return new Date();
  });

  const availableSet = useMemo(() => {
    return new Set(availableDateStrings);
  }, [availableDateStrings]);

  const changeCalendarMonth = (offset: number) => {
    const next = new Date(calendarMonth);
    next.setMonth(next.getMonth() + offset);
    setCalendarMonth(next);
  };

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth(); // 0-indexed
  const monthLabel = dayjs(calendarMonth).format('MMMM YYYY');

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const todayStr = dayjs().format('YYYY-MM-DD');

  const calendarDays = useMemo(() => {
    const days: Array<{
      d: number;
      dateStr: string;
      isAvailable: boolean;
      isSelected: boolean;
      isToday: boolean;
    } | null> = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = dayjs(new Date(year, month, d)).format('YYYY-MM-DD');
      const isAvailable = availableSet.has(dateStr);
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === todayStr;

      days.push({
        d,
        dateStr,
        isAvailable,
        isSelected,
        isToday,
      });
    }

    return days;
  }, [year, month, daysInMonth, firstDayIndex, availableSet, selectedDate, todayStr]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={S.modalOverlay}>
        <View style={S.modalBox}>
          <View style={S.modalHead}>
            <Text style={S.modalTitle}>Select Available Date</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={S.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={S.calendarInner}>
            <View style={S.calNav}>
              <TouchableOpacity style={S.calNavBtn} onPress={() => changeCalendarMonth(-1)}>
                <Text style={S.calNavText}>‹</Text>
              </TouchableOpacity>
              <Text style={S.calMonthLabel}>{monthLabel}</Text>
              <TouchableOpacity style={S.calNavBtn} onPress={() => changeCalendarMonth(1)}>
                <Text style={S.calNavText}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={S.calWeekRow}>
              {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
                <Text key={d} style={S.calWeekDay}>
                  {d}
                </Text>
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
                      onSelectDate(item.dateStr);
                      onClose();
                    }}
                    activeOpacity={0.8}
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
                <View style={[S.legendDot, { backgroundColor: '#CBD5E1' }]} />
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
  );
};

export default AppointmentCalendarModal;
