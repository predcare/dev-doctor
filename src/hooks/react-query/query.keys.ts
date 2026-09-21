export enum AuthQueryKey {
  SEND_OTP = 'SEND_OTP',
  VERIFY_OTP = 'VERIFY_OTP',
  GET_USERS = 'GET_USERS',
  RESEND_OTP = 'RESEND_OTP',
  USER_LOGOUT = 'USER_LOGOUT',
}

export enum ProfileQueryKeys {
  Profile = 'Profile',
  UpdateProfile = 'UpdateProfile',
  DoctorProfile = 'DoctorProfile',
  ALL_PATIENTS = 'ALL_PATIENTS',
}

export enum NotificationQueryKeys {
  Notifications = 'Notifications',
  NotificationCount = 'NotificationCount',
}

export enum PatientsQueryKeys {
  PatientsList = 'PatientsList',
  PatientInfo = 'PatientInfo',
  LinkExisting = 'LinkExisting',
  NewCreate = 'NewCreate',
  SendCred = 'SendCred',
  EmrRecords = 'EmrRecords',
  Prescriptions = 'Prescriptions',
  MyConsults = 'MyConsults',
  FamilyMembers = 'FamilyMembers',
  ALL_PATIENTS = 'ALL_PATIENTS',
}

export enum CommonQueryKeys {
  Countries = 'Countries',
  States = 'States',
  Cities = 'Cities',
  GET_ALL_USERS = 'GET_ALL_USERS',
  POLICIES = 'POLICIES',
}

export enum PrescriptionQueryKeys {
  Settings = 'PrescriptionSettings',
  UploadSignature = 'UploadSignature',
  ByDoctor = 'PrescriptionsByDoctor',
  ByPatient = 'PrescriptionsByPatient',
  ByAppointment = 'PrescriptionsByAppointment',
  PatientInfo = 'PrescriptionPatientInfo',
  Detail = 'PrescriptionDetail',
  UpsertDraft = 'UpsertDraftPrescription',
  Create = 'CreatePrescription',
  Update = 'UpdatePrescription',
  SendEmail = 'SendPrescriptionEmail',
  Pdf = 'PrescriptionPdf',
  Share = 'SharePrescription',
  GetPresciptionInfo = 'GetPresciptionInfo',
  GetAllPrescriptions = 'GetAllPrescriptions',
}

export enum InvoiceQueryKeys {
  Settings = 'InvoiceSettings',
  UploadSignature = 'UploadInvoiceSignature',
}

export enum DoctorAvailabilityQueryKeys {
  ByDoctor = 'DoctorAvailabilityByDoctor',
  AvailableSlots = 'DoctorAvailableSlots',
  ById = 'DoctorAvailabilityById',
  GET_AVAIL_DATES = 'GET_AVAIL_DATES',
  GET_SLOTS_BY_DATE = 'GET_SLOTS_BY_DATE',
}

export enum AppointmentsQueryKeys {
  BookedSlots = 'AppointmentsBookedSlots',
  Book = 'BookAppointment',
}

export enum MyAppointmentsQueryKeys {
  MyAppointments = 'MyAppointments',
  MyAppointmentsStats = 'MyAppointmentsStats',
  MyAppointmentsInfo = 'MyAppointmentsInfo',
  Token = 'Token',
  StatusChange = 'StatusChange',
}

export enum AvailbilityQueryKeys {
  GetAvailablity = 'GetAvailablity',
  DeleteAvailability = 'DeleteAvailability',
  CreateAvailability = 'CreateAvailability',
  UpdateAvailability = 'UpdateAvailability',
  GetMyAvailablity = 'GetMyAvailablity',
}

export enum MyInvoices {
  PatientInvoices = 'PatientInvoices',
  AllInvoices = 'AllInvoices',
  InvoiceSettings = 'InvoiceSettings',
}

export enum HomeApiQuery {
  STATS = 'STATS',
  UPCOMING_APPOITMENTS = 'UPCOMING_APPOITMENTS',
}
