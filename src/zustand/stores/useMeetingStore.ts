import { create } from 'zustand';
import {
  ICallInfo,
  IMeetingStoreState,
  MeetingCallState,
  MeetingPipMode,
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
    set(state => ({
      patientParticipantId: id,
      patientWebcamOn: webcamOn !== undefined ? webcamOn : state.patientWebcamOn,
      patientMicOn: micOn !== undefined ? micOn : state.patientMicOn,
    })),

  setIsCameraPausedForCapture: paused => set({ isCameraPausedForCapture: paused }),

  bumpCameraSessionEpoch: () =>
    set(state => ({ cameraSessionEpoch: state.cameraSessionEpoch + 1 })),

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
