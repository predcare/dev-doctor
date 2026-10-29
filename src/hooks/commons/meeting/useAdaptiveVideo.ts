import { useMeeting, useParticipant } from '@videosdk.live/react-native-sdk';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { VIDEO_TIER_STEP_MS } from '../../../config/meeting.constants';
import { showInfoToast, showWarningToast } from '../../../lib/commons/toast.utils';
import { TVideoTier } from '../../../zustand/interfaces/meeting.interfaces';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';
import { createCameraTrack, getSendTier, stopStream } from './meetingMediaTracks';

const ORDER: TVideoTier[] = ['hd', 'sd', 'low', 'audio'];

/**
 * One place decides the video tier: what layer to request from the patient and what the
 * doctor's camera sends. Steps down after a weak period and back up one level at a time.
 */
export const useAdaptiveVideo = () => {
  const badSinceRef = useRef<number | null>(null);
  const goodSinceRef = useRef<number | null>(null);
  const toastedRef = useRef<Set<TVideoTier>>(new Set());
  // The session's first camera track was created at the current tier (HD on join, the tier on rejoin).
  const appliedSendTierRef = useRef(getSendTier(useMeetingStore.getState().videoTier));
  const wasAudioOnlyRef = useRef(false);

  const networkQuality = useMeetingStore(state => state.networkQuality);
  const qualityLimitation = useMeetingStore(state => state.qualityLimitation);
  const videoTier = useMeetingStore(state => state.videoTier);
  const pipMode = useMeetingStore(state => state.pipMode);
  const isCamOn = useMeetingStore(state => state.isCamOn);
  const isCameraPausedForCapture = useMeetingStore(state => state.isCameraPausedForCapture);
  const patientParticipantId = useMeetingStore(state => state.patientParticipantId);
  const setVideoTier = useMeetingStore(state => state.setVideoTier);
  const bumpCameraSessionEpoch = useMeetingStore(state => state.bumpCameraSessionEpoch);
  const { changeWebcam } = useMeeting({});
  const remote = useParticipant(patientParticipantId || '');

  const changeWebcamRef = useRef(changeWebcam);
  const remoteRef = useRef(remote);
  changeWebcamRef.current = changeWebcam;
  remoteRef.current = remote;

  const remoteWebcamOn = Boolean(remote?.webcamOn);
  const remoteTrackId = remote?.webcamStream?.track?.id ?? null;

  // 1. Decide the tier
  useEffect(() => {
    const tick = () => {
      if (networkQuality === 'OFFLINE') {
        // Reconnect handles a drop; keep the tier and restart the clocks.
        badSinceRef.current = null;
        goodSinceRef.current = null;
        return;
      }

      const now = Date.now();
      const isBad = networkQuality !== 'GOOD' || qualityLimitation !== null;
      if (isBad) {
        goodSinceRef.current = null;
        badSinceRef.current ??= now;
      } else {
        badSinceRef.current = null;
        goodSinceRef.current ??= now;
      }

      const badFor = badSinceRef.current ? now - badSinceRef.current : 0;
      const goodFor = goodSinceRef.current ? now - goodSinceRef.current : 0;
      const index = ORDER.indexOf(videoTier);

      let target: TVideoTier = videoTier;
      if (qualityLimitation === 'bandwidth' && badFor >= VIDEO_TIER_STEP_MS.toAudio) {
        target = 'audio';
      } else if (networkQuality === 'WEAK' && badFor >= VIDEO_TIER_STEP_MS.toAudio) {
        target = 'audio';
      } else if (networkQuality === 'WEAK' && badFor >= VIDEO_TIER_STEP_MS.toLow) {
        target = index < 2 ? 'low' : videoTier;
      } else if (isBad && badFor >= VIDEO_TIER_STEP_MS.toSd) {
        target = index < 1 ? 'sd' : videoTier;
      } else if (!isBad && goodFor >= VIDEO_TIER_STEP_MS.restore && index > 0) {
        target = ORDER[index - 1];
        goodSinceRef.current = now;
      }

      if (target !== videoTier) setVideoTier(target);
    };

    tick();
    const intervalId = setInterval(tick, 2000);
    return () => clearInterval(intervalId);
  }, [networkQuality, qualityLimitation, videoTier, setVideoTier]);

  // Runs before the swap below: a camera turned back on (CAM ON, capture handoff, restore)
  // is already created at the current tier.
  useEffect(() => {
    if (isCamOn && !isCameraPausedForCapture) {
      appliedSendTierRef.current = getSendTier(useMeetingStore.getState().videoTier);
    }
  }, [isCamOn, isCameraPausedForCapture]);

  // 2. Outgoing camera follows the tier
  useEffect(() => {
    const sendTier = getSendTier(videoTier);
    if (sendTier === appliedSendTierRef.current) return;
    // Do not fight the Android capture handoff or swap the camera inside system PiP;
    // the swap runs once those end (the deps re-run this effect).
    if (!isCamOn || isCameraPausedForCapture) return;
    if (Platform.OS === 'android' && pipMode === 'NATIVE_PIP') return;

    let cancelled = false;
    createCameraTrack(sendTier)
      .then(async stream => {
        if (cancelled || !changeWebcamRef.current) {
          stopStream(stream);
          return;
        }
        await changeWebcamRef.current(stream);
        appliedSendTierRef.current = sendTier;
        bumpCameraSessionEpoch();
      })
      .catch(error => console.warn('[useAdaptiveVideo] change camera quality failed:', error));

    return () => {
      cancelled = true;
    };
  }, [videoTier, pipMode, isCamOn, isCameraPausedForCapture, bumpCameraSessionEpoch]);

  // 3. Incoming patient video
  useEffect(() => {
    const p = remoteRef.current;
    if (!patientParticipantId || !p) return;

    if (videoTier === 'audio') {
      wasAudioOnlyRef.current = true;
      p.stopConsumingWebcamStreams?.().catch(() => undefined);
      return;
    }
    if (wasAudioOnlyRef.current) {
      wasAudioOnlyRef.current = false;
      p.consumeWebcamStreams?.().catch(() => undefined);
    }
    if (!remoteWebcamOn || !remoteTrackId || typeof p.setQuality !== 'function') return;

    // The PiP windows are small, so the high layer only costs bandwidth there.
    const quality =
      pipMode !== 'NORMAL' || videoTier === 'low' ? 'low' : videoTier === 'sd' ? 'med' : 'high';
    p.setQuality(quality).catch(error => {
      console.warn(`[useAdaptiveVideo] setQuality(${quality}) failed:`, error);
    });
  }, [patientParticipantId, videoTier, pipMode, remoteWebcamOn, remoteTrackId]);

  // 4. One toast per tier per call
  useEffect(() => {
    if (toastedRef.current.has(videoTier)) return;
    if (videoTier === 'low') {
      toastedRef.current.add(videoTier);
      showWarningToast('Weak connection. Video quality lowered to keep audio clear.');
    } else if (videoTier === 'audio') {
      toastedRef.current.add(videoTier);
      showInfoToast('Switched to audio only to keep the call going.');
    } else if (videoTier === 'hd' && toastedRef.current.size > 0) {
      toastedRef.current.clear();
      showInfoToast('Connection improved. Video restored.');
    }
  }, [videoTier]);
};

export default useAdaptiveVideo;
