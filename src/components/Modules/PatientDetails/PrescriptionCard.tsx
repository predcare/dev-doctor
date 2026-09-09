import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { formatDate } from '../../../lib/common/common.utils';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';

export interface PrescriptionItem {
  id: string | number;
  prescription_id?: string;
  prescriptionGenId?: string;
  diagnosis?: string;
  doctor_name?: string;
  doctor_specialization?: string;
  consultation_date?: string;
  appointment_date?: string;
  status?: 'completed' | 'draft' | string;
  visible_to_patient?: boolean | number;
}

export interface PrescriptionCardProps {
  id?: string | number;
  prescriptionGenId?: string;
  diagnosis?: string;
  patient_name?: string;
  consultation_date?: string;
  appointment_date?: string;
  created_at?: string;
  isSent?: boolean;
  status?: 'completed' | 'draft' | string;
  visible_to_patient?: boolean | number;
  onPress?: () => void;
  onToggleShare?: (newVisible: boolean) => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescriptionGenId,
  diagnosis,
  patient_name,
  created_at,
  status,
  isSent,
  onPress,
}) => {
  const itemDate = created_at ? String(created_at).split('T')[0] : '';
  console.log('created_at', itemDate);
  return (
    <View style={patientDetailsStyles.recordCard}>
      <TouchableOpacity
        style={patientDetailsStyles.recordItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View
          style={[
            patientDetailsStyles.recordIconBox,
            { backgroundColor: theme.colors.primarySoft },
          ]}
        >
          <Text style={[patientDetailsStyles.recordIconText, { color: theme.colors.primary }]}>
            Rx
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          {!!prescriptionGenId && (
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: theme.colors.primary,
                marginBottom: 2,
              }}
            >
              #{prescriptionGenId}
            </Text>
          )}
          {diagnosis && (
            <Text style={patientDetailsStyles.recordTitle} numberOfLines={1}>
              {diagnosis}
            </Text>
          )}
          {!!patient_name && (
            <Text style={[patientDetailsStyles.recordSub, { textTransform: 'capitalize' }]}>
              {patient_name}
            </Text>
          )}
          {!!itemDate && (
            <Text style={patientDetailsStyles.recordMeta}>{formatDate(itemDate)}</Text>
          )}

          <View
            style={[
              patientDetailsStyles.pill,
              {
                marginTop: 6,
                backgroundColor: isSent ? '#DBEAFE' : theme.colors.warningLight,
              },
            ]}
          >
            <Text
              style={[
                patientDetailsStyles.pillText,
                { color: isSent ? '#1E40AF' : theme.colors.warning },
              ]}
            >
              {isSent ? 'Sent' : 'Not Sent'}
            </Text>
          </View>
        </View>

        <Text style={patientDetailsStyles.chevronText}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrescriptionCard;
