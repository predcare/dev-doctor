import { create } from 'zustand';

export interface IncomingCallData {
  patientName?: string;
  callType?: string;
  appointmentId?: number | string;
  meetingId?: string;
  onJoin?: () => void;
}

interface IncomingCallStoreState {
  visible: boolean;
  patientName: string;
  callType: string;
  appointmentId?: number | string;
  meetingId?: string;
  onJoin?: () => void;

  showCallBanner: (params?: IncomingCallData) => void;
  hideCallBanner: () => void;
  toggleCallBanner: () => void;
}

const DEFAULT_PATIENT_NAME = 'Patient';
const DEFAULT_CALL_TYPE = 'Incoming Video Call...';

export const useIncomingCallStore = create<IncomingCallStoreState>(set => ({
  visible: false,
  patientName: DEFAULT_PATIENT_NAME,
  callType: DEFAULT_CALL_TYPE,
  appointmentId: undefined,
  meetingId: undefined,
  onJoin: undefined,

  showCallBanner: (params?: IncomingCallData) =>
    set({
      visible: true,
      patientName: params?.patientName || DEFAULT_PATIENT_NAME,
      callType: params?.callType || DEFAULT_CALL_TYPE,
      appointmentId: params?.appointmentId,
      meetingId: params?.meetingId,
      onJoin: params?.onJoin,
    }),

  hideCallBanner: () =>
    set({
      visible: false,
      patientName: '',
      callType: '',
      appointmentId: undefined,
      meetingId: undefined,
      onJoin: undefined,
    }),

  toggleCallBanner: () =>
    set(state => ({
      visible: !state.visible,
    })),
}));

export default useIncomingCallStore;
