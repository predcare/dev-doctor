import { useMeeting, useParticipant } from '@videosdk.live/react-native-sdk';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { CALL_QUALITY_SAMPLE_MS } from '../../../config/meeting.constants';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';
import useNetworkStore from '../../../zustand/stores/useNetworkStore';
import {
  applyHysteresis,
  classifySample,
  lossRatio,
  sumStats,
  THysteresis,
  TStatsRow,
  TStatsTotals,
} from './callQuality.utils';

/**
 * Samples the doctor's upload and the patient's stream every few seconds and writes a
 * smoothed GOOD / FAIR / WEAK / OFFLINE to the store. Uses audio stats when video is off.
 */
export const useCallQualityMonitor = () => {
  const hysteresisRef = useRef<THysteresis>({ current: 'GOOD', candidate: null, streak: 0 });
  const previousRef = useRef<Record<string, TStatsTotals | null>>({});

  const patientParticipantId = useMeetingStore(state => state.patientParticipantId);
  const setNetworkQuality = useMeetingStore(state => state.setNetworkQuality);
  const { localParticipant } = useMeeting({});
  const local = useParticipant(localParticipant?.id || '');
  const remote = useParticipant(patientParticipantId || '');

  // Refs keep the interval alive across SDK updates (useParticipant returns new objects).
  const localRef = useRef(local);
  const remoteRef = useRef(remote);
  localRef.current = local;
  remoteRef.current = remote;

  useEffect(() => {
    let cancelled = false;

    const sample = async () => {
      const { isOffline } = useNetworkStore.getState();
      const { callState, pipMode } = useMeetingStore.getState();
      // Keep sampling in native PiP (the call is visible); skip a plain background app.
      if (AppState.currentState !== 'active' && pipMode !== 'NATIVE_PIP') return;

      if (isOffline || callState === 'RECONNECTING' || callState === 'DISCONNECTED') {
        hysteresisRef.current = { current: 'OFFLINE', candidate: null, streak: 0 };
        previousRef.current = {};
        setNetworkQuality('OFFLINE');
        return;
      }

      const sources = [
        { key: 'local', p: localRef.current },
        { key: 'remote', p: remoteRef.current },
      ];

      let worstLoss = 0;
      let worstRtt = 0;
      let sampled = false;
      for (const { key, p } of sources) {
        if (!p?.participant || typeof p.getAudioStats !== 'function') continue;
        try {
          const rows = p.webcamOn ? await p.getVideoStats() : await p.getAudioStats();
          if (!rows?.length) continue;
          const totals = sumStats(rows as unknown as TStatsRow[]);
          worstLoss = Math.max(worstLoss, lossRatio(totals, previousRef.current[key] ?? null));
          worstRtt = Math.max(worstRtt, totals.rtt);
          previousRef.current[key] = totals;
          sampled = true;
        } catch {
          // a missed sample is ignored
        }
      }
      if (cancelled) return;

      // Leaving OFFLINE needs real data; with no stats yet, treat the link as fine.
      const reading = sampled ? classifySample(worstLoss, worstRtt) : 'GOOD';
      const next = applyHysteresis(hysteresisRef.current, reading);
      hysteresisRef.current = next;
      setNetworkQuality(next.current);
    };

    const intervalId = setInterval(sample, CALL_QUALITY_SAMPLE_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [setNetworkQuality]);
};

export default useCallQualityMonitor;
