export enum AuthQueryKey {
  SEND_OTP = 'SEND_OTP',
  VERIFY_OTP = 'VERIFY_OTP',
  GET_USERS = 'GET_USERS',
}

export enum ProfileQueryKeys {
  Profile = 'Profile',
  UpdateProfile = 'UpdateProfile',
}

export enum NotificationQueryKeys {
  Notifications = 'Notifications',
}

export enum PatientsQueryKeys {
  PatientsList = 'PatientsList',
  PatientInfo = 'PatientInfo',
  LinkExisting = 'LinkExisting',
  NewCreate = 'NewCreate',
  SendCred = 'SendCred',
  EmrRecords = 'EmrRecords',
  Prescriptions = 'Prescriptions',
}

export enum CommonQueryKeys {
  Countries = 'Countries',
  States = 'States',
  Cities = 'Cities',
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
}

export enum AppointmentsQueryKeys {
  BookedSlots = 'AppointmentsBookedSlots',
  Book = 'BookAppointment',
}

export enum MyAppointmentsQueryKeys {
  MyAppointments = 'MyAppointments',
  Token = 'Token',
  StatusChange = 'StatusChange',
}

export enum AvailbilityQueryKeys {
  GetAvailablity = 'GetAvailablity',
  DeleteAvailability = 'DeleteAvailability',
  CreateAvailability = 'CreateAvailability',
  UpdateAvailability = 'UpdateAvailability',
}

export enum MyInvoices {
  PatientInvoices = 'PatientInvoices',
  AllInvoices = 'AllInvoices',
  InvoiceSettings = 'InvoiceSettings',
}
