import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  capitalize,
  formatTimeSlot,
  getAge,
  getCallDisconnectedInfo,
  getInitials,
} from '../../../../lib/common/common.utils';
import {
  doctorAppointmentsStyles as S,
  TEAL,
} from '../../../../styled/DoctorAppointmentsScreen.styled';
import theme from '../../../../styled/theme.styled';
import { useMeetingStore } from '../../../../zustand/stores/useMeetingStore';
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
  patientGender: string;
  patientDateOfBirth: string;
  appointmentStatus: string;
  appointment_date: string;
  consultation_type: string;
  appointmentId: number;
  appointmentGeneratedId: string;
  isJoinedOnce?: boolean;
  callDurationSeconds?: number;
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
  onVideoCall?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return '#16A34A';
    case 'cancelled':
      return '#DC2626';
    case 'pending':
      return '#D97706';
    case 'in-progress':
    case 'in_progress':
    case 'inprogress':
      return '#0284C7';
    default:
      return '#64748B';
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

export const AppointmentCard: React.FC<AppointmentCardProps> = React.memo(
  ({
    patientName,
    appointmentStatus,
    appointment_date,
    consultation_type,
    appointmentId,
    appointmentGeneratedId,
    startTime,
    endTime,
    isExpired,
    patientDateOfBirth,
    patientGender,
    isJoinedOnce,
    callDurationSeconds,
    onStartConsultation,
    onReschedule,
    onCancel,
    onComplete,
    onCreatePrescription,
    onViewDetails,
    onVideoCall,
  }) => {
    const effectiveStatus = useMemo(() => {
      const rawStatus = appointmentStatus?.toLowerCase() || '';
      const isInProgress =
        rawStatus === 'in-progress' || rawStatus === 'in_progress' || rawStatus === 'inprogress';
      if (isExpired && rawStatus !== 'cancelled' && !isInProgress) {
        return 'completed';
      }
      return rawStatus;
    }, [appointmentStatus, isExpired]);

    const activeApptId = useMeetingStore(state => state.appointmentId);
    const activeApptGeneratedId = useMeetingStore(state => state.appointmentGeneratedId);
    const activeCallState = useMeetingStore(state => state.callState);
    const activeToken = useMeetingStore(state => state.token);
    const activeMeetingId = useMeetingStore(state => state.meetingId);

    const isCallActive =
      (activeCallState === 'CONNECTED' || activeCallState === 'CONNECTING') &&
      Boolean(activeToken && activeMeetingId);

    const isCurrentApptInCall =
      isCallActive &&
      (String(activeApptId) === String(appointmentId) ||
        (Boolean(appointmentGeneratedId) && activeApptGeneratedId === appointmentGeneratedId));

    const disconnectedInfo = useMemo(
      () => getCallDisconnectedInfo(startTime, endTime, callDurationSeconds),
      [startTime, endTime, callDurationSeconds]
    );

    const {
      isVideo,
      isCompleted,
      isCancelled,
      isInProgress,
      statusColor,
      statusBg,
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
            label: 'Prescription',
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
            id: 'prescription',
            label: 'Prescription',
            icon: <PrescriptionIcon size={18} color={theme.colors.primary} />,
            color: theme.colors.primary,
            onPress: () => onCreatePrescription?.(),
          },
        ];
      }

      return [
        {
          id: 'details',
          label: 'View Details',
          icon: <InfoCircleIcon size={18} color="#64748B" />,
          color: '#64748B',
          onPress: () => onViewDetails?.(),
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
          label: 'Cancel',
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
        <View style={S.cardHeader}>
          <View style={S.patientRow}>
            <View style={[S.patientAvatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={S.patientAvatarText}>{getInitials(patientName)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={S.patientName}>{patientName}</Text>
              <Text style={S.patientAge}>
                {capitalize(patientGender || '')} /{' '}
                {getAge(patientDateOfBirth, {
                  large: true,
                })}
              </Text>
              <Text style={S.aptIdText}>APT ID: {appointmentGeneratedId}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={[S.statusBadge, { backgroundColor: statusBg }]}>
              <View style={[S.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[S.statusText, { color: statusColor }]}>
                {effectiveStatus?.replace(/[-_]/g, ' ').toUpperCase()}
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

          <View style={[S.chip, { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}>
            <ClockIcon size={12} color="#475569" />
            <Text style={[S.chipText, { color: '#475569' }]}>{formattedTime}</Text>
          </View>
        </View>

        {isVideo && isJoinedOnce && !isCurrentApptInCall && disconnectedInfo && (
          <View style={S.disconnectedBanner}>
            <Text style={S.disconnectedText}>
              Call disconnected · used {disconnectedInfo.usedText} · {disconnectedInfo.leftText}
            </Text>
          </View>
        )}

        {isCurrentApptInCall && (
          <Text style={S.activeCallNotice}>
            Reschedule & Cancel unavailable while call is active.
          </Text>
        )}

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
              style={[
                S.joinButton,
                isInProgress && { flex: 1 },
                isCurrentApptInCall && { backgroundColor: theme.colors.primary },
                isJoinedOnce && { backgroundColor: theme.colors.brandBlueDark },
              ]}
              onPress={() =>
                isVideo || isCurrentApptInCall ? onVideoCall?.() : onStartConsultation?.()
              }
              activeOpacity={0.85}
            >
              <PlayCircleIcon size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={S.joinButtonText}>
                {isCurrentApptInCall
                  ? 'Already in Call'
                  : isJoinedOnce
                  ? 'Re-join Call'
                  : isVideo
                  ? 'Join Call'
                  : 'Start Consultation'}
              </Text>
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
