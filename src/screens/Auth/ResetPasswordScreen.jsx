import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Button from '../../components/ui/Button';
import Text from '../../components/ui/Text';
import PasswordInput from '../../components/ui/PasswordInput';
import Context from '../../context/Context';
import { getPasswordError } from '../../utils/passwordValidation';
import toast from '../../utils/toast';

const ResetPasswordScreen = ({route, navigation}) => {
  const {mobileNumber, verificationCode, verifyBy, verifyByValue} = route.params || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const {login: {setNewPassword: setNewPasswordApi}} = useContext(Context);

  const handleContinue = async () => {
    setNewPasswordError('');
    setConfirmPasswordError('');
    
    let isValid = true;
    
    
    const passwordErr = getPasswordError(newPassword);
    if (passwordErr) {
      setNewPasswordError(passwordErr);
      isValid = false;
    }
    
    if (!confirmPassword || confirmPassword.trim() === '') {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    if (!isValid) return;

    const payload = {newPassword, value: verifyByValue};
    try {
      const response = await setNewPasswordApi(payload);
      if (response?.status >= 200 && response?.status < 300) {
        toast.success('Password reset successfully');
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      } else {
        toast.error(response?.data?.message ?? 'Failed to reset password');
      }
    } catch (error) {
      const msg = error?.message ?? 'Failed to reset password';
      toast.error(msg);
      setNewPasswordError(msg);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="h3" style={styles.title}>
          Reset Your Password
        </Text>

        <Text variant="body" color={colors.textSecondary} style={styles.instruction}>
          The password must be different than before
        </Text>

        <View style={styles.inputContainer}>
          <PasswordInput
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              if (newPasswordError) {
                setNewPasswordError('');
              }
            }}
            placeholder="Enter the New Password"
            error={newPasswordError}
          />

          <PasswordInput
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) {
                setConfirmPasswordError('');
              }
            }}
            placeholder="Confirm Password"
            error={confirmPasswordError}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            style={styles.continueButton}
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
    // marginTop: 'auto',
    marginBottom: 32,
  },
  continueButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
});

export default ResetPasswordScreen;
