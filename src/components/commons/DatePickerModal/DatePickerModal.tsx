import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../styled/theme.styled';

interface DatePickerModalProps {
  visible: boolean;
  value?: Date | string | null;
  onChange: (date: Date) => void;
  onClose: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  value,
  onChange,
  onClose,
}) => {
  const initialString = value
    ? value instanceof Date
      ? value.toISOString().split('T')[0]
      : String(value)
    : '2000-01-01';

  const [selected, setSelected] = useState(initialString);

  const handleConfirm = () => {
    onChange(new Date(selected));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Select Date of Birth</Text>
          <Text style={styles.subtitle}>Current: {selected}</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default DatePickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 360,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 16,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelText: {
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: theme.colors.brandBlue,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmText: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
});
