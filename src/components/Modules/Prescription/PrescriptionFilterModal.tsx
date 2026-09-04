import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import InlineCalendar from '../../../components/commons/InlineCalendar/InlineCalendar';
import { prescriptionListStyles } from '../../../styled/PrescriptionListScreen.styled';
import { CalendarIcon } from '../../ui/icons';

const TEAL = '#00897B';

export interface PrescriptionFilterModalProps {
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
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtIsoString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const PrescriptionFilterModal: React.FC<PrescriptionFilterModalProps> = ({
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
  const [activeTarget, setActiveTarget] = useState<'from' | 'to' | null>(null);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={prescriptionListStyles.filterOverlay}>
        <View style={prescriptionListStyles.filterSheet}>
          {/* Header */}
          <View style={prescriptionListStyles.filterHeader}>
            <TouchableOpacity
              onPress={onClose}
              style={prescriptionListStyles.closeBtn}
              activeOpacity={0.7}
            >
              <Text style={prescriptionListStyles.closeTxt}>✕</Text>
            </TouchableOpacity>
            <Text style={prescriptionListStyles.filterTitle}>Filter Prescriptions</Text>
            <TouchableOpacity onPress={onReset} activeOpacity={0.7}>
              <Text style={prescriptionListStyles.resetTxt}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Date Range Section */}
            <View style={prescriptionListStyles.filterSection}>
              <View style={prescriptionListStyles.filterSectionHead}>
                <Text style={prescriptionListStyles.filterSectionTitle}>Date Range</Text>
                <Text style={prescriptionListStyles.filterSectionBadge}>SELECT ONE</Text>
              </View>
              {(['Today', 'This Week', 'Current Month', 'Current Year', 'Custom'] as const).map(
                d => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      prescriptionListStyles.radioRow,
                      dateRange === d && prescriptionListStyles.radioRowActive,
                    ]}
                    onPress={() => {
                      setDateRange(d);
                      if (d !== 'Custom') setActiveTarget(null);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        prescriptionListStyles.radioTxt,
                        dateRange === d && prescriptionListStyles.radioTxtActive,
                      ]}
                    >
                      {d}
                    </Text>
                    <View
                      style={[
                        prescriptionListStyles.radio,
                        dateRange === d && prescriptionListStyles.radioSelected,
                      ]}
                    >
                      {dateRange === d && <View style={prescriptionListStyles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                )
              )}
            </View>

            {/* Custom Date Pickers with InlineCalendar */}
            {dateRange === 'Custom' && (
              <View style={prescriptionListStyles.filterSection}>
                <View style={prescriptionListStyles.customHead}>
                  <View>
                    <Text style={prescriptionListStyles.filterSectionTitle}>Custom Range</Text>
                    <Text style={prescriptionListStyles.filterSectionSub}>
                      Specify a custom prescription date window
                    </Text>
                  </View>
                  <CalendarIcon size={28} color="#9CA3AF" />
                </View>

                {/* FROM Date */}
                <Text style={prescriptionListStyles.dateLabel}>FROM</Text>
                <TouchableOpacity
                  style={[
                    prescriptionListStyles.dateInput,
                    activeTarget === 'from' && { borderColor: TEAL },
                  ]}
                  onPress={() => setActiveTarget(prev => (prev === 'from' ? null : 'from'))}
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
                  <Text
                    style={[
                      prescriptionListStyles.dateInputTxt,
                      !customFrom && { color: '#9CA3AF' },
                    ]}
                  >
                    {customFrom ? fmtDisplayDate(customFrom) : 'mm/dd/yyyy'}
                  </Text>
                  {customFrom ? (
                    <TouchableOpacity
                      onPress={() => setCustomFrom('')}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '700' }}>✕</Text>
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>

                {/* Inline Calendar for FROM */}
                {activeTarget === 'from' && (
                  <View style={{ paddingHorizontal: 14, marginVertical: 8 }}>
                    <InlineCalendar
                      selectedDate={customFrom ? new Date(customFrom + 'T00:00:00') : null}
                      onSelectDate={d => {
                        setCustomFrom(fmtIsoString(d));
                        setActiveTarget('to');
                      }}
                      initialMonth={customFrom ? new Date(customFrom + 'T00:00:00') : new Date()}
                    />
                  </View>
                )}

                {/* TO Date */}
                <Text style={[prescriptionListStyles.dateLabel, { marginTop: 12 }]}>TO</Text>
                <TouchableOpacity
                  style={[
                    prescriptionListStyles.dateInput,
                    activeTarget === 'to' && { borderColor: TEAL },
                  ]}
                  onPress={() => setActiveTarget(prev => (prev === 'to' ? null : 'to'))}
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
                  <Text
                    style={[prescriptionListStyles.dateInputTxt, !customTo && { color: '#9CA3AF' }]}
                  >
                    {customTo ? fmtDisplayDate(customTo) : 'mm/dd/yyyy'}
                  </Text>
                  {customTo ? (
                    <TouchableOpacity
                      onPress={() => setCustomTo('')}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '700' }}>✕</Text>
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>

                {/* Inline Calendar for TO */}
                {activeTarget === 'to' && (
                  <View style={{ paddingHorizontal: 14, marginVertical: 8 }}>
                    <InlineCalendar
                      selectedDate={customTo ? new Date(customTo + 'T00:00:00') : null}
                      onSelectDate={d => {
                        setCustomTo(fmtIsoString(d));
                        setActiveTarget(null);
                      }}
                      initialMonth={customTo ? new Date(customTo + 'T00:00:00') : new Date()}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Prescription Status Section */}
            <View style={prescriptionListStyles.filterSection}>
              <View style={prescriptionListStyles.filterSectionHead}>
                <Text style={prescriptionListStyles.filterSectionTitle}>Prescription Status</Text>
                <Text style={prescriptionListStyles.filterSectionBadge}>MULTI-SELECT</Text>
              </View>
              <View style={prescriptionListStyles.statusGrid}>
                {(['All', 'Draft', 'Sent', 'Active'] as const).map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      prescriptionListStyles.statusBtn,
                      statusFilter.has(s) && prescriptionListStyles.statusBtnActive,
                    ]}
                    onPress={() => toggleStatusFilter(s)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        prescriptionListStyles.statusBtnTxt,
                        statusFilter.has(s) && prescriptionListStyles.statusBtnTxtActive,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={onReset}
              style={prescriptionListStyles.resetRow}
              activeOpacity={0.7}
            >
              <Text style={prescriptionListStyles.resetRowTxt}>Reset Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={prescriptionListStyles.applyBtn}
              onPress={onApply}
              activeOpacity={0.85}
            >
              <Text style={prescriptionListStyles.applyBtnTxt}>Apply Filters</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PrescriptionFilterModal;
