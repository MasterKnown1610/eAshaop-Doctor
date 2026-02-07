import {useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Reducer from './Reducer';
import {NotificationActions} from './Actions';
import {API_URLS} from '../../service/config';
import {getPasswordError} from '../../utils/passwordValidation';

export const initialState = {

  notifications: [],
};

export const NotificationState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userId);
      const response = await axios.get(`${API_URLS.Notifications}/user/${userData?.user?.id}`);
      dispatch({type: NotificationActions.GET_NOTIFICATIONS, payload: response.data.notifications});
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return error;
    }
  };


// https://eashaop-af7l.onrender.com/api/notifications/6974ac0dc851ca4702ec7a1f/read?type=user
  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.patch(`${API_URLS.Notifications}/${notificationId}/read?type=user`);
    
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return error;
    }
  };

  return {
    ...state,
    getNotifications,
    markAsRead,
  };
};
