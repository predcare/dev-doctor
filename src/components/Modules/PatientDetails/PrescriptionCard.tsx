import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
  doctor_name?: string;
  doctor_specialization?: string;
  consultation_date?: string;
  appointment_date?: string;
  created_at?: string;
  status?: 'completed' | 'draft' | string;
  visible_to_patient?: boolean | number;
  onPress?: () => void;
  onToggleShare?: (newVisible: boolean) => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescriptionGenId,
  diagnosis,
  doctor_name,
  doctor_specialization,
  consultation_date,
  appointment_date,
  created_at,
  status,
  onPress,
}) => {
  const itemDate =
    consultation_date || appointment_date || (created_at ? String(created_at).split('T')[0] : '');
  const rawStatus = (status || 'draft').toLowerCase();
  const isCompleted = rawStatus === 'completed';

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
          {!!doctor_name && (
            <Text style={patientDetailsStyles.recordSub}>
              Dr. {doctor_name}
              {doctor_specialization ? ` · ${doctor_specialization}` : ''}
            </Text>
          )}
          {!!itemDate && <Text style={patientDetailsStyles.recordMeta}>{itemDate}</Text>}

          <View
            style={[
              patientDetailsStyles.pill,
              {
                marginTop: 6,
                backgroundColor: isCompleted ? '#DBEAFE' : theme.colors.warningLight,
              },
            ]}
          >
            <Text
              style={[
                patientDetailsStyles.pillText,
                { color: isCompleted ? '#1E40AF' : theme.colors.warning },
              ]}
            >
              {rawStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={patientDetailsStyles.chevronText}>›</Text>
      </TouchableOpacity>

      {/* <View
        style={[
          patientDetailsStyles.shareRow,
          { backgroundColor: isShared ? theme.colors.primarySoft : theme.colors.background },
        ]}
      >
        <View>
          <Text
            style={[
              patientDetailsStyles.shareLabel,
              { color: isShared ? theme.colors.primary : theme.colors.textMuted },
            ]}
          >
            {isShared ? 'Visible to patient' : 'Hidden from patient'}
          </Text>
          <Text style={patientDetailsStyles.shareSub}>Tap to {isShared ? 'hide' : 'share'}</Text>
        </View>

        <Switch
          value={isShared}
          onValueChange={val => onToggleShare?.(val)}
          trackColor={{ false: '#E2E8F0', true: theme.colors.mintBdr }}
          thumbColor={isShared ? theme.colors.primary : '#CBD5E1'}
        />
      </View> */}
    </View>
  );
};

export default PrescriptionCard;
