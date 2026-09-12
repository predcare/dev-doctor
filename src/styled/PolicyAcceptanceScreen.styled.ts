import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const policyStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.brandBlue,
  },

  // Logo Header
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  logo: {
    width: 170,
    height: 60,
    tintColor: theme.colors.surface,
  },

  // Card Container
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    maxWidth: 480,
    flexShrink: 1,
    flexDirection: 'column',
  },

  // Fixed Card Title Section
  titleContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
  },

  // Scrollable Middle Content
  scrollableContent: {
    flexShrink: 1,
    marginBottom: 12,
  },
  scrollableContentInner: {
    paddingBottom: 4,
  },

  // Policy Inset Box
  policyBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  policyItem: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 4,
  },
  policyBoldLabel: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  policyValueText: {
    fontWeight: '400',
    color: theme.colors.textSlate,
  },
  policyLinkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  policyLinkBold: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },

  // Notice Text
  noticeText: {
    fontSize: 12,
    color: theme.colors.textSlate,
    lineHeight: 18,
    marginBottom: 8,
  },

  // Fixed Bottom Section (Sticky Checkboxes & Buttons)
  fixedBottomSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    marginTop: 4,
  },

  // Checkbox Group
  checkboxContainer: {
    marginBottom: 16,
    gap: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginRight: 12,
    marginTop: 1,
  },
  checkboxSquareChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmarkIcon: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 16,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13.5,
    color: theme.colors.textPrimary,
    lineHeight: 19,
    fontWeight: '400',
  },
  boldText: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  // Action Buttons
  buttonGroup: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  // Footer Copyright
  footerContainer: {
    paddingTop: 12,
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
});

export default policyStyles;
