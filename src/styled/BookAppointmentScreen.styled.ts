import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const TEAL = theme.colors.primary;
export const TEAL_DARK = theme.colors.primaryDark;
export const TEAL_LIGHT = theme.colors.primarySoft;
export const TEAL_BORDER = theme.colors.mintBdr;

export const bookAppointmentStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollView: { flex: 1 },
  content: { padding: theme.spacing.lg, paddingBottom: 32 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
    elevation: 2,
    gap: 10,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    letterSpacing: 0.1,
    flex: 1,
  },

  // Sections
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: 8,
    letterSpacing: 0.4,
  },

  // Select Buttons / Inputs
  selectButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  selectButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 15,
    color: theme.colors.dark,
    fontWeight: theme.fontWeight.bold,
  },
  placeholderText: {
    color: theme.colors.textMuted,
    fontWeight: '400',
    fontSize: 15,
  },
  selectButtonIcon: { fontSize: 14, color: theme.colors.textSlate },
  patientInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  patientInfoText: {
    fontSize: 13,
    color: theme.colors.primary,
    marginBottom: 3,
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.danger,
    marginTop: 4,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: theme.colors.dark,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },

  // Consultation Type Buttons
  typeRow: { flexDirection: 'row', gap: 12 },
  typeButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
  },
  typeButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  typeButtonIconWrapper: { marginBottom: 10 },
  typeButtonIcon: { fontSize: 32, marginBottom: 8 },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSlate,
    letterSpacing: 0.2,
  },
  typeButtonTextActive: { color: theme.colors.primary },

  // Fee Display
  feeDisplay: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  feeLabel: {
    fontSize: 14,
    color: theme.colors.dark,
    fontWeight: theme.fontWeight.bold,
  },
  feeAmount: {
    fontSize: 22,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  feeNote: {
    fontSize: 12,
    color: theme.colors.textSlate,
    marginTop: 6,
    fontStyle: 'italic',
  },

  // Legend
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1.5 },
  legendText: { fontSize: 12, color: theme.colors.textSlate },

  // Multi-slot summary
  slotSummaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  slotSummaryText: {
    fontSize: 12,
    color: theme.colors.primary,
    flex: 1,
    flexWrap: 'wrap',
  },
  slotClearText: {
    fontSize: 12,
    color: theme.colors.danger,
    fontWeight: theme.fontWeight.bold,
    marginLeft: 8,
  },

  // Period Section
  periodSection: { marginBottom: 20 },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  periodTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },

  // Slot Grid
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 6,
  },
  slotButton: {
    width: '47.5%',
    paddingVertical: 18,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  slotButtonBooked: { backgroundColor: theme.colors.surfaceSecondary, opacity: 0.4 },
  slotButtonSelected: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  slotButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.dark,
    textAlign: 'center',
  },
  slotButtonTextBooked: { color: theme.colors.textMuted },
  slotButtonTextSelected: { color: theme.colors.primary },

  // Book Button
  bookButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 17,
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
  },
  bookButtonDisabled: { opacity: 0.45 },
  bookButtonText: {
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
    letterSpacing: 0.5,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  dateModalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  modalClose: { fontSize: 22, color: theme.colors.textSlate, fontWeight: 'bold' },
  dateList: { maxHeight: 400 },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dateItemSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  dateItemContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dateItemIcon: { fontSize: 22, marginRight: 12 },
  dateItemText: { flex: 1 },
  dateItemDate: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: 2,
  },
  dateItemDateSelected: { color: theme.colors.primary },
  dateItemType: { fontSize: 12, color: theme.colors.textSlate },
  dateItemTypeSelected: { color: theme.colors.primary },
  dateItemCheck: { fontSize: 18, color: theme.colors.primary, fontWeight: 'bold' },
  searchInput: {
    margin: 20,
    marginBottom: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: theme.colors.dark,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  patientList: { maxHeight: 400 },
  patientItem: {
    flexDirection: 'row',
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  patientAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientAvatarText: {
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
  },
  patientDetails: { flex: 1 },
  patientName: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: 3,
  },
  patientId: {
    fontSize: 12,
    color: theme.colors.textSlate,
    marginBottom: 2,
  },
  patientPhone: { fontSize: 12, color: theme.colors.textSlate },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyStateText: {
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSlate,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});

export default bookAppointmentStyles;
