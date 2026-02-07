import React, {useState, useRef, useContext} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Button from '../../components/ui/Button';
import Text from '../../components/ui/Text';
import Context from '../../context/Context';
import toast from '../../utils/toast';

const VerificationCodeScreen = ({route, navigation}) => {
  const {mobileNumber, email, verifyBy, verifyByValue} = route.params || {};
  const {login: {verifyForgotPasswordOTP}} = useContext(Context);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

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

  const handleResend = () => {
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
    console.log('Resending verification code to:', mobileNumber);
  };

  const handleVerify = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 4) {
      return;
    }

    const payload = {
      otp: otpString,
      verifyBy,
      value: verifyByValue,
    };

    setIsVerifying(true);
    try {
      const response = await verifyForgotPasswordOTP(payload);
      if (response?.status >= 200 && response?.status < 300) {
        toast.success('OTP verified successfully');
        navigation.navigate('ResetPassword', {
          mobileNumber,
          email,
          verificationCode: otpString,
          verifyBy,
          verifyByValue,
        });
      } else {
        toast.error('Failed to verify OTP');
      }
    } catch (error) {
      const msg = error?.response?.data?.message ?? error?.message ?? 'Failed to verify OTP';
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="h3" style={styles.title}>
          Enter Verification Code
        </Text>

        <Text variant="body" color={colors.textSecondary} style={styles.instruction}>
          We have sent a code to your mobile number
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

        <View style={styles.buttonContainer}>
          <Button
            title="Verify Now"
            onPress={handleVerify}
            variant="primary"
            style={styles.verifyButton}
            loading={isVerifying}
            disabled={isVerifying}
          />
        </View>

        <View style={styles.resendContainer}>
          <Text variant="bodySmall" color={colors.textSecondary}>
            Didn't received any code?{' '}
          </Text>
          <TouchableOpacity
            onPress={handleResend}
            activeOpacity={0.7}>
            <Text
              variant="bodySmall"
              color={colors.primary}
              style={styles.resendLink}>
              Resend Code
            </Text>
          </TouchableOpacity>
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
    marginBottom: 32,
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
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  verifyButton: {
    width: '100%',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendLink: {
    fontWeight: '500',
  },
});

export default VerificationCodeScreen;
