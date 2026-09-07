import React from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { MOCK_AVAILABLE_DATES, MockAvailableDate } from '../../../../resources/mockData';
import { bookAppointmentStyles as S } from '../../../../styled/BookAppointmentScreen.styled';
import { ParsedAvailableDate } from '../../../../utils/availabilityUtils';

export type AvailableDateItem = ParsedAvailableDate | MockAvailableDate;

interface BookingDateSelectModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (dateObj: AvailableDateItem) => void;
  availableDates?: AvailableDateItem[];
}

export const BookingDateSelectModal: React.FC<BookingDateSelectModalProps> = ({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
  availableDates = MOCK_AVAILABLE_DATES,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={S.modalOverlay}>
        <View style={S.dateModalContent}>
          <View style={S.modalHeader}>
            <Text style={S.modalTitle}>Select Available Date</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={S.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={availableDates}
            keyExtractor={item => item.date}
            style={S.dateList}
            renderItem={({ item }) => {
              const isSelected = selectedDate === item.date;
              const fee = item.in_person_fee;

              return (
                <TouchableOpacity
                  style={[S.dateItem, isSelected && S.dateItemSelected]}
                  onPress={() => {
                    onSelectDate(item);
                    onClose();
                  }}
                >
                  <View style={S.dateItemContent}>
                    <Text style={S.dateItemIcon}>📅</Text>
                    <View style={S.dateItemText}>
                      <Text style={[S.dateItemDate, isSelected && S.dateItemDateSelected]}>
                        {item.formattedDate}
                      </Text>
                      {item.relativeLabel ? (
                        <Text
                          style={[S.dateItemSublabel, isSelected && S.dateItemSublabelSelected]}
                        >
                          {item.relativeLabel}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  <View style={S.dateItemRight}>
                    <Text style={[S.dateItemType, isSelected && S.dateItemTypeSelected]}>
                      Fee: ₹{fee}
                    </Text>
                    {isSelected && <Text style={S.dateItemCheck}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default BookingDateSelectModal;
