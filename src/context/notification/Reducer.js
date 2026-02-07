import {initialState} from './State';

const notificationHandlers = {
  
  GET_NOTIFICATIONS: (state, action) => ({
    ...state,
    notifications: action.payload,
  }),

  MARK_AS_READ: (state, action) => ({
    ...state,
   
  }),
  
  RESET_NOTIFICATIONSSTATE: (state, action) => initialState,
};

const  Reducer = (state, action) => {
  const handler= notificationHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;