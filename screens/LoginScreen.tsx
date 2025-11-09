import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { AuthContainer } from '../components/auth/AuthContainer';
import { AuthInput } from '../components/auth/AuthInput';
import { AuthButton } from '../components/auth/AuthButton';
import { useForm } from '../hooks/useForm';
import { validateEmail, validatePassword } from '../utils/validation';

interface LoginScreenProps {
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onLogin?: (email: string, password: string) => Promise<void>;
}

export function LoginScreen({
  onForgotPassword,
  onSignUp,
  onLogin,
}: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>();

  // Initialize form with validation
  const form = useForm({
    email: {
      value: '',
      validate: validateEmail,
    },
    password: {
      value: '',
      validate: validatePassword,
    },
  });

  const handleSubmit = async () => {
    // Clear any previous general errors
    setGeneralError(undefined);

    // Validate all fields
    const isValid = form.validateForm();
    
    if (!isValid) {
      return;
    }

    // Simulate authentication
    setIsLoading(true);
    
    try {
      if (onLogin) {
        await onLogin(form.values.email, form.values.password);
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Login successful:', form.values.email);
      }
    } catch (error) {
      setGeneralError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Welcome Back"
      subtitle="Sign in to continue"
    >
      <View className="space-y-5">
        {/* Email Input */}
        <AuthInput
          label="Email"
          value={form.values.email}
          onChangeText={form.handleChange('email')}
          onBlur={form.handleBlur('email')}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={form.errors.email}
          icon={<Text className="text-xl">📧</Text>}
          testID="login-email-input"
        />

        {/* Password Input */}
        <AuthInput
          label="Password"
          value={form.values.password}
          onChangeText={form.handleChange('password')}
          onBlur={form.handleBlur('password')}
          placeholder="Enter your password"
          secureTextEntry
          error={form.errors.password}
          icon={<Text className="text-xl">🔒</Text>}
          testID="login-password-input"
        />

        {/* Forgot Password Link */}
        <View className="items-end">
          <Pressable onPress={onForgotPassword} hitSlop={8}>
            <Text className="text-sm text-indigo-500 font-medium">
              Forgot Password?
            </Text>
          </Pressable>
        </View>

        {/* General Error Message */}
        {generalError && (
          <View className="bg-red-50 p-3 rounded-lg">
            <Text className="text-sm text-red-600 text-center">
              {generalError}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <View className="mt-8">
          <AuthButton
            title="Sign In"
            onPress={handleSubmit}
            loading={isLoading}
            testID="login-submit-button"
          />
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-sm text-gray-600">
            Don't have an account?{' '}
          </Text>
          <Pressable onPress={onSignUp} hitSlop={8}>
            <Text className="text-sm text-indigo-500 font-semibold">
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthContainer>
  );
}
