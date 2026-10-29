import {
  applyHysteresis,
  classifySample,
  getLinkSignalCap,
  getSignalLevel,
  lossRatio,
  sumStats,
  THysteresis,
} from '../src/hooks/commons/meeting/callQuality.utils';

describe('callQuality.utils', () => {
  it('computes loss from the change between samples, not running totals', () => {
    const before = sumStats([{ packetsLost: 100, totalPackets: 10000 }]);
    const now = sumStats([{ packetsLost: 110, totalPackets: 10500, rtt: 120 }]);
    expect(lossRatio(now, before)).toBeCloseTo(10 / 500);
    expect(lossRatio(now, null)).toBe(0);
    expect(now.rtt).toBe(120);
  });

  it('classifies samples by loss and rtt', () => {
    expect(classifySample(0.01, 100)).toBe('GOOD');
    expect(classifySample(0.05, 100)).toBe('FAIR');
    expect(classifySample(0.01, 400)).toBe('FAIR');
    expect(classifySample(0.2, 100)).toBe('WEAK');
  });

  it('drops after 2 bad samples and recovers after 3 good ones', () => {
    let state: THysteresis = { current: 'GOOD', candidate: null, streak: 0 };
    state = applyHysteresis(state, 'WEAK');
    expect(state.current).toBe('GOOD');
    state = applyHysteresis(state, 'WEAK');
    expect(state.current).toBe('WEAK');

    state = applyHysteresis(state, 'GOOD');
    state = applyHysteresis(state, 'GOOD');
    expect(state.current).toBe('WEAK');
    state = applyHysteresis(state, 'GOOD');
    expect(state.current).toBe('GOOD');
  });

  it('keeps the old bars when no link details exist', () => {
    expect(getLinkSignalCap(false, 'wifi', null, null)).toBe(4);
    expect(getLinkSignalCap(false, 'cellular', null, null)).toBe(3);
    expect(getLinkSignalCap(false, 'unknown', null, null)).toBe(2);
    expect(getLinkSignalCap(true, 'wifi', 90, null)).toBe(0);
  });

  it('caps the bars by wifi strength and cellular generation', () => {
    expect(getLinkSignalCap(false, 'wifi', 20, null)).toBe(1);
    expect(getLinkSignalCap(false, 'wifi', 70, null)).toBe(3);
    expect(getLinkSignalCap(false, 'cellular', null, '3g')).toBe(2);
    expect(getLinkSignalCap(false, 'cellular', null, '5g')).toBe(4);
  });

  it('does not show full signal on wifi when the call is weak', () => {
    expect(getSignalLevel(4, 'GOOD', null)).toBe(4);
    expect(getSignalLevel(4, 'FAIR', null)).toBe(2);
    expect(getSignalLevel(4, 'WEAK', null)).toBe(1);
    expect(getSignalLevel(4, 'GOOD', 'bandwidth')).toBe(2);
    expect(getSignalLevel(4, 'OFFLINE', null)).toBe(0);
  });
});
