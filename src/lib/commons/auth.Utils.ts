import { AppMessages } from '../../config/message.constants';
import { IMyProfileDoc } from '../../typescripts/interfaces/profile.interfaces';
import { useAlertStore } from '../../zustand/stores/useAlertStore';
import { useAuthStore } from '../../zustand/stores/useAuthStore';

export const _hasActiveSubscription = (user?: IMyProfileDoc | null): boolean => {
  const subscription = user?.subscription;
  if (!subscription) return false;
  if (subscription.status !== 'active') return false;
  if (!subscription.end_date) return false;
  const isExpired = new Date(subscription.end_date).getTime() < Date.now();
  return !isExpired;
};

export const _hasActiveClinic = (user?: IMyProfileDoc | null): boolean => {
  const clinic = user?.clinic;
  if (!clinic) return false;

  if (!clinic.id || clinic.status !== 'active') return false;
  return true;
};

export const ensureClinicAccess = (
  params: { alertType?: 'warning' | 'error'; message?: string } = {
    alertType: 'warning',
    message: '',
  }
): boolean => {
  const { hasActiveClinic, hasActiveSubscription } = useAuthStore.getState();
  const { showWarning, showError } = useAlertStore.getState();

  if (!hasActiveClinic) {
    if (params.alertType === 'warning') {
      showWarning(params.message || AppMessages.NO_CLINIC_FOUND, AppMessages.CLINIC_NOT_FOUND);
    } else {
      showError(params.message || AppMessages.NO_CLINIC_FOUND, AppMessages.CLINIC_NOT_FOUND);
    }
    return false;
  }
  if (!hasActiveSubscription) {
    if (params.alertType === 'warning') {
      showWarning(
        params.message || AppMessages.NO_SUBSCRIPTION_FOUND,
        AppMessages.SUBSCRIPTION_NOT_FOUND
      );
    } else {
      showError(
        params.message || AppMessages.NO_SUBSCRIPTION_FOUND,
        AppMessages.SUBSCRIPTION_NOT_FOUND
      );
    }
    return false;
  }
  return true;
};
