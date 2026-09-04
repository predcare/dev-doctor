import React, { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useMyPatientList } from '../../../hooks/react-query/patients/patients.hooks';
import { theme } from '../../../styled/theme.styled';
import type { IMyPatientDoc } from '../../../typescripts/interfaces/patients.interfaces';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import PatientSkeleton from '../../Skeletons/PatientSkeleton';
import { SearchIcon } from '../../ui/icons';
import CommonErrorCard from '../CommonErrorCard/CommonErrorCard';

export interface SelectablePatient {
  id: number | string;
  name: string;
  patient_id?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  age_display?: string;
}

export interface SelectPatientModalProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
  onSelectPatient: (patient: SelectablePatient) => void;
}

export const SelectPatientModal: React.FC<SelectPatientModalProps> = ({
  visible,
  title = 'Select Patient',
  onClose,
  onSelectPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { userData } = useAuthStore(state => state);

  const {
    data: patientsList,
    isFetching: isPendingPatientsList,
    isError: isErrorPatientsList,
    refetch: refetchPatientsList,
  } = useMyPatientList({
    doctorId: visible && userData?.user_id ? userData?.user_id : undefined,
  });

  const patients = useMemo(() => {
    if (!Array.isArray(patientsList)) return [];
    return patientsList as IMyPatientDoc[];
  }, [patientsList]);

  const filteredPatients = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return patients;
    return patients.filter(
      p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.phone_number && p.phone_number.includes(q)) ||
        (p.patient_id && p.patient_id.toLowerCase().includes(q))
    );
  }, [patients, searchQuery]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.searchBox}>
            <SearchIcon size={16} color={theme.colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search patient by name, ID or phone..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {isPendingPatientsList ? (
            <PatientSkeleton />
          ) : isErrorPatientsList ? (
            <View style={styles.centerContainer}>
              <CommonErrorCard
                title="Failed to Load Patients"
                message="Could not load your patient list. Please try again."
                onRetry={refetchPatientsList}
              />
            </View>
          ) : filteredPatients.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyTitle}>No patients found</Text>
              <Text style={styles.emptySub}>
                {searchQuery ? 'Try adjusting your search term.' : 'No patients available.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredPatients}
              keyExtractor={item => String(item.id)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const initials = (item.name || 'P').substring(0, 2).toUpperCase();
                return (
                  <View style={styles.patientRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarTxt}>{initials}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.patientName}>{item.name}</Text>
                      <Text style={styles.patientSub}>
                        {item.patient_id || `ID: ${item.id}`}
                        {item.phone_number ? ` • ${item.phone_number}` : ''}
                        {item.email ? ` • ${item.email}` : ''}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.selectBtn}
                      onPress={() => {
                        onSelectPatient({
                          id: item.user_id,
                          name: item.name,
                          email: item.email,
                          phone_number: item.phone_number,
                          gender: item.gender,
                          age_display: item.age_display,
                        });
                        onClose();
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.selectBtnTxt}>Select</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SelectPatientModal;

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
    maxHeight: '82%',
    height: '75%',
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTxt: {
    fontSize: 14,
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
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.dark,
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.dark,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  patientSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  selectBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  selectBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.surface,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.bg,
  },
});
