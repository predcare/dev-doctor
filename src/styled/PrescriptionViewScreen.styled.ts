import { StyleSheet } from 'react-native';

export const TEAL = '#00685D';
export const TEAL_DARK = '#005047';
export const TEAL_LIGHT_BG = 'rgba(139,241,230,0.30)';

export const prescriptionViewStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E3E3',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
  },
  editPillTxt: { fontSize: 13, fontWeight: '600', color: TEAL, marginLeft: 4 },
  rxIdBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  // Clinic card
  clinicCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E1E3E3',
  },
  clinicName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
  clinicSub: { fontSize: 13, color: '#64748B' },
  clinicDate: { fontSize: 14, fontWeight: '700', color: TEAL },
  statusChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusChipTxt: { fontSize: 10, fontWeight: '700' },

  // Patient card
  patientCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E3E3',
  },
  patientAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TEAL_LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientName: { fontSize: 16, fontWeight: '700', color: '#191C1D', marginBottom: 5 },
  patientMetaRow: { flexDirection: 'row' },
  patientMetaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  patientMetaTxt: { fontSize: 13, color: '#64748B' },
  patientIdBadge: {
    backgroundColor: '#ECEEEE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'center',
    marginLeft: 8,
  },
  patientIdBadgeTxt: { fontSize: 11, fontWeight: '700', color: TEAL_DARK, letterSpacing: 0.3 },

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
    color: '#3D4946',
    marginLeft: 7,
  },
  outerCountTxt: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // Content Card
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E1E3E3',
  },

  // Vitals
  vitalsRow: { flexDirection: 'row' },
  vitalBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1E3E3',
    marginRight: 6,
  },
  vitalLbl: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.4,
    marginBottom: 5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  vitalVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Symptoms text box
  textBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E1E3E3',
  },
  textBoxTxt: { fontSize: 14, color: '#374151', lineHeight: 22 },

  // Medications
  medItem: { paddingVertical: 12 },
  medBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  medTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  medName: { fontSize: 15, fontWeight: '700', color: '#0F172A', flex: 1 },
  medDosage: { fontSize: 14, fontWeight: '700', color: '#374151' },
  medDosageGreen: { color: TEAL },
  medBotRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  medMetaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  medMetaTxt: { fontSize: 12, color: '#64748B' },
  medFreqRight: { fontSize: 11, color: '#94A3B8' },
  sosBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  sosBadgeTxt: { fontSize: 10, fontWeight: '700', color: '#D97706' },

  // Instructions Card (teal tint)
  instructionsCard: {
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#F0FDF9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  instructionsHd: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  instructionsTitle: { fontSize: 12, fontWeight: '700', color: TEAL, letterSpacing: 0.8, marginLeft: 8 },
  instructionsTxt: { fontSize: 14, color: '#374151', lineHeight: 22 },

  // Follow-up card
  followUpCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E1E3E3',
  },
  followUpLbl: { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 },
  followUpDate: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  followUpIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TEAL_LIGHT_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Promo row
  promoRow: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E3E3',
  },
  promoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promoTxt: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 18 },

  // Bottom action bar
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E3E3',
  },
  completeBtn: {
    backgroundColor: TEAL,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnTxt: {
    color: '#FFFFFF',
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
    backgroundColor: TEAL,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnTxt: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginLeft: 8 },
  shareBtnDocBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F2F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Medical background (Allergies & Chronic) - Full width
  medicalBadgesColumn: {
    gap: 8,
  },
  medicalBadgeFull: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E1E3E3',
  },
  medicalBadgeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  medicalBadgeVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 20,
  },

  // Custom Vitals
  customVitalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E1E3E3',
    marginBottom: 6,
  },
  customVitalLbl: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  customVitalVal: {
    fontSize: 14,
    fontWeight: '700',
    color: TEAL,
  },

  // Referral card
  referralCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 6,
  },
  referralTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
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
    color: '#1E3A8A',
  },

  // Tab bar
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E1E3E3',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 22,
    paddingHorizontal: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  tabLbl: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 4, letterSpacing: 0.2 },
});

export default prescriptionViewStyles;

