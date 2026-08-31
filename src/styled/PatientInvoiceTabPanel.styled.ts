import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const patientInvoiceTabStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeading: {
    fontSize: theme.fontSize.md || 16,
    fontWeight: theme.fontWeight.bold || '700',
    color: theme.colors.textPrimary,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm || 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  primaryBtnText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md || 12,
    marginHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  invoiceAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  bottomMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  pillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  recordSub: {
    fontSize: 12,
    color: theme.colors.textSlate,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  chevron: {
    fontSize: 22,
    color: theme.colors.primary,
    lineHeight: 26,
    paddingLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 14,
    marginVertical: 10,
    borderRadius: theme.borderRadius.md || 12,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyIconText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.warning,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  emptyText: {
    fontSize: 12,
    color: theme.colors.textSlate,
    marginTop: 4,
  },
});
