import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { capitalizeFirstLetter } from '../../../lib/common/common.utils';
import { ExitingSlotsStyled } from '../../../styled/DoctorAvailabilityScreen.styled';
import { theme } from '../../../styled/theme.styled';
import CalendarIcon from '../../ui/icons/CalendarIcon';
import EditIcon from '../../ui/icons/EditIcon';
import TrashIcon from '../../ui/icons/TrashIcon';

export interface ExistingSlotCardProps {
  id: number;
  date_selection_mode: 'specific' | 'recurring' | string;
  selected_dates?: string[];
  recurring_days?: string[];
  recurring_start_date?: string | null;
  recurring_end_date?: string | null;
  recurring_dates?: string[];
  leave_dates?: string[];
  slot_duration: number;
  from_time: string;
  to_time: string;
  consultation_type: 'in-person' | 'video' | 'both' | string;
  in_person_fee: number | string;
  video_fee?: number | string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const formatDisplayTime = (timeStr: string): string => {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();
  if (trimmed.toLowerCase().includes('am') || trimmed.toLowerCase().includes('pm')) {
    return trimmed;
  }
  const parsed = dayjs(`2000-01-01 ${trimmed}`);
  return parsed.isValid() ? parsed.format('hh:mm A') : timeStr;
};

const formatDisplayDate = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  const ds = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parsed = dayjs(ds);
  return parsed.isValid() ? parsed.format('DD MMM YYYY') : dateStr;
};

