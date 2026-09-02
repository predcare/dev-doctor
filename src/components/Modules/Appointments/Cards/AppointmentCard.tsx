import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { getInitials } from '../../../../lib/common/common.utils';
import {
  doctorAppointmentsStyles as S,
  TEAL,
} from '../../../../styled/DoctorAppointmentsScreen.styled';
import theme from '../../../../styled/theme.styled';
import CustomKebabMenu from '../../../ui/CustomMenu/CustomKebabMenu';
import {
  CheckIcon,
  CircleXIcon,
  ClinicIcon,
  ClockIcon,
  InfoCircleIcon,
  PlayCircleIcon,
  PrescriptionIcon,
  RescheduleIcon,
  VideoIcon,
} from '../../../ui/icons';

interface AppointmentCardProps {
  patientName: string;
  appointmentStatus: string;
  appointment_date: string;
  consultation_type: string;
  appointmentId: number;
  appointmentGeneratedId: string;
  startTime?: string;
  endTime?: string;
  isExpired?: boolean;
  onStartConsultation?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onCreatePrescription?: () => void;
  onViewDetails?: () => void;
  onDelete?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return '#10B981';
    case 'cancelled':
      return '#EF4444';
    case 'pending':
      return '#F59E0B';
    case 'in-progress':
    case 'in_progress':
    case 'inprogress':
      return '#0EA5E9';
    default:
      return '#3B82F6';
  }
};

const getStatusBackground = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return '#D1FAE5';
    case 'cancelled':
      return '#FEE2E2';
    case 'pending':
      return '#FEF3C7';
    case 'in-progress':
    case 'in_progress':
    case 'inprogress':
      return '#E0F2FE';
    default:
      return '#DBEAFE';
  }
};

const formatTimeSlot = (startTime?: string, endTime?: string) => {
  if (!startTime) return 'Flexible';
  const formatTime = (t: string) => {
    const parts = t.split(':');
    if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
    return t;
  };
  const s = formatTime(startTime);
  const e = endTime ? formatTime(endTime) : '';
  return e ? `${s} - ${e}` : s;
};

