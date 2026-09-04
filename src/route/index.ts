import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Navigation Route Names Constants
 */
export const AppRoute = {
  SPLASH: 'Splash',
  LOGIN: 'Login',
  NOTIFICATIONS: 'Notifications',
  DOCTOR_PROFILE: 'DoctorProfile',
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
  ACCOUNT: 'Account',
} as const;

export type RouteNames = (typeof AppRoute)[keyof typeof AppRoute];

/**
 * Root Stack Navigator Parameter List
 */
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Notifications: { user?: any } | undefined;
  DoctorProfile: { user?: any } | undefined;
  PrescriptionSettings: { user?: any } | undefined;
  PrescriptionView:
    | { rxId?: string | number; patientId?: string; patientName?: string }
    | undefined;
  PrescriptionList: { user?: any } | undefined;
  InvoiceSettings: { user?: any } | undefined;
  AddPatient: { user?: any } | undefined;
  EditPatient: { patientId?: string | number; patientName?: string } | undefined;
  Availability: { user?: any } | undefined;
  BookAppointment: { user?: any; patientId?: string } | undefined;
  DoctorAppointments: { user?: any; refresh?: boolean } | undefined;
  RescheduleAppointment: { appointmentId?: number; patientId?: string } | undefined;
  DoctorMeeting:
    | { appointmentId?: number | string; patientId?: string; token?: string; meetingId?: string }
    | undefined;
  PatientDetails: { patientId?: string | number; patientName?: string } | undefined;
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
      }
    | undefined;
  MainTabs: undefined;
};

/**
 * Dashboard Bottom Tab Navigator Parameter List
 */
export type DashboardTabParamList = {
  Home: undefined;
  Patients: undefined;
  Schedule: undefined;
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

/**
 * Screen Props & Navigation/Route Props for Dashboard Bottom Tab Screens
 */
export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<DashboardTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;
export type HomeScreenRouteProp = RouteProp<DashboardTabParamList, 'Home'>;
export interface HomeScreenProps {
  navigation?: HomeScreenNavigationProp;
  route?: HomeScreenRouteProp;
}

export type PatientsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<DashboardTabParamList, 'Patients'>,
  NativeStackNavigationProp<RootStackParamList>
>;
export type PatientsScreenRouteProp = RouteProp<DashboardTabParamList, 'Patients'>;
export interface PatientsScreenProps {
  navigation?: PatientsScreenNavigationProp;
  route?: PatientsScreenRouteProp;
}

export type ScheduleScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<DashboardTabParamList, 'Schedule'>,
  NativeStackNavigationProp<RootStackParamList>
>;
export type ScheduleScreenRouteProp = RouteProp<DashboardTabParamList, 'Schedule'>;
export interface ScheduleScreenProps {
  navigation?: ScheduleScreenNavigationProp;
  route?: ScheduleScreenRouteProp;
}

export type ReportsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<DashboardTabParamList, 'Reports'>,
  NativeStackNavigationProp<RootStackParamList>
>;
export type ReportsScreenRouteProp = RouteProp<DashboardTabParamList, 'Reports'>;
export interface ReportsScreenProps {
  navigation?: ReportsScreenNavigationProp;
  route?: ReportsScreenRouteProp;
}

export type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<DashboardTabParamList, 'Account'>,
  NativeStackNavigationProp<RootStackParamList>
>;
export type ProfileScreenRouteProp = RouteProp<DashboardTabParamList, 'Account'>;
export interface ProfileScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export type DoctorProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DoctorProfile'
>;
export type DoctorProfileScreenRouteProp = RouteProp<RootStackParamList, 'DoctorProfile'>;
export interface DoctorProfileScreenProps {
  navigation?: DoctorProfileScreenNavigationProp;
  route?: DoctorProfileScreenRouteProp;
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
