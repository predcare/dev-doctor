import { TVideoTier } from '../zustand/interfaces/meeting.interfaces';

export const CALL_QUALITY_SAMPLE_MS = 3000;
export const CALL_QUALITY_DOWNGRADE_SAMPLES = 2;
export const CALL_QUALITY_UPGRADE_SAMPLES = 3;

export const CALL_QUALITY_THRESHOLDS = {
  good: { loss: 0.02, rtt: 250 },
  fair: { loss: 0.08, rtt: 500 },
} as const;

export const VIDEO_TIER_STEP_MS = {
  toSd: 6000,
  toLow: 10000,
  toAudio: 20000,
  restore: 10000,
} as const;

// The React Native SDK has no 540p preset, so SD is 480p.
export const VIDEO_TIER_PRESETS = {
  hd: { encoderConfig: 'h720p_w1280p', bitrateMode: 'balanced', maxLayer: 3 },
  sd: { encoderConfig: 'h480p_w640p', bitrateMode: 'bandwidth_optimized', maxLayer: 2 },
  low: { encoderConfig: 'h360p_w640p', bitrateMode: 'bandwidth_optimized', maxLayer: 2 },
} as const satisfies Record<Exclude<TVideoTier, 'audio'>, object>;

export const MEETING_REJOIN_BACKOFF_MS = [2000, 4000, 8000, 15000, 15000];

export const MEETING_SDK_RECOVERY_MS = 30000;

export const MEETING_OFFLINE_GRACE_MS = 8000;

export const MEETING_LEAVE_TIMEOUT_MS = 3000;

/** onMeetingLeft codes that mean "the network dropped", not "the call ended". */
export const MEETING_NETWORK_LEAVE_CODES = [1001, 1007, 1102, 1103];
