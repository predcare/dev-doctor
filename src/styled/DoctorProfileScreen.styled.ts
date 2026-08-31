import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

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
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: 10,
  },
  errTxt: {
    fontSize: 15,
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
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
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
    fontSize: 17,
    fontWeight: theme.fontWeight.bold,
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
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
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
    fontSize: 24,
    fontWeight: '900',
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
    fontSize: 17,
    fontWeight: '800',
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
    fontSize: 12,
    color: theme.colors.textSlate,
    fontWeight: theme.fontWeight.medium,
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
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
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
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    marginTop: 4,
  },
  emptySub: {
    fontSize: 13,
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
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
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
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
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
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
});

export default doctorProfileStyles;
