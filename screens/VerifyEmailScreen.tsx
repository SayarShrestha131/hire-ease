import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { AuthContainer } from '../components/auth/AuthContainer';
import { AuthInput } from '../components/auth/AuthInput';
import { AuthButton } from '../components/auth/AuthButton';
import { useForm } from '../hooks/useForm';
import { authService } from '../services/authService';

interface VerifyEmailScreenProps {
  email: string;
  onSuccess?: () => void;
  onResendOTP?: () => void;
}

export function VerifyEmailScreen({
  email,
  onSuccess,
  onResendOTP,
}: VerifyEmailScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  // Initialize form with OTP validation
  const form = useForm({
    otp: {
      value: '',
      validate: (value: string) => {
        if (!value) {
          return { isValid: false, error: 'Please enter the OTP code' };
        }
        if (!/^\d{6}$/.test(value)) {
          return { isValid: false, error: 'OTP must be 6 digits' };
        }
        return { isValid: true };
      },
    },
  });

  const handleSubmit = async () => {
    // Clear previous messages
    setErrorMessage(undefined);
    setSuccessMessage(undefined);

    // Validate OTP field
    const isValid = form.validateForm();
    
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.verifyEmail(email, form.values.otp);
      
      setSuccessMessage('Email verified successfully!');
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to verify email. Please try again.';
      setErrorMessage(message);
      console.error('Email verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Verify Your Email"
      subtitle="Enter the code sent to your email"
    >
      <View className="space-y-5">
        {successMessage ? (
          /* Success Message */
          <View className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
            <View className="items-center mb-4">
              <Text className="text-4xl mb-2">✓</Text>
              <Text className="text-lg font-semibold text-green-800 mb-2">
                Email Verified!
              </Text>
            </View>
            <Text className="text-sm text-green-700 text-center">
              {successMessage}
            </Text>
            <Text className="text-xs text-green-600 text-center mt-2">
              Redirecting to home...
            </Text>
          </View>
        ) : (
          <>
            {/* Email Display */}
            <View className="bg-blue-50 p-3 rounded-lg mb-4">
              <Text className="text-sm text-blue-800 text-center">
                OTP sent to: <Text className="font-semibold">{email}</Text>
              </Text>
            </View>

            {/* OTP Input */}
            <AuthInput
              label="Enter 6-Digit OTP"
              value={form.values.otp}
              onChangeText={form.handleChange('otp')}
              onBlur={form.handleBlur('otp')}
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              error={form.errors.otp}
              icon={<Text className="text-xl">🔢</Text>}
              testID="verify-email-otp-input"
            />

            {/* Error Message */}
            {errorMessage && (
              <View className="bg-red-50 p-4 rounded-lg">
                <Text className="text-sm text-red-600 text-center mb-3">
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <View className="mt-8">
              <AuthButton
                title="Verify Email"
                onPress={handleSubmit}
                loading={isLoading}
                testID="verify-email-submit-button"
              />
            </View>

            {/* Resend OTP */}
            <View className="mt-4">
              <Text className="text-sm text-gray-600 text-center">
                Didn't receive the code?{' '}
                <Text 
                  className="text-indigo-500 font-semibold"
                  onPress={onResendOTP}
                >
                  Resend OTP
                </Text>
              </Text>
            </View>
          </>
        )}
      </View>
    </AuthContainer>
  );
}
