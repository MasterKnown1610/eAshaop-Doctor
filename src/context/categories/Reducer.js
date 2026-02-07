import {initialState} from './State';



const categoriesHandlers = {
  GET_CATEGORIES: (state, action) => ({
    ...state,
    categories: action.payload,
  }),
  SET_LOADING_CATEGORIES: (state, action) => ({
    ...state,
    loadingCategories: action.payload,
  }),
  RESET_CATEGORIESSTATE: (state, action) => ({
    ...initialState,
  }),
};

const  Reducer = (state, action) => {
  const handler= categoriesHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;