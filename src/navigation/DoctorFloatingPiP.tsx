import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDoctorCall } from './DoctorCallContext';

const { width: SW, height: SH } = Dimensions.get('window');
const PIP_W = 120;
const PIP_H = 160;
const NAME_H = 42;
const MARGIN = 12;
const DRAG_THR = 6;

export const DoctorFloatingPiP: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { activeCall, isFloatingPiP, restoreCall, endCall } = useDoctorCall();

  const pan = useRef(
    new Animated.ValueXY({
      x: SW - PIP_W - MARGIN,
      y: SH - PIP_H - NAME_H - 120,
    })
  ).current;

  const isDragging = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.sqrt(dx * dx + dy * dy) > DRAG_THR,
      onPanResponderGrant: () => {
        isDragging.current = false;
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, { dx, dy }) => {
        if (Math.sqrt(dx * dx + dy * dy) > DRAG_THR) {
          isDragging.current = true;
        }
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(_, { dx, dy });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        if (!isDragging.current) {
          restoreCall(navigation);
          return;
        }
        const cx = (pan.x as any)._value + PIP_W / 2;
        const cy = (pan.y as any)._value;
        const snapX = cx < SW / 2 ? MARGIN : SW - PIP_W - MARGIN;
        const snapY = Math.max(60, Math.min(cy, SH - PIP_H - NAME_H - 90));

        Animated.spring(pan, {
          toValue: { x: snapX, y: snapY },
          useNativeDriver: false,
          tension: 40,
          friction: 7,
        }).start();
      },
    })
  ).current;

  if (!isFloatingPiP || !activeCall) return null;

  const initial = activeCall.patientName
    ? activeCall.patientName.trim().charAt(0).toUpperCase()
    : 'P';

  return (
    <Animated.View
      style={[S.card, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <View style={S.videoArea}>
        {/* Remote Patient Avatar View */}
        <View style={S.avatarBg}>
          <View style={S.avatarCircle}>
            <Text style={S.avatarTxt}>{initial}</Text>
          </View>
        </View>

        {/* Doctor Inset Thumbnail View */}
        <View style={S.selfView}>
          <Text style={S.selfTxt}>D</Text>
        </View>

        {/* Live Indicator Dot */}
        <View style={S.liveDot} />

        {/* End Call Button */}
        <TouchableOpacity
          style={S.endBtn}
          onPress={endCall}
          hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
          activeOpacity={0.8}
        >
          <Text style={S.endTxt}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Name Bar */}
      <TouchableOpacity
        style={S.nameBar}
        onPress={() => restoreCall(navigation)}
        activeOpacity={0.9}
      >
        <Text style={S.nameText} numberOfLines={1}>
          Pt. {activeCall.patientName}
        </Text>
        <Text style={S.tapHint}>Tap to return</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const S = StyleSheet.create({
  card: {
    position: 'absolute',
    width: PIP_W,
    zIndex: 99999,
    elevation: 25,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: '#00897B',
  },
  videoArea: {
    width: PIP_W,
    height: PIP_H,
    backgroundColor: '#0F172A',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#00897B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  selfView: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 32,
    height: 44,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#00897B',
    backgroundColor: '#0F1A17',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selfTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  liveDot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    elevation: 5,
  },
  endBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  endTxt: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  nameBar: {
    height: NAME_H,
    backgroundColor: '#00685D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 137, 123, 0.4)',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  tapHint: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 1,
  },
});

export default DoctorFloatingPiP;
