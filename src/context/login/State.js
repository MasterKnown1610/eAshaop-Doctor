import { useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Reducer from './Reducer';
import { LoginActions } from './Actions';
import { API_URLS } from '../../service/config';
import { getPasswordError } from '../../utils/passwordValidation';

export const initialState = {
  login: null,
};

export const LoginState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const loginUser = async (email, password) => {
    try {
      const loginData = {
        email: email,
        password: password,
      };

      const response = await axios.post(`${API_URLS.Login}`, loginData);

      const token = response?.data?.token;

      if (token) {
        await AsyncStorage.setItem('authToken', token);
      }

      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));

      dispatch({
        type: LoginActions.SET_LOGIN,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed';

      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('onboardingCompleted');

      dispatch({
        type: LoginActions.RESET_LOGINSTATE,
      });
    } catch (error) {
      console.log(error, 'logout error');
      throw error;
    }
  };

  const resetLogin = () => {
    dispatch({
      type: LoginActions.RESET_LOGINSTATE,
    });
  };

  // https://eashaop-af7l.onrender.com/api/user/reset-password

  const setNewPassword = async payload => {
    const passwordErr = getPasswordError(payload?.newPassword);
    if (passwordErr) {
      const err = new Error(passwordErr);
      err.response = { data: { message: passwordErr } };
      throw err;
    }

    try {
      const response = await axios.post(
        `${API_URLS.User}/reset-password`,
        payload,
      );
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to reset password';
      throw new Error(errorMessage);
    }
  };

  // https://eashaop-af7l.onrender.com/api/user/registration/send-otp
  const registerDoctor = async payload => {
    try {
      console.log(payload, 'this is the payload');

      const response = await axios.post(`${API_URLS.Register}`, payload);
      console.log(response, 'this is the response');
      return response;
    } catch (error) {
      console.log(error, 'register user error');
      throw error;
    }
  };

  const loginUserOtp = async payload => {
    try {
      console.log(payload, 'this is the payload');
      const response = await axios.post(`${API_URLS.Login}/send-otp`, payload);
      return response;
    } catch (error) {
      console.log(error, 'login user otp error');
      return error;
    }
  };

  // https://eashaop-af7l.onrender.com/api/user/registration/verify-otp
  const verifyRegistrationOTP = async payload => {
    try {
      console.log(payload, 'this is the payload');
      const response = await axios.post(
        `${API_URLS.Register}/verify-otp`,
        payload,
      );
      console.log(response, 'this is the response');
      return response;
    } catch (error) {
      console.log(error, 'verify registration otp error');
      return error;
    }
  };

  const verifyLoginOTP = async payload => {
    try {
      console.log(payload, 'this is the payload');
      const response = await axios.post(
        `${API_URLS.Login}/verify-otp`,
        payload,
      );

      const token = response?.data?.token;

      if (token) {
        await AsyncStorage.setItem('authToken', token);
      }

      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('userData', JSON.stringify(response?.data));

      dispatch({
        type: LoginActions.SET_LOGIN,
        payload: response?.data,
      });

      return response;
    } catch (error) {
      console.log(error, 'verify registration otp error');
      return error;
    }
  };

  // https://eashaop-af7l.onrender.com/api/user/registration/resend-otp
  const resendRegistrationOTP = async payload => {
    try {
      const response = await axios.post(
        `${API_URLS.Register}/resend-otp`,
        payload,
      );

      return response;
    } catch (error) {
      console.log(error, 'resend registration otp error');
      return error;
    }
  };

  // https://eashaop-af7l.onrender.com/api/user/forgot-password/send-otp
  const sendForgotPasswordOTP = async payload => {
    try {
      console.log(payload, 'this is the payload');
      const response = await axios.post(
        `${API_URLS.ForgotPassword}/send-otp`,
        payload,
      );
      return response;
    } catch (error) {
      console.log(error, 'send forgot password otp error');
      return error;
    }
  };

  // https://eashaop-af7l.onrender.com/api/user/forgot-password/verify-otp

  const verifyForgotPasswordOTP = async payload => {
    try {
      console.log(payload, 'this is the payload');
      const response = await axios.post(
        `${API_URLS.ForgotPassword}/verify-otp`,
        payload,
      );
      return response;
    } catch (error) {
      console.log(error, 'verify forgot password otp error');
      return error;
    }
  };

  const verifyEmailAndPhone = async payload => {
    try {
      const response = await axios.get(
        `${API_URLS.Doctors}/check?email=${payload.email}&phone=${payload.phone}`,
      );
      return response;
    } catch (error) {
      console.log(error, 'verify email and phone error');
      return error;
    }
  };

  return {
    ...state,
    loginUser,
    logout,
    resetLogin,
    setNewPassword,
    loginUserOtp,
    registerDoctor,
    verifyRegistrationOTP,
    resendRegistrationOTP,
    sendForgotPasswordOTP,
    verifyForgotPasswordOTP,
    verifyLoginOTP,
    verifyEmailAndPhone,
  };
};
