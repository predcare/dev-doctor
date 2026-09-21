import React, { useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDebounce } from '../../../../hooks/commons/useDebounce';
import { useMyPatientList } from '../../../../hooks/react-query/patients/patients.hooks';
import { capitalize } from '../../../../lib/common/common.utils';
import { ISelectedPatients } from '../../../../Screens/DashboardScreen/BookAppointmentScreen';
import { bookAppointmentStyles as S } from '../../../../styled/BookAppointmentScreen.styled';
import theme from '../../../../styled/theme.styled';
import CommonEmptyCard from '../../../commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../../commons/CommonErrorCard/CommonErrorCard';
import { BookingPatientSkeleton } from '../../../Skeletons/BookingPatientSkeleton';

interface BookingPatientSelectModalProps {
  visible: boolean;
  onClose: () => void;
  selectedPatient: ISelectedPatients | null;
  onSelectPatient: (patient: ISelectedPatients) => void;
}

export const BookingPatientSelectModal: React.FC<BookingPatientSelectModalProps> = ({
  visible,
  onClose,
  selectedPatient,
  onSelectPatient,
}) => {
  const [patientSearch, setPatientSearch] = useState('');
  const debounceSearch = useDebounce(patientSearch?.trim(), 500);
  const {
    data: myPatients,
    isPending: myPatientPending,
    refetch: fetchPatientList,
    isError: isPatientError,
    error: patientError,
  } = useMyPatientList({
    limit: 100,
    page: 1,
    search: debounceSearch,
  });

  const renderEmptyState = () => {
    if (isPatientError && myPatients?.meta?.total === 0) {
      return (
        <CommonErrorCard
          title="Failed to Load Patients"
          message={
            (patientError as any)?.message || 'Could not fetch patient records. Please try again.'
          }
          onRetry={() => fetchPatientList()}
        />
      );
    }
    return (
      <CommonEmptyCard
        message=""
        title="No Patients Found"
        actionText="Reload Patients"
        onAction={fetchPatientList}
      />
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={S.modalOverlay}>
        <View style={S.modalContent}>
          <View style={S.modalHeader}>
            <Text style={S.modalTitle}>Select Patient</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={S.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={S.searchInput}
            placeholder="Search patient by name, email, phone or Id..."
            placeholderTextColor="#94A3B8"
            value={patientSearch}
            onChangeText={setPatientSearch}
            keyboardType="default"
          />

          {myPatientPending ? (
            <View style={S.patientList}>
              <BookingPatientSkeleton count={4} />
            </View>
          ) : (
            <FlatList
              data={myPatients?.data || []}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item, index) =>
                item.patient_id !== '0' ? item.patient_id : `item-${index}`
              }
              style={S.patientList}
              ListEmptyComponent={renderEmptyState}
              renderItem={({ item }) => {
                const isSelected = selectedPatient?.patientGenId === item.patient_id;
                return (
                  <TouchableOpacity
                    style={[S.patientItem, isSelected && S.patientItemSelected]}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelectPatient({
                        id: Number(item.id),
                        name: item.name,
                        patientGenId: item.patient_id,
                        Phone: Number(item.phone_number),
                        gender: item.gender,
                      });
                      onClose();
                    }}
                  >
                    <View style={[S.patientAvatar, { backgroundColor: theme.colors.primary }]}>
                      <Text style={S.patientAvatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                    </View>

                    <View style={S.patientDetails}>
                      <View style={S.patientHeaderRow}>
                        <Text style={S.patientName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {!!item.gender && (
                          <View style={S.patientBadge}>
                            <Text style={S.patientBadgeText}>{capitalize(item?.gender)}</Text>
                          </View>
                        )}
                      </View>
                      <View style={S.patientMetaRow}>
                        <Text style={S.patientId}>ID: {item.patient_id || ''}</Text>
                      </View>
                      {!!item.phone_number && (
                        <Text style={S.patientPhone}>📞 {item.phone_number}</Text>
                      )}
                    </View>
                    {isSelected && (
                      <View style={S.checkBadge}>
                        <Text style={S.checkBadgeText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default BookingPatientSelectModal;
