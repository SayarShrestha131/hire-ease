import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';

import './global.css';

type Screen = 'login' | 'register' | 'forgot-password';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen 
            onSignUp={() => setCurrentScreen('register')} 
            onForgotPassword={() => setCurrentScreen('forgot-password')} 
          />
        );
      case 'register':
        return (
          <RegisterScreen 
            onSignIn={() => setCurrentScreen('login')} 
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordScreen 
            onBack={() => setCurrentScreen('login')} 
          />
        );
      default:
        return (
          <LoginScreen 
            onSignUp={() => setCurrentScreen('register')} 
            onForgotPassword={() => setCurrentScreen('forgot-password')} 
          />
        );
    }
  };

  return (
    <>
      <View className="flex-1">
        {renderScreen()}
      </View>
      <StatusBar style="auto" />
    </>
  );
}
