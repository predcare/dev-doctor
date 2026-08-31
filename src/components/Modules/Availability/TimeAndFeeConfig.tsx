import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../styled/theme.styled';
import TimeRangePicker, { TimeValue } from './TimeRangePicker';

export type { TimeValue };

export interface TimeAndFeeConfigProps {
  fromTime: TimeValue;
  toTime: TimeValue;
  consultationType: 'in-person' | 'video' | 'both';
  slotDuration: number;
  inPersonFee: string;
  videoFee: string;
  hideFee?: boolean;
  requirePayment?: boolean;
  onChangeFromTime: (field: keyof TimeValue, value: string) => void;
  onChangeToTime: (field: keyof TimeValue, value: string) => void;
  onChangeConsultationType: (type: 'in-person' | 'video' | 'both') => void;
  onChangeDuration: (dur: number) => void;
  onChangeInPersonFee: (fee: string) => void;
  onChangeVideoFee: (fee: string) => void;
  onToggleHideFee?: (val: boolean) => void;
  onToggleRequirePayment?: (val: boolean) => void;
}

const DURATIONS = [
  { label: '5 minutes', value: 5 },
  { label: '10 minutes', value: 10 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '60 minutes', value: 60 },
];

export const TimeAndFeeConfig: React.FC<TimeAndFeeConfigProps> = React.memo(
  ({
    fromTime,
    toTime,
    consultationType,
    slotDuration,
    inPersonFee,
    videoFee,
    hideFee = false,
    requirePayment = false,
    onChangeFromTime,
    onChangeToTime,
    onChangeConsultationType,
    onChangeDuration,
    onChangeInPersonFee,
    onChangeVideoFee,
    onToggleHideFee,
    onToggleRequirePayment,
  }) => {
    const [showDurPicker, setShowDurPicker] = useState(false);

    return (
      <View style={s.container}>
        {/* ── 1. Time Range Section Component ── */}
        <TimeRangePicker
          fromTime={fromTime}
          toTime={toTime}
          onChangeFromTime={onChangeFromTime}
          onChangeToTime={onChangeToTime}
        />

        {/* ── 2. Consultation Type Radio Card Buttons ── */}
        <View style={[s.sectionHeader, { marginTop: 14 }]}>
          <Text style={{ fontSize: 14, marginRight: 6 }}>💼</Text>
          <Text style={s.sectionTitle}>Consultation Type</Text>
        </View>
        <View style={s.radioGroup}>
          {/* In-Person */}
          <TouchableOpacity
            style={[
              s.radioOption,
              consultationType === 'in-person' && s.radioOptionSelected,
            ]}
            onPress={() => onChangeConsultationType('in-person')}
            activeOpacity={0.8}
          >
            {consultationType === 'in-person' && (
              <View style={s.consultationCheckBadge}>
                <Text style={s.consultationCheckText}>✓</Text>
              </View>
            )}
            <Text style={s.radioOptionIcon}>🏥</Text>
            <Text
              style={[
                s.radioLabel,
                consultationType === 'in-person' && s.radioLabelSelected,
              ]}
            >
              In-Person
            </Text>
          </TouchableOpacity>

          {/* Video Call */}
          <TouchableOpacity
            style={[
              s.radioOption,
              consultationType === 'video' && s.radioOptionSelected,
            ]}
            onPress={() => onChangeConsultationType('video')}
            activeOpacity={0.8}
          >
            {consultationType === 'video' && (
              <View style={s.consultationCheckBadge}>
                <Text style={s.consultationCheckText}>✓</Text>
              </View>
            )}
            <Text style={s.radioOptionIcon}>📹</Text>
            <Text
              style={[
                s.radioLabel,
                consultationType === 'video' && s.radioLabelSelected,
              ]}
            >
              Video Call
            </Text>
          </TouchableOpacity>

          {/* Both */}
          <TouchableOpacity
            style={[
              s.radioOption,
              consultationType === 'both' && s.radioOptionSelected,
            ]}
            onPress={() => onChangeConsultationType('both')}
            activeOpacity={0.8}
          >
            {consultationType === 'both' && (
              <View style={s.consultationCheckBadge}>
                <Text style={s.consultationCheckText}>✓</Text>
              </View>
            )}
            <Text style={s.radioOptionIcon}>🏥📹</Text>
            <Text
              style={[
                s.radioLabel,
                consultationType === 'both' && s.radioLabelSelected,
              ]}
            >
              Both
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── 3. Slot Duration ── */}
        <View style={[s.sectionHeader, { marginTop: 18 }]}>
          <Text style={{ fontSize: 14, marginRight: 6 }}>⏱️</Text>
          <Text style={s.sectionTitle}>Slot Duration</Text>
        </View>
        <TouchableOpacity
          style={s.durationBtn}
          onPress={() => setShowDurPicker(!showDurPicker)}
          activeOpacity={0.7}
        >
          <Text style={s.durationBtnTxt}>
            {DURATIONS.find(d => d.value === slotDuration)?.label || `${slotDuration} minutes`}
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>⌄</Text>
        </TouchableOpacity>

        {showDurPicker && (
          <View style={s.durationMenu}>
            {DURATIONS.map(d => (
              <TouchableOpacity
                key={d.value}
                style={[s.durationItem, slotDuration === d.value && s.durationItemSel]}
                onPress={() => {
                  onChangeDuration(d.value);
                  setShowDurPicker(false);
                }}
              >
                <Text
                  style={[s.durationItemTxt, slotDuration === d.value && s.durationItemTxtSel]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── 4. Consultation Fees ── */}
        <View style={[s.sectionHeader, { marginTop: 18 }]}>
          <Text style={{ fontSize: 14, marginRight: 6 }}>💳</Text>
          <Text style={s.sectionTitle}>Consultation Fee</Text>
        </View>

        {(consultationType === 'in-person' || consultationType === 'both') && (
          <View style={s.feeInputGroup}>
            <Text style={s.feeLabel}>In-Person Fee (INR) *</Text>
            <TextInput
              style={s.feeInput}
              value={inPersonFee}
              onChangeText={onChangeInPersonFee}
              keyboardType="numeric"
              placeholder="Enter in-person consultation fee"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>
        )}

        {(consultationType === 'video' || consultationType === 'both') && (
          <View style={s.feeInputGroup}>
            <Text style={s.feeLabel}>Video Fee (INR) *</Text>
            <TextInput
              style={s.feeInput}
              value={videoFee}
              onChangeText={onChangeVideoFee}
              keyboardType="numeric"
              placeholder="Enter video consultation fee"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>
        )}

        {/* Hide fee checkbox */}
        {(consultationType === 'in-person' || consultationType === 'both') && (
          <View style={s.checkboxRow}>
            <TouchableOpacity
              style={s.checkbox}
              onPress={() => onToggleHideFee && onToggleHideFee(!hideFee)}
              activeOpacity={0.8}
            >
              <View style={[s.checkboxBox, hideFee && s.checkboxBoxChecked]}>
                {hideFee && <Text style={s.checkmark}>✓</Text>}
              </View>
              <Text style={s.checkboxLabel}>Hide fee from patients</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Require payment checkbox */}
        {(consultationType === 'in-person' || consultationType === 'both') && (
          <View style={s.checkboxRow}>
            <TouchableOpacity
              style={s.checkbox}
              onPress={() =>
                onToggleRequirePayment && onToggleRequirePayment(!requirePayment)
              }
              activeOpacity={0.8}
            >
              <View style={[s.checkboxBox, requirePayment && s.checkboxBoxChecked]}>
                {requirePayment && <Text style={s.checkmark}>✓</Text>}
              </View>
              <Text style={s.checkboxLabel}>Require online payment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
);

const s = StyleSheet.create({
  container: {
    marginTop: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  radioOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    position: 'relative',
    gap: 4,
  },
  radioOptionSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  radioOptionIcon: {
    fontSize: 20,
  },
  radioLabel: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSlate,
  },
  radioLabelSelected: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  consultationCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultationCheckText: {
    fontSize: 10,
    color: theme.colors.surface,
    fontWeight: '800',
  },
  durationBtn: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationBtnTxt: {
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.dark,
  },
  durationMenu: {
    marginTop: 6,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    overflow: 'hidden',
  },
  durationItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
  },
  durationItemSel: {
    backgroundColor: theme.colors.primarySoft,
  },
  durationItemTxt: {
    fontSize: 13,
    color: theme.colors.dark,
  },
  durationItemTxtSel: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  feeInputGroup: {
    marginBottom: 12,
  },
  feeLabel: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  feeInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.dark,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
  },
  checkboxRow: {
    marginTop: 6,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.surfaceBorder,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: '800',
  },
  checkboxLabel: {
    fontSize: 13,
    color: theme.colors.dark,
    fontWeight: '500',
  },
});

export default TimeAndFeeConfig;
