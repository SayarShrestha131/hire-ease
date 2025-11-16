import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { AuthContainer } from '../components/auth/AuthContainer';
import { AuthInput } from '../components/auth/AuthInput';
import { AuthButton } from '../components/auth/AuthButton';
import { useForm } from '../hooks/useForm';
import { validateEmail } from '../utils/validation';
import { authService } from '../services/authService';

interface ForgotPasswordScreenProps {
  onBack?: () => void;
  onEmailSent?: (email: string) => void;
}

export function ForgotPasswordScreen({
  onBack,
  onEmailSent,
}: ForgotPasswordScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  // Initialize form with email validation
  const form = useForm({
    email: {
      value: '',
      validate: validateEmail,
    },
  });

  const handleSubmit = async () => {
    // Clear previous errors
    setErrorMessage(undefined);

    // Validate email field
    try {
      const isValid = form.validateForm();
      
      if (!isValid) {
        return;
      }
    } catch (validationError) {
      console.error('Validation error:', validationError);
      setErrorMessage('Validation failed. Please check your email.');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Sending forgot password request for:', form.values.email);
      await authService.forgotPassword(form.values.email);
      
      console.log('Forgot password request successful, navigating to OTP screen');
      // Navigate to OTP screen
      if (onEmailSent) {
        onEmailSent(form.values.email);
      } else {
        console.warn('onEmailSent callback is not defined');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset email. Please try again.';
      setErrorMessage(message);
      console.error('Password reset failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Forgot Password?"
      subtitle="Enter your email to reset your password"
    >
      <View className="space-y-5">
        {/* Back Button */}
        <View className="mb-4">
          <Pressable
            onPress={onBack}
            hitSlop={8}
            className="flex-row items-center"
          >
            <Text className="text-base text-indigo-500 font-medium">
              ← Back
            </Text>
          </Pressable>
        </View>

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
          testID="forgot-password-email-input"
        />

        {/* Error Message */}
        {errorMessage && (
          <View className="bg-red-50 p-3 rounded-lg">
            <Text className="text-sm text-red-600 text-center">
              {errorMessage}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <View className="mt-8">
          <AuthButton
            title="Send OTP Code"
            onPress={handleSubmit}
            loading={isLoading}
            testID="forgot-password-submit-button"
          />
        </View>
      </View>
    </AuthContainer>
  );
}
