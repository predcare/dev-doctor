import { StyleSheet } from 'react-native';
import { theme } from './theme.styled';

export const TEAL = theme.colors.primary;
export const TEAL_DARK = theme.colors.primaryDark;
export const TEAL_LIGHT_BG = theme.colors.primarySoft;

export const prescriptionViewStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // Header
  header: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  backCircle: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
  },
  editPillTxt: { fontSize: 13, fontWeight: '600', color: theme.colors.primary, marginLeft: 4 },
  rxIdBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSlate,
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  // Clinic card
  clinicCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  clinicName: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 3 },
  clinicSub: { fontSize: 13, color: theme.colors.textSlate },
  clinicDate: { fontSize: 14, fontWeight: '700', color: theme.colors.primary },
  statusChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusChipTxt: { fontSize: 10, fontWeight: '700' },

  // Patient card
  patientCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  patientAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 5,
  },
  patientMetaRow: { flexDirection: 'row' },
  patientMetaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  patientMetaTxt: { fontSize: 13, color: theme.colors.textSlate },
  patientIdBadge: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'center',
    marginLeft: 8,
  },
  patientIdBadgeTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    letterSpacing: 0.3,
  },

  // Outer section heading
  outerSection: {
    marginHorizontal: 12,
    marginBottom: 8,
  },
  outerSectionHd: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  outerSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginLeft: 7,
  },
  outerCountTxt: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },

  // Content Card
  contentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },

  // Vitals
  vitalsRow: { flexDirection: 'row' },
  vitalBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginRight: 6,
  },
  vitalLbl: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.4,
    marginBottom: 5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  vitalVal: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Symptoms text box
  textBox: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  textBoxTxt: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 22 },

  // Medications
  medItem: { paddingVertical: 12 },
  medBorder: { borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceBorder },
  medTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  medName: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary, flex: 1 },
  medDosage: { fontSize: 14, fontWeight: '700', color: theme.colors.textSecondary },
  medDosageGreen: { color: theme.colors.primary },
  medBotRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  medMetaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  medMetaTxt: { fontSize: 12, color: theme.colors.textSlate },
  medFreqRight: { fontSize: 11, color: theme.colors.textMuted },
  sosBadge: {
    backgroundColor: theme.colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  sosBadgeTxt: { fontSize: 10, fontWeight: '700', color: theme.colors.warning },

  // Instructions Card (teal tint)
  instructionsCard: {
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.mintBg,
  },
  instructionsHd: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  instructionsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.8,
    marginLeft: 8,
  },
  instructionsTxt: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 22 },

  // Follow-up card
  followUpCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  followUpLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  followUpDate: { fontSize: 17, fontWeight: '700', color: theme.colors.textPrimary },
  followUpIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Promo row
  promoRow: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  promoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promoTxt: { flex: 1, fontSize: 13, color: theme.colors.textSecondary, lineHeight: 18 },

  // Bottom action bar
  bottomBar: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
  },
  completeBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnTxt: {
    color: theme.colors.textInverted,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  shareBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shareBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnTxt: { fontSize: 16, fontWeight: '700', color: theme.colors.textInverted, marginLeft: 8 },
  shareBtnDocBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Medical background (Allergies & Chronic) - Full width
  medicalBadgesColumn: {
    gap: 8,
  },
  medicalBadgeFull: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  medicalBadgeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSlate,
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  medicalBadgeVal: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },

  // Custom Vitals
  customVitalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: 6,
  },
  customVitalLbl: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  customVitalVal: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // Referral card
  referralCard: {
    backgroundColor: theme.colors.accentLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.infoLight,
    gap: 6,
  },
  referralTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accent,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  referralRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referralTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.accent,
  },

  // Tab bar
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 22,
    paddingHorizontal: 8,
    elevation: 10,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  tabLbl: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.2,
  },
});

export default prescriptionViewStyles;
