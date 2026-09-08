import dayjs from 'dayjs';
import { Linking, Platform } from 'react-native';
import { showErrorToast } from './toast.utils';

export interface OpenMapParams {
  address?: string;
  lat?: number | string | null;
  long?: number | string | null;
}

export const openLocationOnMap = (params: OpenMapParams): void => {
  const { address, lat, long } = params || {};

  const latitude = lat ?? null;
  const longitude = long ?? null;
  const clinicAddress = address?.trim() || '';

  // Validate location data
  const hasCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    latitude !== '' &&
    longitude !== null &&
    longitude !== undefined &&
    longitude !== '';

  const hasAddress = Boolean(clinicAddress);

  // No location information available
  if (!hasCoordinates && !hasAddress) {
    showErrorToast('Clinic location is not available');
    return;
  }

  let url = '';

  // Prefer coordinates when available
  if (hasCoordinates) {
    url =
      Platform.OS === 'ios'
        ? `maps:0,0?q=${latitude},${longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  } else if (hasAddress) {
    url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinicAddress)}`;
  }

  Linking.openURL(url).catch(err => {
    console.error('Failed to open map URL:', err);
    showErrorToast('Unable to open map');
  });
};

export const formatDate = (
  date: Date | string | null | undefined,
  format = 'DD/MM/YYYY'
): string => {
  if (!date) return '';
  return dayjs(date).format(format);
};

export const dateOnly = (dateTimeStr: string, format = 'DD MMM YYYY'): string => {
  if (!dateTimeStr?.includes('T')) return '';
  const datePart = dateTimeStr.split('T')[0];
  return dayjs(datePart).format(format);
};

export function getInitials(name: string): string {
  if (!name) return 'D';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const getAvatarColor = (name = '', colors: string[] = ['#00897B', '#00796B']): string => {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const formatTimeAgo = (date: string): string => {
  const d = dayjs(date);
  const minutes = dayjs().diff(d, 'minute');

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = dayjs().diff(d, 'hour');
  if (hours < 24) return d.format('hh:mm A');

  const days = dayjs().diff(d, 'day');
  if (days < 7) return `${days}d ago`;

  return d.format('MMM D');
};

export const getAge = (dob: string): string => {
  if (!dob) return '';
  const b = new Date(dob);
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age > 0 ? `${age}y` : '< 1y';
};

export const capitalizeFirstLetter = (value?: string): string => {
  if (!value) return '';

  const text = value.trim();

  if (!text) return '';

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatDateToYYYYMMDD = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const formatTodayBannerDate = (d: Date): string => {
  const day = d.getDate();
  const monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEPT',
    'OCT',
    'NOV',
    'DEC',
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

export const checkIsExpired = (
  appointmentDate: string,
  endTime?: string,
  startTime?: string
): boolean => {
  if (!appointmentDate) return false;
  const now = new Date();
  const todayStr = formatDateToYYYYMMDD(now);

  if (appointmentDate < todayStr) {
    return true;
  }

  if (appointmentDate === todayStr) {
    const timeToCheck = endTime || startTime;
    if (!timeToCheck) return false;

    const parts = timeToCheck.split(':').map(Number);
    const timeMs = new Date(now).setHours(parts[0] || 0, parts[1] || 0, parts[2] || 0, 0);
    return now.getTime() > timeMs;
  }

  return false;
};

export const getTimeUntilStart = (startTime: string): string => {
  const now = new Date();

  const [hours, minutes, seconds] = startTime.split(':').map(Number);

  const start = new Date();
  start.setHours(hours, minutes, seconds || 0, 0);

  const diffMs = start.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Started';
  }

  const totalMinutes = Math.ceil(diffMs / (1000 * 60));

  const hoursLeft = Math.floor(totalMinutes / 60);
  const minutesLeft = totalMinutes % 60;

  if (hoursLeft > 0 && minutesLeft > 0) {
    return `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''} ${minutesLeft} minute${
      minutesLeft > 1 ? 's' : ''
    }`;
  }

  if (hoursLeft > 0) {
    return `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}`;
  }

  return `${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}`;
};

export const capitalize = (value: string): string => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const _compactNumber = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0';

  const absNum = Math.abs(num);

  if (absNum >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T';
  } else if (absNum >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (absNum >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (absNum >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return num.toString();
  }
};

export const formatTimeSlot = (startTime?: string, endTime?: string) => {
  if (!startTime) return 'Flexible';

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) return time;

    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const start = formatTime(startTime);
  const end = endTime ? formatTime(endTime) : '';

  return end ? `${start} - ${end}` : start;
};

export const maskValue = (value: string) => {
  if (!value) return '';
  if (value.length <= 2) return value;
  return value.slice(0, 2) + '*'.repeat(value.length - 2);
};
