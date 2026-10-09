import { create } from 'zustand';

export type TCallState = 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ENDED' | 'ERROR';

export type MeetingPipMode = 'NORMAL' | 'IN_APP_PIP' | 'NATIVE_PIP';

interface IMeetingStoreState {
  // Session details
  token: string | null;
  meetingId: string | null;
  appointmentId: number | string | null;

  // Appointment context (for header display & timer)
  patientName: string | null;
  patientUserId: string | null;
  patientAlphanumericId: string | null;
  appointmentGeneratedId: string | null;
  startTime: string | null;
  endTime: string | null;
  callDurationSeconds: number;
  remainingSeconds: number;

  // Connection & Media States
  callState: TCallState;
  errorMessage: string | null;
  isMicOn: boolean;
  isCameraOn: boolean;
  facingMode: 'front' | 'back';
  remoteParticipantId: string | null;
  // PiP & Camera Interruption States
  pipMode: MeetingPipMode;
  isInAppPip: boolean;
  isNativePip: boolean;
  isCameraPausedForCapture: boolean;
  cameraSessionEpoch: number;

  // in Person consulatation
  apptIdforInPerson?: string | null;
  patientIdforInPerson?: string | null;
  patientNameforInPerson?: string | null;
  statusforInPerson?: string | null;

  // Actions
  setMeetingSession: (params: {
    token: string;
    meetingId: string;
    appointmentId?: number | string;
    patientName?: string;
    patientUserId?: string;
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
  setRemainingSeconds: (seconds: number | ((prev: number) => number)) => void;
  setPipMode: (pipMode: MeetingPipMode) => void;
  setIsInAppPip: (isInAppPip: boolean) => void;
  setIsNativePip: (isNativePip: boolean) => void;
  setIsCameraPausedForCapture: (paused: boolean) => void;
  bumpCameraSessionEpoch: () => void;
  resetMeetingStore: () => void;
  clearInPersonAppointment: () => void;
  setInPersonAppointment: (params: {
    apptIdforInPerson?: string | null;
    patientIdforInPerson?: string | null;
    patientNameforInPerson?: string | null;
    statusforInPerson?: string | null;
  }) => void;
}

const initialState = {
  token: null,
  meetingId: null,
  appointmentId: null,
  patientName: null,
  patientUserId: null,
  patientAlphanumericId: null,
  appointmentGeneratedId: null,
  startTime: null,
  endTime: null,
  callDurationSeconds: 0,
  remainingSeconds: 0,
  callState: 'IDLE' as TCallState,
  errorMessage: null as string | null,
  isMicOn: true,
  isCameraOn: true,
  facingMode: 'front' as const,
  remoteParticipantId: null,
  pipMode: 'NORMAL' as MeetingPipMode,
  isInAppPip: false,
  isNativePip: false,
  isCameraPausedForCapture: false,
  cameraSessionEpoch: 0,
  apptIdforInPerson: null,
  patientIdforInPerson: null,
  patientNameforInPerson: null,
  statusforInPerson: null,
};

export const useMeetingStore = create<IMeetingStoreState>(set => ({
  ...initialState,

  setMeetingSession: ({
    token,
    meetingId,
    appointmentId,
    patientName,
    patientUserId,
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
      patientUserId: patientUserId ?? null,
      patientAlphanumericId: patientAlphanumericId ?? null,
      appointmentGeneratedId: appointmentGeneratedId ?? null,
      startTime: startTime ?? null,
      endTime: endTime ?? null,
      callDurationSeconds: callDurationSeconds ?? 0,
      remainingSeconds: Math.max(0, callDurationSeconds ?? 0),
      callState: 'CONNECTING',
      errorMessage: null,
      pipMode: 'NORMAL',
      isInAppPip: false,
      isNativePip: false,
      isCameraPausedForCapture: false,
      cameraSessionEpoch: 0,
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

  setRemainingSeconds: update =>
    set(state => ({
      remainingSeconds: typeof update === 'function' ? update(state.remainingSeconds) : update,
    })),

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

  setPipMode: pipMode =>
    set({
      pipMode,
      isInAppPip: pipMode === 'IN_APP_PIP',
      isNativePip: pipMode === 'NATIVE_PIP',
    }),

  setIsInAppPip: isInAppPip =>
    set(state => ({
      isInAppPip,
      pipMode: isInAppPip ? 'IN_APP_PIP' : state.isNativePip ? 'NATIVE_PIP' : 'NORMAL',
    })),

  setIsNativePip: isNativePip =>
    set(state => ({
      isNativePip,
      isInAppPip: isNativePip ? false : state.isInAppPip,
      pipMode: isNativePip ? 'NATIVE_PIP' : state.isInAppPip ? 'IN_APP_PIP' : 'NORMAL',
    })),

  setIsCameraPausedForCapture: isCameraPausedForCapture => set({ isCameraPausedForCapture }),

  bumpCameraSessionEpoch: () =>
    set(state => ({ cameraSessionEpoch: state.cameraSessionEpoch + 1 })),

  resetMeetingStore: () => set({ ...initialState }),

  // In Person
  clearInPersonAppointment: () =>
    set({
      apptIdforInPerson: null,
      patientIdforInPerson: null,
      patientNameforInPerson: null,
      statusforInPerson: null,
    }),

  setInPersonAppointment: ({
    apptIdforInPerson,
    patientIdforInPerson,
    patientNameforInPerson,
    statusforInPerson,
  }) =>
    set({
      apptIdforInPerson: apptIdforInPerson ?? null,
      patientIdforInPerson: patientIdforInPerson ?? null,
      patientNameforInPerson: patientNameforInPerson ?? null,
      statusforInPerson: statusforInPerson ?? null,
    }),
}));

export default useMeetingStore;
