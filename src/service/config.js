const SERVER_HOST = 'https://eashaop-af7l.onrender.com';
export const BASE_URL = `${SERVER_HOST}/api`;
export const SOCKET_URL = SERVER_HOST;

export const API_URLS = {
  User: `${BASE_URL}/user`,
  Login: `${BASE_URL}/doctors/login`,
  Register: `${BASE_URL}/doctors/register`,
  ForgotPassword: `${BASE_URL}/user/forgot-password`,
  ResetPassword: `${BASE_URL}/user/reset-password`,
  Categories: `${BASE_URL}/categories`,
  Doctors: `${BASE_URL}/doctors`,
  Reviews: `${BASE_URL}/reviews`,
  Appointments: `${BASE_URL}/appointments`,
  Notifications: `${BASE_URL}/notifications`,
  /** POST /api/v1/call/end - report call ended (room_id, duration, user_id) */
  CallEnd: `${BASE_URL}/v1/call/end`,
  DoctorProfile: `${BASE_URL}/doctors/profile`,
};
