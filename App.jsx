import React from 'react';
import { View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastProvider from 'toastify-react-native';
import { AuthProvider } from './src/context/AuthContext';
import { SocketProvider } from './src/context/SocketContext';
import AppNavigator from './src/navigation/AppNavigator';
import ContextState from './src/context/ContextState';
import CustomToast from './src/components/ui/CustomToast';

const TOAST_PADDING = 5;

const toastConfig = {
  success: props => <CustomToast {...props} />,
  error: props => <CustomToast {...props} />,
  info: props => <CustomToast {...props} />,
  warn: props => <CustomToast {...props} />,
  default: props => <CustomToast {...props} />,
};

function AppContent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <ContextState>
        <AuthProvider>
          <SocketProvider>
            <AppNavigator />
          </SocketProvider>
        </AuthProvider>
      </ContextState>
      <ToastProvider
        config={toastConfig}
        topOffset={insets.top + TOAST_PADDING}
        bottomOffset={insets.bottom + TOAST_PADDING}
        width="90%"
        showProgressBar={false}
      />
    </View>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
