import {useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Reducer from './Reducer';
import {CategoriesActions} from './Actions';
import {API_URLS} from '../../service/config';

export const initialState = {
  categories: null,
  loadingCategories: false,
};

export const CategoriesState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  
  const getCategories = async () => {
    dispatch({type: CategoriesActions.SET_LOADING_CATEGORIES, payload: true});
    try {
      const response = await axios.get(`${API_URLS.Categories}`);
      if(response.status >= 200 && response.status < 300) {
        dispatch({type: CategoriesActions.GET_CATEGORIES, payload: response.data});
      }
      dispatch({type: CategoriesActions.SET_LOADING_CATEGORIES, payload: false});
    } catch (error) {
      console.log(error, "this is the error");
      dispatch({type: CategoriesActions.SET_LOADING_CATEGORIES, payload: false});
      return error;
    }
  }

  return {
    ...state,
    getCategories,
  };
};