export const ExistingSlotCard: React.FC<ExistingSlotCardProps> = React.memo(
  ({
    id,
    date_selection_mode,
    selected_dates = [],
    recurring_days = [],
    recurring_dates = [],
    leave_dates = [],
    slot_duration,
    from_time,
    to_time,
    consultation_type,
    in_person_fee,
    video_fee,
    onEdit,
    onDelete,
  }) => {
    const [expandedDates, setExpandedDates] = useState(false);
    const [expandedLeaves, setExpandedLeaves] = useState(false);
    const [expandedRecurringDates, setExpandedRecurringDates] = useState(false);

    const safeSelectedDates = useMemo(() => selected_dates || [], [selected_dates]);
    const safeRecurringDays = useMemo(() => recurring_days || [], [recurring_days]);
    const safeRecurringDates = useMemo(() => recurring_dates || [], [recurring_dates]);
    const safeLeaveDates = useMemo(() => leave_dates || [], [leave_dates]);

    const isSpecific = useMemo(() => {
      return date_selection_mode === 'specific';
    }, [date_selection_mode]);

    const formattedRecurringDays = useMemo(() => {
      return safeRecurringDays.map(day => capitalizeFirstLetter(day)).join(', ');
    }, [safeRecurringDays]);
    console.log('from_time', from_time, to_time);
    const formattedFromTime = useMemo(() => {
      return formatDisplayTime(from_time);
    }, [from_time]);

    const formattedToTime = useMemo(() => {
      return formatDisplayTime(to_time);
    }, [to_time]);

    return (
      <View style={ExitingSlotsStyled.existingSlotCard}>
        <View style={ExitingSlotsStyled.slotCardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={ExitingSlotsStyled.slotTypeIconBox}>
              <CalendarIcon size={20} color={theme.colors.primary} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={ExitingSlotsStyled.slotTypeLabel}>TYPE</Text>
              <Text style={ExitingSlotsStyled.slotCardMode}>
                {isSpecific ? 'Specific Dates' : 'Recurring Schedule'}
              </Text>
            </View>
          </View>

          <View style={ExitingSlotsStyled.slotCardActions}>
            {onEdit && (
              <TouchableOpacity
                style={ExitingSlotsStyled.editButton}
                onPress={() => onEdit(id)}
                activeOpacity={0.7}
              >
                <EditIcon size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={ExitingSlotsStyled.deleteButton}
                onPress={() => onDelete(id)}
                activeOpacity={0.7}
              >
                <TrashIcon size={16} color={theme.colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={ExitingSlotsStyled.consultationChipRow}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={ExitingSlotsStyled.slotTypeLabel}>CONSULTATIONS</Text>
            <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>📋</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 6 }}>
            {(consultation_type === 'in-person' ||
              consultation_type === 'in_person' ||
              consultation_type === 'both') && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontSize: 13 }}>👤</Text>
                <Text style={ExitingSlotsStyled.consultationChip}>In-Person</Text>
              </View>
            )}
            {(consultation_type === 'video' || consultation_type === 'both') && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontSize: 13 }}>📹</Text>
                <Text style={ExitingSlotsStyled.consultationChip}>Video</Text>
              </View>
            )}
          </View>
        </View>
        <View style={ExitingSlotsStyled.slotCardGrid}>
          <View style={ExitingSlotsStyled.slotCardGridCell}>
            <View style={ExitingSlotsStyled.slotCardGridRow}>
              <Text style={{ fontSize: 12, marginRight: 4 }}>⏰</Text>
              <Text style={ExitingSlotsStyled.slotCardGridLabel}>TIME</Text>
            </View>
            <Text style={ExitingSlotsStyled.slotCardGridValue}>
              {formattedFromTime} - {formattedToTime}
            </Text>
          </View>

          {isSpecific ? (
            <View style={ExitingSlotsStyled.slotCardGridCell}>
              <View style={ExitingSlotsStyled.slotCardGridRow}>
                <Text style={{ fontSize: 12, marginRight: 4 }}>⏳</Text>
                <Text style={ExitingSlotsStyled.slotCardGridLabel}>DURATION</Text>
              </View>
              <Text style={ExitingSlotsStyled.slotCardGridValue}>{slot_duration} min</Text>
            </View>
          ) : (
            <View style={ExitingSlotsStyled.slotCardGridCell}>
              <View style={ExitingSlotsStyled.slotCardGridRow}>
                <Text style={{ fontSize: 12, marginRight: 4 }}>📅</Text>
                <Text style={ExitingSlotsStyled.slotCardGridLabel}>DAYS</Text>
              </View>
              <Text style={ExitingSlotsStyled.slotCardGridValue} numberOfLines={2}>
                {formattedRecurringDays || 'N/A'}
              </Text>
            </View>
          )}
        </View>

        <View style={ExitingSlotsStyled.slotFeesRow}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={ExitingSlotsStyled.slotFeeLabel}>CONSULTATION FEES</Text>
            <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>💳</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {(consultation_type === 'in-person' ||
              consultation_type === 'in_person' ||
              consultation_type === 'both') && (
              <View style={ExitingSlotsStyled.slotFeeCell}>
                <Text style={ExitingSlotsStyled.slotFeeTypeLabel}>IN-PERSON</Text>
                <Text style={ExitingSlotsStyled.slotFeeValue}>₹{in_person_fee}</Text>
              </View>
            )}
            {(consultation_type === 'video' || consultation_type === 'both') && (
              <View style={ExitingSlotsStyled.slotFeeCell}>
                <Text style={ExitingSlotsStyled.slotFeeTypeLabel}>VIDEO</Text>
                <Text style={ExitingSlotsStyled.slotFeeValue}>₹{video_fee}</Text>
              </View>
            )}
          </View>
        </View>
        {isSpecific && safeSelectedDates.length > 0 && (
          <View style={ExitingSlotsStyled.slotDatesRow}>
            <Text style={ExitingSlotsStyled.slotDatesLabel}>AVAILABLE DATES</Text>
            <Text style={ExitingSlotsStyled.slotDatesValue}>
              {expandedDates
                ? safeSelectedDates.map(d => formatDisplayDate(d)).join(', ')
                : safeSelectedDates
                    .slice(0, 3)
                    .map(d => formatDisplayDate(d))
                    .join(', ')}
              {safeSelectedDates.length > 3 && (
                <Text
                  style={ExitingSlotsStyled.moreDatesLink}
                  onPress={() => setExpandedDates(!expandedDates)}
                >
                  {expandedDates ? '  show less' : `  +${safeSelectedDates.length - 3} more`}
                </Text>
              )}
            </Text>
          </View>
        )}
        {!isSpecific && safeRecurringDates.length > 0 && (
          <View style={ExitingSlotsStyled.slotDatesRow}>
            <Text style={ExitingSlotsStyled.slotDatesLabel}>
              RECURRING DATES ({safeRecurringDates.length})
            </Text>
            <Text style={ExitingSlotsStyled.slotDatesValue}>
              {expandedRecurringDates
                ? safeRecurringDates.map(d => formatDisplayDate(d)).join(', ')
                : safeRecurringDates
                    .slice(0, 4)
                    .map(d => formatDisplayDate(d))
                    .join(', ')}
              {safeRecurringDates.length > 4 && (
                <Text
                  style={ExitingSlotsStyled.moreDatesLink}
                  onPress={() => setExpandedRecurringDates(!expandedRecurringDates)}
                >
                  {expandedRecurringDates
                    ? '  show less'
                    : `  +${safeRecurringDates.length - 4} more`}
                </Text>
              )}
            </Text>
          </View>
        )}
        {safeLeaveDates.length > 0 && (
          <View style={ExitingSlotsStyled.slotLeaveRow}>
            <View style={{ flex: 1 }}>
              <Text style={ExitingSlotsStyled.slotLeaveLabel}>LEAVES</Text>
              <Text style={ExitingSlotsStyled.slotLeaveValue}>
                {expandedLeaves
                  ? safeLeaveDates.map(d => formatDisplayDate(d)).join(', ')
                  : safeLeaveDates
                      .slice(0, 2)
                      .map(d => formatDisplayDate(d))
                      .join(', ')}
                {safeLeaveDates.length > 2 && (
                  <Text
                    style={ExitingSlotsStyled.moreLeavesLink}
                    onPress={() => setExpandedLeaves(!expandedLeaves)}
                  >
                    {expandedLeaves ? '  show less' : `  +${safeLeaveDates.length - 2} more`}
                  </Text>
                )}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
);

export default ExistingSlotCard;