export const AppointmentCard: React.FC<AppointmentCardProps> = React.memo(
  ({
    patientName,
    appointmentStatus,
    appointment_date,
    consultation_type,
    appointmentGeneratedId,
    startTime,
    endTime,
    isExpired,
    onStartConsultation,
    onReschedule,
    onCancel,
    onComplete,
    onCreatePrescription,
    onViewDetails,
    onDelete,
  }) => {
    const effectiveStatus = useMemo(() => {
      const rawStatus = appointmentStatus?.toLowerCase() || '';
      if (isExpired && rawStatus !== 'cancelled') {
        return 'completed';
      }
      return rawStatus;
    }, [appointmentStatus, isExpired]);

    const {
      isVideo,
      isCompleted,
      isCancelled,
      isInProgress,
      statusColor,
      statusBg,
      isConfirmed,
      formattedTime,
    } = useMemo(() => {
      const inProgress =
        effectiveStatus === 'in-progress' ||
        effectiveStatus === 'in_progress' ||
        effectiveStatus === 'inprogress';

      return {
        isVideo: consultation_type?.toLowerCase() === 'video',
        isCompleted: effectiveStatus === 'completed',
        isCancelled: effectiveStatus === 'cancelled',
        isConfirmed: effectiveStatus === 'confirmed',
        isInProgress: inProgress,
        statusColor: getStatusColor(effectiveStatus),
        statusBg: getStatusBackground(effectiveStatus),
        formattedTime: formatTimeSlot(startTime, endTime),
      };
    }, [consultation_type, effectiveStatus, startTime, endTime]);

    const menuItems = useMemo(() => {
      if (effectiveStatus === 'completed') {
        return [
          {
            id: 'details',
            label: 'View Details',
            icon: <InfoCircleIcon size={18} color="#64748B" />,
            color: '#64748B',
            onPress: () => onViewDetails?.(),
          },
          {
            id: 'prescription',
            label: 'Create Prescription',
            icon: <PrescriptionIcon size={18} color={theme.colors.primary} />,
            color: theme.colors.primary,
            onPress: () => onCreatePrescription?.(),
          },
        ];
      }

      if (effectiveStatus === 'cancelled') {
        return [
          {
            id: 'details',
            label: 'View Details',
            icon: <InfoCircleIcon size={18} color="#64748B" />,
            color: '#64748B',
            onPress: () => onViewDetails?.(),
          },
        ];
      }

      if (isInProgress) {
        return [
          {
            id: 'details',
            label: 'View Details',
            icon: <InfoCircleIcon size={18} color="#64748B" />,
            color: '#64748B',
            onPress: () => onViewDetails?.(),
          },
          {
            id: 'complete',
            label: 'Mark as Completed',
            icon: <CheckIcon size={18} color="#10B981" />,
            color: '#10B981',
            onPress: () => onComplete?.(),
          },
          {
            id: 'prescription',
            label: 'Create Prescription',
            icon: <PrescriptionIcon size={18} color={theme.colors.primary} />,
            color: theme.colors.primary,
            onPress: () => onCreatePrescription?.(),
          },
        ];
      }

      // Confirmed / Scheduled / Pending / Default
      return [
        {
          id: 'details',
          label: 'View Details',
          icon: <InfoCircleIcon size={18} color="#64748B" />,
          color: '#64748B',
          onPress: () => onViewDetails?.(),
        },
        {
          id: 'complete',
          label: 'Mark as Completed',
          icon: <CheckIcon size={18} color="#10B981" />,
          color: '#10B981',
          onPress: () => onComplete?.(),
        },
        {
          id: 'reschedule',
          label: 'Reschedule',
          icon: <RescheduleIcon size={18} color="#64748B" />,
          color: '#64748B',
          onPress: () => onReschedule?.(),
        },
        {
          id: 'cancel',
          label: 'Cancel Appointment',
          icon: <CircleXIcon size={18} color="#EF4444" />,
          color: '#EF4444',
          onPress: () => onCancel?.(),
        },
      ];
    }, [
      effectiveStatus,
      isInProgress,
      onViewDetails,
      onCreatePrescription,
      onComplete,
      onReschedule,
      onCancel,
    ]);

    return (
      <View style={S.card}>
        {/* Card Header */}
        <View style={S.cardHeader}>
          <View style={S.patientRow}>
            <View style={[S.patientAvatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={S.patientAvatarText}>{getInitials(patientName)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={S.patientName}>{patientName}</Text>
              <Text style={S.patientAge}>Female / 34 yrs</Text>
              <Text style={S.aptIdText}>APT ID: {appointmentGeneratedId}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={[S.statusBadge, { backgroundColor: statusBg }]}>
              <View style={[S.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[S.statusText, { color: statusColor }]}>
                {effectiveStatus.replace(/[-_]/g, ' ').toUpperCase()}
              </Text>
            </View>
            {menuItems.length > 0 && (
              <CustomKebabMenu
                items={menuItems}
                triggerStyle={{ width: 32, height: 32, borderRadius: 8 }}
              />
            )}
          </View>
        </View>

        <View style={S.chipsRow}>
          <View
            style={[
              S.chip,
              {
                backgroundColor: isVideo ? '#E6F7F5' : '#FFF3E6',
                borderColor: isVideo ? '#B2DFDB' : '#FDDCB5',
              },
            ]}
          >
            {isVideo ? (
              <VideoIcon size={12} color={TEAL} />
            ) : (
              <ClinicIcon size={12} color="#F97316" />
            )}
            <Text style={[S.chipText, { color: isVideo ? TEAL : '#F97316' }]}>
              {isVideo ? 'Video Call' : 'In-Clinic'}
            </Text>
          </View>
          <View style={[S.chip, { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}>
            <ClockIcon size={12} color="#475569" />
            <Text style={[S.chipText, { color: '#475569' }]}>{appointment_date}</Text>
          </View>

          {/* Time Chip */}
          <View style={[S.chip, { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}>
            <ClockIcon size={12} color="#475569" />
            <Text style={[S.chipText, { color: '#475569' }]}>{formattedTime}</Text>
          </View>
        </View>

        {isCancelled && (
          <View style={S.cancelledBox}>
            <View style={S.cancelledIconCircle}>
              <CircleXIcon size={16} color="#EF4444" />
            </View>
            <View style={S.cancelledTextContainer}>
              <Text style={S.cancelledTitle}>Appointment Cancelled</Text>
              <Text style={S.cancelledSubtext}>This slot is no longer active</Text>
            </View>
          </View>
        )}

        {!isCompleted && !isCancelled && (
          <View style={[S.cardFooterActions, isInProgress && { flexDirection: 'row', gap: 10 }]}>
            <TouchableOpacity
              style={[S.joinButton, isInProgress && { flex: 1 }]}
              onPress={onStartConsultation}
              activeOpacity={0.85}
            >
              <PlayCircleIcon size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={S.joinButtonText}>{isVideo ? 'Join Call' : 'Start Consultation'}</Text>
            </TouchableOpacity>
            {isInProgress && (
              <TouchableOpacity
                style={[S.completeButton, { flex: 1 }]}
                onPress={onComplete}
                activeOpacity={0.85}
              >
                <CheckIcon size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={S.joinButtonText}>Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }
);

export default AppointmentCard;
