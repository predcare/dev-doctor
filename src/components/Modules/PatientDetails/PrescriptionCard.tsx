import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';

export interface PrescriptionItem {
  id: string;
  diagnosis: string;
  doctor_name: string;
  doctor_specialization?: string;
  consultation_date: string;
  status: 'completed' | 'draft' | string;
  visible_to_patient: boolean;
}

export interface PrescriptionCardProps {
  prescription: PrescriptionItem;
  onPress?: () => void;
  onToggleShare?: (newVisible: boolean) => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onPress,
  onToggleShare,
}) => {
  const isCompleted = prescription.status.toLowerCase() === 'completed';
  const isShared = prescription.visible_to_patient;

  return (
    <View style={patientDetailsStyles.recordCard}>
      <TouchableOpacity
        style={patientDetailsStyles.recordItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[patientDetailsStyles.recordIconBox, { backgroundColor: theme.colors.primarySoft }]}>
          <Text style={[patientDetailsStyles.recordIconText, { color: theme.colors.primary }]}>
            Rx
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={patientDetailsStyles.recordTitle} numberOfLines={1}>
            {prescription.diagnosis || 'Prescription'}
          </Text>
          {!!prescription.doctor_name && (
            <Text style={patientDetailsStyles.recordSub}>
              Dr. {prescription.doctor_name}
              {prescription.doctor_specialization ? ` · ${prescription.doctor_specialization}` : ''}
            </Text>
          )}
          <Text style={patientDetailsStyles.recordMeta}>{prescription.consultation_date}</Text>

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
              {prescription.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={patientDetailsStyles.chevronText}>›</Text>
      </TouchableOpacity>

      {/* Share Toggle Row */}
      <View
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
          <Text style={patientDetailsStyles.shareSub}>
            Tap to {isShared ? 'hide' : 'share'}
          </Text>
        </View>

        <Switch
          value={isShared}
          onValueChange={val => onToggleShare?.(val)}
          trackColor={{ false: '#E2E8F0', true: theme.colors.mintBdr }}
          thumbColor={isShared ? theme.colors.primary : '#CBD5E1'}
        />
      </View>
    </View>
  );
};

export default PrescriptionCard;
