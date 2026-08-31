import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const invoiceScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 14,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  backArrow: {
    fontSize: 22,
    color: theme.colors.dark,
    fontWeight: '700',
    lineHeight: 24,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  headerSubTitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 14,
    gap: 14,
  },

  // Card Base
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  // Clinic & Patient Header Banner
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  patientName: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  patientMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  // Line Item Table & Inputs
  itemRow: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  itemRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemNameInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.dark,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
    paddingVertical: 4,
    marginRight: 8,
  },
  deleteBtn: {
    padding: 6,
  },
  deleteTxt: {
    fontSize: 16,
    color: theme.colors.danger,
  },
  itemInputsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    color: theme.colors.dark,
  },
  itemTotalTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: 8,
    textAlign: 'right',
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
    borderRadius: 10,
    backgroundColor: theme.colors.primarySoft,
    gap: 6,
  },
  addItemBtnTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // Options / Selector Chips
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  optionChipSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  optionChipTxt: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  optionChipTxtSelected: {
    color: theme.colors.primary,
    fontWeight: '700',
  },

  // Summary Row
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: 8,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  wordsTxt: {
    fontSize: 11,
    fontStyle: 'italic',
    color: theme.colors.textMuted,
    marginTop: 4,
  },

  // Bottom Actions
  footerActionBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 14,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
  },
  draftBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    alignItems: 'center',
  },
  draftBtnTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  submitBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  submitBtnTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.surface,
  },
});
