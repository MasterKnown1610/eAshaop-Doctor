/**
 * Call / Jitsi room utilities.
 * Architecture: Room IDs can be generated client-side for quick start,
 * or fetched from backend for validated/appointment-bound calls.
 */

/**
 * Generate a unique meeting room ID.
 * Format: doctor_<doctorId>_patient_<patientId>_<timestamp>
 * Use when backend is not yet providing room IDs.
 *
 * @param {string} doctorId - Doctor user/id
 * @param {string} patientId - Patient user/id
 * @returns {string} Room ID safe for Jitsi URL
 */
export const generateRoomId = (doctorId, patientId) => {
  const safeDoctor = String(doctorId || 'doctor').replace(/[^a-zA-Z0-9-_]/g, '_');
  const safePatient = String(patientId || 'patient').replace(/[^a-zA-Z0-9-_]/g, '_');
  const timestamp = Date.now();
  return `doctor_${safeDoctor}_patient_${safePatient}_${timestamp}`;
};

/**
 * Fetch room ID from backend (placeholder).
 * Backend should validate appointment and return a room ID (and optionally expiry).
 * Use this when calls must be tied to a specific appointment.
 *
 * @param {string} appointmentId - Appointment id
 * @returns {Promise<{ roomId: string, expiresAt?: string }>}
 */
export const fetchRoomIdFromBackend = async (appointmentId) => {
  // TODO: Replace with real API
  // const response = await api.post('/api/v1/call/start', { appointment_id: appointmentId });
  // return { roomId: response.data.room_id, expiresAt: response.data.expires_at };
  if (!appointmentId) throw new Error('appointmentId required');
  const fallback = `appointment_${appointmentId}_${Date.now()}`;
  return { roomId: fallback };
};
