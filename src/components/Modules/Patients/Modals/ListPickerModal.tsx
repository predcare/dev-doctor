import React from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../../../../styled/theme.styled';

export interface ListPickerProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  items: { id: number; name: string }[];
  selected: string;
  onPick: (item: { id: number; name: string }) => void;
  isLoading?: boolean;
}

export const ListPickerModal: React.FC<ListPickerProps> = React.memo(
  ({ visible, onClose, title, items, selected, onPick }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <View style={s.sheet}>
          <View style={s.sheetHead}>
            <Text style={s.sheetTitle}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={s.sheetX}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={items}
            keyExtractor={it => it.id.toString()}
            style={{ maxHeight: 420 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ padding: 32, alignItems: 'center' }}>
                <Text style={s.emptyTxt}>No options available</Text>
              </View>
            }
            renderItem={({ item: it }) => {
              const sel = it.name === selected;
              return (
                <TouchableOpacity
                  style={[s.opt, sel && s.optSel]}
                  onPress={() => {
                    onPick(it);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[s.optTxt, sel && s.optTxtSel]}>{it.name}</Text>
                  {sel && <Text style={s.tick}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  ),
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
  sheetX: { fontSize: 20, color: theme.colors.textMuted, fontWeight: 'bold' },
  emptyTxt: { fontSize: 14, color: theme.colors.textMuted },
  opt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
  },
  optSel: { backgroundColor: theme.colors.primarySoft },
  optTxt: { fontSize: 15, fontWeight: '500', color: theme.colors.dark },
  optTxtSel: { color: theme.colors.primary, fontWeight: theme.fontWeight.bold },
  tick: { fontSize: 18, color: theme.colors.primary, fontWeight: 'bold' },
});

export default ListPickerModal;
