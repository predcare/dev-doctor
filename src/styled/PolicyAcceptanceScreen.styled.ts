import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const policyStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.brandBlue,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: theme.colors.brandBlue,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  // Logo Header
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  logo: {
    width: 170,
    height: 56,
    tintColor: theme.colors.surface,
  },

  // Main Card Container
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    width: '100%',
    maxWidth: 500,
  },

  // Title Section
  titleContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    color: theme.colors.textSlate,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 19,
  },

  // Policy Items List Container
  docListContainer: {
    gap: 10,
    marginBottom: 14,
  },
  docTileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docTileCardActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.mintBdr,
  },
  docTileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  docIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 118, 110, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docMeta: {
    flex: 1,
  },
  docTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  docTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  docVersionBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  docVersionText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: theme.colors.textSlate,
  },
  docSubtext: {
    fontSize: 11.5,
    color: theme.colors.textMuted,
  },
  docActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
  },
  docActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // Notice Banner
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noticeIcon: {
    marginTop: 1,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
    fontWeight: '400',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },

  // Checkbox Group
  checkboxContainer: {
    gap: 10,
    marginBottom: 18,
  },
  checkboxCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkboxCardChecked: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.mintBdr,
  },
  checkboxSquare: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94A3B8',
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  checkboxSquareChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmarkText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: '800',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // Action Buttons
  buttonGroup: {
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },

  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  secondaryButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Footer Copyright & Security Note
  footerContainer: {
    marginTop: 16,
    alignItems: 'center',
    gap: 4,
  },
  footerSecurityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerSecurityText: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
  copyrightText: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
});

export default policyStyles;
