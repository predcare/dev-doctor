import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  useCreateAvailability,
  useUpdateAvailability,
} from '../../../hooks/react-query/availability/availablity.hooks';
import { AvailbilityQueryKeys } from '../../../hooks/react-query/query.keys';
import { showErrorToast, showSuccessToast } from '../../../lib/common/toast.utils';
import {
  AvailabilityFormSchema,
  TAvailabilityFormValues,
} from '../../../lib/schemas/availability.schema';
import { theme } from '../../../styled/theme.styled';
import { IMyAvailabilityDoc } from '../../../typescripts/interfaces/availability.interfaces';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import { queryClient } from '../../providers/ReactQueryProvider';
import RecurringDaysPicker from './RecurringDaysPicker';
import SlotCalendarPicker from './SlotCalendarPicker';
import TimeAndFeeConfig, { TimeValue } from './TimeAndFeeConfig';

export interface SlotEditorCardProps {
  slotIndex: number;
  editingSlot?: IMyAvailabilityDoc | null;
  existingSlots?: IMyAvailabilityDoc[];
  onSave?: (data: TAvailabilityFormValues) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const parseTimeStringToTimeValue = (timeStr?: string | null): TimeValue => {
  if (!timeStr) return { hour: '09', minute: '00', period: 'AM' };
  const trimmed = timeStr.trim();
  const parts = trimmed.split(':');
  let h = parseInt(parts[0], 10) || 9;
  const m = parts[1] || '00';
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  const hourStr = String(h).padStart(2, '0');
  return { hour: hourStr, minute: m, period };
};

const formatTimeValueToHHMM = (tv: TimeValue): string => {
  if (!tv) return '09:00';
  let h = parseInt(tv.hour, 10) || 9;
  if (tv.period === 'PM' && h < 12) h += 12;
  if (tv.period === 'AM' && h === 12) h = 0;
  const hh = String(h).padStart(2, '0');
  const mm = String(tv.minute || '00').padStart(2, '0');
  return `${hh}:${mm}`;
};

const consultationOverlaps = (a: string, b: string): boolean => {
  if (a === b) return true;
  if (a === 'both' || b === 'both') return true;
  return false;
};

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const SlotEditorCard: React.FC<SlotEditorCardProps> = React.memo(
  ({ slotIndex, editingSlot, existingSlots = [], onSave, onCancel, isSaving = false }) => {
    const {
      control,
      handleSubmit,
      setValue,
      reset,
      formState: { errors },
    } = useForm<TAvailabilityFormValues>({
      resolver: yupResolver(AvailabilityFormSchema),
      defaultValues: {
        editorTab: 'specific',
        selectedDates: [],
        recurringDays: [],
        startDate: null,
        endDate: null,
        leaveDates: [],
        fromTime: { hour: '09', minute: '00', period: 'AM' },
        toTime: { hour: '05', minute: '00', period: 'PM' },
        consultationType: 'in-person',
        slotDuration: 30,
        inPersonFee: '',
        videoFee: '',
        hideFee: false,
        requirePayment: false,
      },
    });

    const { mutate: updateAvailbility, isPending: isUpdatePending } = useUpdateAvailability();
    const { mutate: createAvailbility, isPending: isCreatePending } = useCreateAvailability();
    const { userData } = useAuthStore(state => state);
    const { showLoader, hideLoader } = useLoadingStore(state => state);

    const isSubmitting = isSaving || isUpdatePending || isCreatePending;

    const activeTab = useWatch({ control, name: 'editorTab' }) || 'specific';
    const selectedDates = useWatch({ control, name: 'selectedDates' }) || [];
    const recurringDays = useWatch({ control, name: 'recurringDays' }) || [];
    const startDate = useWatch({ control, name: 'startDate' });
    const endDate = useWatch({ control, name: 'endDate' });
    const leaveDates = useWatch({ control, name: 'leaveDates' }) || [];
    const fromTime = useWatch({ control, name: 'fromTime' }) || {
      hour: '09',
      minute: '00',
      period: 'AM',
    };
    const toTime = useWatch({ control, name: 'toTime' }) || {
      hour: '05',
      minute: '00',
      period: 'PM',
    };
    const consultationType = useWatch({ control, name: 'consultationType' }) || 'in-person';
    const slotDuration = useWatch({ control, name: 'slotDuration' }) ?? 30;
    const inPersonFee = useWatch({ control, name: 'inPersonFee' }) || '';
    const videoFee = useWatch({ control, name: 'videoFee' }) || '';
    const hideFee = useWatch({ control, name: 'hideFee' }) ?? false;
    const requirePayment = useWatch({ control, name: 'requirePayment' }) ?? false;

    useEffect(() => {
      if (editingSlot) {
        reset({
          editorTab:
            editingSlot.date_selection_mode === 'recurring' ||
            editingSlot.date_selection_mode === 'leave' ||
            editingSlot.date_selection_mode === 'specific'
              ? editingSlot.date_selection_mode
              : 'specific',
          selectedDates: editingSlot.selected_dates || [],
          recurringDays: editingSlot.recurring_days || [],
          startDate: editingSlot.recurring_start_date || null,
          endDate: editingSlot.recurring_end_date || null,
          leaveDates: editingSlot.leave_dates || [],
          fromTime: parseTimeStringToTimeValue(editingSlot.from_time),
          toTime: parseTimeStringToTimeValue(editingSlot.to_time),
          consultationType:
            editingSlot.consultation_type === 'video' ||
            editingSlot.consultation_type === 'both' ||
            editingSlot.consultation_type === 'in-person'
              ? editingSlot.consultation_type
              : 'in-person',
          slotDuration: editingSlot.slot_duration || 30,
          inPersonFee: editingSlot.in_person_fee ? String(editingSlot.in_person_fee) : '',
          videoFee: editingSlot.video_fee ? String(editingSlot.video_fee) : '',
          hideFee: Boolean(editingSlot.hide_fee),
          requirePayment: Boolean(editingSlot.require_payment),
        });
      } else {
        reset({
          editorTab: 'specific',
          selectedDates: [],
          recurringDays: [],
          startDate: null,
          endDate: null,
          leaveDates: [],
          fromTime: { hour: '09', minute: '00', period: 'AM' },
          toTime: { hour: '05', minute: '00', period: 'PM' },
          consultationType: 'in-person',
          slotDuration: 30,
          inPersonFee: '',
          videoFee: '',
          hideFee: false,
          requirePayment: false,
        });
      }
    }, [editingSlot, reset]);

    const handleToggleDate = (dateStr: string) => {
      const current = selectedDates;
      const updated = current.includes(dateStr)
        ? current.filter(d => d !== dateStr)
        : [...current, dateStr];
      setValue('selectedDates', updated, { shouldValidate: true, shouldDirty: true });
    };

    const handleToggleLeaveDate = (dateStr: string) => {
      const current = leaveDates;
      const updated = current.includes(dateStr)
        ? current.filter(d => d !== dateStr)
        : [...current, dateStr];
      setValue('leaveDates', updated, { shouldValidate: true, shouldDirty: true });
    };

    const handleToggleRecurringDay = (dayKey: string) => {
      const current = recurringDays;
      const updated = current.includes(dayKey)
        ? current.filter(d => d !== dayKey)
        : [...current, dayKey];
      setValue('recurringDays', updated, { shouldValidate: true, shouldDirty: true });
    };

    const handleFormSave = (data: TAvailabilityFormValues) => {
      if (!userData?.user_id) {
        return showErrorToast('Doctor information not found. Please log in again.');
      }

      // 1. Fee calculations based on consultation type
      let calcInPersonFee = 0;
      let calcVideoFee = 0;

      if (data.consultationType === 'in-person') {
        calcInPersonFee = parseFloat(data.inPersonFee) || 0;
        calcVideoFee = 0;
      } else if (data.consultationType === 'video') {
        calcInPersonFee = 0;
        calcVideoFee = parseFloat(data.videoFee) || 0;
      } else if (data.consultationType === 'both') {
        calcInPersonFee = parseFloat(data.inPersonFee) || 0;
        calcVideoFee = parseFloat(data.videoFee) || 0;
      }

      const fromTimeHHMM = formatTimeValueToHHMM(data.fromTime);
      const toTimeHHMM = formatTimeValueToHHMM(data.toTime);

      // 2. Duplicate Check against existingSlots
      if (existingSlots && existingSlots.length > 0) {
        const fromHHMM = fromTimeHHMM.substring(0, 5);
        const toHHMM = toTimeHHMM.substring(0, 5);

        for (const existing of existingSlots) {
          if (editingSlot?.id && existing.id === editingSlot.id) continue;

          const existingFrom = (existing.from_time || '').substring(0, 5);
          const existingTo = (existing.to_time || '').substring(0, 5);

          const sameTime = existingFrom === fromHHMM && existingTo === toHHMM;
          const sameDuration = Number(existing.slot_duration) === Number(data.slotDuration);
          const sameConsult = consultationOverlaps(
            existing.consultation_type,
            data.consultationType
          );

          if (sameTime && sameDuration && sameConsult) {
            if (data.editorTab === 'specific' && existing.date_selection_mode === 'specific') {
              const existingDates = existing.selected_dates || [];
              const overlap = data.selectedDates.filter(d => existingDates.includes(d));
              if (overlap.length > 0) {
                showErrorToast(
                  `You already have a ${existing.consultation_type} slot on ${overlap.join(
                    ', '
                  )} from ${fromHHMM} to ${toHHMM}.`,
                  'Duplicate Availability'
                );
                return;
              }
            } else if (
              data.editorTab === 'recurring' &&
              existing.date_selection_mode === 'recurring'
            ) {
              const existingDays = existing.recurring_days || [];
              const overlapDays = data.recurringDays.filter(d => existingDays.includes(d));
              if (overlapDays.length > 0) {
                showErrorToast(
                  `You already have a recurring ${
                    existing.consultation_type
                  } slot on ${overlapDays.join(', ')} from ${fromHHMM} to ${toHHMM}.`,
                  'Duplicate Availability'
                );
                return;
              }
            }
          }
        }
      }

      // 3. Single Slot Payload Construction
      const slotPayload: Record<string, any> = {
        date_selection_mode: data.editorTab,
        selected_dates: data.editorTab === 'specific' ? data.selectedDates : [],
        recurring_days: data.editorTab === 'recurring' ? data.recurringDays : [],
        recurring_start_date:
          data.editorTab === 'recurring' && data.startDate && data.startDate.trim() !== ''
            ? data.startDate
            : null,
        recurring_end_date:
          data.editorTab === 'recurring' && data.endDate && data.endDate.trim() !== ''
            ? data.endDate
            : null,
        leave_dates: data.editorTab === 'leave' ? data.leaveDates : [],
        from_time: fromTimeHHMM,
        to_time: toTimeHHMM,
        consultation_type: data.consultationType,
        slot_duration: Number(data.slotDuration),
        in_person_fee: calcInPersonFee,
        video_fee: calcVideoFee,
        hide_fee: data.hideFee ? 1 : 0,
        require_payment: data.requirePayment ? 1 : 0,
      };

      if (editingSlot?.id) {
        showLoader('Updating...');
        updateAvailbility(
          {
            id: editingSlot.id,
            body: slotPayload,
          },
          {
            onSuccess: async () => {
              showSuccessToast('Doctor availability updated successfully');
              await queryClient.invalidateQueries({
                queryKey: [AvailbilityQueryKeys.GetAvailablity],
              });
              hideLoader();
              if (onSave) onSave(data);
              onCancel();
            },
            onError: (err: any) => {
              console.log('Update availability error response:', err?.response?.data);
              const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                'Failed to update availability';
              showErrorToast(msg);
              hideLoader();
            },
          }
        );
      } else {
        // POST OPERATION: Wrap slotPayload inside { doctor_id, clinic_id, slots: [slotPayload] }
        const createPayload = {
          doctor_id: Number(userData.user_id),
          clinic_id: userData.clinic_id ? Number(userData.clinic_id) : 1,
          slots: [slotPayload],
        };

        showLoader('Adding...');
        createAvailbility(
          {
            doctorId: Number(userData.user_id),
            body: createPayload,
          },
          {
            onSuccess: async () => {
              showSuccessToast('Doctor availability created successfully');
              await queryClient.invalidateQueries({
                queryKey: [AvailbilityQueryKeys.GetAvailablity],
              });
              hideLoader();
              if (onSave) onSave(data);
              onCancel();
            },
            onError: (err: any) => {
              console.log('Create availability error response:', err?.response?.data);
              const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                'Failed to create availability';
              showErrorToast(msg);
              hideLoader();
            },
          }
        );
      }
    };

    return (
      <View style={s.card}>
        {/* Editor Card Header */}
        <View style={s.cardHeader}>
          <Text style={s.slotTitle}>
            {editingSlot ? `Edit Slot #${editingSlot.id}` : `Slot Configuration #${slotIndex + 1}`}
          </Text>
          <TouchableOpacity onPress={onCancel} style={s.removeBtn} activeOpacity={0.7}>
            <Text style={s.removeTxt}>✕ Remove</Text>
          </TouchableOpacity>
        </View>

        {/* Mode Tabs */}
        <View style={s.tabRow}>
          {(['specific', 'recurring', 'leave'] as const).map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[s.tab, isActive && s.tabActive]}
                onPress={() =>
                  setValue('editorTab', tab, { shouldValidate: true, shouldDirty: true })
                }
                activeOpacity={0.8}
              >
                <Text style={[s.tabTxt, isActive && s.tabTxtActive]}>
                  {tab === 'specific' ? 'Specific' : tab === 'recurring' ? 'Recurring' : 'Leave'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Mode Calendar / Schedule Config */}
        {activeTab === 'specific' && (
          <View>
            <SlotCalendarPicker
              mode="specific"
              selectedDates={selectedDates}
              onToggleDate={handleToggleDate}
            />
            {Boolean(errors.selectedDates?.message) && (
              <Text style={s.errorTxt}>{errors.selectedDates?.message}</Text>
            )}
          </View>
        )}

        {activeTab === 'recurring' && (
          <View>
            <RecurringDaysPicker
              recurringDays={recurringDays}
              startDate={startDate}
              endDate={endDate}
              startDateError={errors.startDate?.message}
              endDateError={errors.endDate?.message}
              recurringDaysError={errors.recurringDays?.message}
              onToggleDay={handleToggleRecurringDay}
              onChangeStartDate={dateStr =>
                setValue('startDate', dateStr, { shouldValidate: true, shouldDirty: true })
              }
              onChangeEndDate={dateStr =>
                setValue('endDate', dateStr, { shouldValidate: true, shouldDirty: true })
              }
            />
          </View>
        )}

        {activeTab === 'leave' && (
          <View>
            <SlotCalendarPicker
              mode="leave"
              selectedDates={leaveDates}
              onToggleDate={handleToggleLeaveDate}
            />
            {Boolean(errors.leaveDates?.message) && (
              <Text style={s.errorTxt}>{errors.leaveDates?.message}</Text>
            )}
          </View>
        )}

        {/* Time, Mode, Duration & Fee Config */}
        <TimeAndFeeConfig
          fromTime={fromTime}
          toTime={toTime}
          consultationType={consultationType}
          slotDuration={slotDuration}
          inPersonFee={inPersonFee}
          videoFee={videoFee}
          inPersonFeeError={errors.inPersonFee?.message}
          videoFeeError={errors.videoFee?.message}
          hideFee={hideFee}
          requirePayment={requirePayment}
          onChangeFromTime={(field: keyof TimeValue, value: string) =>
            setValue(
              'fromTime',
              { ...fromTime, [field]: value },
              { shouldValidate: true, shouldDirty: true }
            )
          }
          onChangeToTime={(field: keyof TimeValue, value: string) =>
            setValue(
              'toTime',
              { ...toTime, [field]: value },
              { shouldValidate: true, shouldDirty: true }
            )
          }
          onChangeConsultationType={type =>
            setValue('consultationType', type, { shouldValidate: true, shouldDirty: true })
          }
          onChangeDuration={dur =>
            setValue('slotDuration', dur, { shouldValidate: true, shouldDirty: true })
          }
          onChangeInPersonFee={fee =>
            setValue('inPersonFee', fee, { shouldValidate: true, shouldDirty: true })
          }
          onChangeVideoFee={fee =>
            setValue('videoFee', fee, { shouldValidate: true, shouldDirty: true })
          }
          onToggleHideFee={val =>
            setValue('hideFee', val, { shouldValidate: true, shouldDirty: true })
          }
          onToggleRequirePayment={val =>
            setValue('requirePayment', val, { shouldValidate: true, shouldDirty: true })
          }
        />

        {/* Save & Cancel Action Buttons Inside Card */}
        <View style={s.actionRow}>
          <TouchableOpacity
            style={[s.saveBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit(handleFormSave)}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <Text style={s.saveBtnTxt}>
                {editingSlot?.id ? '💾 Update Availability' : '💾 Add Availability'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={s.cancelBtn} onPress={onCancel} activeOpacity={0.75}>
            <Text style={s.cancelBtnTxt}>✕ Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

const s = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  slotTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
  },
  removeTxt: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.danger,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabTxt: {
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSlate,
  },
  tabTxtActive: {
    color: theme.colors.surface,
    fontWeight: theme.fontWeight.bold,
  },
  errorTxt: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    fontWeight: theme.fontWeight.semibold,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnTxt: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnTxt: {
    color: theme.colors.textSlate,
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
  },
});

export default SlotEditorCard;
