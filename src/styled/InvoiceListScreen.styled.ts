import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const invoiceListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header — compact, white
  header: {
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
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
    fontSize: 24,
    color: theme.colors.textPrimary,
    fontWeight: '700',
    lineHeight: 28,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  // Search row
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textPrimary,
    paddingVertical: 0,
    marginLeft: 8,
  },
  filterIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },

  // Filter chips
  chipRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: theme.colors.background,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
  },
  chipTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSlate,
  },
  chipTxtActive: {
    color: theme.colors.surface,
  },

  // Scroll content
  scroll: {
    flex: 1,
  },

  // Stats — two separate cards with gap
  statsRow: {
    flexDirection: 'row',
    margin: 12,
    marginBottom: 8,
  },
  statCardTeal: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    marginRight: 10,
  },
  statCardWhite: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  statLabelWhite: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.overlayWhite80 || 'rgba(255,255,255,0.75)',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  statLabelGray: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  statAmtWhite: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.surface,
  },
  statAmtDark: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },

  // Recent transactions header
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  txLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
  },
  txCount: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },

  // Each invoice row card
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 1,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  txName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  txSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  txAmt: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Empty / loading
  loadingTxt: {
    color: theme.colors.textSlate,
    marginTop: 10,
    fontSize: 13,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.textSlate,
    textAlign: 'center',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  fabTxt: {
    color: theme.colors.surface,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },

  // Filter Modal Styles
  filterOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '92%',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTxt: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  resetTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  filterSection: {
    marginHorizontal: 14,
    marginTop: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  filterSectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  filterSectionSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  filterSectionBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  radioRowActive: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  radioTxt: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  radioTxtActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: theme.colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  customHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
  },
  dateInputTxt: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    paddingVertical: 0,
    marginLeft: 10,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statusBtn: {
    width: '47%',
    marginHorizontal: '1.5%',
    marginBottom: 8,
    paddingVertical: 13,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  statusBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  statusBtnTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  statusBtnTxtActive: {
    color: theme.colors.surface,
  },
  resetRow: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  resetRowTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  applyBtn: {
    marginHorizontal: 14,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 8,
  },
  applyBtnTxt: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },

  // Calendar Modal Styles
  calOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '88%',
    elevation: 10,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  calNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calNavTxt: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  calMonthTxt: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  calWeekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calWeekTxt: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  calDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calDayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDaySelected: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
  },
  calDayTxt: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  calDayTxtSel: {
    color: theme.colors.surface,
    fontWeight: '700',
  },
  calCloseBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSecondary,
  },
  calCloseTxt: {
    fontSize: 14,
    color: theme.colors.textSlate,
    fontWeight: '600',
  },
});
