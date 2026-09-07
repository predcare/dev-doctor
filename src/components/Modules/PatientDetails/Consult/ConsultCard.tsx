import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { formatDate, formatTimeSlot, getInitials } from '../../../../lib/common/common.utils';
import { consultTabStyles } from '../../../../styled/ConsultTabPanel.styled';
import { theme } from '../../../../styled/theme.styled';
import { ConsultType } from '../../../../typescripts/enums';
import { CalendarIcon, CheckIcon, ClinicIcon, ClockIcon, VideoIcon } from '../../../ui/icons';

interface ConsultCardProps {
  appointmentGeneratedId: string;
  patientName: string;
  patientId: string;
  appointmentDate: string;
  startTime?: string;
  endTime?: string;
  appointmentStatus?: string;
  appointmentType?: string;
  loading?: boolean;
  onVideoCall?: () => void;
  onStartConsultation?: () => void;
  onCompleted?: () => void;
}

const ConsultCard: React.FC<ConsultCardProps> = ({
  appointmentDate,
  appointmentGeneratedId,
  appointmentStatus,
  appointmentType,
  endTime,
  patientId,
  patientName,
  startTime,
  onVideoCall,
  onStartConsultation,
  onCompleted,
  loading,
}) => {
  const { isVideo, isCompleted, isInProgress } = useMemo(() => {
    const rawStatus = (appointmentStatus || '').toLowerCase();
    return {
      isVideo: (appointmentType || '').toLowerCase() === ConsultType.VIDEO,
      isCompleted: rawStatus === 'completed',
      isInProgress: rawStatus === 'in_progress' || rawStatus === 'in-progress' || rawStatus === '',
    };
  }, [appointmentType, appointmentStatus]);

  const statusText = useMemo(() => {
    if (!appointmentStatus) return '';
    const formatted = appointmentStatus.replace(/[-_]/g, ' ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
  }, [appointmentStatus]);

  const statusStyle = useMemo(() => {
    const st = (appointmentStatus || '').toLowerCase();
    if (st === 'completed') {
      return { bg: theme.colors.successLight, text: theme.colors.success };
    }
    if (st === 'in_progress' || st === 'in-progress' || st === 'inprogress') {
      return { bg: theme.colors.accentLight, text: theme.colors.accent };
    }
    if (st === 'pending') {
      return { bg: theme.colors.warningLight, text: theme.colors.warning };
    }
    if (st === 'cancelled') {
      return { bg: theme.colors.dangerLight, text: theme.colors.danger };
    }
    return { bg: theme.colors.surfaceSecondary, text: theme.colors.textSlate };
  }, [appointmentStatus]);

  return (
    <View style={consultTabStyles.card}>
      <View style={consultTabStyles.cardHeader}>
        <View style={consultTabStyles.idTagRow}>
          <Text style={consultTabStyles.consultIdText}>{appointmentGeneratedId}</Text>
          <View
            style={[
              consultTabStyles.typeBadge,
              isVideo ? consultTabStyles.typeVideoBg : consultTabStyles.typeInPersonBg,
            ]}
          >
            {isVideo ? (
              <VideoIcon size={12} color="#0284C7" />
            ) : (
              <ClinicIcon size={12} color="#0284C7" />
            )}
            <Text
              style={isVideo ? consultTabStyles.typeVideoText : consultTabStyles.typeInPersonText}
            >
              {isVideo ? 'Video' : 'In-Person'}
            </Text>
          </View>
        </View>
        {Boolean(statusText) && (
          <View style={[consultTabStyles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[consultTabStyles.statusText, { color: statusStyle.text }]}>
              {statusText}
            </Text>
          </View>
        )}
      </View>
      <View style={consultTabStyles.patientHeader}>
        <View style={consultTabStyles.avatarContainer}>
          <Text style={consultTabStyles.avatarText}>{getInitials(patientName)}</Text>
        </View>
        <View style={consultTabStyles.patientMeta}>
          <Text style={consultTabStyles.patientName}>{patientName}</Text>
          <Text style={consultTabStyles.patientSubText}>ID: {patientId}</Text>
        </View>
      </View>
      <View style={consultTabStyles.dateTimeBox}>
        <View style={consultTabStyles.dateTimeItem}>
          <CalendarIcon size={14} color="#64748B" />
          <Text style={consultTabStyles.dateTimeText}>{formatDate(appointmentDate)}</Text>
        </View>
        <View style={consultTabStyles.divider} />
        <View style={consultTabStyles.dateTimeItem}>
          <ClockIcon size={14} color="#64748B" />
          <Text style={consultTabStyles.dateTimeText}>{formatTimeSlot(startTime, endTime)}</Text>
        </View>
      </View>
      {isVideo && !isCompleted && (
        <View style={consultTabStyles.actionRow}>
          <TouchableOpacity
            style={consultTabStyles.btnJoinCall}
            activeOpacity={0.8}
            onPress={onVideoCall}
            disabled={loading}
          >
            <VideoIcon size={16} color="#FFFFFF" />
            <Text style={consultTabStyles.btnJoinCallText}>Join Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={consultTabStyles.btnJoinCall}
            activeOpacity={0.8}
            onPress={onCompleted}
            disabled={loading}
          >
            <CheckIcon size={16} color="#FFFFFF" />
            <Text style={consultTabStyles.btnJoinCallText}>Completed</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isVideo && isInProgress && (
        <View style={consultTabStyles.actionRow}>
          <TouchableOpacity
            style={consultTabStyles.btnJoinCall}
            activeOpacity={0.8}
            onPress={onStartConsultation}
            disabled={loading}
          >
            <ClinicIcon size={16} color="#FFFFFF" />
            <Text style={consultTabStyles.btnJoinCallText}>Start Consultation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={consultTabStyles.btnJoinCall}
            activeOpacity={0.8}
            onPress={onCompleted}
            disabled={loading}
          >
            <CheckIcon size={16} color="#FFFFFF" />
            <Text style={consultTabStyles.btnJoinCallText}>Completed</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ConsultCard;
