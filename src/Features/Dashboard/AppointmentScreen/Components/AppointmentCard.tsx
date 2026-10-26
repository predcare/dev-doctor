import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CustomKebabMenu from '../../../../components/ui/CustomMenu/CustomKebabMenu';
import {
  CircleXIcon,
  ClinicIcon,
  ClockIcon,
  PlayCircleIcon,
  VideoIcon
} from '../../../../components/ui/icons';
import {
  _toTitleCase,
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
        const isInstant = consultation_type?.toLowerCase() === 'instant';
        const timeLabel = formatTimeSlot(startTime, '');

        return {
          isCompleted: appointmentStatus === 'completed',
          isCancelled: appointmentStatus === 'cancelled',
          isConfirmed: appointmentStatus === 'confirmed',
          isInProgress: inProgress,
          statusColor: getStatusColor(appointmentStatus),
          statusBg: getStatusBackground(appointmentStatus),
          formattedTime:
            !isInstant && appointmentDurationMinutes
              ? `${timeLabel} (${appointmentDurationMinutes}m)`
              : timeLabel,
        };
      }, [appointmentStatus, startTime, endTime, consultation_type, appointmentDurationMinutes]);

    const buttonText = useMemo(() => {
      if (isVideo) {
        if (isCurrentApptInCall) return 'Already in Call';
        if (isJoinedOnce) return 'Re-join Call';
        return 'Join Call';
      }
      if (isInProgress) return 'Continue';
      return 'Start Consultation';
    }, [isVideo, isCurrentApptInCall, isJoinedOnce]);

    const menuItems = useMemo(() => {
      if (appointmentStatus === 'completed') {
        return [
          {
            id: 'details',
            label: 'View Details',
            // icon: <InfoCircleIcon size={18} color="#64748B" />,
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
            // icon: <InfoCircleIcon size={18} color="#64748B" />,
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
            // icon: <InfoCircleIcon size={18} color="#64748B" />,
            color: '#64748B',
            onPress: () => onViewDetails?.(),
          },
          {
            id: 'complete',
            label: 'Mark as Completed',
            // icon: <CheckIcon size={18} color="#16A34A" />,
            color: '#16A34A',
            onPress: () => onComplete?.(),
          },
        ];
      }

      const items = [
        {
          id: 'details',
          label: 'View Details',
          // icon: <InfoCircleIcon size={18} color="#64748B" />,
          color: '#64748B',
          onPress: () => onViewDetails?.(),
        },
        {
          id: 'reschedule',
          label: 'Reschedule',
          // icon: <RescheduleIcon size={18} color="#64748B" />,
          color: '#64748B',
          onPress: () => onReschedule?.(),
        },
      ];

      if (appointmentStatus?.toLowerCase() === 'confirmed') {
        items.push({
          id: 'cancel',
          label: 'Cancel',
          // icon: <CircleXIcon size={18} color="#EF4444" />,
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
                {formattedTime}, {formatDate(appointment_date, 'MMM D, YYYY')}
              </Text>
            ) : null}
          </View>
          <View style={S.consultTypeBadge}>
            {isVideo ? (
              <VideoIcon size={12} color={theme.colors.textInPerson} isOutline={true} />
            ) : (
              <ClinicIcon size={12} color={theme.colors.textGreen} />
            )}
            <Text style={[S.consultTypeText, !isVideo && { color: theme.colors.textGreen }]}>{_toTitleCase(consultation_type || '')}</Text>
          </View>
        </View>

        <View style={S.cardHeader}>
          <View style={S.patientRow}>
            <View style={[S.patientAvatar, { backgroundColor: theme.colors.inPersonBg }]}>
              <Text style={[S.patientAvatarText, { color: theme.colors.textGreen }]}>{getInitials(patientName)}</Text>
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

          <View style={[S.statusBadge, { backgroundColor: statusBg }]}>
            <View style={[S.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[S.statusText, { color: statusColor }]}>
              {appointmentStatus?.replace(/[-_]/g, ' ').toUpperCase()}
            </Text>
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

        {menuItems.length > 0 && (
          <View style={[S.cardFooterActions, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
            {!isCompleted && !isCancelled && !hideVideoJoin && (
              <TouchableOpacity
                style={[
                  S.joinButton,
                  { flex: 1 },
                  !isVideo &&
                  isInProgress && {
                    backgroundColor: theme.colors.inPersonBg,
                    // borderWidth: 1.5,
                    // borderColor: theme.colors.primary,
                  },
                  isVideo && { backgroundColor: theme.colors.videoCallBtnBg },
                  isCurrentApptInCall && { backgroundColor: theme.colors.videoCallBtnBg },
                  isVideo && isJoinedOnce && { backgroundColor: theme.colors.videoCallBtnBg },
                ]}
                onPress={() => (isVideo ? onVideoCall?.() : onStartConsultation?.())}
                activeOpacity={0.85}
              >
                {isVideo ? <PlayCircleIcon size={18} color="#FFFFFF" style={{ marginRight: 6 }} /> : null}
                <Text
                  style={[
                    S.joinButtonText,
                    !isVideo && isInProgress && { color: theme.colors.textSlate },
                  ]}
                >
                  {buttonText}
                </Text>
              </TouchableOpacity>
            )}
            <CustomKebabMenu
              items={menuItems}
              triggerStyle={{
                width: 40,
                height: 40,
                borderRadius: 8,
                marginLeft: !isCompleted && !isCancelled && !hideVideoJoin ? 0 : 'auto',
              }}
            />
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
