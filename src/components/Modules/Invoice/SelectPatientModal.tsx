import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../../../styled/theme.styled';

export interface SelectablePatient {
  id: string;
  name: string;
  phone: string;
  age: string;
  gender: string;
}

interface SelectPatientModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPatient: (patient: SelectablePatient) => void;
}

export const SelectPatientModal: React.FC<SelectPatientModalProps> = ({
  visible,
  onClose,
  onSelectPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Static Patients Mock
  const mockPatients: SelectablePatient[] = [
    { id: 'PAT-1092', name: 'Eleanor Vance', phone: '+91 98765 43210', age: '34 yrs', gender: 'Female' },
    { id: 'PAT-1088', name: 'James Thornton', phone: '+91 98123 45678', age: '42 yrs', gender: 'Male' },
    { id: 'PAT-1074', name: 'Sophia Martinez', phone: '+91 97654 32109', age: '29 yrs', gender: 'Female' },
    { id: 'PAT-1065', name: 'Robert Chen', phone: '+91 99887 76655', age: '58 yrs', gender: 'Male' },
    { id: 'PAT-1051', name: 'Aisha Sharma', phone: '+91 91234 56789', age: '31 yrs', gender: 'Female' },
  ];

  const filteredPatients = mockPatients.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Patient for Invoice</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search patient by name or ID..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Patient Item List */}
          <FlatList
            data={filteredPatients}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.patientRow}
                onPress={() => {
                  onSelectPatient(item);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarTxt}>
                    {item.name.substring(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>{item.name}</Text>
                  <Text style={styles.patientMeta}>
                    {item.id} • {item.gender}, {item.age} • {item.phone}
                  </Text>
                </View>
                <Text style={styles.arrowRight}>›</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  closeBtn: {
    padding: 4,
  },
  closeTxt: {
    fontSize: 18,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginVertical: 12,
    height: 42,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.dark,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  patientMeta: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  arrowRight: {
    fontSize: 22,
    color: theme.colors.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.bg,
  },
});

export default SelectPatientModal;
