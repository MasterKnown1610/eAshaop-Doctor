import { useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Reducer from './Reducer';
import { BookingsActions } from './Actions';
import { API_URLS } from '../../service/config';

export const initialState = {
  bookingSlots: null,
  loadingBookingsSlots: false,
  userDepartments: null,
  loadingBookAppointment: false,
  appointments: null,
  loadingAppointments: false,
};

export const BookingsState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  // https://eashaop-af7l.onrender.com/api/doctors/691d70e9f3c0890f1a2f7bfd/availability/2026-01-24

  const getBookingsSlots = async (doctorId, date) => {
    try {
      dispatch({
        type: BookingsActions.SET_LOADING_BOOKINGS_SLOTS,
        payload: true,
      });
      const response = await axios.get(
        `${API_URLS.Doctors}/${doctorId}/availability/${date}`,
      );
      dispatch({
        type: BookingsActions.SET_BOOKING_SLOTS,
        payload: response.data,
      });
      dispatch({
        type: BookingsActions.RESET_LOADING_BOOKINGS_SLOTS,
        payload: false,
      });
    } catch (error) {
      dispatch({
        type: BookingsActions.RESET_LOADING_BOOKINGS_SLOTS,
        payload: false,
      });
      console.error('Error getting bookings slots:', error);
      return null;
    }
  };

  const getUserDepartments = async userId => {
    try {
      const response = await axios.get(`${API_URLS.User}/${userId}`);
      dispatch({
        type: BookingsActions.USER_DEPARTMENTS,
        payload: response.data,
      });
    } catch (error) {
      console.error('Error getting user departments:', error);
      return null;
    }
  };

  // https://eashaop-af7l.onrender.com/api/appointments/pay-at-clinic
  const bookAppointment = async payload => {
    try {
      dispatch({
        type: BookingsActions.SET_LOADING_BOOK_APPOINTMENT,
        payload: true,
      });
      const response = await axios.post(
        `${API_URLS.Appointments}/pay-at-clinic`,
        payload,
      );
      dispatch({
        type: BookingsActions.SET_LOADING_BOOK_APPOINTMENT,
        payload: false,
      });
      console.log(response, 'this is the response');
      return response;
    } catch (error) {
      console.error('Error booking appointment:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        headers: error?.response?.headers,
      });
      console.log(payload, 'this is the payload');
      dispatch({
        type: BookingsActions.SET_LOADING_BOOK_APPOINTMENT,
        payload: false,
      });
      return null;
    }
  };

  const resetBookingsSlots = () => {
    dispatch({ type: BookingsActions.RESET_BOOKINGSSTATE });
  };

  // https://eashaop-af7l.onrender.com/api/appointments/user/6958fb3d6fd5d6438d9ec80c

  const getAppointments = async () => {
    try {
      const userId = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userId);
      dispatch({
        type: BookingsActions.SET_LOADING_APPOINTMENTS,
        payload: true,
      });
      const response = await axios.get(
        `${API_URLS.Appointments}/doctor/${userData?.doctor?.id}`,
      );
      dispatch({
        type: BookingsActions.SET_APPOINTMENTS,
        payload: response.data,
      });
      dispatch({
        type: BookingsActions.SET_LOADING_APPOINTMENTS,
        payload: false,
      });
      return response;
    } catch (error) {
      console.error('Error getting appointments:', error);
      dispatch({
        type: BookingsActions.SET_LOADING_APPOINTMENTS,
        payload: false,
      });
      return error;
    }
  };

  const setDoctorAvailability = async payload => {
    try {
      const userId = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userId);
      const response = await axios.post(
        `${API_URLS.Doctors}/${userData?.doctor?.id}/availability`,
        payload,
      );
      return response;
    } catch (error) {
      console.error('Error setting doctor availability:', error);
      return null;
    }
  };

  return {
    ...state,
    getBookingsSlots,
    resetBookingsSlots,
    getUserDepartments,
    bookAppointment,
    getAppointments,
    setDoctorAvailability,
  };
};
