
import React, {useState, useContext} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Button from '../../components/ui/Button';
import PasswordInput from '../../components/ui/PasswordInput';
import Text from '../../components/ui/Text';
import Checkbox from '../../components/ui/Checkbox';
import {useAuth} from '../../context/AuthContext';
import logo from '../../assets/login/logo.png';
import Context from '../../context/Context';
import toast from '../../utils/toast';
import { useNavigation } from '@react-navigation/native';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginScreen = () => {
  const {login: authLogin, completeOnboarding} = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const {
    login: {loginUser, loginUserOtp},
  } = useContext(Context);

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!email || email.trim() === '') {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password || password.trim() === '') {
      setPasswordError('Please enter your password');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (isValid) {
      setIsLoggingIn(true);
      try {
        const response = await loginUser(email.trim(), password);
        await authLogin(response);
        completeOnboarding();
      } catch (error) {
        const message = error?.message || 'Login failed';
        toast.error(message);
        setEmailError(message);
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
    
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  const handleLoginWithOTP = async () => {
    setEmailError('');

    if (!email || email.trim() === '') {
      setEmailError('Please enter your email');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    const payload = {value: email.trim(), verifyBy: 'email'};
    setIsSendingOTP(true);
    try {
      const response = await loginUserOtp(payload);
      if (response?.status >= 200 && response?.status < 300) {
        toast.success('OTP sent successfully');
        navigation.navigate('OTP', {email: email.trim(), verifyBy: 'email', verifyByValue: email.trim(), isLogin: true});
      } else {
        toast.error(response?.data?.message ?? 'Failed to send OTP');
      }
    } catch (error) {
      const msg = error?.response?.data?.message ?? error?.message ?? 'Failed to send OTP';
      toast.error(msg);
    } finally {
      setIsSendingOTP(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
           <Image source={logo} style={styles.logoIconImage} />
          </View>
         
        </View>

      
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text variant="label" style={styles.inputLabel}>
              Enter Your Email
            </Text>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) {
                  setEmailError('');
                }
              }}
              placeholder="Enter Your Email"
              placeholderTextColor={colors.gray}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {emailError && (
              <Text variant="caption" color={colors.error} style={styles.errorText}>
                {emailError}
              </Text>
            )}
          </View>

          <PasswordInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) {
                setPasswordError('');
              }
            }}
            placeholder="Enter the Password"
            error={passwordError}
          />
        </View>

        
        <View style={styles.optionsContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              checked={rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
              label="Remember Me"
              style={styles.checkbox}
            />

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text variant="bodySmall" color={colors.primary}>
                Forget Password ?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLoginWithOTP}
            disabled={isSendingOTP}
            activeOpacity={isSendingOTP ? 1 : 0.7}>
            <Text
              variant="bodySmall"
              color={isSendingOTP ? colors.gray : colors.primary}
              style={styles.otpLink}>
              Login with OTP instead of password
            </Text>
          </TouchableOpacity>
        </View>

      
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            onPress={handleLogin}
            variant="primary"
            loading={isLoggingIn}
            disabled={isLoggingIn}
            style={styles.loginButton}
          />
          <Button
            title="Sign up"
            onPress={handleSignUp}
            variant="outline"
            style={styles.signUpButton}
          />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logoIconImage: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
    
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  header: {
    backgroundColor: colors.primary,
    height: 44,
    marginHorizontal: -24,
    marginTop: -24,
  },
  statusBarPlaceholder: {
    height: 44,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 48,
  },
  logoIcon: {
    width: 280,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoIconText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taglineText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: 8,
  },
  taglineBox: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taglineBoxText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  companyName: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 48,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    marginTop: 4,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  loginButton: {
    flex: 1,
  },
  signUpButton: {
    flex: 1,
  },
  otpLink: {
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LoginScreen;
