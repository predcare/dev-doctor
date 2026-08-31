import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../../../../styled/theme.styled';

export interface MockUserItem {
  id: number | string;
  name: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  date_of_birth?: string;
}

export interface UserPickerModalProps {
  visible: boolean;
  onClose: () => void;
  users?: MockUserItem[];
  isLoading?: boolean;
  onPick: (user: MockUserItem) => void;
}

const mockExistingUsers: MockUserItem[] = [
  {
    id: 101,
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone_number: '9845012345',
    gender: 'Female',
    date_of_birth: '1992-05-14',
  },
  {
    id: 102,
    name: 'Marcus Thorne',
    email: 'marcus.thorne@example.com',
    phone_number: '9876543210',
    gender: 'Male',
    date_of_birth: '1978-11-20',
  },
  {
    id: 103,
    name: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    phone_number: '9123456789',
    gender: 'Female',
    date_of_birth: '1997-03-08',
  },
  {
    id: 104,
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone_number: '9988776655',
    gender: 'Male',
    date_of_birth: '1974-08-30',
  },
  {
    id: 105,
    name: 'Rachel Adams',
    email: 'rachel.adams@example.com',
    phone_number: '9445566778',
    gender: 'Female',
    date_of_birth: '1985-01-12',
  },
  {
    id: 106,
    name: 'Arjun Patel',
    email: 'arjun.patel@example.com',
    phone_number: '9876541230',
    gender: 'Male',
    date_of_birth: '1987-09-25',
  },
  {
    id: 107,
    name: 'Priyanka Sharma',
    email: 'priyanka.s@example.com',
    phone_number: '9123487654',
    gender: 'Female',
    date_of_birth: '1995-12-05',
  },
];

export const UserPickerModal: React.FC<UserPickerModalProps> = React.memo(
  ({
    visible,
    onClose,
    users = mockExistingUsers,
    onPick,
  }) => {
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
      if (visible) {
        setSearchText('');
      }
    }, [visible]);

    const filteredUsers = useMemo(() => {
      if (!searchText.trim()) return users;
      const q = searchText.toLowerCase().trim();
      return users.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q) ||
          (u.phone_number || '').includes(q)
      );
    }, [users, searchText]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
          <View style={[s.sheet, { maxHeight: '85%' }]}>
            {/* Header */}
            <View style={s.sheetHead}>
              <Text style={s.sheetTitle}>Select Existing User</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={s.sheetX}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={s.userSearch}>
              <TextInput
                style={s.userSearchInput}
                placeholder="Search by name, email or phone…"
                placeholderTextColor={theme.colors.textMuted}
                value={searchText}
                onChangeText={setSearchText}
                autoCapitalize="none"
              />
            </View>

            {/* User List */}
            <FlatList
              data={filteredUsers}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={s.userRow}
                  onPress={() => {
                    onPick(item);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={s.userAvatar}>
                    <Text style={s.userAvatarTxt}>
                      {(item.name || '?')[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.userName}>{item.name}</Text>
                    <Text style={s.userSub} numberOfLines={1}>
                      {item.email || item.phone_number || 'No contact details'}
                    </Text>
                  </View>
                  <Text style={s.selectTxt}>Select</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 400 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={{ padding: 32, alignItems: 'center' }}>
                  <Text style={s.emptyTxt}>No matching users found</Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
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
  emptyTxt: { fontSize: 14, color: theme.colors.textMuted },
  userSearch: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  userSearchInput: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.dark,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarTxt: { fontSize: 17, fontWeight: theme.fontWeight.bold, color: theme.colors.surface },
  userName: { fontSize: 15, fontWeight: theme.fontWeight.bold, color: theme.colors.dark },
  userSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  selectTxt: { color: theme.colors.primary, fontSize: 13, fontWeight: theme.fontWeight.bold },
});

export default UserPickerModal;
