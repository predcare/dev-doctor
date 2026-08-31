import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';

export interface MedicalDocument {
  id: string;
  title: string;
  document_type: string;
  document_path: string;
  visible_to_patient: boolean;
  appointment_date?: string;
  isDoctorUploaded?: boolean;
}

export interface MedicalDocumentCardProps {
  document: MedicalDocument;
  onPress?: () => void;
  onToggleShare?: (newVisible: boolean) => void;
}

export const MedicalDocumentCard: React.FC<MedicalDocumentCardProps> = ({
  document,
  onPress,
  onToggleShare,
}) => {
  const ext = (document.document_path || '').split('.').pop()?.toLowerCase() || '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  const badgeText = isImage ? 'IMG' : 'PDF';
  const isDoctor = document.isDoctorUploaded ?? true;
  const isShared = document.visible_to_patient;

  return (
    <View style={patientDetailsStyles.recordCard}>
      <TouchableOpacity
        style={patientDetailsStyles.recordItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[patientDetailsStyles.recordIconBox, { backgroundColor: '#EEF4FF' }]}>
          <Text style={[patientDetailsStyles.recordIconText, { color: '#3B6FD4' }]}>
            {badgeText}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={patientDetailsStyles.recordTitle} numberOfLines={1}>
            {document.title}
          </Text>
          <Text style={patientDetailsStyles.recordSub}>{document.document_type || 'Document'}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, alignItems: 'center' }}>
            <View
              style={[
                patientDetailsStyles.pill,
                { backgroundColor: isDoctor ? '#EEF4FF' : theme.colors.primarySoft },
              ]}
            >
              <Text
                style={[
                  patientDetailsStyles.pillText,
                  { color: isDoctor ? '#3B6FD4' : theme.colors.primary },
                ]}
              >
                {isDoctor ? 'Doctor' : 'Patient'}
              </Text>
            </View>
            {!!document.appointment_date && (
              <Text style={patientDetailsStyles.recordMeta}>{document.appointment_date}</Text>
            )}
          </View>
        </View>

        <Text style={patientDetailsStyles.chevronText}>›</Text>
      </TouchableOpacity>

      {/* Doctor Share Row Toggle */}
      {isDoctor && (
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
      )}
    </View>
  );
};

export default MedicalDocumentCard;
