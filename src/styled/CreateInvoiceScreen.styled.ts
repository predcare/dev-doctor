import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const createInvoiceStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
  },

  // Line Item Editor Section
  sectionContainer: {
    marginBottom: 14,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  addBtn: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  itemBlock: {
    paddingTop: 14,
    marginTop: 8,
  },
  fieldLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  descInput: {
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: theme.colors.dark,
    backgroundColor: theme.colors.background,
    marginBottom: 4,
  },
  descInputError: {
    borderColor: theme.colors.danger,
  },
  errorText: {
    fontSize: 11,
    color: theme.colors.danger,
    marginBottom: 8,
    fontWeight: '500',
  },
  threeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.dark,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  smallInputReadOnly: {
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceSecondary,
    borderColor: theme.colors.surfaceBorder,
  },
  smallInputTxt: {
    fontSize: 13,
    color: theme.colors.dark,
    fontWeight: '700',
  },
  gstBadgeBox: {
    justifyContent: 'center',
    backgroundColor: theme.colors.primarySoft,
  },
  gstBadgeTxt: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  discountRow: {
    flexDirection: 'row',
    height: 44,
  },
  discTypeBtn: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discTypeTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  deleteIconBtn: {
    width: 36,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },

  // Payment Mode & Billing Config Section
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },

  // Tax % Chips
  taxChipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  taxChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taxChipActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  taxChipTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSlate,
  },
  taxChipTxtActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  // GST Mode Selector
  gstSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: 12,
  },
  gstSegmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  gstSegmentBtnActive: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  gstSegmentTxt: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSlate,
  },
  gstSegmentTxtActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },

  // Payment Status Selector Chips
  statusChipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 10,
  },
  statusChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  statusChipActivePaid: {
    backgroundColor: theme.colors.successLight,
    borderColor: theme.colors.success,
  },
  statusChipActiveUnpaid: {
    backgroundColor: theme.colors.warningLight,
    borderColor: theme.colors.warning,
  },
  statusChipTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSlate,
  },
  statusChipTxtActivePaid: {
    color: theme.colors.success,
    fontWeight: '700',
  },
  statusChipTxtActiveUnpaid: {
    color: theme.colors.warning,
    fontWeight: '700',
  },

  notesInput: {
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.dark,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: theme.colors.background,
  },

  // Summary Card Section
  totalsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLbl: {
    fontSize: 13,
    color: theme.colors.textSlate,
    fontWeight: '500',
  },
  totalVal: {
    fontSize: 13,
    color: theme.colors.dark,
    fontWeight: '600',
  },
  totalValDiscount: {
    color: theme.colors.danger,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: 12,
  },
  grandLbl: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  grandVal: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
  },

  // Footer Actions
  footer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  footerSummary: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  submitBtnSpacing: {
    marginTop: 18,
    marginBottom: 8,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default createInvoiceStyles;
