import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useChangeAppointmentStatus } from '../../../../hooks/react-query/appointments/appointments.hooks';
import { MyAppointmentsQueryKeys } from '../../../../hooks/react-query/query.keys';
import { formatDate, formatStatus, formatTimeSlot } from '../../../../lib/common/common.utils';
import theme from '../../../../styled/theme.styled';
import { IAppointmentDoc } from '../../../../typescripts/interfaces/appointments.interfaces';
import { useLoadingStore } from '../../../../zustand/stores/useLoadingStore';
import { queryClient } from '../../../providers/ReactQueryProvider';
import { ChevronDownIcon, ChevronUpIcon, CircleXIcon, EditIcon } from '../../../ui/icons';

interface AppointmentInfoModalProps {
  visible: boolean;
  appointment?: IAppointmentDoc | null;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return '#16A34A';
    case 'cancelled':
    case 'canceled':
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
    case 'canceled':
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

const STATUS_OPTIONS = [
  { id: 'in_progress', label: 'In Progress', color: theme.colors.primary, bg: '#EFF6FF' },
  { id: 'completed', label: 'Completed', color: '#10B981', bg: '#ECFDF5' },
  { id: 'cancelled', label: 'Cancelled', color: theme.colors.danger, bg: '#FEF2F2' },
] as const;

export const AppointmentInfoModal: React.FC<AppointmentInfoModalProps> = React.memo(
  ({ visible, appointment, onClose }) => {
    const { mutate: changeStatus, isPending } = useChangeAppointmentStatus();
    const { showLoader, hideLoader } = useLoadingStore(state => state);

    const [showStatusOptions, setShowStatusOptions] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const effectiveStatus = useMemo(() => {
      const rawStatus = appointment?.appointment_status?.toLowerCase() || '';
      return rawStatus;
    }, [appointment?.appointment_status]);

    const formattedStatusLabel = useMemo(() => {
      return formatStatus(effectiveStatus) || 'Confirmed';
    }, [effectiveStatus]);

    const activeSelectedStatus = selectedStatus || effectiveStatus;

    const selectedOpt = useMemo(() => {
      const cleanSel = activeSelectedStatus.replace('_', '').replace('-', '');
      return STATUS_OPTIONS.find(opt => {
        const cleanOpt = opt.id.replace('_', '').replace('-', '');
        return cleanOpt === cleanSel;
      });
    }, [activeSelectedStatus]);

    const isSameStatus = useMemo(() => {
      const cleanEffective = effectiveStatus.replace('_', '').replace('-', '');
      const cleanSelected = activeSelectedStatus.replace('_', '').replace('-', '');
      return cleanEffective === cleanSelected;
    }, [effectiveStatus, activeSelectedStatus]);

    const actionButtonLabel = useMemo(() => {
      if (selectedOpt) {
        return `Mark as ${selectedOpt.label}`;
      }
      return 'Update Status';
    }, [selectedOpt]);

    const { isVideo, statusColor, statusBg, formattedTime } = useMemo(() => {
      const inProgress =
        effectiveStatus === 'in-progress' ||
        effectiveStatus === 'in_progress' ||
        effectiveStatus === 'inprogress';

      return {
        isVideo: appointment?.consultation_type?.toLowerCase() === 'video',
        isCompleted: effectiveStatus === 'completed',
        isCancelled: effectiveStatus === 'cancelled' || effectiveStatus === 'canceled',
        isConfirmed: effectiveStatus === 'confirmed',
        isInProgress: inProgress,
        statusColor: getStatusColor(effectiveStatus),
        statusBg: getStatusBackground(effectiveStatus),
        formattedTime: formatTimeSlot(appointment?.start_time, appointment?.end_time),
      };
    }, [
      appointment?.consultation_type,
      effectiveStatus,
      appointment?.start_time,
      appointment?.end_time,
    ]);

    const patientIdDisplay = useMemo(() => {
      if (appointment?.patient_alphanumeric_id) return appointment.patient_alphanumeric_id;
      if (appointment?.patient_id) return `PT${String(appointment.patient_id).padStart(4, '0')}`;
      return '';
    }, [appointment]);

    const handleStatusChange = useCallback(
      (statusId: string) => {
        if (!appointment?.appointment_id || isPending) return;
        showLoader('Updating status...');
        changeStatus(
          { appointmentId: appointment.appointment_id, appointment_status: statusId },
          {
            onSuccess: async () => {
              await queryClient.invalidateQueries({
                queryKey: [MyAppointmentsQueryKeys.MyAppointments],
              });
              hideLoader();
              setShowStatusOptions(false);
              onClose();
            },
            onError: () => {
              hideLoader();
            },
          }
        );
      },
      [appointment?.appointment_id, isPending, changeStatus, showLoader, hideLoader, onClose]
    );

    const handleApplyStatus = useCallback(() => {
      if (!showStatusOptions) {
        setShowStatusOptions(true);
        return;
      }
      if (!activeSelectedStatus || isSameStatus || isPending) return;
      handleStatusChange(activeSelectedStatus);
    }, [showStatusOptions, activeSelectedStatus, isSameStatus, isPending, handleStatusChange]);

    useEffect(() => {
      if (!visible) {
        setShowStatusOptions(false);
        setSelectedStatus(null);
      } else {
        setSelectedStatus(effectiveStatus);
      }
    }, [visible, effectiveStatus]);

    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Appointment Details</Text>
              <TouchableOpacity
                style={styles.closeBtnCircle}
                onPress={onClose}
                activeOpacity={0.75}
              >
                <CircleXIcon size={18} color={theme.colors.textSlate} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.modalScrollBody}
              bounces={true}
            >
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>PATIENT INFORMATION</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{appointment?.patient_name || '-'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Appointment ID</Text>
                  <Text style={styles.infoValue}>{appointment?.appointment_id || '-'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Patient ID</Text>
                  <Text style={styles.infoValue}>{patientIdDisplay || '-'}</Text>
                </View>

                <View style={[styles.infoRow, styles.infoRowLast]}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>
                    {appointment?.patient_phone ? `+91-${appointment.patient_phone}` : '-'}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>APPOINTMENT INFO</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(appointment?.appointment_date) || '-'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Time</Text>
                  <Text style={styles.infoValue}>{formattedTime || '-'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>
                    {appointment?.call_duration_seconds
                      ? `⏱ ${Math.ceil(appointment.call_duration_seconds / 60)} min`
                      : '-'}
                  </Text>
                </View>

                <View style={[styles.infoRow, styles.infoRowLast]}>
                  <Text style={styles.infoLabel}>Type</Text>
                  <Text style={styles.infoValue}>
                    {isVideo ? '📹 Video Consultation' : '🏥 In-Clinic Consultation'}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>CALL DETAILS</Text>
                <View style={[styles.infoRow, styles.infoRowLast]}>
                  <Text style={styles.infoLabel}>Ended At</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(appointment?.call_end_time) || '-'}
                  </Text>
                </View>
                <View style={[styles.infoRow, styles.infoRowLast]}>
                  <Text style={styles.infoLabel}>Reason</Text>
                  <Text style={styles.infoValue}>
                    {appointment?.reason || appointment?.symptoms || 'N/A'}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.currentStatusDisplayRow}>
                  <Text style={styles.infoLabel}>Current Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                      {formattedStatusLabel}
                    </Text>
                  </View>
                </View>
                <View style={styles.statusHeaderRow}>
                  <Text style={styles.sectionTitle}>APPOINTMENT STATUS</Text>
                  <TouchableOpacity
                    style={styles.changeStatusToggleBtn}
                    onPress={() => setShowStatusOptions(prev => !prev)}
                    activeOpacity={0.7}
                    disabled={isPending}
                  >
                    <EditIcon size={12} color={theme.colors.primary} />
                    <Text style={styles.changeStatusToggleTxt}>
                      {showStatusOptions ? 'Close' : 'Change Status'}
                    </Text>
                    {showStatusOptions ? (
                      <ChevronUpIcon size={12} color={theme.colors.primary} />
                    ) : (
                      <ChevronDownIcon size={12} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                </View>

                {showStatusOptions && (
                  <View style={styles.radioGroup}>
                    <Text style={styles.selectStatusHint}>Select new status:</Text>
                    {STATUS_OPTIONS.map(opt => {
                      const cleanOptId = opt.id.replace('_', '').replace('-', '');
                      const cleanSelected = activeSelectedStatus.replace('_', '').replace('-', '');
                      const isSelected = cleanSelected === cleanOptId;

                      return (
                        <TouchableOpacity
                          key={opt.id}
                          style={[
                            styles.radioItem,
                            isSelected && { borderColor: opt.color, backgroundColor: opt.bg },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => setSelectedStatus(opt.id)}
                          disabled={isPending}
                        >
                          <View
                            style={[
                              styles.radioOuter,
                              { borderColor: isSelected ? opt.color : theme.colors.textMuted },
                            ]}
                          >
                            {isSelected && (
                              <View style={[styles.radioInner, { backgroundColor: opt.color }]} />
                            )}
                          </View>
                          <Text
                            style={[
                              styles.radioLabel,
                              { color: isSelected ? opt.color : theme.colors.textPrimary },
                            ]}
                          >
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                <View style={styles.actionButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      selectedOpt?.color ? { backgroundColor: selectedOpt.color } : null,
                      (showStatusOptions && isSameStatus) || isPending
                        ? styles.disabledButton
                        : null,
                    ]}
                    activeOpacity={0.85}
                    onPress={handleApplyStatus}
                    disabled={(showStatusOptions && isSameStatus) || isPending}
                  >
                    {isPending ? (
                      <ActivityIndicator size="small" color={theme.colors.textInverted} />
                    ) : (
                      <Text style={styles.primaryButtonText}>
                        {showStatusOptions ? actionButtonLabel : 'Change Status'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeFooterBtn}
                onPress={onClose}
                activeOpacity={0.85}
              >
                <Text style={styles.closeFooterBtnTxt}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    flexDirection: 'column',
  },
  modalScrollView: {
    flexShrink: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSecondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  closeBtnCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  sectionCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeStatusToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  changeStatusToggleTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  currentStatusDisplayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  selectStatusHint: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: 4,
    marginTop: 6,
  },
  radioGroup: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.primary,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    gap: 10,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  statusSpinner: {
    marginLeft: 'auto',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSecondary,
  },
  infoRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 2,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSecondary,
    backgroundColor: theme.colors.surface,
  },
  deleteBtn: {
    backgroundColor: theme.colors.danger,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteBtnTxt: {
    color: theme.colors.textInverted,
    fontSize: 14,
    fontWeight: '700',
  },
  closeFooterBtn: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeFooterBtnTxt: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSecondary,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: theme.colors.textInverted,
    fontSize: 14,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

AppointmentInfoModal.displayName = 'AppointmentInfoModal';
export default AppointmentInfoModal;
