import React, { useMemo } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../../../styled/theme.styled';
import { CircleXIcon } from '../../../ui/icons';

interface AppointmentInfoModalProps {
  visible: boolean;
  appointment: any;
  onClose: () => void;
}

const getStatusConfig = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return {
        color: '#10B981',
        bg: '#D1FAE5',
        label: 'Completed',
      };
    case 'cancelled':
      return {
        color: theme.colors.danger,
        bg: theme.colors.dangerLight,
        label: 'Cancelled',
      };
    case 'pending':
      return {
        color: theme.colors.warning,
        bg: theme.colors.warningLight,
        label: 'Pending',
      };
    default:
      return {
        color: theme.colors.info,
        bg: theme.colors.infoLight,
        label: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Confirmed',
      };
  }
};

export const AppointmentInfoModal: React.FC<AppointmentInfoModalProps> = React.memo(
  ({ visible, onClose }) => {
    const statusConfig = useMemo(() => getStatusConfig('completed'), []);
    let consultation_type = 'video';
    const isVideo = useMemo(() => {
      const type = consultation_type?.toLowerCase() || '';
      return type.includes('video') || type.includes('online');
    }, [consultation_type]);

    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
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
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollBody}
            >
              {/* Status Badge */}
              <View style={styles.statusBadgeRow}>
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>Completed</Text>
                </View>
              </View>

              {/* Section 1: Patient Information */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>PATIENT INFORMATION</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>Sahil Mallick</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Appointment ID</Text>
                  <Text style={styles.infoValue}>APPT-98657</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Patient ID</Text>
                  <Text style={styles.infoValue}>PT0004</Text>
                </View>

                <View style={[styles.infoRow, styles.infoRowLast]}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>+91-1234567890</Text>
                </View>
              </View>

              {/* Section 2: Appointment Info */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>APPOINTMENT INFO</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>01 Sep 2026</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Time</Text>
                  <Text style={styles.infoValue}>10:00 AM – 10:30 AM</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>⏱ 10 min</Text>
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
                  <Text style={styles.infoValue}>11:10 AM</Text>
                </View>
                <View style={[styles.infoRow, styles.infoRowLast]}>
                  <Text style={styles.infoLabel}>Reason</Text>
                  <Text style={styles.infoValue}>Lorem ipsum dolor sit amet.</Text>
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
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
    maxHeight: '88%',
    paddingBottom: 24,
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
    paddingBottom: 12,
  },
  statusBadgeRow: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
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
    marginBottom: 6,
    textTransform: 'uppercase',
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
    paddingTop: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSecondary,
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
});

AppointmentInfoModal.displayName = 'AppointmentInfoModal';
export default AppointmentInfoModal;
