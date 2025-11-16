import { useState, useEffect } from 'react';
import { View, Text, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from './screens/ResetPasswordScreen';
import { VerifyEmailScreen } from './screens/VerifyEmailScreen';
import { initializeAuth } from './services/api';

import './global.css';

type Screen = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify-email' | 'home';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [resetEmail, setResetEmail] = useState<string | undefined>();
  const [verifyEmail, setVerifyEmail] = useState<string | undefined>();

  useEffect(() => {
    // Initialize auth on app start
    const init = async () => {
      await initializeAuth();
      setIsLoading(false);
    };
    init();
  }, []);



  const handleLoginSuccess = () => {
    setCurrentScreen('home');
  };

  const handleRegisterSuccess = (email: string) => {
    setVerifyEmail(email);
    setCurrentScreen('verify-email');
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen 
            onSignUp={() => setCurrentScreen('register')} 
            onForgotPassword={() => setCurrentScreen('forgot-password')}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'register':
        return (
          <RegisterScreen 
            onSignIn={() => setCurrentScreen('login')}
            onRegisterSuccess={handleRegisterSuccess}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordScreen 
            onBack={() => setCurrentScreen('login')}
            onEmailSent={(email) => {
              setResetEmail(email);
              setCurrentScreen('reset-password');
            }}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordScreen 
            email={resetEmail}
            onSuccess={() => {
              setResetEmail(undefined);
              setCurrentScreen('login');
            }}
            onRequestNewOTP={() => setCurrentScreen('forgot-password')}
          />
        );
      case 'verify-email':
        return (
          <VerifyEmailScreen 
            email={verifyEmail || ''}
            onSuccess={() => {
              setVerifyEmail(undefined);
              setCurrentScreen('home');
            }}
            onResendOTP={() => {
              // TODO: Implement resend OTP
              console.log('Resend OTP requested');
            }}
          />
        );
      case 'home':
        return (
          <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Welcome!</Text>
            <Text className="text-base text-gray-600 mb-8">You are logged in</Text>
            <Text 
              className="text-indigo-500 font-semibold"
              onPress={() => setCurrentScreen('login')}
            >
              Logout
            </Text>
          </View>
        );
      default:
        return (
          <LoginScreen 
            onSignUp={() => setCurrentScreen('register')} 
            onForgotPassword={() => setCurrentScreen('forgot-password')}
            onLoginSuccess={handleLoginSuccess}
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
