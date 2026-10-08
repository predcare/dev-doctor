import { StyleSheet } from 'react-native';
import { globalShadows, theme } from './theme.styled';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    paddingBottom: 0,
  },

  profileCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xs + 2,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    ...globalShadows.card,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm + 2,
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginRight: theme.spacing.xs + 2,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.dark,
    marginBottom: 2,
    lineHeight: 18,
  },
  medicalDegree: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.regular,
    lineHeight: 15,
  },
  editProfileBtn: {
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: theme.spacing.xs + 1,
    borderRadius: theme.borderRadius.full,
    flexShrink: 0,
    alignSelf: 'center',
  },
  editProfileBtnTxt: {
    fontSize: 11,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
  },

  // Section Label
  sectionLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textMuted,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xs + 2,
    marginLeft: theme.spacing.xl,
  },

  // Menu Card Group
  menuGroup: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    ...globalShadows.card,
    overflow: 'hidden',
  },

  // Row Item
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 14,
    backgroundColor: theme.colors.surface,
    minHeight: 52,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
  },
  rowDanger: {
    backgroundColor: '#FFF5F5',
  },
  rowIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  rowLabel: {
    fontSize: 11,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.dark,
    flex: 1,
  },
  rowValue: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
    marginRight: 6,
  },

  // Expanded Subscription Block
  expandedBlock: {
    backgroundColor: theme.colors.bg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
  },
  currentPlanCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginTop: 14,
    marginBottom: 4,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  expandedMeta: {
    fontSize: 9,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  planName: {
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.dark,
  },
  activeBadge: {
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeBadgeTxt: {
    fontSize: 9,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.success,
  },
  renewalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  renewalText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginLeft: 6,
  },
  manageSubBtn: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  manageSubTxt: {
    fontSize: 12,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
  },

  // Add-ons list
  addonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 13,
    backgroundColor: theme.colors.surface,
  },
  addonIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: theme.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addonIconTxt: {
    fontSize: 15,
  },
  addonName: {
    fontSize: 12,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.dark,
    marginBottom: 1,
  },
  addonSub: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  addonBtn: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addonBtnTxt: {
    fontSize: 10,
    fontWeight: theme.fontWeight.medium,
  },

  // Wallet
  topUpBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  topUpTxt: {
    fontSize: 9,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.surface,
    letterSpacing: 0.5,
  },

  // App Settings
  themeDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },

  // Policy Expanded Sub-items
  policySubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
    paddingLeft: theme.spacing.xl + 6,
  },
  policyIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  policyTitle: {
    fontSize: 12,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.dark,
    marginBottom: 1,
  },
  policySub: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },

  // Logout Card
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#FED7D7',
    ...globalShadows.card,
  },
  logoutIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FED7D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  logoutInfo: {
    flex: 1,
  },
  logoutTitle: {
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.danger,
    marginBottom: 2,
  },

  versionText: {
    textAlign: 'center',
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
});

export const doctorProfileStyles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg,
    padding: 32,
    gap: 16,
  },
  loadTxt: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 10,
  },
  errTxt: {
    fontSize: 13,
    color: theme.colors.body,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryTxt: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
    elevation: 2,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.dark,
    flex: 1,
    textAlign: 'center',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
  },
  editTxt: {
    fontSize: 11,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
  },

  scroll: {
    flex: 1,
  },

  // Hero section
  hero: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: theme.colors.primary,
    padding: 3,
  },
  avatarCircle: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    fontSize: 20,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.surface,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drName: {
    fontSize: 12,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.dark,
    letterSpacing: 0.3,
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  drId: {
    fontSize: 11,
    color: theme.colors.textSlate,
    fontWeight: theme.fontWeight.regular,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeTxt: {
    fontSize: 10,
    fontWeight: theme.fontWeight.medium,
  },

  // Card container
  card: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: 4,
  },

  // Empty clinic view
  emptyTab: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.dark,
    marginTop: 4,
  },
  emptySub: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
  },
  emptyBtnTxt: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },

  // Action Buttons
  actions: {
    marginHorizontal: theme.spacing.lg,
    gap: 10,
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
  },
  primaryBtnTxt: {
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.surface,
  },
  secondaryBtn: {
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
  },
  secondaryBtnTxt: {
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  mapBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
  },
});

export default profileStyles;
