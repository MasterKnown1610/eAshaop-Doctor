import {useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Reducer from './Reducer';
import {LoginActions} from './Actions';
import {API_URLS} from '../../service/config';
import {getPasswordError} from '../../utils/passwordValidation';

export const initialState = {
  login: null,
};

export const LoginState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
 

  return {
    ...state,
   
  };
};
