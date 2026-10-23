import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CustomKebabMenu from '../../../../components/ui/CustomMenu/CustomKebabMenu';
import {
  CheckIcon,
  CircleXIcon,
  ClinicIcon,
  ClockIcon,
  InfoCircleIcon,
  PlayCircleIcon,
  RescheduleIcon,
  VideoIcon
} from '../../../../components/ui/icons';
import {
  capitalize,
  formatDate,
  formatTimeSlot,
  getAge,
  getInitials,
  shouldHideJoinForCallDuration,
} from '../../../../lib/commons/common.utils';
import { doctorAppointmentsStyles as S } from '../../../../styled/DoctorAppointmentsScreen.styled';
import theme from '../../../../styled/theme.styled';
import { useMeetingStore } from '../../../../zustand/stores/useMeetingStore';

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
  startTime?: string;
  endTime?: string;
  appointmentDurationMinutes?: number | null;
  callDurationSeconds?: number | null;
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
    appointmentDurationMinutes,
    callDurationSeconds,
    patientDateOfBirth,
    patientGender,
    isJoinedOnce,
    onStartConsultation,
    onReschedule,
    onCancel,
    onComplete,
    onCreatePrescription,
    onViewDetails,
    onVideoCall,
  }) => {
    const activeApptId = useMeetingStore(state => state.callInfo?.appointment?.id);
    const activeApptGeneratedId = useMeetingStore(
      state => state.callInfo?.appointment?.appointmentId
    );
    const activeCallState = useMeetingStore(state => state.callState);
    const activeToken = useMeetingStore(state => state.callInfo?.token);
    const activeMeetingId = useMeetingStore(state => state.callInfo?.meetingId);

    const isCallActive =
      (activeCallState === 'INITIALIZING' ||
        activeCallState === 'CONNECTING' ||
        activeCallState === 'WAITING_FOR_PATIENT' ||
        activeCallState === 'CONNECTED' ||
        activeCallState === 'RECONNECTING') &&
      Boolean(activeToken && activeMeetingId);

    const isVideo = consultation_type?.toLowerCase() === 'video';
    const hideVideoJoin =
      isVideo &&
      shouldHideJoinForCallDuration({
        status: appointmentStatus,
        appointmentDurationMinutes,
        callDurationSeconds,
      });

    const isCurrentApptInCall =
      isVideo &&
      isCallActive &&
      (String(activeApptId) === String(appointmentId) ||
        (Boolean(appointmentGeneratedId) && activeApptGeneratedId === appointmentGeneratedId));

    const { isCompleted, isCancelled, isInProgress, statusColor, statusBg, formattedTime } =
      useMemo(() => {
        const inProgress =
          appointmentStatus === 'in-progress' ||
          appointmentStatus === 'in_progress' ||
          appointmentStatus === 'inprogress';

        return {
          isCompleted: appointmentStatus === 'completed',
          isCancelled: appointmentStatus === 'cancelled',
          isConfirmed: appointmentStatus === 'confirmed',
          isInProgress: inProgress,
          statusColor: getStatusColor(appointmentStatus),
          statusBg: getStatusBackground(appointmentStatus),
          formattedTime: formatTimeSlot(startTime, ''),
        };
      }, [appointmentStatus, startTime, endTime]);

    const buttonText = useMemo(() => {
      if (isVideo) {
        if (isCurrentApptInCall) return 'Already in Call';
        if (isJoinedOnce) return 'Re-join Call';
        return 'Join Call';
      }
      return 'Start Consultation';
    }, [isVideo, isCurrentApptInCall, isJoinedOnce]);

    const menuItems = useMemo(() => {
      if (appointmentStatus === 'completed') {
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

      if (appointmentStatus === 'cancelled') {
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
        ];
      }

      const items = [
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
      ];

      if (appointmentStatus?.toLowerCase() === 'confirmed') {
        items.push({
          id: 'cancel',
          label: 'Cancel',
          icon: <CircleXIcon size={18} color="#EF4444" />,
          color: '#EF4444',
          onPress: () => onCancel?.(),
        });
      }

      return items;
    }, [
      appointmentStatus,
      isInProgress,
      onViewDetails,
      onCreatePrescription,
      onComplete,
      onReschedule,
      onCancel,
    ]);

    return (
      <View style={S.card}>
        <View style={S.typeTimeRow}>
          <View style={S.timePill}>
            <ClockIcon size={13} color={theme.colors.primary} />
            {formattedTime ? (
              <Text style={S.timePillText} numberOfLines={1}>
                {formattedTime} ({appointmentDurationMinutes}m),{' '}
                {formatDate(appointment_date, 'MMM D, YYYY')}
              </Text>
            ) : null}
          </View>
          <View style={S.consultTypeBadge}>
            {isVideo ? (
              <VideoIcon size={12} color={theme.colors.textInPerson} isOutline={true} />
            ) : (
              <ClinicIcon size={12} color={theme.colors.textGreen} />
            )}
            <Text style={[S.consultTypeText, !isVideo && { color: theme.colors.textGreen }]}>{isVideo ? 'Video Call' : 'In-Clinic'}</Text>
          </View>
        </View>

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
                {appointmentStatus?.replace(/[-_]/g, ' ').toUpperCase()}
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

        {!isCompleted && !isCancelled && (!hideVideoJoin || isInProgress) && (
          <View style={[S.cardFooterActions, isInProgress && { flexDirection: 'row', gap: 10 }]}>
            {!hideVideoJoin && (
              <TouchableOpacity
                style={[
                  S.joinButton,
                  isInProgress && { flex: 1 },
                  isVideo && { backgroundColor: theme.colors.videoCallBtnBg },
                  isCurrentApptInCall && { backgroundColor: theme.colors.videoCallBtnBg },
                  isVideo && isJoinedOnce && { backgroundColor: theme.colors.videoCallBtnBg },
                ]}
                onPress={() => (isVideo ? onVideoCall?.() : onStartConsultation?.())}
                activeOpacity={0.85}
              >
                {isVideo ? <PlayCircleIcon size={18} color="#FFFFFF" style={{ marginRight: 6 }} /> : null}
                <Text style={S.joinButtonText}>{buttonText}</Text>
              </TouchableOpacity>
            )}
            {isInProgress && (
              <TouchableOpacity
                style={[S.completeButton, { flex: 1 }]}
                onPress={onComplete}
                activeOpacity={0.85}
              >
                <CheckIcon size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={S.joinButtonText}>Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {isCurrentApptInCall && (
          <Text style={S.activeCallNotice}>
            Reschedule & Cancel unavailable while call is active.
          </Text>
        )}
      </View>
    );
  }
);

export default AppointmentCard;
