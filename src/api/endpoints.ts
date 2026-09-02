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
    linkExisting: '/doctor/patients/link-existing',
    newCreate: '/doctor/patients/add',
    sendCred: '/doctor/patients/send-credentials',
  },
  appointments: {
    get: '/doctor/appointments/doctor',
    getToken: (appointmentId: number | string) =>
      `/doctor/appointments/${appointmentId}/video-token`,
    heartbeat: '/doctor/appointments/heartbeat',
  },
  availablity: {
    get: '/doctor/doctor-availability/doctor/',
    delete: '/doctor/doctor-availability/',
    create: '/doctor/doctor-availability/',
    update: '/doctor/doctor-availability/',
  },
};

export const successEndpoints = [endpoints.auth.sendOtp, endpoints.auth.verifyOtp];

export const exclude401Routes = [endpoints.auth.verifyOtp, endpoints.auth.sendOtp];
