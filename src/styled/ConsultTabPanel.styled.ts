import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const consultTabStyles = StyleSheet.create({
  consultStepBarWrapper: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
    justifyContent: 'space-between',
  },
  consultStepTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  consultStepTabActive: {
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
  },
  consultStepTabTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSlate,
  },
  consultStepTabTitleActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  consultStickyBottomBar: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
  },
  autoSaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 6,
  },
  autoSaveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
  },
  autoSaveText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  bottomBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btnPrev: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    alignItems: 'center',
  },
  btnPrevText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  btnNext: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  btnNextText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.surface,
  },
  btnComplete: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
  },
  btnCompleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.surface,
  },
});
