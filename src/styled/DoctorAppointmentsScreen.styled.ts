import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const TEAL = theme.colors.primary;
export const TEAL_PRIMARY = theme.colors.primaryDark;

export const doctorAppointmentsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  backButton: {
    marginRight: 12,
  },
  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  statCardActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statLabelActive: {
    color: theme.colors.overlayWhite80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  statValueActive: {
    color: theme.colors.textInverted,
  },
  statSub: {
    fontSize: 10,
    color: theme.colors.textSlate,
    marginTop: 2,
  },
  statSubActive: {
    color: theme.colors.overlayWhite80,
  },

  // Search Row
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    gap: 10,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  searchBoxFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: theme.fontWeight.regular,
    color: theme.colors.textPrimary,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  filterActiveDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    borderWidth: 1.5,
    borderColor: theme.colors.surface,
  },

  // Custom Tabs Container (Both | In-person | Video)
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceBorder,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },

  // Active Filter Banner
  filterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterBannerTxt: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.regular,
  },
  filterBannerCountTxt: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
    letterSpacing: 0.3,
  },
  filterBannerClear: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },

  // List & Cards
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    elevation: 2,
    shadowColor: theme.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 14,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  patientAvatarText: {
    color: theme.colors.textInverted,
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
  },
  patientName: {
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  patientAge: {
    fontSize: 11,
    color: theme.colors.textSlate,
  },
  aptIdText: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.regular,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 9,
    fontWeight: theme.fontWeight.semibold,
    letterSpacing: 0.3,
  },

  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 3,
    marginBottom: 5,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 9,
    fontWeight: theme.fontWeight.medium,
  },

  // Action Buttons
  cardFooterActions: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  cancelledBox: {
    marginHorizontal: 14,
    marginBottom: 14,
    backgroundColor: theme.colors.errorBg,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.dangerLight,
    gap: 12,
  },
  cancelledIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelledTextContainer: {
    flex: 1,
  },
  cancelledTitle: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.danger,
  },
  cancelledSubtext: {
    fontSize: 10,
    fontWeight: theme.fontWeight.regular,
    color: theme.colors.danger,
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    color: theme.colors.textInverted,
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
  },
  completeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kebabCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  kebabDotV: {
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: theme.colors.textSlate,
  },

  // Kebab Popup Modal
  kebabMenuContent: {
    position: 'absolute',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingVertical: 6,
    width: 220,
    elevation: 8,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    overflow: 'hidden',
  },
  kebabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  kebabMenuText: {
    fontSize: 12,
    fontWeight: theme.fontWeight.medium,
  },

  // Details Modal
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.dark,
  },
  modalClose: {
    fontSize: 16,
    color: theme.colors.textSlate,
    fontWeight: theme.fontWeight.medium,
  },
  modalBody: {
    padding: 16,
  },
  reasonBox: {
    padding: 10,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  reasonText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
  },
  modalDeleteBtn: {
    flex: 1,
    backgroundColor: theme.colors.danger,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalDeleteBtnTxt: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
  },
  modalCloseFooterBtn: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseFooterBtnTxt: {
    color: theme.colors.dark,
    fontSize: 12,
    fontWeight: theme.fontWeight.medium,
  },

  // Filter Bottom Sheet Modal
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    maxHeight: '88%',
  },
  sheetHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  sheetHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surfaceBorder,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSecondary,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  sheetSectionTitle: {
    fontSize: 10,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textMuted,
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 12,
  },
  filterOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  filterOptionTxt: {
    fontSize: 13,
    flex: 1,
  },
  filterFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSecondary,
  },
  btnReset: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  btnResetTxt: {
    color: theme.colors.textSlate,
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
  },
  btnApply: {
    flex: 1.5,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  btnApplyTxt: {
    color: theme.colors.textInverted,
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 12,
    color: theme.colors.textSlate,
    textAlign: 'center',
    marginTop: 4,
  },
  disconnectedBanner: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 14,
    marginVertical: 10,
  },
  disconnectedText: {
    color: '#6D28D9',
    fontSize: 11,
    fontWeight: theme.fontWeight.medium,
    textAlign: 'center',
  },
  activeCallNotice: {
    color: '#9A3412',
    fontSize: 10,
    fontWeight: theme.fontWeight.regular,
    textAlign: 'center',
    paddingBottom: 10,
  },
});

export const appointmentDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },

  // Status & Appt ID Overview Card
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.cardShadow || '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statusTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  apptIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  apptIdLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '400',
  },
  apptIdValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statusDivider: {
    height: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    marginVertical: 10,
  },
  statusInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfoText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  statusInfoBold: {
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },

  // Action CTA Button
  actionCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  actionCtaDirections: {
    backgroundColor: theme.colors.primary,
  },
  actionCtaVideo: {
    backgroundColor: theme.colors.info,
  },
  actionCtaText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textInverted,
    letterSpacing: 0.3,
  },

  // Base Section Card
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.cardShadow || '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  cardHeaderLink: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.primaryDark,
  },

  // Doctor Card
  doctorProfileRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  doctorAvatarWrap: {
    position: 'relative',
  },
  doctorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.mintBdr,
  },
  doctorAvatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  doctorInitials: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
  },
  doctorDetails: {
    flex: 1,
    gap: 3,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: theme.colors.primaryDark,
    fontWeight: '500',
  },
  doctorClinic: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  doctorStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSecondary,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  statDividerVertical: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.surfaceSecondary,
  },

  // Tags & Languages
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagPill: {
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagPillText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: '400',
  },

  // Schedule & Appointment Details
  gridContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
  },
  detailIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  detailSubValue: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  mapActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 6,
  },
  mapActionBtnText: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.primaryDark,
  },

  // Patient Card
  patientInfoGrid: {
    gap: 10,
  },
  patientInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSecondary,
  },
  patientInfoLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  patientInfoVal: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    maxWidth: '65%',
    textAlign: 'right',
  },

  // Notes & Clinical Information
  noteBox: {
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  noteText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },

  // Billing
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  billLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  billValue: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  billTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
  },
  billTotalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  billTotalValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  paymentBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    padding: 10,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 10,
  },
  paymentBadgeLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paymentStatusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // Footer Action Buttons
  cardFooterActions: {
    marginTop: 16,
    gap: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.success,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  prescriptionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
    paddingVertical: 14,
    borderRadius: 12,
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  prescriptionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: 6,
  },
  activeCallNotice: {
    fontSize: 11,
    color: theme.colors.warning,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '400',
  },
});
export default doctorAppointmentsStyles;
