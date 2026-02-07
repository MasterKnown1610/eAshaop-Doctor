import React, {useState, useEffect, useRef, useContext} from 'react';
import {  
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Button from '../../components/ui/Button';
import Text from '../../components/ui/Text';
import {useAuth} from '../../context/AuthContext';
import Context from '../../context/Context';
import toast from '../../utils/toast';
import { useNavigation } from '@react-navigation/native';

const OTPScreen = ({route, navigation}) => {
  const params = route.params || {};
  const {
    mobileNumber,
    phone_number,
    email: paramEmail,
    verifyBy: paramVerifyBy,
    isRegistration = false,
    registrationData,
    isLogin = false,
  } = params;

  const {login: {verifyRegistrationOTP, resendRegistrationOTP, verifyLoginOTP}} = useContext(Context);

  const verifyBy = paramVerifyBy ?? registrationData?.verifyBy ?? 'phone';
  const email = paramEmail ?? registrationData?.email ?? '';
  const phone = phone_number ?? mobileNumber ?? '';

  const isEmail = verifyBy === 'email';
  const displayValue = isEmail ? email : phone;
  const targetLabel = isEmail ? 'email address' : 'phone number';

  const {login: authLogin, completeOnboarding} = useAuth();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
   
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value, index) => {
   
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);

    
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

   
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (canResend) {
     
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
     
    let payload = {
      verifyBy: "email",
      verifyByValue: email
    }
    console.log(payload, "this is the payload");
    const response = await resendRegistrationOTP(payload);
    console.log(response, "this is the response");
    if(response.status >= 200 && response.status < 300) {
      toast.success("OTP sent successfully");
    } else {
      toast.error("Failed to send OTP");
    }
    }
  };

  const handleConfirm = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 4) {
      return;
    }

    console.log('Verifying OTP:', otpString);

    if(isLogin) {

      let payload = {
        otp: otpString.trim(),
        value : email,
        verifyBy : 'email',
      }
      console.log(payload, "this is the payload")
      const response = await verifyLoginOTP(payload);
      if (response?.status >= 200 && response?.status < 300) {
        await authLogin(response.data);
        completeOnboarding();
      } else {
        console.log(response, "this is the response")
        toast.error("Invalid OTP");
      }

    }

    
    if(isRegistration) {
      let payload = {
        otp: otpString.trim(),
        verifyByValue : email,
      }
      const response = await verifyRegistrationOTP(payload);
      if (response.status >= 200 && response.status < 300) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      } else {
        console.log(response, "this is the response")
        toast.error("Invalid OTP");
      }
    } else {
      // await verifyLoginOTP(otpString);
      console.log("verify login otp");
    }
    // await login(userData);

    // Onboarding only after registration; skip after login-with-OTP
    if (!isRegistration) {
      await completeOnboarding();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
       
        <Text variant="h3" style={styles.title}>
          Enter OTP
        </Text>

        <Text variant="body" color={colors.textSecondary} style={styles.instruction}>
          We have sent the verification code to your {targetLabel}
          {displayValue ? ` ${displayValue}` : ''}
        </Text>

       
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <Text variant="bodySmall" color={colors.textSecondary}>
            Didn't received code?{' '}
          </Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={!canResend}
            activeOpacity={0.7}>
            <Text
              variant="bodySmall"
              color={canResend ? colors.primary : colors.gray}
              style={styles.resendLink}>
              Resend{!canResend && `(${formatTimer(timer)})`}
            </Text>
          </TouchableOpacity>
        </View>

      
        <View style={styles.buttonContainer}>
          <Button
            title="Confirm"
            onPress={handleConfirm}
            variant="primary"
            style={styles.confirmButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  instruction: {
    textAlign: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  resendLink: {
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    // marginTop: 'auto',
    marginBottom: 32,
  },
  confirmButton: {
    width: '100%',
  },
});

export default OTPScreen;
