import React, { useLayoutEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { CheckIcon } from '../../../../components/ui/icons';
import theme from '../../../../styled/theme.styled';

export interface OptionPickerModalProps {
  visible: boolean;
  title: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export const OptionPickerModal: React.FC<OptionPickerModalProps> = ({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}) => {
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const pick = (opt: string) => {
    if (opt === 'Custom') {
      setCustomMode(true);
      if (!selected || options.includes(selected)) {
        setCustomValue('');
      }
      return;
    }
    onSelect(opt);
    onClose();
  };

  const saveCustom = () => {
    const next = customValue.trim();
    if (!next) return;
    onSelect(next);
    onClose();
  };

  const canSave = customValue.trim().length > 0;
  const presetOptions = options.filter(opt => opt !== 'Custom');
  const isCustomSelected = Boolean(selected) && !presetOptions.includes(selected ?? '');
  const isSelected = (opt: string) => (opt === 'Custom' ? isCustomSelected : selected === opt);

  useLayoutEffect(() => {
    if (!visible) return;
    const current = selected ?? '';
    const isCustomValue = current.length > 0 && !options.includes(current);
    setCustomMode(isCustomValue);
    setCustomValue(isCustomValue ? current : '');
  }, [visible, selected, options]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.header}>
                {customMode ? (
                  <TouchableOpacity
                    onPress={() => setCustomMode(false)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.backText}>← Back</Text>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.closeBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeTxt}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.title}>{title}</Text>

              {customMode ? (
                <>
                  <Text style={styles.hint}>Enter a value that is not in the list.</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Custom Value"
                    placeholderTextColor={theme.colors.textMuted}
                    value={customValue}
                    onChangeText={setCustomValue}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={saveCustom}
                  />
                  <TouchableOpacity
                    style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
                    onPress={saveCustom}
                    activeOpacity={0.85}
                    disabled={!canSave}
                  >
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.optionList}>
                  {options.map(opt => {
                    const selectedOpt = isSelected(opt);
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => pick(opt)}
                        style={[styles.option, selectedOpt && styles.optionSelected]}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.optionText, selectedOpt && styles.optionTextSelected]}>
                          {opt}
                        </Text>
                        {selectedOpt ? <CheckIcon size={16} color={theme.colors.primary} /> : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.textSlate,
    marginTop: -4,
    marginBottom: 12,
  },
  optionList: {
    gap: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionSelected: {
    backgroundColor: theme.colors.primarySoft,
  },
  optionText: {
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  backText: {
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceSecondary,
  },
  closeTxt: {
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 15,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: 14,
  },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.45,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverted,
  },
});

export default OptionPickerModal;
