import {initialState} from './State';



const bookingsHandlers = {
  SET_BOOKING_SLOTS: (state, action) => ({
    ...state,
    bookingSlots: action.payload,
  }),
  SET_LOADING_BOOKINGS_SLOTS: (state, action) => ({
    ...state,
    loadingBookingsSlots: action.payload,
  }),
  USER_DEPARTMENTS: (state, action) => ({
    ...state,
    userDepartments: action.payload,
  }),
  SET_LOADING_BOOK_APPOINTMENT: (state, action) => ({
    ...state,
    loadingBookAppointment: action.payload,
  }),
  RESET_LOADING_BOOKINGS_SLOTS: (state, action) => ({
    ...state,
    loadingBookingsSlots: false,
  }),
  SET_APPOINTMENTS: (state, action) => ({
    ...state,
    appointments: action.payload,
  }),
  SET_LOADING_APPOINTMENTS: (state, action) => ({
    ...state,
    loadingAppointments: action.payload,
  }),
  RESET_BOOKINGSSTATE: (state, action) => initialState,
};

const  Reducer = (state, action) => {
  const handler= bookingsHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;