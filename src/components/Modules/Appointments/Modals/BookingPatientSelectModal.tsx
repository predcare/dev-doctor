import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  doctorId: string | number;
}

export const BookingPatientSelectModal: React.FC<BookingPatientSelectModalProps> = ({
  visible,
  onClose,
  selectedPatient,
  onSelectPatient,
  doctorId,
}) => {
  const [patientSearch, setPatientSearch] = useState('');

  const {
    data: myPatients,
    isPending: myPatientPending,
    refetch: fetchPatientList,
    isError: isPatientError,
    error: patientError,
  } = useMyPatientList({
    doctorId: visible ? doctorId : undefined,
  });

  const normalizedPatients = useMemo(() => {
    const sourceList =
      myPatients && myPatients.length > 0 ? myPatients : myPatientPending ? [] : [];
    return sourceList.map(item => {
      const rawId = item.user_id;
      const name = item.name || 'Unknown Patient';
      const patientGenId = item?.patient_id;
      const gender = item.gender || '';
      const phone = item.phone_number || '';
      return {
        raw: item,
        id: rawId,
        idString: String(rawId),
        name,
        patientGenId,
        gender,
        phone,
      };
    });
  }, [myPatients, myPatientPending]);

  const filteredPatients = useMemo(() => {
    const q = patientSearch.toLowerCase().trim();
    if (!q) return normalizedPatients;
    return normalizedPatients.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.patientGenId.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
  }, [normalizedPatients, patientSearch]);

  const renderEmptyState = () => {
    if (isPatientError && (!myPatients || myPatients.length === 0)) {
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
            placeholder="Search patient by name, ID or phone..."
            placeholderTextColor="#94A3B8"
            value={patientSearch}
            onChangeText={setPatientSearch}
          />

          {myPatientPending ? (
            <View style={S.patientList}>
              <BookingPatientSkeleton count={4} />
            </View>
          ) : (
            <FlatList
              data={filteredPatients}
              keyExtractor={(item, index) =>
                item.idString !== '0' ? item.idString : `item-${index}`
              }
              style={S.patientList}
              ListEmptyComponent={renderEmptyState}
              renderItem={({ item }) => {
                const isSelected = Number(selectedPatient?.id) === item.id;
                return (
                  <TouchableOpacity
                    style={[S.patientItem, isSelected && S.patientItemSelected]}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelectPatient({
                        id: item.id,
                        name: item.name,
                        patientGenId: item.patientGenId,
                        Phone: item.phone,
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
                        <Text style={S.patientId}>ID: {item.patientGenId}</Text>
                      </View>

                      {!!item.phone && <Text style={S.patientPhone}>📞 {item.phone}</Text>}
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
