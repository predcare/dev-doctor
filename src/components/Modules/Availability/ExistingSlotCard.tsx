import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { capitalizeFirstLetter } from '../../../lib/common/common.utils';
import { ExitingSlotsStyled } from '../../../styled/DoctorAvailabilityScreen.styled';
import { theme } from '../../../styled/theme.styled';
import {
  CalendarIcon,
  CircleXIcon,
  ClockIcon,
  CreditCardIcon,
  EditIcon,
  FileTextIcon,
  InfoCircleIcon,
  PatientAvatarIcon,
  ScheduleIcon,
  TrashIcon,
  VideoIcon,
} from '../../ui/icons';

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
  hide_fee?: boolean;
  require_payment?: boolean;
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
    recurring_start_date,
    recurring_end_date,
    recurring_dates = [],
    leave_dates = [],
    slot_duration,
    from_time,
    to_time,
    consultation_type,
    in_person_fee,
    video_fee,
    hide_fee = false,
    require_payment = false,
    onEdit,
    onDelete,
  }) => {
    const [expandedDates, setExpandedDates] = useState(false);
    const [expandedLeaves, setExpandedLeaves] = useState(true);
    const [expandedRecurringDates, setExpandedRecurringDates] = useState(true);

    const safeSelectedDates = useMemo(() => selected_dates || [], [selected_dates]);
    const safeRecurringDays = useMemo(() => recurring_days || [], [recurring_days]);
    const safeRecurringDates = useMemo(() => recurring_dates || [], [recurring_dates]);
    const safeLeaveDates = useMemo(() => leave_dates || [], [leave_dates]);

    const isSpecific = useMemo(() => {
      return date_selection_mode === 'specific';
    }, [date_selection_mode]);

    const formattedRecurringDays = useMemo(() => {
      return safeRecurringDays.map(day => capitalizeFirstLetter(day).slice(0, 3)).join(', ');
    }, [safeRecurringDays]);

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
              <CalendarIcon size={18} color={theme.colors.primary} />
            </View>
            <View style={{ marginLeft: 8 }}>
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
                <EditIcon size={14} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={ExitingSlotsStyled.deleteButton}
                onPress={() => onDelete(id)}
                activeOpacity={0.7}
              >
                <TrashIcon size={14} color={theme.colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={ExitingSlotsStyled.consultationChipRow}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={ExitingSlotsStyled.slotTypeLabel}>CONSULTATIONS</Text>
            <FileTextIcon size={12} color={theme.colors.primary} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 }}>
            {(consultation_type === 'in-person' ||
              consultation_type === 'in_person' ||
              consultation_type === 'both') && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <PatientAvatarIcon size={13} color={theme.colors.primary} />
                <Text style={ExitingSlotsStyled.consultationChip}>In-Person</Text>
              </View>
            )}
            {(consultation_type === 'video' || consultation_type === 'both') && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <VideoIcon size={13} color={theme.colors.primary} />
                <Text style={ExitingSlotsStyled.consultationChip}>Video</Text>
              </View>
            )}
          </View>
        </View>

        <View style={ExitingSlotsStyled.slotCardGrid}>
          <View style={ExitingSlotsStyled.slotCardGridCell}>
            <View style={ExitingSlotsStyled.slotCardGridRow}>
              <ClockIcon size={12} color={theme.colors.textMuted} />
              <Text style={ExitingSlotsStyled.slotCardGridLabel}>TIME</Text>
            </View>
            <Text style={ExitingSlotsStyled.slotCardGridValue}>
              {formattedFromTime} - {formattedToTime}
            </Text>
          </View>

          <View style={ExitingSlotsStyled.slotCardGridCell}>
            <View style={ExitingSlotsStyled.slotCardGridRow}>
              <ScheduleIcon size={12} color={theme.colors.textMuted} />
              <Text style={ExitingSlotsStyled.slotCardGridLabel}>DURATION</Text>
            </View>
            <Text style={ExitingSlotsStyled.slotCardGridValue}>{slot_duration} min</Text>
          </View>
        </View>

        <View style={ExitingSlotsStyled.slotFeesRow}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <Text style={ExitingSlotsStyled.slotFeeLabel}>CONSULTATION FEES</Text>
            <CreditCardIcon size={12} color={theme.colors.textMuted} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(consultation_type === 'in-person' ||
              consultation_type === 'in_person' ||
              consultation_type === 'both') && (
              <View style={ExitingSlotsStyled.slotFeeCell}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}
                >
                  <PatientAvatarIcon size={10} color={theme.colors.textMuted} />
                  <Text style={ExitingSlotsStyled.slotFeeTypeLabel}>IN-PERSON</Text>
                </View>
                <Text style={ExitingSlotsStyled.slotFeeValue}>₹{in_person_fee}</Text>
              </View>
            )}
            {(consultation_type === 'video' || consultation_type === 'both') && (
              <View style={ExitingSlotsStyled.slotFeeCell}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}
                >
                  <VideoIcon size={10} color={theme.colors.textMuted} />
                  <Text style={ExitingSlotsStyled.slotFeeTypeLabel}>VIDEO</Text>
                </View>
                <Text style={ExitingSlotsStyled.slotFeeValue}>₹{video_fee}</Text>
              </View>
            )}
          </View>
        </View>

        {isSpecific && safeSelectedDates.length > 0 && (
          <View style={ExitingSlotsStyled.slotDatesRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 }}>
              <CalendarIcon size={11} color={theme.colors.textMuted} />
              <Text style={ExitingSlotsStyled.slotDatesLabel}>AVAILABLE DATES</Text>
            </View>
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

        {!isSpecific && safeRecurringDays.length > 0 && (
          <View style={ExitingSlotsStyled.slotDatesRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 }}>
              <CalendarIcon size={11} color={theme.colors.textMuted} />
              <Text style={ExitingSlotsStyled.slotDatesLabel}>RECURRING DAYS</Text>
            </View>
            <Text style={ExitingSlotsStyled.slotDatesValue}>{formattedRecurringDays}</Text>
          </View>
        )}

        {!isSpecific && (
          <View style={ExitingSlotsStyled.slotDatesRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <ScheduleIcon size={11} color={theme.colors.textMuted} />
              <Text style={ExitingSlotsStyled.slotDatesLabel}>RECURRING RANGE</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={ExitingSlotsStyled.slotFeeCell}>
                <Text style={ExitingSlotsStyled.slotFeeTypeLabel}>FROM</Text>
                <Text style={ExitingSlotsStyled.slotCardGridValue}>
                  {formatDisplayDate(recurring_start_date) || 'Not set'}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>→</Text>
              <View style={ExitingSlotsStyled.slotFeeCell}>
                <Text style={ExitingSlotsStyled.slotFeeTypeLabel}>TO</Text>
                <Text style={ExitingSlotsStyled.slotCardGridValue}>
                  {formatDisplayDate(recurring_end_date) || 'Not set'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {!isSpecific && safeRecurringDates.length > 0 && (
          <View style={ExitingSlotsStyled.slotDatesRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 }}>
              <CalendarIcon size={11} color={theme.colors.textMuted} />
              <Text style={ExitingSlotsStyled.slotDatesLabel}>
                RECURRING DATES ({safeRecurringDates.length})
              </Text>
            </View>
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

        <View style={ExitingSlotsStyled.slotCardGrid}>
          <View
            style={[
              ExitingSlotsStyled.slotCardGridCell,
              { flexDirection: 'row', alignItems: 'center', gap: 6 },
            ]}
          >
            <InfoCircleIcon
              size={13}
              color={hide_fee ? theme.colors.warning : theme.colors.success}
            />
            <View>
              <Text style={ExitingSlotsStyled.slotCardGridLabel}>HIDE FEE</Text>
              <Text
                style={[
                  ExitingSlotsStyled.slotCardGridValue,
                  { color: hide_fee ? theme.colors.warning : theme.colors.success },
                ]}
              >
                {hide_fee ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
          <View
            style={[
              ExitingSlotsStyled.slotCardGridCell,
              { flexDirection: 'row', alignItems: 'center', gap: 6 },
            ]}
          >
            <CreditCardIcon
              size={13}
              color={require_payment ? theme.colors.success : theme.colors.textMuted}
            />
            <View>
              <Text style={ExitingSlotsStyled.slotCardGridLabel}>ONLINE PAYMENT</Text>
              <Text
                style={[
                  ExitingSlotsStyled.slotCardGridValue,
                  { color: require_payment ? theme.colors.success : theme.colors.textMuted },
                ]}
              >
                {require_payment ? 'Required' : 'Not Required'}
              </Text>
            </View>
          </View>
        </View>

        {safeLeaveDates.length > 0 && (
          <View style={ExitingSlotsStyled.slotLeaveRow}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <CircleXIcon size={11} color={theme.colors.danger} />
                <Text style={ExitingSlotsStyled.slotLeaveLabel}>LEAVES</Text>
              </View>
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
