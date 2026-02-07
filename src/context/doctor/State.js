import { useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Reducer from './Reducer';
import { DoctorActions } from './Actions';
import { API_URLS } from '../../service/config';

export const initialState = {
  doctors: null,
  loadingDoctors: false,
  doctorDetails: null,
  loadingDoctorDetails: false,
  doctorReviews: null,
  loadingDoctorReviews: false,
  postingReview: false,
  doctorProfile: null,
};

export const DoctorState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getDoctorsByCategoryId = async categoryId => {
    try {
      dispatch({ type: DoctorActions.SET_LOADING_DOCTORS, payload: true });
      const response = await axios.get(
        `${API_URLS.Categories}/${categoryId}/doctors`,
      );
      dispatch({
        type: DoctorActions.GET_DOCTORS,
        payload: response.data?.doctors,
      });
      dispatch({ type: DoctorActions.SET_LOADING_DOCTORS, payload: false });
    } catch (error) {
      console.log(error, 'get doctors error');
      dispatch({ type: DoctorActions.SET_LOADING_DOCTORS, payload: false });
    }
  };

  const getDoctorDetails = async doctorId => {
    try {
      dispatch({
        type: DoctorActions.SET_LOADING_DOCTOR_DETAILS,
        payload: true,
      });
      const response = await axios.get(`${API_URLS.Doctors}/${doctorId}`);
      dispatch({
        type: DoctorActions.GET_DOCTOR_DETAILS,
        payload: response.data,
      });
      dispatch({
        type: DoctorActions.SET_LOADING_DOCTOR_DETAILS,
        payload: false,
      });
    } catch (error) {
      console.log(error, 'get doctor details error');
      dispatch({
        type: DoctorActions.SET_LOADING_DOCTOR_DETAILS,
        payload: false,
      });
    }
  };

  // https://eashaop-af7l.onrender.com/api/reviews?doctorId=691d70e9f3c0890f1a2f7b89
  const getDoctorReviews = async doctorId => {
    try {
      dispatch({
        type: DoctorActions.SET_LOADING_DOCTOR_REVIEWS,
        payload: true,
      });
      const response = await axios.get(
        `${API_URLS.Reviews}?doctorId=${doctorId}`,
      );
      dispatch({
        type: DoctorActions.GET_DOCTOR_REVIEWS,
        payload: response.data,
      });
      dispatch({
        type: DoctorActions.SET_LOADING_DOCTOR_REVIEWS,
        payload: false,
      });
    } catch (error) {
      console.log(error, 'get doctor comments error');
      dispatch({
        type: DoctorActions.SET_LOADING_DOCTOR_REVIEWS,
        payload: false,
      });
      return error;
    }
  };
  // https://eashaop-af7l.onrender.com/api/reviews
  const postDoctorReview = async payload => {
    try {
      dispatch({ type: DoctorActions.SET_POSTING_REVIEW, payload: true });
      const response = await axios.post(`${API_URLS.Reviews}`, payload);
      dispatch({ type: DoctorActions.SET_POSTING_REVIEW, payload: false });
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        return response.data;
      }
    } catch (error) {
      dispatch({ type: DoctorActions.SET_POSTING_REVIEW, payload: false });
      console.log(error, 'post doctor review error');
      return error;
    }
  };
  const getDoctorProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log(token, 'this is the token');
      const response = await axios.get(`${API_URLS.DoctorProfile}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: DoctorActions.GET_DOCTOR_PROFILE,
        payload: response.data,
      });
    } catch (error) {
      console.log(error, 'get doctor profile error');
      return error;
    }
  };
  const updateDoctorProfile = async payload => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log(token, 'this is the token');
      const response = await axios.put(`${API_URLS.DoctorProfile}`, payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.status >= 200 && response.status < 300) {
        getDoctorProfile();
        return response;
      } else {
        return error;
      }
    } catch (error) {
      console.log(error, 'get doctor profile error');
      return error;
    }
  };
  const resetDoctorDetails = () => {
    dispatch({ type: DoctorActions.RESET_DOCTOR_DETAILS });
  };
  const resetDoctorState = () => {
    dispatch({ type: DoctorActions.RESET_DOCTOR_STATE });
  };

  return {
    ...state,
    getDoctorsByCategoryId,
    getDoctorDetails,
    resetDoctorState,
    resetDoctorDetails,
    getDoctorReviews,
    postDoctorReview,
    getDoctorProfile,
    updateDoctorProfile,
  };
};
