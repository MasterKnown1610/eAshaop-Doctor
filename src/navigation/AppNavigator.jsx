
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppStack from './AppStack';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import {colors} from '../theme/colors';

const AppNavigator = () => {
  const {isAuthenticated, hasCompletedOnboarding, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Show onboarding if authenticated but hasn't completed onboarding
  const showOnboarding = isAuthenticated && !hasCompletedOnboarding;

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : showOnboarding ? (
        <OnboardingScreen />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AppNavigator;
