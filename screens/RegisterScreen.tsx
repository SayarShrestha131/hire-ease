import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { AuthContainer } from '../components/auth/AuthContainer';
import { AuthInput } from '../components/auth/AuthInput';
import { AuthButton } from '../components/auth/AuthButton';
import { PasswordStrengthMeter } from '../components/auth/PasswordStrengthMeter';
import { useForm } from '../hooks/useForm';
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from '../utils/validation';
import { authService } from '../services/authService';

interface RegisterScreenProps {
  onSignIn?: () => void;
  onRegisterSuccess?: (email: string) => void;
}

export function RegisterScreen({ onSignIn, onRegisterSuccess }: RegisterScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>();

  // Initialize form with validation
  const form = useForm({
    name: {
      value: '',
      validate: validateName,
    },
    email: {
      value: '',
      validate: validateEmail,
    },
    password: {
      value: '',
      validate: validatePassword,
    },
    confirmPassword: {
      value: '',
      validate: (value: string, formValues?: Record<string, string>) => {
        return validatePasswordMatch(formValues?.password || '', value);
      },
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

    setIsLoading(true);

    try {
      const response = await authService.signup({
        name: form.values.name,
        email: form.values.email,
        password: form.values.password,
      });
      
      console.log('Registration successful, verification required');
      
      // Navigate to email verification screen
      if (onRegisterSuccess) {
        onRegisterSuccess(form.values.email);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer title="Create Account" subtitle="Join us today">
      <View className="space-y-5">
        {/* Name Input */}
        <AuthInput
          label="Full Name"
          value={form.values.name}
          onChangeText={form.handleChange('name')}
          onBlur={form.handleBlur('name')}
          placeholder="Enter your full name"
          autoCapitalize="words"
          error={form.errors.name}
          icon={<Text className="text-xl">👤</Text>}
          testID="register-name-input"
        />

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
          testID="register-email-input"
        />

        {/* Password Input */}
        <View>
          <AuthInput
            label="Password"
            value={form.values.password}
            onChangeText={form.handleChange('password')}
            onBlur={form.handleBlur('password')}
            placeholder="Enter your password"
            secureTextEntry
            error={form.errors.password}
            icon={<Text className="text-xl">🔒</Text>}
            testID="register-password-input"
          />
          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={form.values.password} />
        </View>

        {/* Confirm Password Input */}
        <AuthInput
          label="Confirm Password"
          value={form.values.confirmPassword}
          onChangeText={form.handleChange('confirmPassword')}
          onBlur={form.handleBlur('confirmPassword')}
          placeholder="Confirm your password"
          secureTextEntry
          error={form.errors.confirmPassword}
          icon={<Text className="text-xl">🔒</Text>}
          testID="register-confirm-password-input"
        />

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
            title="Sign Up"
            onPress={handleSubmit}
            loading={isLoading}
            testID="register-submit-button"
          />
        </View>

        {/* Sign In Link */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-sm text-gray-600">
            Already have an account?{' '}
          </Text>
          <Pressable onPress={onSignIn} hitSlop={8}>
            <Text className="text-sm text-indigo-500 font-semibold">
              Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthContainer>
  );
}
