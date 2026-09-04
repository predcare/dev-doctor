import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon } from '../../../components/ui/icons';
import { dateOnly } from '../../../lib/common/common.utils';
import { prescriptionListStyles as S } from '../../../styled/PrescriptionListScreen.styled';
import type { IPatientPrescriptionDoc } from '../../../typescripts/interfaces/prescriptions.interfaces';

export interface IPrescriptionItemCardProps {
  item: IPatientPrescriptionDoc;
  onPress: () => void;
}

export const PrescriptionItemCard: React.FC<IPrescriptionItemCardProps> = ({
  item,
  onPress,
}) => {
  const rxIdStr = item.prescription_id || `#${String(item.id).padStart(4, '0')}`;
  const patientName = item.patient_name || 'Patient';
  const status = (item.status || 'completed').toLowerCase();
  const isCompleted = status === 'completed';
  const displayDate = dateOnly(item.created_at || item.consultation_date || item.appointment_date);

  return (
    <TouchableOpacity style={S.txCard} onPress={onPress} activeOpacity={0.75}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={S.txName}>{patientName}</Text>
          <View
            style={[
              S.badge,
              {
                backgroundColor: isCompleted ? '#D1FAE5' : '#FEF3C7',
                marginLeft: 8,
              },
            ]}
          >
            <Text
              style={[
                S.badgeTxt,
                { color: isCompleted ? '#059669' : '#D97706' },
              ]}
            >
              {status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={S.txSub}>
          {rxIdStr} {displayDate ? `• ${displayDate}` : ''}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ChevronRightIcon size={16} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

export default PrescriptionItemCard;
