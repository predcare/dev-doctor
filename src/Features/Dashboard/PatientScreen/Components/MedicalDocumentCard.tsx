import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import CustomSwitch from '../../../../components/ui/CustomSwitch/CustomSwitch';
import { FileDocumentIcon, ImageIcon } from '../../../../components/ui/icons';
import { formatDate } from '../../../../lib/commons/common.utils';
import { patientDetailsStyles } from '../../../../styled/PatientDetailsScreen.styled';
import theme from '../../../../styled/theme.styled';

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
  created_at?: string;
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
  isDoctorUploaded,
  isUpdatingShare,
  onPress,
  onToggleShare,
}) => {
  const cleanPath = (document_url || '').split('?')[0] || '';
  const ext = (cleanPath.split('.').pop() || '').toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);

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
            {!!created_at && <Text style={patientDetailsStyles.recordMeta}>{formatDate(created_at)}</Text>}
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
              borderTopColor: visible_to_patient
                ? theme.colors.mintBdr
                : theme.colors.surfaceBorder,
            },
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1, marginRight: 12 }}
            onPress={() => !isUpdatingShare && onToggleShare?.(!visible_to_patient)}
            activeOpacity={0.7}
            disabled={isUpdatingShare}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: visible_to_patient ? theme.colors.primary : theme.colors.textMuted,
                }}
              />
              <Text
                style={[
                  patientDetailsStyles.shareLabel,
                  { color: visible_to_patient ? theme.colors.primary : theme.colors.textSecondary },
                ]}
              >
                {visible_to_patient ? 'Visible to patient' : 'Hidden from patient'}
              </Text>
            </View>
            <Text style={patientDetailsStyles.shareSub}>
              {visible_to_patient ? 'Tap to hide from patient' : 'Tap to share with patient'}
            </Text>
          </TouchableOpacity>

          <View style={{ minWidth: 46, minHeight: 26, alignItems: 'center', justifyContent: 'center' }}>
            {isUpdatingShare ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <CustomSwitch
                value={visible_to_patient || false}
                onValueChange={val => onToggleShare?.(val)}
                disabled={isUpdatingShare}
                size="md"
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default MedicalDocumentCard;
