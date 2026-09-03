import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const navigationStyles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surface,
    paddingTop: 6,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.cardShadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: 3,
  },
  activeIndicatorDot: {
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    marginBottom: 3,
  },
  inactiveIndicatorDot: {
    width: 14,
    height: 3,
    backgroundColor: theme.colors.transparent,
    marginBottom: 3,
  },
  activeIconContainer: {
    width: 48,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveIconContainer: {
    width: 48,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
