import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

export const doctorMeetingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Header Bar
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 12,
    backgroundColor: '#000000',
  },
  headerLeft: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  doctorStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E99A8',
    marginTop: 4,
    letterSpacing: 0.5,
  },

  headerRight: {
    alignItems: 'flex-end',
  },
  headerTopRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 119, 6, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 6,
  },
  connectingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  connectingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.3,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 10,
  },

  headerBottomRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  leftPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8E99A8',
    letterSpacing: 0.3,
  },
  leftTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Floating PIP Box (Top Right)
  selfPipCard: {
    position: 'absolute',
    top: 95,
    right: 16,
    width: 112,
    height: 152,
    borderRadius: 16,
    backgroundColor: '#0D131E',
    borderWidth: 1,
    borderColor: '#192233',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 100,
  },
  pipMuteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipAvatarTxt: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3A475C',
  },
  pipYouBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pipYouTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8E99A8',
    letterSpacing: 0.3,
  },

  // Main Stage Area (Center Waiting State)
  stageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  waitingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 24,
    textAlign: 'center',
  },
  waitingSubtitle: {
    fontSize: 13,
    color: '#8E99A8',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Bottom Control Bar
  controlBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 12,
    backgroundColor: '#000000',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 10,
  },
  controlRowSpacing: {
    marginBottom: 10,
  },
  controlBtn: {
    flex: 1,
    height: 76,
    backgroundColor: '#22252D',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnEnd: {
    backgroundColor: '#3D1518',
    borderWidth: 1,
    borderColor: '#591C21',
  },
  controlBtnTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  controlBtnTxtMuted: {
    color: '#94A3B8',
  },
  controlBtnTxtEnd: {
    color: '#EF4444',
  },
});

export default doctorMeetingStyles;

