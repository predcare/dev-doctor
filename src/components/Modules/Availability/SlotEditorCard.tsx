import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
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
import { SlotEditCardStyles } from '../../../styled/DoctorAvailabilityScreen.styled';
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
      if (!userData?.id) {
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

      const targetMode =
        data.editorTab === 'leave'
          ? (editingSlot?.date_selection_mode as string) ||
            (data.recurringDays && data.recurringDays.length > 0 ? 'recurring' : 'specific')
          : data.editorTab;

      const slotPayload: Record<string, any> = {
        clinic_id: userData?.clinic?.id || '',
        date_selection_mode: targetMode,
        selected_dates: data.selectedDates || [],
        recurring_days: data.recurringDays || [],
        recurring_start_date:
          data.startDate && data.startDate.trim() !== '' ? data.startDate : null,
        recurring_end_date: data.endDate && data.endDate.trim() !== '' ? data.endDate : null,
        leave_dates: data.leaveDates || [],
        slot_duration: Number(data.slotDuration),
        from_time: fromTimeHHMM,
        to_time: toTimeHHMM,
        consultation_type: data.consultationType,
        in_person_fee: calcInPersonFee,
        video_fee: calcVideoFee,
        hide_fee: Boolean(data.hideFee),
        require_payment: Boolean(data.requirePayment),
        status: true,
      };

      if (editingSlot?.id) {
        showLoader('Updating...');
        updateAvailbility(
          {
            id: editingSlot.id,
            body: slotPayload,
          },
          {
            onSuccess: async res => {
              if (res?.success) {
                showSuccessToast(res?.message);
                await queryClient.invalidateQueries({
                  queryKey: [AvailbilityQueryKeys.GetAvailablity],
                });
                hideLoader();
                if (onSave) onSave(data);
                onCancel();
              } else {
                hideLoader();
              }
            },
            onError: () => {
              hideLoader();
            },
          }
        );
      } else {
        showLoader('Adding...');
        createAvailbility(
          {
            body: slotPayload,
          },
          {
            onSuccess: async res => {
              if (res?.success) {
                showSuccessToast(res?.message);
                await queryClient.invalidateQueries({
                  queryKey: [AvailbilityQueryKeys.GetAvailablity],
                });
                hideLoader();
                if (onSave) onSave(data);
                onCancel();
              } else {
                hideLoader();
              }
            },
            onError: () => {
              hideLoader();
            },
          }
        );
      }
    };

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

    return (
      <View style={SlotEditCardStyles.card}>
        <View style={SlotEditCardStyles.cardHeader}>
          <Text style={SlotEditCardStyles.slotTitle}>
            {editingSlot ? `Edit Slot #${editingSlot.id}` : `Slot Configuration #${slotIndex + 1}`}
          </Text>
          <TouchableOpacity
            onPress={onCancel}
            style={SlotEditCardStyles.removeBtn}
            activeOpacity={0.7}
          >
            <Text style={SlotEditCardStyles.removeTxt}>✕ Remove</Text>
          </TouchableOpacity>
        </View>
        <View style={SlotEditCardStyles.tabRow}>
          {(['specific', 'recurring', 'leave'] as const).map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[SlotEditCardStyles.tab, isActive && SlotEditCardStyles.tabActive]}
                onPress={() =>
                  setValue('editorTab', tab, { shouldValidate: true, shouldDirty: true })
                }
                activeOpacity={0.8}
              >
                <Text
                  style={[SlotEditCardStyles.tabTxt, isActive && SlotEditCardStyles.tabTxtActive]}
                >
                  {tab === 'specific' ? 'Specific' : tab === 'recurring' ? 'Recurring' : 'Leave'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {activeTab === 'specific' && (
          <View>
            <SlotCalendarPicker
              mode="specific"
              selectedDates={selectedDates}
              leaveDates={leaveDates}
              onToggleDate={handleToggleDate}
            />
            {Boolean(errors.selectedDates?.message) && (
              <Text style={SlotEditCardStyles.errorTxt}>{errors.selectedDates?.message}</Text>
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
              leaveDates={leaveDates}
              onToggleDate={handleToggleLeaveDate}
            />
            {Boolean(errors.leaveDates?.message) && (
              <Text style={SlotEditCardStyles.errorTxt}>{errors.leaveDates?.message}</Text>
            )}
          </View>
        )}

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
          onToggleHideFee={val => {
            setValue('hideFee', val, { shouldValidate: true, shouldDirty: true });
            if (val) {
              setValue('requirePayment', false, { shouldValidate: true, shouldDirty: true });
            }
          }}
          onToggleRequirePayment={val => {
            setValue('requirePayment', val, { shouldValidate: true, shouldDirty: true });
            if (val) {
              setValue('hideFee', false, { shouldValidate: true, shouldDirty: true });
            }
          }}
        />

        <View style={SlotEditCardStyles.actionRow}>
          <TouchableOpacity
            style={[SlotEditCardStyles.saveBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit(handleFormSave)}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <Text style={SlotEditCardStyles.saveBtnTxt}>
                {editingSlot?.id ? '💾 Update Availability' : '💾 Add Availability'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={SlotEditCardStyles.cancelBtn}
            onPress={onCancel}
            activeOpacity={0.75}
          >
            <Text style={SlotEditCardStyles.cancelBtnTxt}>✕ Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

export default SlotEditorCard;
