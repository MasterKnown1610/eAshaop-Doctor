import React, {useState, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Button from '../../components/ui/Button';
import Text from '../../components/ui/Text';
import EmailInput from '../../components/ui/EmailInput';
import PhoneNumberInput from '../../components/ui/PhoneNumberInput';
import Context from '../../context/Context';
import toast from '../../utils/toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgetPasswordScreen = ({navigation}) => {
  const {login: {sendForgotPasswordOTP}} = useContext(Context);
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    setMobileNumberError('');
    setEmailError('');

    const mobile = mobileNumber?.trim() ?? '';
    const emailVal = email?.trim() ?? '';
    const validMobile = mobile.length === 10;
    const validEmail = emailVal.length > 0 && EMAIL_REGEX.test(emailVal);

    if (!validMobile && !validEmail) {
      if (!mobile && !emailVal) {
        setMobileNumberError('Please enter your mobile number or email');
        setEmailError('Please enter your mobile number or email');
      } else {
        if (mobile && mobile.length !== 10) {
          setMobileNumberError('Please enter a valid 10-digit mobile number');
        }
        if (emailVal && !EMAIL_REGEX.test(emailVal)) {
          setEmailError('Please enter a valid email address');
        }
      }
      return;
    }

    const useEmail = validEmail;
    const verifyBy = useEmail ? 'email' : 'phone';
    const verifyByValue = useEmail ? emailVal : mobile;

    let payload= {
      verifyBy: verifyBy,
      value: verifyByValue,
    }

    setIsSubmitting(true);
    try {
      const response = await sendForgotPasswordOTP(payload);
      console.log(response, "this is the response");
      if (response?.status >= 200 && response?.status < 300) {
        toast.success('OTP sent successfully');
        navigation.navigate('VerificationCode', {
          mobileNumber: useEmail ? undefined : mobileNumber.trim(),
          email: useEmail ? email.trim() : undefined,
          verifyBy,
          verifyByValue,
        });
      } else {
        const msg = response?.data?.message ?? 'Failed to send OTP';
        toast.error(msg);
      }
    } catch (error) {
      const msg = error?.response?.data?.message ?? error?.message ?? 'Failed to send OTP';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="h3" style={styles.title}>
          Forget Password
        </Text>

        <Text variant="body" color={colors.textSecondary} style={styles.instruction}>
          Enter your mobile number or email to reset password
        </Text>

        <View style={styles.inputContainer}>
          {/* <PhoneNumberInput
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={(t) => {
              setMobileNumber(t);
              if (mobileNumberError) setMobileNumberError('');
            }}
            placeholder="10-digit mobile number"
            error={mobileNumberError}
          /> */}
          <EmailInput
            label="Email"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (emailError) setEmailError('');
            }}
            placeholder="Enter your email"
            error={emailError}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            style={styles.continueButton}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
          <Button
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            style={styles.cancelButton}
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
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginTop: 'auto',
    marginBottom: 32,
  },
  continueButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
});

export default ForgetPasswordScreen;
