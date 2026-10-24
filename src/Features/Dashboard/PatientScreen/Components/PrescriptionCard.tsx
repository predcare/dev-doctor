import React from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  CalendarIcon,
  ChevronRightIcon,
  RxIcon,
} from '../../../../components/ui/icons';
import { formatDate } from '../../../../lib/commons/common.utils';
import { prescriptionCardstyles } from '../../../../styled/PatientDetailsScreen.styled';
import theme from '../../../../styled/theme.styled';

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
  isSent,
  onPress,
}) => {
  const isDelivered = Boolean(isSent);
  const badgeLabel = isDelivered
    ? 'Sent'
    : 'Not Sent';

  return (
    <View style={prescriptionCardstyles.card}>
      <TouchableOpacity
        style={prescriptionCardstyles.touchable}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={prescriptionCardstyles.iconBox}>
          <RxIcon size={24} color={theme.colors.primary} />
        </View>

        <View style={prescriptionCardstyles.content}>
          <View style={prescriptionCardstyles.topRow}>
            {prescriptionGenId ? (
              <View style={prescriptionCardstyles.idBadge}>
                <Text style={prescriptionCardstyles.idText}>#{prescriptionGenId}</Text>
              </View>
            ) : (
              <View style={prescriptionCardstyles.idBadge}>
                <Text style={prescriptionCardstyles.idText}>Rx</Text>
              </View>
            )}

            <View
              style={[
                prescriptionCardstyles.statusBadge,
                isDelivered ? prescriptionCardstyles.statusBadgeSuccess : prescriptionCardstyles.statusBadgeWarning,
              ]}
            >
              <Text
                style={[
                  prescriptionCardstyles.statusText,
                  isDelivered ? prescriptionCardstyles.statusTextSuccess : prescriptionCardstyles.statusTextWarning,
                ]}
              >
                {badgeLabel}
              </Text>
            </View>
          </View>
          <Text style={prescriptionCardstyles.diagnosisTitle} numberOfLines={2}>
            {diagnosis?.trim() || 'General Prescription'}
          </Text>

          {/* Bottom Row: Date & Metadata */}
          <View style={prescriptionCardstyles.bottomRow}>
            {!!created_at && (
              <View style={prescriptionCardstyles.dateRow}>
                <CalendarIcon size={12} color={theme.colors.textMuted} />
                <Text style={prescriptionCardstyles.dateText}>{formatDate(created_at)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Right Arrow Chevron */}
        <View style={prescriptionCardstyles.chevronBox}>
          <ChevronRightIcon size={16} color={theme.colors.textMuted} />
        </View>
      </TouchableOpacity>
    </View>
  );
};



export default PrescriptionCard;
