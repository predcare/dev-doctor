import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const appointmentFilterModalStyles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheetContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '80%',
    maxHeight: '85%',
    flexDirection: 'column',
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  sheetHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 6,
  },
  sheetHandleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSecondary,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  closeBtnCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnTxt: {
    fontSize: 18,
    color: theme.colors.textSlate,
    fontWeight: theme.fontWeight.bold,
  },

  // Body Scroll
  scrollBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
  },

  // Option Row List Item
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSecondary,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    backgroundColor: theme.colors.primarySoft,
  },
  optionText: {
    fontSize: 15,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  optionTextActive: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },

  // Custom From / To Calendar Inputs
  calendarInputsContainer: {
    marginTop: 12,
    marginBottom: 6,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputGroupLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateInputRowActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  dateInputLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  dateInputText: {
    fontSize: 14,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
  },
  dateInputPlaceholder: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnTxt: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.bold,
  },

  // Inline Calendar Card Widget
  inlineCalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    padding: 16,
    marginTop: 4,
    marginBottom: 14,
  },
  inlineCalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inlineCalNavBtn: {
    padding: 6,
  },
  inlineCalMonthTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  inlineCalWeekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  inlineCalWeekTxt: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
  },
  inlineCalDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inlineCalDayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineCalDayInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineCalDaySelected: {
    backgroundColor: theme.colors.primary,
  },
  inlineCalDayTxt: {
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
  },
  inlineCalDayTxtSelected: {
    color: theme.colors.textInverted,
    fontWeight: theme.fontWeight.bold,
  },

  // Footer Actions
  filterFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSecondary,
    backgroundColor: theme.colors.surface,
  },
  btnReset: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  btnResetTxt: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
  },
  btnApply: {
    flex: 1.2,
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  btnApplyTxt: {
    color: theme.colors.textInverted,
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
  },
});

export default appointmentFilterModalStyles;
