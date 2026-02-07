/**
 * Call lifecycle API integration.
 * Backend can use these for analytics, billing, or appointment state.
 */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URLS } from './config';

/**
 * Report that a call has ended.
 * Optional: call when user leaves the meeting (or on exit button).
 *
 * @param {object} params
 * @param {string} params.room_id - Jitsi room ID
 * @param {number} params.duration - Call duration in seconds
 * @param {string} [params.user_id] - Current user ID (optional if auth token sent)
 * @returns {Promise<{ success: boolean }>}
 */
export const endCall = async ({ room_id, duration, user_id }) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const response = await axios.post(
      API_URLS.CallEnd,
      { room_id, duration, user_id },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error) {
    // Non-blocking: log but don't fail the UX
    console.warn('[CallApi] endCall failed:', error?.response?.data || error?.message);
    return { success: false };
  }
};
