import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon } from '../../../../components/ui/icons';
import { formatDate } from '../../../../lib/commons/common.utils';
import { prescriptionListStyles } from '../../../../styled/PrescriptionListScreen.styled';
import { IPatientPrescriptionDoc } from '../../../../typescripts/interfaces/prescriptions.interfaces';

export interface IPrescriptionItemCardProps {
  item: IPatientPrescriptionDoc;
  onPress: () => void;
}

export const PrescriptionItemCard: React.FC<IPrescriptionItemCardProps> = ({ item, onPress }) => {
  const rxIdStr = item.prescription_id || `#${String(item.id).padStart(4, '0')}`;
  const patientName = item.patient_name || 'Patient';
  const status = (item.status || 'completed').toLowerCase();
  const displayDate = formatDate(item.created_at || item.consultation_date || item.appointment_date);
  const isSent = useMemo(() => {
    return item?.email_sent_at ? true : false;
  }, [item?.email_sent_at]);
  return (
    <TouchableOpacity style={prescriptionListStyles.txCard} onPress={onPress} activeOpacity={0.75}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={prescriptionListStyles.txName}>{patientName}</Text>
          <View
            style={[
              prescriptionListStyles.badge,
              {
                backgroundColor: isSent ? '#D1FAE5' : '#FEF3C7',
                marginLeft: 8,
              },
            ]}
          >
            <Text style={[prescriptionListStyles.badgeTxt, { color: isSent ? '#059669' : '#D97706' }]}>
              {isSent ? 'SENT' : 'NOT SENT'}
            </Text>
          </View>
        </View>

        <Text style={prescriptionListStyles.txSub}>
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
