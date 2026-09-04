export const baseUrl = 'https://api-stage.predcare.in';
export const baseUrlApi = `${baseUrl}/api/v1`;

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
    sendOtp: '/doctor/auth/send-otp',
    verifyOtp: '/doctor/auth/verify-otp',
    users: '/doctor/auth/users',
  },
  profile: {
    get: '/doctor/own-profile',
    update: '/doctors/user/',
  },
  patients: {
    get: '/doctor/patients/doctor/',
    delete: '/doctor/patients/',
    details: '/doctor/patients/',
    linkExisting: '/doctor/patients/link-existing',
    newCreate: '/doctor/patients/add',
    sendCred: '/doctor/patients/send-credentials',
    emrRecords: '/doctor/emr/patient/',
    prescriptions: (uid: string | number) => `/doctor/prescriptions/patient/${uid}?role=doctor`,
    emrShare: (docId: string | number) => `/doctor/emr/document/${docId}/share`,
    prescriptionsShare: (presId: string | number) => `/doctor/prescriptions/${presId}/share`,
    emrUpload: '/doctor/emr/upload',
  },
  appointments: {
    get: '/doctor/appointments/doctor',
    getToken: (appointmentId: number | string) =>
      `/doctor/appointments/${appointmentId}/video-token`,
    heartbeat: '/doctor/appointments/heartbeat',
    statusChange: (appointmentId: number | string) =>
      `/doctor/appointments/${appointmentId}/status`,
  },
  availablity: {
    get: '/doctor/doctor-availability/doctor/',
    delete: '/doctor/doctor-availability/',
    create: '/doctor/doctor-availability/',
    update: '/doctor/doctor-availability/',
  },
  commons: {
    country: '/patients/locations/countries',
    states: '/patients/locations/states/',
    cities: '/patients/locations/cities/',
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
};

export const successEndpoints = [endpoints.auth.sendOtp, endpoints.auth.verifyOtp];

export const exclude401Routes = [endpoints.auth.verifyOtp, endpoints.auth.sendOtp];
