import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { invoiceListStyles as S } from '../../../styled/InvoiceListScreen.styled';
import { CalendarIcon } from '../../ui/icons';
import InvoiceCalendarModal from './InvoiceCalendarModal';

const TEAL = '#00897B';

export interface InvoiceFilterModalProps {
  visible: boolean;
  onClose: () => void;
  dateRange: 'Today' | 'This Week' | 'Current Month' | 'Current Year' | 'Custom';
  setDateRange: (
    range: 'Today' | 'This Week' | 'Current Month' | 'Current Year' | 'Custom'
  ) => void;
  customFrom: string;
  setCustomFrom: (dateIso: string) => void;
  customTo: string;
  setCustomTo: (dateIso: string) => void;
  statusFilter: Set<string>;
  toggleStatusFilter: (status: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const fmtDisplayDate = (s: string) => {
  if (!s) return '';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const InvoiceFilterModal: React.FC<InvoiceFilterModalProps> = ({
  visible,
  onClose,
  dateRange,
  setDateRange,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  statusFilter,
  toggleStatusFilter,
  onReset,
  onApply,
}) => {
  const [showCalendar, setShowCalendar] = useState<'from' | 'to' | null>(null);

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View style={S.filterOverlay}>
          <View style={S.filterSheet}>
            {/* Header */}
            <View style={S.filterHeader}>
              <TouchableOpacity onPress={onClose} style={S.closeBtn} activeOpacity={0.7}>
                <Text style={S.closeTxt}>✕</Text>
              </TouchableOpacity>
              <Text style={S.filterTitle}>Filter Invoices</Text>
              <TouchableOpacity onPress={onReset} activeOpacity={0.7}>
                <Text style={S.resetTxt}>Reset</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {/* Date Range Section */}
              <View style={S.filterSection}>
                <View style={S.filterSectionHead}>
                  <Text style={S.filterSectionTitle}>Date Range</Text>
                  <Text style={S.filterSectionBadge}>SELECT ONE</Text>
                </View>
                {(['Today', 'This Week', 'Current Month', 'Current Year'] as const).map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[S.radioRow, dateRange === d && S.radioRowActive]}
                    onPress={() => setDateRange(d)}
                    activeOpacity={0.7}
                  >
                    <Text style={[S.radioTxt, dateRange === d && S.radioTxtActive]}>{d}</Text>
                    <View style={[S.radio, dateRange === d && S.radioSelected]}>
                      {dateRange === d && <View style={S.radioDot} />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Range Section */}
              <View style={S.filterSection}>
                <View style={S.customHead}>
                  <View>
                    <Text style={S.filterSectionTitle}>Custom Range</Text>
                    <Text style={S.filterSectionSub}>Specify a unique billing window</Text>
                  </View>
                  <CalendarIcon size={32} color="#D1D5DB" />
                </View>

                {/* FROM Date Picker */}
                <Text style={S.dateLabel}>FROM</Text>
                <TouchableOpacity
                  style={S.dateInput}
                  onPress={() => {
                    setShowCalendar('from');
                    setDateRange('Custom');
                  }}
                  activeOpacity={0.7}
                >
                  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <Rect
                      x={1}
                      y={2}
                      width={14}
                      height={13}
                      rx={2}
                      stroke={TEAL}
                      strokeWidth={1.3}
                    />
                    <Path d="M1 6H15" stroke={TEAL} strokeWidth={1.3} />
                    <Path d="M5 1V4M11 1V4" stroke={TEAL} strokeWidth={1.3} strokeLinecap="round" />
                  </Svg>
                  <Text style={[S.dateInputTxt, !customFrom && { color: '#D1D5DB' }]}>
                    {customFrom ? fmtDisplayDate(customFrom) : 'Select Date'}
                  </Text>
                </TouchableOpacity>

                {/* TO Date Picker */}
                <Text style={[S.dateLabel, { marginTop: 12 }]}>TO</Text>
                <TouchableOpacity
                  style={S.dateInput}
                  onPress={() => {
                    setShowCalendar('to');
                    setDateRange('Custom');
                  }}
                  activeOpacity={0.7}
                >
                  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <Rect
                      x={1}
                      y={2}
                      width={14}
                      height={13}
                      rx={2}
                      stroke={TEAL}
                      strokeWidth={1.3}
                    />
                    <Path d="M1 6H15" stroke={TEAL} strokeWidth={1.3} />
                    <Path d="M5 1V4M11 1V4" stroke={TEAL} strokeWidth={1.3} strokeLinecap="round" />
                  </Svg>
                  <Text style={[S.dateInputTxt, !customTo && { color: '#D1D5DB' }]}>
                    {customTo ? fmtDisplayDate(customTo) : 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Invoice Status Section */}
              <View style={S.filterSection}>
                <View style={S.filterSectionHead}>
                  <Text style={S.filterSectionTitle}>Invoice Status</Text>
                  <Text style={S.filterSectionBadge}>MULTI-SELECT</Text>
                </View>
                <View style={S.statusGrid}>
                  {(['All', 'Paid', 'Pending', 'Overdue'] as const).map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[S.statusBtn, statusFilter.has(s) && S.statusBtnActive]}
                      onPress={() => toggleStatusFilter(s)}
                      activeOpacity={0.7}
                    >
                      <Text style={[S.statusBtnTxt, statusFilter.has(s) && S.statusBtnTxtActive]}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity onPress={onReset} style={S.resetRow} activeOpacity={0.7}>
                <Text style={S.resetRowTxt}>Reset Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity style={S.applyBtn} onPress={onApply} activeOpacity={0.85}>
                <Text style={S.applyBtnTxt}>Apply Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Picker Calendar Modal */}
      <InvoiceCalendarModal
        visible={!!showCalendar}
        onClose={() => setShowCalendar(null)}
        selectedDate={showCalendar === 'from' ? customFrom : customTo}
        onSelectDate={dateIso => {
          if (showCalendar === 'from') setCustomFrom(dateIso);
          else setCustomTo(dateIso);
        }}
      />
    </>
  );
};

export default InvoiceFilterModal;
