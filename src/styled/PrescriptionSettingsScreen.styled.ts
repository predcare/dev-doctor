import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const prescriptionSettingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  backIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.dark,
    lineHeight: 24,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  saveTopBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveTopBtnSaved: {
    backgroundColor: theme.colors.success,
  },
  saveTopBtnText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },

  // Preview Banner
  previewCard: {
    backgroundColor: theme.colors.surface,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    elevation: 2,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  previewBanner: {
    backgroundColor: theme.colors.primarySoft,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  previewLogoBox: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  previewLogoTxt: {
    color: theme.colors.surface,
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 10,
  },
  previewClinicName: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  previewSubline: {
    fontSize: 8,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 1,
  },
  previewContact: {
    fontSize: 8,
    color: theme.colors.textSlate,
    marginTop: 3,
  },
  previewRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  previewRightLabel: {
    fontSize: 7.5,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  previewRightVal: {
    fontSize: 8.5,
    fontWeight: '700',
    color: theme.colors.dark,
  },

  // Cards & Form Fields
  card: {
    backgroundColor: theme.colors.surface,
    marginBottom: 10,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  twoCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: 6,
  },
  optional: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '400',
  },
  readonlyField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  readonlyText: {
    fontSize: 13,
    color: theme.colors.textSlate,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 9,
    fontSize: 13,
    color: theme.colors.dark,
    backgroundColor: '#F8FAFC',
  },

  // Footer Preview
  footerPreview: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  footerPreviewText: {
    fontSize: 10,
    color: theme.colors.dark,
    lineHeight: 14,
  },
  footerNote: {
    fontSize: 8,
    color: theme.colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  footerSigBox: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  footerSigImg: {
    width: 90,
    height: 32,
  },

  // Save Buttons
  saveBtn: {
    backgroundColor: theme.colors.primary,
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnTxt: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
  },
  secondaryBtn: {
    backgroundColor: theme.colors.surface,
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  secondaryBtnTxt: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
  },
});

export default prescriptionSettingsStyles;
