import React, { useMemo } from 'react';
import { ActivityIndicator, Switch, Text, TouchableOpacity, View } from 'react-native';
import { formatDate } from '../../../lib/common/common.utils';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { FileDocumentIcon, ImageIcon } from '../../ui/icons';

export interface MedicalDocument {
  id: string | number;
  title: string;
  document_type: string;
  document_url?: string;
  visible_to_patient: boolean;
  appointment_date?: string | null;
  created_at?: string;
  doctor_id?: number;
  isDoctorUploaded?: boolean;
}

export interface MedicalDocumentCardProps {
  id: string | number;
  title: string;
  document_type: string;
  document_url?: string;
  visible_to_patient: boolean;
  appointment_date?: string | null;
  created_at?: string;
  doctor_name?: string;
  doctor_id?: number;
  isDoctorUploaded?: boolean;
  isUpdatingShare?: boolean;
  onPress?: () => void;
  onToggleShare?: (newVisible: boolean) => void;
}

export const MedicalDocumentCard: React.FC<MedicalDocumentCardProps> = ({
  title,
  document_type,
  document_url,
  visible_to_patient,
  created_at,
  doctor_id,
  isDoctorUploaded,
  isUpdatingShare,
  onPress,
  onToggleShare,
}) => {
  const cleanPath = (document_url || '').split('?')[0] || '';
  const ext = (cleanPath.split('.').pop() || '').toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);

  const displayDate = useMemo(() => {
    if (created_at) {
      return formatDate(created_at);
    }
    return '';
  }, [created_at]);

  return (
    <View style={patientDetailsStyles.recordCard}>
      <TouchableOpacity
        style={patientDetailsStyles.recordItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[patientDetailsStyles.recordIconBox, { backgroundColor: '#EEF4FF' }]}>
          {isImage ? <ImageIcon /> : <FileDocumentIcon />}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={patientDetailsStyles.recordTitle} numberOfLines={1}>
            {title || document_type || 'Medical Document'}
          </Text>
          <Text style={patientDetailsStyles.recordSub}>{document_type || 'Document'}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, alignItems: 'center' }}>
            <View
              style={[
                patientDetailsStyles.pill,
                { backgroundColor: isDoctorUploaded ? '#EEF4FF' : theme.colors.primarySoft },
              ]}
            >
              <Text
                style={[
                  patientDetailsStyles.pillText,
                  { color: isDoctorUploaded ? '#3B6FD4' : theme.colors.primary },
                ]}
              >
                {isDoctorUploaded ? 'Doctor' : 'Patient'}
              </Text>
            </View>
            {!!displayDate && <Text style={patientDetailsStyles.recordMeta}>{displayDate}</Text>}
          </View>
        </View>

        <Text style={patientDetailsStyles.chevronText}>›</Text>
      </TouchableOpacity>
      {isDoctorUploaded && (
        <View
          style={[
            patientDetailsStyles.shareRow,
            {
              backgroundColor: visible_to_patient
                ? theme.colors.primarySoft
                : theme.colors.background,
            },
          ]}
        >
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text
              style={[
                patientDetailsStyles.shareLabel,
                { color: visible_to_patient ? theme.colors.primary : theme.colors.textMuted },
              ]}
            >
              {visible_to_patient ? 'Visible to patient' : 'Hidden from patient'}
            </Text>
            <Text style={patientDetailsStyles.shareSub}>
              {visible_to_patient ? 'Tap to hide from patient' : 'Tap to share with patient'}
            </Text>
          </View>

          {isUpdatingShare ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Switch
              value={visible_to_patient || false}
              onValueChange={val => onToggleShare?.(val)}
              disabled={isUpdatingShare}
              trackColor={{ false: '#E2E8F0', true: theme.colors.mintBdr }}
              thumbColor={visible_to_patient ? theme.colors.primary : '#CBD5E1'}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default MedicalDocumentCard;
