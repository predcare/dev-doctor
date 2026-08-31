import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CalendarIcon from '../../ui/icons/CalendarIcon';
import EditIcon from '../../ui/icons/EditIcon';
import TrashIcon from '../../ui/icons/TrashIcon';
import { theme } from '../../../styled/theme.styled';

export interface AvailabilitySlotItem {
  id: number;
  date_selection_mode: 'specific' | 'recurring';
  selected_dates: string[];
  recurring_days: string[];
  recurring_start_date?: string | null;
  recurring_end_date?: string | null;
  leave_dates: string[];
  from_time: string;
  to_time: string;
  consultation_type: 'in-person' | 'video' | 'both';
  slot_duration: number;
  in_person_fee: number | string;
  video_fee?: number | string;
}

export interface ExistingSlotCardProps {
  slot: AvailabilitySlotItem;
  onEdit?: (slot: AvailabilitySlotItem) => void;
  onDelete?: (id: number) => void;
}

const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const ds = dateStr.split('T')[0];
    const [year, month, day] = ds.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

export const ExistingSlotCard: React.FC<ExistingSlotCardProps> = React.memo(
  ({ slot, onEdit, onDelete }) => {
    const [expandedDates, setExpandedDates] = useState(false);
    const [expandedLeaves, setExpandedLeaves] = useState(false);

    const isSpecific = slot.date_selection_mode === 'specific';

    return (
      <View style={s.existingSlotCard}>
        {/* ── TYPE Header Row ── */}
        <View style={s.slotCardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={s.slotTypeIconBox}>
              <CalendarIcon size={20} color={theme.colors.primary} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={s.slotTypeLabel}>TYPE</Text>
              <Text style={s.slotCardMode}>
                {isSpecific ? 'Specific Dates' : 'Recurring Schedule'}
              </Text>
            </View>
          </View>

          <View style={s.slotCardActions}>
            {isSpecific ? (
              <>
                {onEdit && (
                  <TouchableOpacity
                    style={s.manageBtn}
                    onPress={() => onEdit(slot)}
                    activeOpacity={0.75}
                  >
                    <Text style={s.manageBtnText}>MANAGE</Text>
                    <Text style={{ fontSize: 10, color: theme.colors.primary, marginLeft: 3 }}>⚙</Text>
                  </TouchableOpacity>
                )}
                {onDelete && (
                  <TouchableOpacity
                    style={s.deleteButton}
                    onPress={() => onDelete(slot.id)}
                    activeOpacity={0.7}
                  >
                    <TrashIcon size={16} color={theme.colors.danger} />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                {onEdit && (
                  <TouchableOpacity
                    style={s.editButton}
                    onPress={() => onEdit(slot)}
                    activeOpacity={0.7}
                  >
                    <EditIcon size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                )}
                {onDelete && (
                  <TouchableOpacity
                    style={s.deleteButton}
                    onPress={() => onDelete(slot.id)}
                    activeOpacity={0.7}
                  >
                    <TrashIcon size={16} color={theme.colors.danger} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>

        {/* ── CONSULTATIONS Chip Row ── */}
        <View style={s.consultationChipRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={s.slotTypeLabel}>CONSULTATIONS</Text>
            <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>📋</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 6 }}>
            {(slot.consultation_type === 'in-person' || slot.consultation_type === 'both') && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontSize: 13 }}>👤</Text>
                <Text style={s.consultationChip}>In-Person</Text>
              </View>
            )}
            {(slot.consultation_type === 'video' || slot.consultation_type === 'both') && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontSize: 13 }}>📹</Text>
                <Text style={s.consultationChip}>Video</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── TIME + DAYS/DURATION Grid ── */}
        <View style={s.slotCardGrid}>
          <View style={s.slotCardGridCell}>
            <View style={s.slotCardGridRow}>
              <Text style={{ fontSize: 12, marginRight: 4 }}>⏰</Text>
              <Text style={s.slotCardGridLabel}>TIME</Text>
            </View>
            <Text style={s.slotCardGridValue}>{slot.from_time} - {slot.to_time}</Text>
          </View>

          {isSpecific ? (
            <View style={s.slotCardGridCell}>
              <View style={s.slotCardGridRow}>
                <Text style={{ fontSize: 12, marginRight: 4 }}>⏳</Text>
                <Text style={s.slotCardGridLabel}>DURATION</Text>
              </View>
              <Text style={s.slotCardGridValue}>{slot.slot_duration} min</Text>
            </View>
          ) : (
            <View style={s.slotCardGridCell}>
              <View style={s.slotCardGridRow}>
                <Text style={{ fontSize: 12, marginRight: 4 }}>📅</Text>
                <Text style={s.slotCardGridLabel}>DAYS</Text>
              </View>
              <Text style={s.slotCardGridValue}>{slot.recurring_days.join(', ')}</Text>
            </View>
          )}
        </View>

        {/* ── CONSULTATION FEES ── */}
        <View style={s.slotFeesRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={s.slotFeeLabel}>CONSULTATION FEES</Text>
            <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>💳</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {(slot.consultation_type === 'in-person' || slot.consultation_type === 'both') && (
              <View style={s.slotFeeCell}>
                <Text style={s.slotFeeTypeLabel}>IN-PERSON</Text>
                <Text style={s.slotFeeValue}>₹{slot.in_person_fee}</Text>
              </View>
            )}
            {(slot.consultation_type === 'video' || slot.consultation_type === 'both') && (
              <View style={s.slotFeeCell}>
                <Text style={s.slotFeeTypeLabel}>VIDEO</Text>
                <Text style={s.slotFeeValue}>₹{slot.video_fee || '0'}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── AVAILABLE DATES (Specific) ── */}
        {isSpecific && slot.selected_dates.length > 0 && (
          <View style={s.slotDatesRow}>
            <Text style={s.slotDatesLabel}>AVAILABLE DATES</Text>
            <Text style={s.slotDatesValue}>
              {expandedDates
                ? slot.selected_dates.map(d => formatDisplayDate(d)).join(', ')
                : slot.selected_dates.slice(0, 3).map(d => formatDisplayDate(d)).join(', ')}
              {slot.selected_dates.length > 3 && (
                <Text
                  style={s.moreDatesLink}
                  onPress={() => setExpandedDates(!expandedDates)}
                >
                  {expandedDates ? '  show less' : `  +${slot.selected_dates.length - 3} more`}
                </Text>
              )}
            </Text>
          </View>
        )}

        {/* ── LEAVES ── */}
        {slot.leave_dates && slot.leave_dates.length > 0 && (
          <View style={s.slotLeaveRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.slotLeaveLabel}>LEAVES</Text>
              <Text style={s.slotLeaveValue}>
                {expandedLeaves
                  ? slot.leave_dates.map(d => formatDisplayDate(d)).join(', ')
                  : slot.leave_dates.slice(0, 2).map(d => formatDisplayDate(d)).join(', ')}
                {slot.leave_dates.length > 2 && (
                  <Text
                    style={s.moreLeavesLink}
                    onPress={() => setExpandedLeaves(!expandedLeaves)}
                  >
                    {expandedLeaves ? '  show less' : `  +${slot.leave_dates.length - 2} more`}
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

const s = StyleSheet.create({
  existingSlotCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  slotCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  slotTypeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotTypeLabel: {
    fontSize: 9,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  slotCardMode: {
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    marginTop: 1,
  },
  slotCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.surface,
  },
  manageBtnText: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    letterSpacing: 0.4,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultationChipRow: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  consultationChip: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  slotCardGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  slotCardGridCell: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.bg,
  },
  slotCardGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  slotCardGridLabel: {
    fontSize: 9,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  slotCardGridValue: {
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  slotFeesRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  slotFeeCell: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 8,
  },
  slotFeeLabel: {
    fontSize: 9,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  slotFeeTypeLabel: {
    fontSize: 9,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  slotFeeValue: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  slotDatesRow: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  slotDatesLabel: {
    fontSize: 9,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  slotDatesValue: {
    fontSize: 12,
    color: theme.colors.dark,
  },
  moreDatesLink: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  slotLeaveRow: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  slotLeaveLabel: {
    fontSize: 9,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  slotLeaveValue: {
    fontSize: 12,
    color: theme.colors.danger,
  },
  moreLeavesLink: {
    color: theme.colors.danger,
    fontWeight: theme.fontWeight.bold,
  },
});

export default ExistingSlotCard;
