import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Navigation Route Names Constants
 */
export const AppRoute = {
  SPLASH: 'Splash',
  LOGIN: 'Login',
  POLICY_ACCEPTANCE: 'PolicyAcceptance',
  NOTIFICATIONS: 'Notifications',
  ACCOUNT: 'Account',
  PROFILE: 'Profile',
  PRESCRIPTION_SETTINGS: 'PrescriptionSettings',
  PRESCRIPTION_VIEW: 'PrescriptionView',
  INVOICE_SETTINGS: 'InvoiceSettings',
  ADD_PATIENT: 'AddPatient',
  EDIT_PATIENT: 'EditPatient',
  AVAILABILITY: 'Availability',
  BOOK_APPOINTMENT: 'BookAppointment',
  DOCTOR_APPOINTMENTS: 'DoctorAppointments',
  RESCHEDULE_APPOINTMENT: 'RescheduleAppointment',
  DOCTOR_MEETING: 'DoctorMeeting',
  PATIENT_DETAILS: 'PatientDetails',
  INVOICE_LIST: 'InvoiceList',
  CREATE_INVOICE: 'CreateInvoice',
  CREATE_PRESCRIPTION: 'CreatePrescription',
  PRESCRIPTION_LIST: 'PrescriptionList',
  MAIN_TABS: 'MainTabs',
  HOME: 'Home',
  PATIENTS: 'Patients',
  SCHEDULE: 'Schedule',
  REPORTS: 'Reports',
  APPOINTMENTS: 'Appointments',
  APPOINTMENT_DETAILS: 'AppointmentDetails',
} as const;

export type RouteNames = (typeof AppRoute)[keyof typeof AppRoute];

/**
 * Root Stack Navigator Parameter List
 */
export type RootStackParamList = {
  Splash: undefined;
  Login: { refetchOnMount?: boolean } | undefined;
  PolicyAcceptance: undefined;
  MainTabs: undefined;
  Home: undefined;
  Patients: undefined;
  Schedule: { refresh?: boolean } | undefined;
  Reports: undefined;
  Account: undefined;
  Profile: undefined;
  Notifications: { user?: any } | undefined;
  PrescriptionSettings: { user?: any } | undefined;
  PrescriptionView:
    | {
        rxId?: string | number;
        patientId?: string | number;
        patientName?: string;
        fromScreen?: string;
      }
    | undefined;
  Appointments: undefined;
  AppointmentDetails: { appointmentId?: string } | undefined;
  PrescriptionList: { user?: any } | undefined;
  InvoiceSettings: { user?: any } | undefined;
  AddPatient: { user?: any } | undefined;
  EditPatient: { patientId?: string | number; patientName?: string } | undefined;
  Availability: { user?: any } | undefined;
  BookAppointment: undefined;
  DoctorAppointments: { user?: any; refresh?: boolean } | undefined;
  RescheduleAppointment: { appointmentId?: number; patientId?: string | number } | undefined;
  DoctorMeeting:
    | { appointmentId?: number | string; patientId?: string; token?: string; meetingId?: string }
    | undefined;
  PatientDetails:
    | { patientId?: string | number; patientName?: string; openUploadModal?: boolean }
    | undefined;
  InvoiceList: { user?: any } | undefined;
  CreateInvoice:
    | {
        patientId?: string | number;
        patientGeneratedId?: string;
        patientName?: string;
        appointmentId?: string;
        fee?: number;
      }
    | undefined;
  CreatePrescription:
    | {
        patientId?: string | number;
        appointmentId?: string | number;
        patientName?: string;
        prescriptionId?: string | number;
        fromScreen?: string;
      }
    | undefined;
};

/**
 * Dashboard Bottom Tab Navigator Parameter List
 */
export type DashboardTabParamList = {
  Home: undefined;
  Patients: undefined;
  Appointments: { refresh?: boolean } | undefined;
  Reports: undefined;
  Account: undefined;
};

// Global type augmentation for React Navigation hooks across the app
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/**
 * Screen Props & Navigation/Route Props for Root Stack Screens
 */
export type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;
export type SplashScreenRouteProp = RouteProp<RootStackParamList, 'Splash'>;
export interface SplashScreenProps {
  navigation?: SplashScreenNavigationProp;
  route?: SplashScreenRouteProp;
}

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export interface LoginScreenProps {
  navigation?: LoginScreenNavigationProp;
  route?: LoginScreenRouteProp;
}

