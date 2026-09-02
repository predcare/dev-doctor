import { create } from 'zustand';

export type TCallState = 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ENDED' | 'ERROR';

interface IMeetingStoreState {
  // Session details
  token: string | null;
  meetingId: string | null;
  appointmentId: number | string | null;

  // Appointment context (for header display & timer)
  patientName: string | null;
  patientAlphanumericId: string | null;
  appointmentGeneratedId: string | null;
  startTime: string | null;
  endTime: string | null;
  callDurationSeconds: number;

  // Connection & Media States
  callState: TCallState;
  errorMessage: string | null;
  isMicOn: boolean;
  isCameraOn: boolean;
  facingMode: 'front' | 'back';
  remoteParticipantId: string | null;
  // PiP States
  isInAppPip: boolean;
  isNativePip: boolean;

  // Actions
  setMeetingSession: (params: {
    token: string;
    meetingId: string;
    appointmentId?: number | string;
    patientName?: string;
    patientAlphanumericId?: string;
    appointmentGeneratedId?: string;
    startTime?: string;
    endTime?: string;
    callDurationSeconds?: number;
  }) => void;
  setCallState: (callState: TCallState) => void;
  setErrorState: (message?: string) => void;
  setMicState: (isMicOn: boolean) => void;
  setCameraState: (isCameraOn: boolean) => void;
  setFacingMode: (mode: 'front' | 'back') => void;
  setRemoteParticipantId: (id: string | null) => void;
  setIsInAppPip: (isInAppPip: boolean) => void;
  setIsNativePip: (isNativePip: boolean) => void;
  resetMeetingStore: () => void;
}

const initialState = {
  token: null,
  meetingId: null,
  appointmentId: null,
  patientName: null,
  patientAlphanumericId: null,
  appointmentGeneratedId: null,
  startTime: null,
  endTime: null,
  callDurationSeconds: 0,
  callState: 'IDLE' as TCallState,
  errorMessage: null as string | null,
  isMicOn: true,
  isCameraOn: true,
  facingMode: 'front' as const,
  remoteParticipantId: null,
  isInAppPip: false,
  isNativePip: false,
};

export const useMeetingStore = create<IMeetingStoreState>(set => ({
  ...initialState,

  setMeetingSession: ({
    token,
    meetingId,
    appointmentId,
    patientName,
    patientAlphanumericId,
    appointmentGeneratedId,
    startTime,
    endTime,
    callDurationSeconds,
  }) =>
    set({
      token,
      meetingId,
      appointmentId: appointmentId ?? null,
      patientName: patientName ?? null,
      patientAlphanumericId: patientAlphanumericId ?? null,
      appointmentGeneratedId: appointmentGeneratedId ?? null,
      startTime: startTime ?? null,
      endTime: endTime ?? null,
      callDurationSeconds: callDurationSeconds ?? 0,
      callState: 'CONNECTING',
      errorMessage: null,
      isInAppPip: false,
      isNativePip: false,
    }),

  setCallState: callState => set({ callState }),

  setErrorState: message =>
    set({
      callState: 'ERROR',
      errorMessage: message || "'token' is empty or invalid or might have expired.",
    }),

  setMicState: isMicOn => set({ isMicOn }),

  setCameraState: isCameraOn => set({ isCameraOn }),

  setFacingMode: facingMode => set({ facingMode }),

  setRemoteParticipantId: remoteParticipantId =>
    set(state => ({
      remoteParticipantId,
      // Don't overwrite terminal states (ERROR/ENDED) — a participant leaving
      // during an error flow shouldn't flip us back to CONNECTING.
      callState:
        state.callState === 'ERROR' || state.callState === 'ENDED'
          ? state.callState
          : remoteParticipantId
          ? 'CONNECTED'
          : 'CONNECTING',
    })),

  setIsInAppPip: isInAppPip => set({ isInAppPip }),

  setIsNativePip: isNativePip => set({ isNativePip }),

  resetMeetingStore: () => set({ ...initialState }),
}));
