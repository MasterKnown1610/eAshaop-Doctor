import {initialState} from './State';



const loginHandlers = {
  SET_LOGIN: (state, action) => ({
    ...state,
    login: action.payload,
  }),
  RESET_LOGINSTATE: (state, action) => initialState,
};

const  Reducer = (state, action) => {
  const handler= loginHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;