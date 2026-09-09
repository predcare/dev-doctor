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
  inPersonFeeError?: string;
  videoFeeError?: string;
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
    inPersonFeeError,
    videoFeeError,
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
        <TimeRangePicker
          fromTime={fromTime}
          toTime={toTime}
          onChangeFromTime={onChangeFromTime}
          onChangeToTime={onChangeToTime}
        />

        <View style={[s.sectionHeader, { marginTop: 14 }]}>
          <Text style={{ fontSize: 14, marginRight: 6 }}>💼</Text>
          <Text style={s.sectionTitle}>Consultation Type</Text>
        </View>
        <View style={s.radioGroup}>
          <TouchableOpacity
            style={[s.radioOption, consultationType === 'in-person' && s.radioOptionSelected]}
            onPress={() => onChangeConsultationType('in-person')}
            activeOpacity={0.8}
          >
            {consultationType === 'in-person' && (
              <View style={s.consultationCheckBadge}>
                <Text style={s.consultationCheckText}>✓</Text>
              </View>
            )}
            <Text style={s.radioOptionIcon}>🏥</Text>
            <Text style={[s.radioLabel, consultationType === 'in-person' && s.radioLabelSelected]}>
              In-Person
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.radioOption, consultationType === 'video' && s.radioOptionSelected]}
            onPress={() => onChangeConsultationType('video')}
            activeOpacity={0.8}
          >
            {consultationType === 'video' && (
              <View style={s.consultationCheckBadge}>
                <Text style={s.consultationCheckText}>✓</Text>
              </View>
            )}
            <Text style={s.radioOptionIcon}>📹</Text>
            <Text style={[s.radioLabel, consultationType === 'video' && s.radioLabelSelected]}>
              Video Call
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.radioOption, consultationType === 'both' && s.radioOptionSelected]}
            onPress={() => onChangeConsultationType('both')}
            activeOpacity={0.8}
          >
            {consultationType === 'both' && (
              <View style={s.consultationCheckBadge}>
                <Text style={s.consultationCheckText}>✓</Text>
              </View>
            )}
            <Text style={s.radioOptionIcon}>🏥📹</Text>
            <Text style={[s.radioLabel, consultationType === 'both' && s.radioLabelSelected]}>
              Both
            </Text>
          </TouchableOpacity>
        </View>
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
                <Text style={[s.durationItemTxt, slotDuration === d.value && s.durationItemTxtSel]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={[s.sectionHeader, { marginTop: 18 }]}>
          <Text style={{ fontSize: 14, marginRight: 6 }}>💳</Text>
          <Text style={s.sectionTitle}>Consultation Fee & Options</Text>
        </View>

        <View style={s.feeCardsContainer}>
          {(consultationType === 'in-person' || consultationType === 'both') && (
            <View style={s.feeCard}>
              <View style={s.feeCardHeader}>
                <View style={s.feeCardTitleRow}>
                  <Text style={s.feeCardIcon}>🏥</Text>
                  <Text style={s.feeCardTitle}>In-Person Consultation</Text>
                </View>
                <View style={s.inPersonBadge}>
                  <Text style={s.inPersonBadgeTxt}>In-Person Only</Text>
                </View>
              </View>

              <View style={s.feeInputGroup}>
                <Text style={s.feeLabel}>In-Person Fee (INR) {requirePayment ? '*' : ''}</Text>
                <TextInput
                  style={[
                    s.feeInput,
                    Boolean(inPersonFeeError) && { borderColor: theme.colors.danger },
                  ]}
                  value={inPersonFee}
                  onChangeText={onChangeInPersonFee}
                  keyboardType="numeric"
                  placeholder={requirePayment ? 'Enter in-person fee' : 'Enter in-person fee'}
                  placeholderTextColor={theme.colors.textMuted}
                />
                {Boolean(inPersonFeeError) && <Text style={s.errorText}>{inPersonFeeError}</Text>}
              </View>

              <View style={s.cardDivider} />

              <Text style={s.optionsSubheader}>In-Person Options</Text>

              {!requirePayment && (
                <View style={s.checkboxRow}>
                  <TouchableOpacity
                    style={s.checkbox}
                    onPress={() => onToggleHideFee && onToggleHideFee(!hideFee)}
                    activeOpacity={0.8}
                  >
                    <View style={[s.checkboxBox, hideFee && s.checkboxBoxChecked]}>
                      {hideFee && <Text style={s.checkmark}>✓</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.checkboxLabel}>Hide fee from patients</Text>
                      <Text style={s.checkboxHint}>
                        Don't display in-person fee on doctor profile
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {!hideFee && (
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
                    <View style={{ flex: 1 }}>
                      <Text style={s.checkboxLabel}>Require online payment</Text>
                      <Text style={s.checkboxHint}>
                        Patients must pay online during slot booking
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {(consultationType === 'video' || consultationType === 'both') && (
            <View style={s.feeCard}>
              <View style={s.feeCardHeader}>
                <View style={s.feeCardTitleRow}>
                  <Text style={s.feeCardIcon}>📹</Text>
                  <Text style={s.feeCardTitle}>Video Consultation</Text>
                </View>
              </View>

              <View style={s.feeInputGroup}>
                <Text style={s.feeLabel}>Video Fee (INR) *</Text>
                <TextInput
                  style={[
                    s.feeInput,
                    Boolean(videoFeeError) && { borderColor: theme.colors.danger },
                  ]}
                  value={videoFee}
                  onChangeText={onChangeVideoFee}
                  keyboardType="numeric"
                  placeholder="Enter video consultation fee"
                  placeholderTextColor={theme.colors.textMuted}
                />
                {Boolean(videoFeeError) && <Text style={s.errorText}>{videoFeeError}</Text>}
              </View>
            </View>
          )}
        </View>
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
  feeCardsContainer: {
    gap: 12,
  },
  feeCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    padding: 14,
  },
  feeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  feeCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feeCardIcon: {
    fontSize: 15,
  },
  feeCardTitle: {
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  inPersonBadge: {
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.tealBdr,
  },
  inPersonBadgeTxt: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  feeInputGroup: {
    marginBottom: 4,
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
  cardDivider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: 12,
  },
  optionsSubheader: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSlate,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  checkboxRow: {
    marginTop: 6,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.surfaceBorder,
    marginRight: 10,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
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
    fontWeight: '600',
  },
  checkboxHint: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});

export default TimeAndFeeConfig;
