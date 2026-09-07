import { Dimensions, StyleSheet } from 'react-native';
import { globalShadows, theme } from './theme.styled';

const { width } = Dimensions.get('window');

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 110,
  },

  // Search Input Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: theme.spacing.xl,
    ...globalShadows.card,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
  },

  // Highlights & Insights Section
  insightsSection: {
    marginBottom: theme.spacing.xl,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  insightsTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  periodPill: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodPillText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  periodDropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    zIndex: 999,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    minWidth: 140,
    ...globalShadows.card,
    overflow: 'hidden',
  },
  periodMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSecondary,
  },
  periodMenuItemText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textPrimary,
  },
  periodMenuItemTextActive: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },

  // Stat Tile
  statTile: {
    width: 152,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 16,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...globalShadows.card,
  },
  statTileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTileValue: {
    fontSize: 25,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 3,
  },
  statTileLabel: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSlate,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  sectionLink: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },

  appointmentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    ...globalShadows.card,
  },
  apptTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  timeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apptTime: {
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  apptDistance: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
  },
  apptPatientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  apptAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    flexShrink: 0,
  },
  apptAvatarText: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverted,
  },
  patientInfoGroup: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  apptPatientName: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  patientMetaText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  consultChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  consultChipText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 0.2,
  },
  symptomsText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  symptomsLabel: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  // Action Buttons
  detailsBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    flexShrink: 0,
    alignSelf: 'center',
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverted,
  },
  joinBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  joinBtnText: {
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverted,
  },

  // Need Assistance Banner
  supportBanner: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
    position: 'relative',
    ...globalShadows.card,
  },
  supportCircle1: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  supportCircle2: {
    position: 'absolute',
    right: 40,
    bottom: -35,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  supportTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverted,
    marginBottom: 6,
  },
  supportSub: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 18,
    marginBottom: theme.spacing.lg,
  },
  supportBtn: {
    backgroundColor: theme.colors.surface,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
  },
  supportBtnText: {
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.accent,
  },

  // Quick Access 2x2 Grid
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: theme.spacing.md,
  },
  quickAccessCard: {
    width: (width - 44) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    ...globalShadows.card,
  },
  quickAccessLabel: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    letterSpacing: 0.4,
    marginTop: 8,
    textAlign: 'center',
  },
});
