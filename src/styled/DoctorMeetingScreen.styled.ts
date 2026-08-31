import { StyleSheet, Platform, Dimensions } from 'react-native';
import { theme } from './theme.styled';

const { width: SW, height: SH } = Dimensions.get('window');

export const TEAL = '#00897B';
export const TEAL_DARK = '#00685D';

export const doctorMeetingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1410',
  },

  // Header Bar
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 14 : 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(10, 20, 16, 0.9)',
    zIndex: 10,
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerChipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerChipLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  timerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  timerChipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  timerLeftLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Video Stage
  videoStage: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0F1A17',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remotePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  remoteAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 6,
  },
  remoteAvatarTxt: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  remoteNameTxt: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  remoteStatusTxt: {
    fontSize: 13,
    color: '#2DD4BF',
    fontWeight: '600',
  },

  // Draggable Self Picture-in-Picture (PiP)
  selfPipCard: {
    position: 'absolute',
    width: 110,
    height: 150,
    borderRadius: 16,
    backgroundColor: '#1E2D2A',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 100,
  },
  selfAvatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  selfAvatarTxt: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  selfBadge: {
    position: 'absolute',
    bottom: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  selfBadgeTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Action Bar Tabs (Patient | Upload | Prescription)
  actionTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#12201C',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  actionTabBtnActive: {
    backgroundColor: TEAL,
  },
  actionTabTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionTabTxtActive: {
    color: '#FFFFFF',
  },

  // Meeting Control Bar (Mic, Camera, Flip, End Call)
  controlBar: {
    flexDirection: 'row',
    backgroundColor: '#0A1410',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    gap: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ctrlBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 4,
  },
  ctrlBtnMuted: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  ctrlBtnLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  endCallBtn: {
    flex: 1.2,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 4,
  },
  endCallBtnTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Modal / Sliding Panels
  panelOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  panelContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  panelCloseBtn: {
    padding: 4,
  },
  panelCloseTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#64748B',
  },
  panelBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // Patient Info Panel specifics
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },

  // Upload Panel specifics
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  uploadSubmitBtn: {
    backgroundColor: TEAL,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  uploadSubmitTxt: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default doctorMeetingStyles;
