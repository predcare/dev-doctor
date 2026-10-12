import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={[editPatientStyles.modalOverlay, { paddingTop: insets.top }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            editPatientStyles.modalSheet,
            { paddingBottom: Math.max(16, insets.bottom + 12) },
          ]}
          onStartShouldSetResponder={() => true}
        >
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
                    isSelected && editPatientStyles.modalOptSelected,
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
                      isSelected && editPatientStyles.modalOptTxtSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {isSelected && <Text style={editPatientStyles.checkmark}>✓</Text>}
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
