import dayjs from 'dayjs';
import {
  IDocBookingAvailRoot,
  IDocBookingAvailSlot,
  IMyAvailabilityDoc,
} from '../typescripts/interfaces/availability.interfaces';

export interface ParsedAvailableDate {
  date: string;
  formattedDate: string;
  relativeLabel: string;
  in_person_fee: number;
  video_fee: number;
  consultation_type: string;
  clinic_id: number | string;
  availability_id?: number | string;
}

export type SlotPeriod = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';

export interface ISlotItem {
  start: string;
  end: string;
  displayTime: string;
  period: SlotPeriod;
  booked: boolean;
}

export function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  const hour = parseInt(parts[0], 10);
  const minutes = parts[1] || '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function getSlotPeriod(startTimeStr: string): SlotPeriod {
  if (!startTimeStr) return 'MORNING';
  const hour = parseInt(startTimeStr.split(':')[0], 10);
  if (hour < 12) return 'MORNING';
  if (hour < 16) return 'AFTERNOON';
  if (hour < 20) return 'EVENING';
  return 'NIGHT';
}

export function groupSlotsByPeriod(
  timeSlots: { start: string; end: string }[] = [],
  bookedSlotsMap: Record<string, string[]> = {},
  selectedDate: string = ''
): Record<SlotPeriod, ISlotItem[]> {
  const result: Record<SlotPeriod, ISlotItem[]> = {
    MORNING: [],
    AFTERNOON: [],
    EVENING: [],
    NIGHT: [],
  };

  if (!timeSlots || timeSlots.length === 0) {
    return result;
  }

  const bookedList = (selectedDate && bookedSlotsMap[selectedDate]) || [];
  const bookedSet = new Set(bookedList);
  const now = dayjs();

  timeSlots.forEach(slot => {
    if (selectedDate) {
      const slotTimeStr = slot.start.includes('T') ? slot.start : `${selectedDate}T${slot.start}`;
      const slotTime = dayjs(slotTimeStr);

      if (slotTime.isValid() && slotTime.isBefore(now)) {
        return;
      }
    }

    const period = getSlotPeriod(slot.start);
    const isBooked = bookedSet.has(slot.start);
    const startFormatted = formatTime12h(slot.start);
    const endFormatted = formatTime12h(slot.end);

    result[period].push({
      start: slot.start,
      end: slot.end,
      displayTime: `${startFormatted} - ${endFormatted}`,
      period,
      booked: isBooked,
    });
  });

  return result;
}

export function parseDoctorAvailableDates(
  availability?: IMyAvailabilityDoc | null,
  referenceDateStr?: string
): ParsedAvailableDate[] {
  if (!availability) return [];

  const isRecurring = availability.date_selection_mode === 'recurring';
  const rawDates: string[] = isRecurring
    ? availability.recurring_dates || []
    : availability.selected_dates || [];

  const leaveSet = new Set(availability.leave_dates || []);

  const ref = referenceDateStr ? dayjs(referenceDateStr) : dayjs();
  const today = ref.startOf('day');

  const validDates = rawDates.filter(d => {
    if (!d || leaveSet.has(d)) return false;
    const dateObj = dayjs(d).startOf('day');
    return !dateObj.isBefore(today);
  });

  const inPersonFee = parseFloat(String(availability.in_person_fee || 0)) || 0;
  const videoFee = parseFloat(String(availability.video_fee || 0)) || 0;

  return validDates.map(dateStr => {
    const d = dayjs(dateStr).startOf('day');

    const formattedDate = d.format('ddd, MMM DD');

    const diffDays = d.diff(today, 'day');
    let relativeLabel = '';
    if (diffDays === 0) {
      relativeLabel = 'Today';
    } else if (diffDays === 1) {
      relativeLabel = 'Tomorrow';
    } else if (diffDays === 2) {
      relativeLabel = 'In 2 days';
    } else {
      relativeLabel = `In ${diffDays} days`;
    }

    return {
      date: dateStr,
      formattedDate,
      relativeLabel,
      in_person_fee: inPersonFee,
      video_fee: videoFee,
      consultation_type: availability.consultation_type || 'both',
      clinic_id: availability.clinic_id,
      availability_id: availability.id,
    };
  });
}

export function parseBookingAvailableDates(
  bookingAvail?: IDocBookingAvailRoot | null,
  referenceDateStr?: string
): ParsedAvailableDate[] {
  if (!bookingAvail || !bookingAvail.dates || bookingAvail.dates.length === 0) return [];

  const ref = referenceDateStr ? dayjs(referenceDateStr) : dayjs();
  const today = ref.startOf('day');

  return bookingAvail.dates
    .filter(item => item && item.date)
    .map(item => {
      const d = dayjs(item.date).startOf('day');
      const formattedDate = d.format('ddd, MMM DD');
      const diffDays = d.diff(today, 'day');
      let relativeLabel = '';
      if (diffDays === 0) {
        relativeLabel = 'Today';
      } else if (diffDays === 1) {
        relativeLabel = 'Tomorrow';
      } else if (diffDays === 2) {
        relativeLabel = 'In 2 days';
      } else if (diffDays > 2) {
        relativeLabel = `In ${diffDays} days`;
      }

      const firstSlot = item.slots && item.slots.length > 0 ? item.slots[0] : null;
      const inPersonFee = firstSlot ? parseFloat(String(firstSlot.in_person_fee || 0)) || 0 : 0;
      const videoFee = firstSlot ? parseFloat(String(firstSlot.video_fee || 0)) || 0 : 0;
      const consultationType = firstSlot?.consultation_type || 'both';

      return {
        date: item.date,
        formattedDate,
        relativeLabel,
        in_person_fee: inPersonFee,
        video_fee: videoFee,
        consultation_type: consultationType,
        clinic_id: bookingAvail.clinic_id,
        availability_id: firstSlot?.availability_id,
      };
    });
}

export function groupBookingSlotsByPeriod(
  slots: IDocBookingAvailSlot[] = [],
  selectedDate: string = ''
): Record<SlotPeriod, ISlotItem[]> {
  const result: Record<SlotPeriod, ISlotItem[]> = {
    MORNING: [],
    AFTERNOON: [],
    EVENING: [],
    NIGHT: [],
  };

  if (!slots || slots.length === 0) {
    return result;
  }

  const now = dayjs();

  slots.forEach(slot => {
    if (selectedDate) {
      const slotTimeStr = slot.start.includes('T') ? slot.start : `${selectedDate}T${slot.start}`;
      const slotTime = dayjs(slotTimeStr);

      if (slotTime.isValid() && slotTime.isBefore(now)) {
        return;
      }
    }

    const period = getSlotPeriod(slot.start);
    const startFormatted = formatTime12h(slot.start);
    const endFormatted = formatTime12h(slot.end);

    result[period].push({
      start: slot.start,
      end: slot.end,
      displayTime: `${startFormatted} - ${endFormatted}`,
      period,
      booked: !!slot.booked,
    });
  });

  return result;
}

export const normalizeApiTime = (time?: string | null): string => {
  if (!time) return '';
  const s = String(time).trim();
  return s.length === 5 ? `${s}:00` : s;
};
