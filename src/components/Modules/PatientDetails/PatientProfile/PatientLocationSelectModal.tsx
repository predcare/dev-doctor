import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { editPatientStyles } from '../../../../styled/EditPatientScreen.styled';

interface IModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  items: { id: number; name: string }[];
  selected: string;
  onPick: (item: { id: number; name: string }) => void;
  isLoading?: boolean;
}

const PatientLocationSelectModal = ({
  visible,
  onClose,
  title,
  items,
  selected,
  onPick,
}: IModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={editPatientStyles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={editPatientStyles.modalSheet}>
          <View style={editPatientStyles.modalHead}>
            <Text style={editPatientStyles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={editPatientStyles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 350 }}>
            {items.map(item => {
              const isSelected = item.name === selected;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    editPatientStyles.modalOpt,
                    selected && editPatientStyles.modalOptSelected,
                  ]}
                  onPress={() => {
                    onPick(item);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      editPatientStyles.modalOptTxt,
                      selected && editPatientStyles.modalOptTxtSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {selected && <Text style={editPatientStyles.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default PatientLocationSelectModal;
