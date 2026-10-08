import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import PredDatePickerModal from '../../../../components/commons/PredDatePickerModal/PredDatePickerModal';
import { CalendarIcon } from '../../../../components/ui/icons';
import { prescriptionListStyles } from '../../../../styled/PrescriptionListScreen.styled';
import { IPrescriptionFilterState } from '../PrescritionScreen';

const TEAL = '#00897B';

export interface PrescriptionFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterState: IPrescriptionFilterState;
  updateFilterState: <K extends keyof IPrescriptionFilterState>(
    key: K,
    value: IPrescriptionFilterState[K]
  ) => void;
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

const dateRangeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'this_week' },
  { label: 'Current Month', value: 'current_month' },
  { label: 'Current Year', value: 'current_year' },
  { label: 'Custom', value: 'custom' },
];

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Completed', value: 'completed' },
];

export const PrescriptionFilterModal: React.FC<PrescriptionFilterModalProps> = ({
  visible,
  onClose,
  filterState,
  updateFilterState,
  onReset,
  onApply,
}) => {
  const insets = useSafeAreaInsets();
  const [datePickerTarget, setDatePickerTarget] = useState<'from' | 'to' | null>(null);

  const customFrom = filterState.from_date;
  const customTo = filterState.to_date;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={[prescriptionListStyles.filterOverlay, { paddingTop: insets.top }]}>
        <View style={[prescriptionListStyles.filterSheet, { paddingBottom: Math.max(16, insets.bottom + 8) }]}>
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
              {dateRangeOptions.map(d => (
                <TouchableOpacity
                  key={d.value}
                  style={[
                    prescriptionListStyles.radioRow,
                    filterState.date_filter === d.value && prescriptionListStyles.radioRowActive,
                  ]}
                  onPress={() => {
                    updateFilterState('date_filter', d.value);
                    if (d.value !== 'custom') setDatePickerTarget(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      prescriptionListStyles.radioTxt,
                      filterState.date_filter === d.value && prescriptionListStyles.radioTxtActive,
                    ]}
                  >
                    {d.label}
                  </Text>
                  <View
                    style={[
                      prescriptionListStyles.radio,
                      filterState.date_filter === d.value && prescriptionListStyles.radioSelected,
                    ]}
                  >
                    {filterState.date_filter === d.value && (
                      <View style={prescriptionListStyles.radioDot} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Date Pickers with PredDatePickerModal */}
            {filterState.date_filter === 'custom' && (
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
                    datePickerTarget === 'from' && { borderColor: TEAL },
                  ]}
                  onPress={() => setDatePickerTarget('from')}
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
                      onPress={() => updateFilterState('from_date', '')}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>✕</Text>
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>

                {/* TO Date */}
                <Text style={[prescriptionListStyles.dateLabel, { marginTop: 12 }]}>TO</Text>
                <TouchableOpacity
                  style={[
                    prescriptionListStyles.dateInput,
                    datePickerTarget === 'to' && { borderColor: TEAL },
                  ]}
                  onPress={() => setDatePickerTarget('to')}
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
                      onPress={() => updateFilterState('to_date', '')}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>✕</Text>
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>
              </View>
            )}

            {/* Prescription Status Section */}
            <View style={prescriptionListStyles.filterSection}>
              <View style={prescriptionListStyles.filterSectionHead}>
                <Text style={prescriptionListStyles.filterSectionTitle}>Prescription Status</Text>
                <Text style={prescriptionListStyles.filterSectionBadge}>SELECT ONE</Text>
              </View>
              <View style={prescriptionListStyles.statusGrid}>
                {statusOptions.map(s => (
                  <TouchableOpacity
                    key={s.value}
                    style={[
                      prescriptionListStyles.statusBtn,
                      filterState.status === s.value && prescriptionListStyles.statusBtnActive,
                    ]}
                    onPress={() => updateFilterState('status', s.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        prescriptionListStyles.statusBtnTxt,
                        filterState.status === s.value && prescriptionListStyles.statusBtnTxtActive,
                      ]}
                    >
                      {s.label}
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

      {/* Date Picker Modal */}
      {datePickerTarget !== null && (
        <PredDatePickerModal
          visible={datePickerTarget !== null}
          title={datePickerTarget === 'from' ? 'Select From Date' : 'Select To Date'}
          value={
            datePickerTarget === 'from'
              ? customFrom
                ? new Date(customFrom + 'T00:00:00')
                : new Date()
              : customTo
                ? new Date(customTo + 'T00:00:00')
                : new Date()
          }
          onConfirm={selectedDate => {
            if (datePickerTarget === 'from') {
              updateFilterState('from_date', fmtIsoString(selectedDate));
            } else if (datePickerTarget === 'to') {
              updateFilterState('to_date', fmtIsoString(selectedDate));
            }
            setDatePickerTarget(null);
          }}
          onCancel={() => setDatePickerTarget(null)}
        />
      )}
    </Modal>
  );
};

export default PrescriptionFilterModal;

