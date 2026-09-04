import React, { useMemo } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { dateOnly } from '../../../lib/common/common.utils';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { FileDocumentIcon, ImageIcon } from '../../ui/icons';

export interface MedicalDocument {
  id: string | number;
  title: string;
  document_type: string;
  document_url?: string;
  visible_to_patient: boolean | number;
  appointment_date?: string | null;
  created_at?: string;
  doctor_name?: string;
  doctor_id?: number;
  isDoctorUploaded?: boolean;
}

export interface MedicalDocumentCardProps {
  id: string | number;
  title: string;
  document_type: string;
  document_url?: string;
  visible_to_patient: boolean | number;
  appointment_date?: string | null;
  created_at?: string;
  doctor_name?: string;
  doctor_id?: number;
  isDoctorUploaded?: boolean;
  onPress?: () => void;
  onToggleShare?: (newVisible: boolean) => void;
}

export const MedicalDocumentCard: React.FC<MedicalDocumentCardProps> = ({
  id,
  title,
  document_type,
  document_url,
  visible_to_patient,
  appointment_date,
  created_at,
  doctor_name,
  doctor_id,
  isDoctorUploaded,
  onPress,
  onToggleShare,
}) => {
  const cleanPath = (document_url || '').split('?')[0] || '';
  const ext = (cleanPath.split('.').pop() || '').toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);

  const isDoctor = isDoctorUploaded ?? (doctor_id !== undefined || !!doctor_name);

  const isShared =
    typeof visible_to_patient === 'number' ? visible_to_patient === 1 : Boolean(visible_to_patient);

  const displayDate = useMemo(() => {
    if (created_at) {
      return dateOnly(created_at, 'DD MMM YYYY');
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
            {!!displayDate && <Text style={patientDetailsStyles.recordMeta}>{displayDate}</Text>}
          </View>
        </View>

        <Text style={patientDetailsStyles.chevronText}>›</Text>
      </TouchableOpacity>
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
            <Text style={patientDetailsStyles.shareSub}>Tap to {isShared ? 'hide' : 'share'}</Text>
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
