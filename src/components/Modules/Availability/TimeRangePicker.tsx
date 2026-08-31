import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../styled/theme.styled';

export interface TimeValue {
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
}

export interface TimeRangePickerProps {
  fromTime: TimeValue;
  toTime: TimeValue;
  onChangeFromTime: (field: keyof TimeValue, value: string) => void;
  onChangeToTime: (field: keyof TimeValue, value: string) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export const TimeRangePicker: React.FC<TimeRangePickerProps> = React.memo(
  ({ fromTime, toTime, onChangeFromTime, onChangeToTime }) => {
    const [pickerModal, setPickerModal] = useState<{
      visible: boolean;
      target?: 'from_hour' | 'from_min' | 'to_hour' | 'to_min';
    }>({ visible: false });

    const handleSelectTimeValue = (val: string) => {
      if (pickerModal.target === 'from_hour') onChangeFromTime('hour', val);
      else if (pickerModal.target === 'from_min') onChangeFromTime('minute', val);
      else if (pickerModal.target === 'to_hour') onChangeToTime('hour', val);
      else if (pickerModal.target === 'to_min') onChangeToTime('minute', val);
      setPickerModal({ visible: false });
    };

    return (
      <View style={s.container}>
        {/* Section Header */}
        <View style={s.sectionHeader}>
          <Text style={{ fontSize: 14, marginRight: 6 }}>⏰</Text>
          <Text style={s.sectionTitle}>Time Range</Text>
        </View>

        {/* FROM row */}
        <Text style={s.timeLabel}>FROM</Text>
        <View style={s.timeDropdownRow}>
          <TouchableOpacity
            style={s.timeDropdownBox}
            onPress={() => setPickerModal({ visible: true, target: 'from_hour' })}
            activeOpacity={0.7}
          >
            <Text style={s.timeDropdownText}>{fromTime.hour}</Text>
            <Text style={s.timeDropdownChevron}>⌄</Text>
          </TouchableOpacity>

          <Text style={s.timeSeparator}>:</Text>

          <TouchableOpacity
            style={s.timeDropdownBox}
            onPress={() => setPickerModal({ visible: true, target: 'from_min' })}
            activeOpacity={0.7}
          >
            <Text style={s.timeDropdownText}>{fromTime.minute}</Text>
            <Text style={s.timeDropdownChevron}>⌄</Text>
          </TouchableOpacity>

          <View style={s.ampmGroup}>
            {(['AM', 'PM'] as const).map(p => (
              <TouchableOpacity
                key={p}
                style={[s.ampmBtn, fromTime.period === p && s.ampmBtnActive]}
                onPress={() => onChangeFromTime('period', p)}
                activeOpacity={0.75}
              >
                <Text style={[s.ampmBtnText, fromTime.period === p && s.ampmBtnTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* TO row */}
        <Text style={[s.timeLabel, { marginTop: 12 }]}>TO</Text>
        <View style={s.timeDropdownRow}>
          <TouchableOpacity
            style={s.timeDropdownBox}
            onPress={() => setPickerModal({ visible: true, target: 'to_hour' })}
            activeOpacity={0.7}
          >
            <Text style={s.timeDropdownText}>{toTime.hour}</Text>
            <Text style={s.timeDropdownChevron}>⌄</Text>
          </TouchableOpacity>

          <Text style={s.timeSeparator}>:</Text>

          <TouchableOpacity
            style={s.timeDropdownBox}
            onPress={() => setPickerModal({ visible: true, target: 'to_min' })}
            activeOpacity={0.7}
          >
            <Text style={s.timeDropdownText}>{toTime.minute}</Text>
            <Text style={s.timeDropdownChevron}>⌄</Text>
          </TouchableOpacity>

          <View style={s.ampmGroup}>
            {(['AM', 'PM'] as const).map(p => (
              <TouchableOpacity
                key={p}
                style={[s.ampmBtn, toTime.period === p && s.ampmBtnActive]}
                onPress={() => onChangeToTime('period', p)}
                activeOpacity={0.75}
              >
                <Text style={[s.ampmBtnText, toTime.period === p && s.ampmBtnTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selection Modal */}
        <Modal
          visible={pickerModal.visible}
          transparent
          animationType="fade"
          onRequestClose={() => setPickerModal({ visible: false })}
        >
          <TouchableOpacity
            style={s.modalOverlay}
            activeOpacity={1}
            onPress={() => setPickerModal({ visible: false })}
          >
            <View style={s.modalCard}>
              <Text style={s.modalTitle}>
                Select {pickerModal.target?.includes('hour') ? 'Hour' : 'Minute'}
              </Text>
              <View style={s.modalGrid}>
                {(pickerModal.target?.includes('hour') ? HOURS : MINUTES).map(item => (
                  <TouchableOpacity
                    key={item}
                    style={s.modalOptionBtn}
                    onPress={() => handleSelectTimeValue(item)}
                  >
                    <Text style={s.modalOptionTxt}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
);

const s = StyleSheet.create({
  container: {
    marginBottom: 10,
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
  timeLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  timeDropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeDropdownBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeDropdownText: {
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  timeDropdownChevron: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  ampmGroup: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 3,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
  },
  ampmBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ampmBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  ampmBtnText: {
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
  },
  ampmBtnTextActive: {
    color: theme.colors.surface,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  modalOptionBtn: {
    width: 50,
    height: 44,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionTxt: {
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
});

export default TimeRangePicker;
