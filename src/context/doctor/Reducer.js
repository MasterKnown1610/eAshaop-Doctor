import {initialState} from './State';



const doctorHandlers = {
  GET_DOCTORS: (state, action) => ({
    ...state,
    doctors: action.payload,
  }),
  SET_LOADING_DOCTORS: (state, action) => ({
    ...state,
    loadingDoctors: action.payload,
  }),
  GET_DOCTOR_DETAILS: (state, action) => ({
    ...state,
    doctorDetails: action.payload,
  }),
  SET_LOADING_DOCTOR_DETAILS: (state, action) => ({
    ...state,
    loadingDoctorDetails: action.payload,
  }),
  GET_DOCTOR_REVIEWS: (state, action) => ({
    ...state,
    doctorReviews: action.payload,
  }),
  SET_POSTING_REVIEW: (state, action) => ({
    ...state,
    postingReview: action.payload,
  }),
  SET_LOADING_DOCTOR_REVIEWS: (state, action) => ({
    ...state,
    loadingDoctorReviews: action.payload,
  }),
  RESET_DOCTOR_DETAILS: (state, action) => ({
    ...state,
    doctorDetails: null,
  }),
  RESET_DOCTOR_STATE: (state, action) => ({
    ...initialState,
  }),
};

const  Reducer = (state, action) => {
  const handler= doctorHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;