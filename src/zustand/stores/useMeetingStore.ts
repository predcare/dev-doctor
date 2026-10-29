import { create } from 'zustand';
import {
  ICallInfo,
  IMeetingStoreState,
  MeetingCallState,
  MeetingPipMode,
  TNetworkQuality,
  TQualityLimitation,
  TVideoTier,
} from '../interfaces/meeting.interfaces';

const initialCallInfo: ICallInfo = {
  token: null,
  meetingId: null,
  appointment: null,
};

const initialVideoState = {
  callInfo: initialCallInfo,
  appointmentId: null as string | number | null,
  callState: 'IDLE' as MeetingCallState,
  pipMode: 'NORMAL' as MeetingPipMode,
  isMuted: false,
  isCamOn: true,
  isFrontCamera: true,
  patientInfo: null,
  remainingSeconds: 0,
  patientParticipantId: null as string | null,
  patientWebcamOn: false,
  patientMicOn: true,
  isCameraPausedForCapture: false,
  cameraSessionEpoch: 0,
  networkQuality: 'GOOD' as TNetworkQuality,
  qualityLimitation: null as TQualityLimitation,
  videoTier: 'hd' as TVideoTier,
  sessionKey: 0,
  rejoinAttempt: 0,
  isEndRequested: false,
};

const initialInPersonState = {
  apptIdforInPerson: null as string | null,
  patientIdforInPerson: null as string | null,
  patientNameforInPerson: null as string | null,
  statusforInPerson: null as string | null,
};

export const useMeetingStore = create<IMeetingStoreState>((set, get) => ({
  ...initialVideoState,
  ...initialInPersonState,

  setCallInfo: ({ token, meeting_id, appointment, patientInfo }) => {
    const durationMinutes = Number(
      appointment.appointment_duration || appointment.slot_duration || 0
    );
    const elapsedSeconds = Math.max(0, Number(appointment.call_elapsed_seconds || 0));
    const totalSeconds = durationMinutes > 0 ? Math.floor(durationMinutes * 60) : 0;
    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

    set({
      callInfo: {
        token,
        meetingId: meeting_id,
        appointment: {
          id: appointment.id,
          appointmentId: appointment.appointment_id,
          appointmentDate: appointment.appointment_date,
          startTime: appointment.start_time,
          endTime: appointment.end_time,
          slotDuration: appointment.slot_duration ?? null,
          appointmentDuration: durationMinutes || null,
          callElapsedSeconds: elapsedSeconds,
        },
      },
      appointmentId: appointment.id,
      patientInfo: patientInfo || get().patientInfo,
      remainingSeconds,
      callState: 'INITIALIZING',
      pipMode: 'NORMAL',
    });
  },

  setCallState: (callState: MeetingCallState) => set({ callState }),

  setPipMode: (pipMode: MeetingPipMode) => set({ pipMode }),

  setIsMuted: (isMuted: boolean) => set({ isMuted }),

  setIsCamOn: (isCamOn: boolean) => set({ isCamOn }),

  setIsFrontCamera: (isFrontCamera: boolean) => set({ isFrontCamera }),

  setRemainingSeconds: update =>
    set(state => ({
      remainingSeconds: typeof update === 'function' ? update(state.remainingSeconds) : update,
    })),

  setPatientParticipant: ({ id, webcamOn, micOn }) =>
    set(state => {
      const nextWebcamOn = webcamOn !== undefined ? webcamOn : state.patientWebcamOn;
      const nextMicOn = micOn !== undefined ? micOn : state.patientMicOn;
      // Several hooks report the same patient values; skip no-op writes to avoid extra renders.
      if (
        state.patientParticipantId === id &&
        state.patientWebcamOn === nextWebcamOn &&
        state.patientMicOn === nextMicOn
      ) {
        return state;
      }
      return { patientParticipantId: id, patientWebcamOn: nextWebcamOn, patientMicOn: nextMicOn };
    }),

  setIsCameraPausedForCapture: paused => set({ isCameraPausedForCapture: paused }),

  bumpCameraSessionEpoch: () =>
    set(state => ({ cameraSessionEpoch: state.cameraSessionEpoch + 1 })),

  setNetworkQuality: networkQuality =>
    set(state => (state.networkQuality === networkQuality ? state : { networkQuality })),

  setQualityLimitation: qualityLimitation =>
    set(state => (state.qualityLimitation === qualityLimitation ? state : { qualityLimitation })),

  setVideoTier: videoTier => set(state => (state.videoTier === videoTier ? state : { videoTier })),

  setRejoinAttempt: rejoinAttempt => set({ rejoinAttempt }),

  setEndRequested: isEndRequested => set({ isEndRequested }),

  rejoinCallInfo: ({ token, meetingId, callElapsedSeconds }) =>
    set(state => {
      const durationMinutes = Number(state.callInfo.appointment?.appointmentDuration || 0);
      const totalSeconds = Math.floor(durationMinutes * 60);
      const serverRemaining =
        callElapsedSeconds != null && totalSeconds > 0
          ? Math.max(0, totalSeconds - callElapsedSeconds)
          : null;
      // Keeps pipMode, mute/camera state and patientInfo: only the session changes.
      return {
        callInfo: { ...state.callInfo, token, meetingId },
        sessionKey: state.sessionKey + 1,
        callState: 'RECONNECTING' as MeetingCallState,
        patientParticipantId: null,
        // The server can only shorten the remaining time, never extend it.
        remainingSeconds:
          serverRemaining != null
            ? Math.min(state.remainingSeconds, serverRemaining)
            : state.remainingSeconds,
      };
    }),

  resetCallInfo: () =>
    set({
      ...initialVideoState,
    }),

  resetMeetingStore: () =>
    set({
      ...initialVideoState,
    }),

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
