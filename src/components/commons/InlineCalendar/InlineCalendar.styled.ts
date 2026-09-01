import { StyleSheet } from 'react-native';
import { theme } from '../../../styled/theme.styled';

export const inlineCalendarStyles = StyleSheet.create({
  inlineCalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  inlineCalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inlineCalNavBtn: {
    padding: 6,
  },
  inlineCalMonthTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  inlineCalWeekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  inlineCalWeekTxt: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
  },
  inlineCalDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inlineCalDayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineCalDayInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineCalDaySelected: {
    backgroundColor: theme.colors.primary,
  },
  inlineCalDayTxt: {
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
  },
  inlineCalDayTxtSelected: {
    color: theme.colors.textInverted,
    fontWeight: theme.fontWeight.bold,
  },
});

export default inlineCalendarStyles;
