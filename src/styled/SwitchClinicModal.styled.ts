import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const switchClinicModalStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surfaceBorder,
  },
  header: {
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.dark,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.textSlate,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceSecondary,
  },
  closeTxt: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    padding: 16,
    marginBottom: 12,
  },
  clinicRowSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  clinicName: {
    flex: 1,
    marginRight: 12,
    fontSize: 14,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.dark,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  confirmButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.surface,
  },
  list: {
    maxHeight: 280,
  },
  skeletonRow: {
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceSecondary,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.textSlate,
    textAlign: 'center',
    marginBottom: 12,
  },
});