export type PolicyAcceptanceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PolicyAcceptance'
>;
export type PolicyAcceptanceScreenRouteProp = RouteProp<RootStackParamList, 'PolicyAcceptance'>;
export interface PolicyAcceptanceScreenProps {
  navigation?: PolicyAcceptanceScreenNavigationProp;
  route?: PolicyAcceptanceScreenRouteProp;
}

export type NotificationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Notifications'
>;
export type NotificationsScreenRouteProp = RouteProp<RootStackParamList, 'Notifications'>;
export interface NotificationsScreenProps {
  navigation?: NotificationsScreenNavigationProp;
  route?: NotificationsScreenRouteProp;
}

export type InvoiceListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'InvoiceList'
>;
export type InvoiceListScreenRouteProp = RouteProp<RootStackParamList, 'InvoiceList'>;
export interface InvoiceListScreenProps {
  navigation?: InvoiceListScreenNavigationProp;
  route?: InvoiceListScreenRouteProp;
}

export type CreateInvoiceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateInvoice'
>;
export type CreateInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'CreateInvoice'>;
export interface CreateInvoiceScreenProps {
  navigation?: CreateInvoiceScreenNavigationProp;
  route?: CreateInvoiceScreenRouteProp;
}

export type EditPatientScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditPatient'
>;
export type EditPatientScreenRouteProp = RouteProp<RootStackParamList, 'EditPatient'>;
export interface EditPatientScreenProps {
  navigation?: EditPatientScreenNavigationProp;
  route?: EditPatientScreenRouteProp;
}

export type PatientDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PatientDetails'
>;
export type PatientDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PatientDetails'>;
export interface PatientDetailsScreenProps {
  navigation?: PatientDetailsScreenNavigationProp;
  route?: PatientDetailsScreenRouteProp;
}

export type PrescriptionViewScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PrescriptionView'
>;
export type PrescriptionViewScreenRouteProp = RouteProp<RootStackParamList, 'PrescriptionView'>;
export interface PrescriptionViewScreenProps {
  navigation?: PrescriptionViewScreenNavigationProp;
  route?: PrescriptionViewScreenRouteProp;
}

export type BookAppointmentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BookAppointment'
>;
export type BookAppointmentScreenRouteProp = RouteProp<RootStackParamList, 'BookAppointment'>;
export interface BookAppointmentScreenProps {
  navigation?: BookAppointmentScreenNavigationProp;
  route?: BookAppointmentScreenRouteProp;
}

export type DoctorAppointmentsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DoctorAppointments'
>;
export type DoctorAppointmentsScreenRouteProp = RouteProp<RootStackParamList, 'DoctorAppointments'>;
export interface DoctorAppointmentsScreenProps {
  navigation?: DoctorAppointmentsScreenNavigationProp;
  route?: DoctorAppointmentsScreenRouteProp;
}

export type RescheduleAppointmentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RescheduleAppointment'
>;
export type RescheduleAppointmentScreenRouteProp = RouteProp<
  RootStackParamList,
  'RescheduleAppointment'
>;
export interface RescheduleAppointmentScreenProps {
  navigation?: RescheduleAppointmentScreenNavigationProp;
  route?: RescheduleAppointmentScreenRouteProp;
}

export type DoctorMeetingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DoctorMeeting'
>;
export type DoctorMeetingScreenRouteProp = RouteProp<RootStackParamList, 'DoctorMeeting'>;
export interface DoctorMeetingScreenProps {
  navigation?: DoctorMeetingScreenNavigationProp;
  route?: DoctorMeetingScreenRouteProp;
}

export type CreatePrescriptionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreatePrescription'
>;
export type CreatePrescriptionScreenRouteProp = RouteProp<RootStackParamList, 'CreatePrescription'>;
export interface CreatePrescriptionScreenProps {
  navigation?: CreatePrescriptionScreenNavigationProp;
  route?: CreatePrescriptionScreenRouteProp;
}

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export interface HomeScreenProps {
  navigation?: HomeScreenNavigationProp;
  route?: HomeScreenRouteProp;
}

export type RecordsTabRouteProp = RouteProp<RootStackParamList, 'PatientDetails'>;
