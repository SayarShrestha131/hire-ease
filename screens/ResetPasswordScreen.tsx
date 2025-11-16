import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { AuthContainer } from '../components/auth/AuthContainer';
import { AuthInput } from '../components/auth/AuthInput';
import { AuthButton } from '../components/auth/AuthButton';
import { useForm } from '../hooks/useForm';
import { validatePassword } from '../utils/validation';
import { authService } from '../services/authService';

interface ResetPasswordScreenProps {
  email?: string;
  onSuccess?: () => void;
  onRequestNewOTP?: () => void;
}

export function ResetPasswordScreen({
  email,
  onSuccess,
  onRequestNewOTP,
}: ResetPasswordScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  // Initialize form with OTP and password validation
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
    newPassword: {
      value: '',
      validate: validatePassword,
    },
    confirmPassword: {
      value: '',
      validate: (value: string, formValues?: Record<string, string>) => {
        if (!value) {
          return { isValid: false, error: 'Please confirm your password' };
        }
        if (formValues && value !== formValues.newPassword) {
          return { isValid: false, error: 'Passwords do not match' };
        }
        return { isValid: true };
      },
    },
  });

  // Calculate password strength
  useEffect(() => {
    const password = form.values.newPassword;
    if (password.length === 0) {
      setPasswordStrength('weak');
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      setPasswordStrength('weak');
    } else if (strength <= 3) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }, [form.values.newPassword]);

  const handleSubmit = async () => {
    // Clear previous messages
    setErrorMessage(undefined);
    setSuccessMessage(undefined);

    // Validate all fields
    const isValid = form.validateForm();
    
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.resetPassword(form.values.otp, form.values.newPassword);
      
      setSuccessMessage(response.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 3000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password. Please try again.';
      setErrorMessage(message);
      console.error('Password reset failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'w-1/3';
      case 'medium':
        return 'w-2/3';
      case 'strong':
        return 'w-full';
    }
  };

  return (
    <AuthContainer
      title="Reset Password"
      subtitle="Enter your new password"
    >
      <View className="space-y-5">
        {successMessage ? (
          /* Success Message */
          <View className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
            <View className="items-center mb-4">
              <Text className="text-4xl mb-2">✓</Text>
              <Text className="text-lg font-semibold text-green-800 mb-2">
                Password Reset Successful
              </Text>
            </View>
            <Text className="text-sm text-green-700 text-center mb-2">
              {successMessage}
            </Text>
            <Text className="text-xs text-green-600 text-center">
              Redirecting to login...
            </Text>
          </View>
        ) : (
          <>
            {/* Email Display */}
            {email && (
              <View className="bg-blue-50 p-3 rounded-lg mb-4">
                <Text className="text-sm text-blue-800 text-center">
                  OTP sent to: <Text className="font-semibold">{email}</Text>
                </Text>
              </View>
            )}

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
              testID="reset-password-otp-input"
            />

            {/* New Password Input */}
            <AuthInput
              label="New Password"
              value={form.values.newPassword}
              onChangeText={form.handleChange('newPassword')}
              onBlur={form.handleBlur('newPassword')}
              placeholder="Enter new password"
              secureTextEntry
              error={form.errors.newPassword}
              icon={<Text className="text-xl">🔒</Text>}
              testID="reset-password-new-input"
            />

            {/* Password Strength Indicator */}
            {form.values.newPassword.length > 0 && (
              <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-gray-600">Password Strength:</Text>
                  <Text className={`text-xs font-semibold ${
                    passwordStrength === 'weak' ? 'text-red-600' :
                    passwordStrength === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.toUpperCase()}
                  </Text>
                </View>
                <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View className={`h-full ${getStrengthColor()} ${getStrengthWidth()} transition-all`} />
                </View>
              </View>
            )}

            {/* Confirm Password Input */}
            <AuthInput
              label="Confirm Password"
              value={form.values.confirmPassword}
              onChangeText={form.handleChange('confirmPassword')}
              onBlur={form.handleBlur('confirmPassword')}
              placeholder="Confirm new password"
              secureTextEntry
              error={form.errors.confirmPassword}
              icon={<Text className="text-xl">🔒</Text>}
              testID="reset-password-confirm-input"
            />

            {/* Error Message */}
            {errorMessage && (
              <View className="bg-red-50 p-4 rounded-lg">
                <Text className="text-sm text-red-600 text-center mb-3">
                  {errorMessage}
                </Text>
                {(errorMessage.includes('Invalid') || errorMessage.includes('expired') || errorMessage.includes('Too many')) && (
                  <Pressable
                    onPress={onRequestNewOTP}
                    className="bg-red-100 py-2 px-4 rounded-lg"
                  >
                    <Text className="text-sm text-red-700 font-medium text-center">
                      Request New OTP
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Submit Button */}
            <View className="mt-8">
              <AuthButton
                title="Reset Password"
                onPress={handleSubmit}
                loading={isLoading}
                testID="reset-password-submit-button"
              />
            </View>

            {/* Password Requirements */}
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-xs font-semibold text-gray-700 mb-2">
                Password Requirements:
              </Text>
              <Text className="text-xs text-gray-600">
                • At least 8 characters long{'\n'}
                • Mix of uppercase and lowercase letters{'\n'}
                • At least one number{'\n'}
                • At least one special character
              </Text>
            </View>
          </>
        )}
      </View>
    </AuthContainer>
  );
}
