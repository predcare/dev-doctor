import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { invoiceListStyles as S } from '../../../styled/InvoiceListScreen.styled';

export interface InvoiceCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (dateIso: string) => void;
}

const fmtIsoDate = (d: Date) => d.toISOString().split('T')[0];

const calDays = (month: Date): (Date | null)[] => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const days: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) days.push(null);
  for (let i = 1; i <= last.getDate(); i++)
    days.push(new Date(month.getFullYear(), month.getMonth(), i));
  return days;
};

export const InvoiceCalendarModal: React.FC<InvoiceCalendarModalProps> = ({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
}) => {
  const [calMonth, setCalMonth] = useState(new Date());

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={S.calOverlay}>
        <View style={S.calBox}>
          {/* Month Navigation Header */}
          <View style={S.calNavRow}>
            <TouchableOpacity
              style={S.calNavBtn}
              onPress={() => {
                const d = new Date(calMonth);
                d.setMonth(d.getMonth() - 1);
                setCalMonth(d);
              }}
            >
              <Text style={S.calNavTxt}>◀</Text>
            </TouchableOpacity>
            <Text style={S.calMonthTxt}>
              {calMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity
              style={S.calNavBtn}
              onPress={() => {
                const d = new Date(calMonth);
                d.setMonth(d.getMonth() + 1);
                setCalMonth(d);
              }}
            >
              <Text style={S.calNavTxt}>▶</Text>
            </TouchableOpacity>
          </View>

          {/* Weekday Headers */}
          <View style={S.calWeekRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <Text key={d} style={S.calWeekTxt}>
                {d}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={S.calDaysGrid}>
            {calDays(calMonth).map((day, i) => {
              if (!day) return <View key={`e${i}`} style={S.calDayCell} />;
              const ds = fmtIsoDate(day);
              const sel = selectedDate === ds;
              return (
                <TouchableOpacity
                  key={ds}
                  style={[S.calDayCell, sel && S.calDaySelected]}
                  onPress={() => {
                    onSelectDate(ds);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[S.calDayTxt, sel && S.calDayTxtSel]}>{day.getDate()}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={S.calCloseBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={S.calCloseTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default InvoiceCalendarModal;
