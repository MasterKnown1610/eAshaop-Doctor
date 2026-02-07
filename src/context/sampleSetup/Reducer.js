import {initialState} from './State';



const categoriesHandlers = {
  SET_CATEGORIES: (state, action) => ({
    ...state,
    categories: action.payload,
  }),
  RESET_CATEGORIESSTATE: (state, action) => initialState,
};

const  Reducer = (state, action) => {
  const handler= categoriesHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;