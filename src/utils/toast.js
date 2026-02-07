import {Toast} from 'toastify-react-native';
import {colors} from '../theme/colors';

const DEFAULT_POSITION = 'top';
const DEFAULT_VISIBILITY_TIME = 3000;

const defaultOptions = {
  position: DEFAULT_POSITION,
  visibilityTime: DEFAULT_VISIBILITY_TIME,
  autoHide: true,
  textColor: colors.white,
};

/**
 * Global toast notifications.
 * Use ToastProvider in App.jsx and import from '@/utils/toast' or 'utils/toast'.
 *
 * @example
 * import toast from '../utils/toast';
 * toast.success('Login successful!');
 * toast.error('Invalid credentials');
 * toast.warning('Session expiring soon');
 * toast.update('Profile updated');
 * toast.info('Sign up coming soon!');
 */
export const toast = {
  success: (message, options = {}) => {
    Toast.show({
      type: 'success',
      text1: message,
      ...defaultOptions,
      backgroundColor: options.backgroundColor ?? colors.success,
      iconColor: options.iconColor ?? colors.white,
      progressBarColor: options.progressBarColor ?? colors.white,
      ...options,
    });
  },

  error: (message, options = {}) => {
    Toast.show({
      type: 'error',
      text1: message,
      ...defaultOptions,
      backgroundColor: options.backgroundColor ?? colors.error,
      iconColor: options.iconColor ?? colors.white,
      progressBarColor: options.progressBarColor ?? colors.white,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    Toast.show({
      type: 'warn',
      text1: message,
      ...defaultOptions,
      backgroundColor: options.backgroundColor ?? colors.warning,
      iconColor: options.iconColor ?? colors.white,
      progressBarColor: options.progressBarColor ?? colors.white,
      ...options,
    });
  },

  update: (message, options = {}) => {
    Toast.show({
      type: 'info',
      text1: message,
      ...defaultOptions,
      backgroundColor: options.backgroundColor ?? colors.info,
      iconColor: options.iconColor ?? colors.white,
      progressBarColor: options.progressBarColor ?? colors.white,
      ...options,
    });
  },

  info: (message, options = {}) => {
    Toast.show({
      type: 'info',
      text1: message,
      ...defaultOptions,
      backgroundColor: options.backgroundColor ?? colors.info,
      iconColor: options.iconColor ?? colors.white,
      progressBarColor: options.progressBarColor ?? colors.white,
      ...options,
    });
  },

  hide: () => {
    Toast.hide();
  },
};

export default toast;
