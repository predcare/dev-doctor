import { StyleSheet } from 'react-native';
import { globalShadows, theme } from './theme.styled';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    paddingBottom: 48,
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
    fontSize: theme.fontSize.md + 1,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginRight: theme.spacing.xs + 2,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: theme.fontSize.md - 0.5,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: 2,
    lineHeight: 20,
  },
  medicalDegree: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.regular,
    lineHeight: 16,
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
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },

  // Section Label
  sectionLabel: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
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
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.dark,
    flex: 1,
  },
  rowValue: {
    fontSize: theme.fontSize.xs + 1,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
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
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  expandedMeta: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
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
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  activeBadge: {
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeBadgeTxt: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  renewalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  renewalText: {
    fontSize: theme.fontSize.xs,
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
    fontSize: theme.fontSize.xs + 1,
    fontWeight: theme.fontWeight.semibold,
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
    fontSize: 17,
  },
  addonName: {
    fontSize: theme.fontSize.xs + 1,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: 1,
  },
  addonSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  addonBtn: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addonBtnTxt: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
  },

  // Wallet
  topUpBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  topUpTxt: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
    letterSpacing: 0.5,
  },

  // App Settings
  themeDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },

  // Version Footer
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
});

export default profileStyles;
