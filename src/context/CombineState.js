import { useMemo } from 'react';
import { LoginState } from './login/State';
import { CategoriesState } from './categories/State';
import { DoctorState } from './doctor/State';
import { BookingsState } from './bookings/State';
import { NotificationState } from './notification/State';


const useCombineState = () => {
  const login = LoginState();
  const categories = CategoriesState();
  const doctors = DoctorState();
  const bookings = BookingsState();
  const notifications = NotificationState();
  return useMemo(
    () => ({
      login,
      categories,
      doctors,
      bookings,
      notifications,
    }),
    [
      login,
      categories,
      doctors,
      bookings,
      notifications,
    ],
  );
};

export default useCombineState;
