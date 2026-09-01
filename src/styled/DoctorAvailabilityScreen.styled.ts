import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const availabilityStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    letterSpacing: 0.2,
  },
  sectionHeaderIcon: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },

  addSlotBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  addSlotBtnTxt: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
  },

  actionRow: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 12,
  },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  saveBtnTxt: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
    letterSpacing: 0.4,
  },
  cancelBtn: {
    backgroundColor: '#FEF2F2',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelBtnTxt: {
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    letterSpacing: 0.3,
  },
});

export default availabilityStyles;
