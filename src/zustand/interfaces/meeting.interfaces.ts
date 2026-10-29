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

export type TNetworkQuality = 'GOOD' | 'FAIR' | 'WEAK' | 'OFFLINE';

export type TVideoTier = 'hd' | 'sd' | 'low' | 'audio';

export type TQualityLimitation = 'congestion' | 'bandwidth' | 'cpu' | null;

export interface IMeetingTokenRefresh {
  token: string;
  meetingId: string;
  callElapsedSeconds?: number;
}

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
  networkQuality: TNetworkQuality;
  qualityLimitation: TQualityLimitation;
  videoTier: TVideoTier;
  /** Bumped on every rejoin so MeetingProvider remounts with the fresh token. */
  sessionKey: number;
  rejoinAttempt: number;
  /** Set by endMeetingCall() so a network drop can be told apart from an intentional end. */
  isEndRequested: boolean;

  apptIdforInPerson: string | null;
  patientIdforInPerson: string | null;
  patientNameforInPerson: string | null;
  statusforInPerson: string | null;

  setIsCameraPausedForCapture: (paused: boolean) => void;
  bumpCameraSessionEpoch: () => void;
  setNetworkQuality: (networkQuality: TNetworkQuality) => void;
  setQualityLimitation: (qualityLimitation: TQualityLimitation) => void;
  setVideoTier: (videoTier: TVideoTier) => void;
  setRejoinAttempt: (rejoinAttempt: number) => void;
  setEndRequested: (isEndRequested: boolean) => void;
  rejoinCallInfo: (params: IMeetingTokenRefresh) => void;

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
