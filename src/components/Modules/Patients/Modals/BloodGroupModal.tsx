import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../../../../styled/theme.styled';

export const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export interface BloodGroupModalProps {
  visible: boolean;
  selectedGroup: string;
  onSelect: (bg: string) => void;
  onClose: () => void;
  bloodGroups?: string[];
}

export const BloodGroupModal: React.FC<BloodGroupModalProps> = React.memo(
  ({
    visible,
    selectedGroup,
    onSelect,
    onClose,
    bloodGroups = BLOOD_GROUPS,
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={s.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={s.sheet}>
          <View style={s.sheetHead}>
            <Text style={s.sheetTitle}>Select Blood Group</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={s.sheetX}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ maxHeight: 420 }}
            keyboardShouldPersistTaps="handled"
          >
            {bloodGroups.map(bg => {
              const sel = selectedGroup === bg;
              return (
                <TouchableOpacity
                  key={bg}
                  style={[s.opt, sel && s.optSel]}
                  onPress={() => {
                    onSelect(bg);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[s.optTxt, sel && s.optTxtSel]}>{bg}</Text>
                  {sel && <Text style={s.tick}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  )
);

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
  },
  sheetHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  sheetX: {
    fontSize: 20,
    color: theme.colors.textMuted,
    fontWeight: 'bold',
  },
  opt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
  },
  optSel: {
    backgroundColor: theme.colors.primarySoft,
  },
  optTxt: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.dark,
  },
  optTxtSel: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  tick: {
    fontSize: 18,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default BloodGroupModal;
