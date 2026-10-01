import React, { useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommonEmptyCard from '../../../../components/commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../../../components/commons/CommonErrorCard/CommonErrorCard';
import { useDebounce } from '../../../../hooks/commons/useDebounce';
import { useMyPatientList } from '../../../../hooks/react-query/patients/patients.hooks';
import { capitalize } from '../../../../lib/commons/common.utils';
import bookAppointmentStyles from '../../../../styled/BookAppointmentScreen.styled';
import theme from '../../../../styled/theme.styled';
import { ISelectedPatients } from '../BookAppointmentScreen';
import BookingPatientSkeleton from '../Skeletons/BookingPatientSkeleton';

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
  const insets = useSafeAreaInsets();
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={[bookAppointmentStyles.modalOverlay, { paddingTop: insets.top }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            bookAppointmentStyles.modalContent,
            { paddingBottom: Math.max(20, insets.bottom + 12) },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={bookAppointmentStyles.modalHeader}>
            <Text style={bookAppointmentStyles.modalTitle}>Select Patient</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={bookAppointmentStyles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={bookAppointmentStyles.searchInput}
            placeholder="Search patient by name, email, phone or Id..."
            placeholderTextColor="#94A3B8"
            value={patientSearch}
            onChangeText={setPatientSearch}
            keyboardType="default"
          />

          {myPatientPending ? (
            <View style={bookAppointmentStyles.patientList}>
              <BookingPatientSkeleton count={4} />
            </View>
          ) : (
            <FlatList
              data={myPatients?.data || []}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item, index) =>
                item.patient_id !== '0' ? item.patient_id : `item-${index}`
              }
              style={bookAppointmentStyles.patientList}
              ListEmptyComponent={renderEmptyState}
              renderItem={({ item }) => {
                const isSelected = selectedPatient?.patientGenId === item.patient_id;
                return (
                  <TouchableOpacity
                    style={[bookAppointmentStyles.patientItem, isSelected && bookAppointmentStyles.patientItemSelected]}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelectPatient({
                        id: Number(item.user_id),
                        name: item.name,
                        patientGenId: item.patient_id,
                        Phone: Number(item.phone_number),
                        gender: item.gender,
                      });
                      onClose();
                    }}
                  >
                    <View style={[bookAppointmentStyles.patientAvatar, { backgroundColor: theme.colors.primary }]}>
                      <Text style={bookAppointmentStyles.patientAvatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                    </View>

                    <View style={bookAppointmentStyles.patientDetails}>
                      <View style={bookAppointmentStyles.patientHeaderRow}>
                        <Text style={bookAppointmentStyles.patientName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {!!item.gender && (
                          <View style={bookAppointmentStyles.patientBadge}>
                            <Text style={bookAppointmentStyles.patientBadgeText}>{capitalize(item?.gender)}</Text>
                          </View>
                        )}
                      </View>
                      <View style={bookAppointmentStyles.patientMetaRow}>
                        <Text style={bookAppointmentStyles.patientId}>ID: {item.patient_id || ''}</Text>
                      </View>
                      {!!item.phone_number && (
                        <Text style={bookAppointmentStyles.patientPhone}>📞 {item.phone_number}</Text>
                      )}
                    </View>
                    {isSelected && (
                      <View style={bookAppointmentStyles.checkBadge}>
                        <Text style={bookAppointmentStyles.checkBadgeText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default BookingPatientSelectModal;
