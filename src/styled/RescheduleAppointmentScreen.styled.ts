import { StyleSheet, Platform } from 'react-native';
import { theme } from './theme.styled';

export const TEAL = '#00685D';
export const TEAL_PRIMARY = '#00897B';

export const rescheduleAppointmentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Header
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 16 : 14,
    paddingBottom: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  backPill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: TEAL,
    letterSpacing: -0.2,
  },

  // Content
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Current Appointment Card
  currentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  patientSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Section Headers
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  outerLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },

  // Date Horizontal Strip
  dateStrip: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  dateCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  dateCardActive: {
    backgroundColor: '#E6F7F5',
    borderColor: TEAL,
  },
  dateDayLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  dateDayLabelActive: {
    color: TEAL,
  },
  dateNum: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  dateNumActive: {
    color: TEAL,
  },
  calendarPillBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  calendarPillTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  // Slot Grid & Grouping
  periodHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 10,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  timeChip: {
    width: '47.5%',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  timeChipBooked: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.4,
  },
  timeChipActive: {
    backgroundColor: '#E6F7F5',
    borderColor: TEAL,
  },
  timeChipCurrent: {
    backgroundColor: '#E6F7F5',
    borderColor: TEAL,
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  timeChipTextBooked: {
    color: '#94A3B8',
  },
  timeChipTextActive: {
    color: TEAL,
  },

  // Inputs Section
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 14,
    marginBottom: 6,
  },
  fieldOptional: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
  },
  fieldInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    textAlignVertical: 'top',
  },

  // Summary Strip Box (New Schedule vs Previous)
  bookingButtonRow: {
    flexDirection: 'row',
    backgroundColor: TEAL,
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  bookingButton: {
    flex: 1,
  },
  bookingButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bookingButtonValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  dottedDivider: {
    width: 1,
    height: 40,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderStyle: 'dashed',
    marginHorizontal: 12,
  },

  // Confirm Button
  bookBtn: {
    backgroundColor: TEAL,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bookBtnDisabled: {
    opacity: 0.45,
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Calendar Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalClose: {
    fontSize: 20,
    color: '#64748B',
    fontWeight: 'bold',
  },
  calendarInner: {},
  calNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calNavText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: 'bold',
  },
  calMonthLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  calWeekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  calCellPast: {
    opacity: 0.3,
  },
  calCellAvail: {
    backgroundColor: '#E6F7F5',
  },
  calCellToday: {
    borderWidth: 1.5,
    borderColor: TEAL,
  },
  calCellSelected: {
    backgroundColor: TEAL,
  },
  calCellText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  calCellTextPast: {
    color: '#94A3B8',
  },
  calCellTextAvail: {
    color: TEAL,
    fontWeight: '700',
  },
  calCellTextToday: {
    color: TEAL,
    fontWeight: '800',
  },
  calCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  calLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default rescheduleAppointmentStyles;
