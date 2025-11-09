import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { AuthContainer } from '../components/auth/AuthContainer';
import { AuthInput } from '../components/auth/AuthInput';
import { AuthButton } from '../components/auth/AuthButton';
import { useForm } from '../hooks/useForm';
import { validateEmail } from '../utils/validation';

interface ForgotPasswordScreenProps {
  onBack?: () => void;
  onResetPassword?: (email: string) => Promise<void>;
}

export function ForgotPasswordScreen({
  onBack,
  onResetPassword,
}: ForgotPasswordScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialize form with email validation
  const form = useForm({
    email: {
      value: '',
      validate: validateEmail,
    },
  });

  const handleSubmit = async () => {
    // Validate email field
    const isValid = form.validateForm();
    
    if (!isValid) {
      return;
    }

    // Simulate password reset request
    setIsLoading(true);
    
    try {
      if (onResetPassword) {
        await onResetPassword(form.values.email);
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Password reset email sent to:', form.values.email);
      }
      
      // Show success message
      setSubmitted(true);
    } catch (error) {
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

        {!submitted ? (
          <>
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

            {/* Submit Button */}
            <View className="mt-8">
              <AuthButton
                title="Send Reset Link"
                onPress={handleSubmit}
                loading={isLoading}
                testID="forgot-password-submit-button"
              />
            </View>
          </>
        ) : (
          /* Success Message */
          <View className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
            <View className="items-center mb-4">
              <Text className="text-4xl mb-2">✓</Text>
              <Text className="text-lg font-semibold text-green-800 mb-2">
                Check Your Email
              </Text>
            </View>
            <Text className="text-sm text-green-700 text-center mb-4">
              We've sent password reset instructions to{' '}
              <Text className="font-semibold">{form.values.email}</Text>
            </Text>
            <Text className="text-xs text-green-600 text-center">
              If you don't see the email, check your spam folder or try again.
            </Text>
            
            {/* Back to Login Button */}
            <View className="mt-6">
              <AuthButton
                title="Back to Login"
                onPress={onBack}
                variant="secondary"
                testID="back-to-login-button"
              />
            </View>
          </View>
        )}
      </View>
    </AuthContainer>
  );
}
