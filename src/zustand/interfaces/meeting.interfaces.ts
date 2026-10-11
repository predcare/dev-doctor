export type MeetingCallState =
  | 'IDLE'
  | 'INITIALIZING'
  | 'CONNECTING'
  | 'WAITING_FOR_PATIENT'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'DISCONNECTED'
  | 'FAILED'
  | 'ENDED';

export type MeetingPipMode = 'NORMAL' | 'IN_APP_PIP' | 'NATIVE_PIP';

export interface IMeetingPatientInfo {
  name?: string;
  patientId?: string;
}

export interface ICallAppointmentInfo {
  id: string | null;
  appointmentId: string | null;
  appointmentDate: string | null;
  startTime: string | null;
  endTime: string | null;
  slotDuration: number | null;
  appointmentDuration: number | null;
  callElapsedSeconds: number | null;
}

export interface ICallInfo {
  token: string | null;
  meetingId: string | null;
  appointment: ICallAppointmentInfo | null;
}

export interface IMeetingStoreState {
  callInfo: ICallInfo;
  appointmentId: string | number | null;
  callState: MeetingCallState;
  pipMode: MeetingPipMode;
  isMuted: boolean;
  isCamOn: boolean;
  isFrontCamera: boolean;
  patientInfo: IMeetingPatientInfo | null;
  remainingSeconds: number;
  patientParticipantId: string | null;
  patientWebcamOn: boolean;
  patientMicOn: boolean;
  isCameraPausedForCapture: boolean;
  cameraSessionEpoch: number;

  apptIdforInPerson: string | null;
  patientIdforInPerson: string | null;
  patientNameforInPerson: string | null;
  statusforInPerson: string | null;

  setIsCameraPausedForCapture: (paused: boolean) => void;
  bumpCameraSessionEpoch: () => void;

  setCallInfo: (data: {
    token: string;
    meeting_id: string;
    appointment: {
      id: string;
      appointment_id: string;
      appointment_date: string;
      start_time: string;
      end_time: string;
      slot_duration?: number;
      appointment_duration?: number;
      call_elapsed_seconds?: number;
    };
    patientInfo?: IMeetingPatientInfo;
  }) => void;
  setCallState: (callState: MeetingCallState) => void;
  setPipMode: (pipMode: MeetingPipMode) => void;
  setIsMuted: (isMuted: boolean) => void;
  setIsCamOn: (isCamOn: boolean) => void;
  setIsFrontCamera: (isFrontCamera: boolean) => void;
  setRemainingSeconds: (seconds: number | ((prev: number) => number)) => void;
  setPatientParticipant: (data: {
    id: string | null;
    webcamOn?: boolean;
    micOn?: boolean;
  }) => void;
  resetCallInfo: () => void;
  resetMeetingStore: () => void;
  clearInPersonAppointment: () => void;
  setInPersonAppointment: (params: {
    apptIdforInPerson?: string | null;
    patientIdforInPerson?: string | null;
    patientNameforInPerson?: string | null;
    statusforInPerson?: string | null;
  }) => void;
}
