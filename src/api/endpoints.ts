export const baseUrl = 'https://api-stage.predcare.in';
export const localBaseUrl = 'http://192.168.0.104:3000';
export const baseUrlApi = `${localBaseUrl}/api/v1`;

export const mediaPaths = (fileName?: string) => {
  if (!fileName) return '';
  const rawImg = String(fileName);
  if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
    return rawImg;
  }
  if (rawImg.startsWith('/')) {
    return `${baseUrl}${rawImg}`;
  }
  if (rawImg.startsWith('storage/')) {
    return `${baseUrl}/${rawImg}`;
  }
  return `${baseUrl}/storage/${rawImg}`;
};

export const endpoints = {
  auth: {
    sendOtp: '/auth/request-login-otp',
    verifyOtp: '/auth/verify-login-otp',
    resendOtp: '/auth/resend-otp',
    users: '/doctor/auth/users',
  },
  profile: {
    get: '/users/profile',
    update: '/doctors/user/',
  },
  patients: {
    get: '/doctors/my-patients',
    delete: '/doctor/patients/',
    details: '/doctor/patients/',
    linkExisting: '/users/link-existing-patient',
    newCreate: '/users/add-patient',
    sendCred: '/doctor/patients/send-credentials',
    emrRecords: '/doctor/emr/patient/',
    prescriptions: (uid: string | number) => `/doctor/prescriptions/patient/${uid}?role=doctor`,
    emrShare: (docId: string | number) => `/doctor/emr/document/${docId}/share`,
    prescriptionsShare: (presId: string | number) => `/doctor/prescriptions/${presId}/share`,
    emrUpload: '/doctor/emr/upload',
    consults: (uid: string | number) => `/doctor/appointments/doctor/patient-consult/${uid}`,
    familyMembers: (uid: string | number) => `/doctor/patients/family-members/${uid}`,
    patientUpdate: (uid: number | string) => `/doctor/patients/${uid}`,
  },
  appointments: {
    get: '/doctor/appointments/doctor',
    getToken: (appointmentId: number | string) =>
      `/doctor/appointments/${appointmentId}/video-token`,
    heartbeat: '/doctor/appointments/heartbeat',
    statusChange: (appointmentId: number | string) =>
      `/doctor/appointments/${appointmentId}/status`,
    bookByDoc: '/doctor/appointments/book',
    getdetails: (id: string | number) => `/doctor/appointments/${id}`,
    reschedule: (id: string | number) => `/doctor/appointments/${id}/reschedule`,
    heartBeat: '/doctor/appointments/heartbeat',
    saveCall: '/doctor/appointments/save-call',
  },
  availablity: {
    get: '/doctor/doctor-availability/doctor/',
    delete: '/doctor/doctor-availability/',
    create: '/doctor/doctor-availability',
    update: '/doctor/doctor-availability/',
    docAvailabilities: '/doctor/doctor-availability/doctor/',
    fullAvailability: '/doctor/availability/full-overview',
  },
  commons: {
    country: '/doctor/patients/locations/countries',
    states: '/doctor/patients/locations/states/',
    cities: '/doctor/patients/locations/cities/',
    users: '/doctor/auth/users',
    policies: '/cms/policies',
    policyAccept: '/users/user-policy-acceptances',
  },
  invoices: {
    getAll: (uid: string | number) => `/doctor/invoices/doctor/${uid}`,
    patientInvoices: '/doctor/invoices/doctor/',
    downloadPdf: (invoiceId: number | string) => `/doctor/invoices/${invoiceId}/pdf`,
    invoiceSettings: '/doctor/invoices/settings/',
    create: '/doctor/invoices',
  },
  prescritions: {
    create: '/doctor/prescriptions',
    getAll: (doctorId: string | number) => `/doctor/prescriptions/doctor/${doctorId}`,
    update: (id: string | number) => `/doctor/prescriptions/${id}`,
    upsertDraft: (id?: string | number) =>
      id ? `/doctor/prescriptions/upsert-draft/${id}` : '/doctor/prescriptions/upsert-draft',
    get: (id: string | number) => `/doctor/prescriptions/${id}`,
    sendAgain: (id: string | number) => `/doctor/prescriptions/${id}/send-email`,
    downloadPrescription: (id: string | number) => `/doctor/prescriptions/${id}/pdf`,
  },
  notifications: {
    getAll: '/notifications',
    delete: '/notifications/',
    counts: `/notifications/count`,
    clearNotify: `/notifications/clear-all`,
  },
  homes: {
    stats: (doctorId: string | number) => `/doctor/appointments/doctor/${doctorId}/stats`,
    upcomingAppts: (doctorId: string | number) => `/doctor/appointments/doctor/${doctorId}/today`,
  },
};

export const successEndpoints = [endpoints.auth.sendOtp, endpoints.auth.verifyOtp];

export const exclude401Routes = [endpoints.auth.verifyOtp, endpoints.auth.sendOtp];
