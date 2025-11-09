import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardTypeOptions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  icon?: React.ReactNode;
  onBlur?: () => void;
  testID?: string;
}

export function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  icon,
  onBlur,
  testID,
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isValid = !error && value.length > 0 && !isFocused;

  // Animated border color
  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      error ? 2 : isFocused ? 1 : isValid ? 3 : 0,
      [0, 1, 2, 3],
      ['#e5e7eb', '#6366f1', '#ef4444', '#10b981']
    );

    return {
      borderColor: withTiming(borderColor, { duration: 200 }),
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className="w-full">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      
      <Animated.View
        style={animatedBorderStyle}
        className="flex-row items-center border-2 rounded-lg bg-white"
      >
        {/* Icon */}
        {icon && (
          <View className="pl-4">
            {icon}
          </View>
        )}

        {/* Input */}
        <TextInput
          className="flex-1 px-4 py-3 text-base text-gray-900"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          testID={testID}
        />

        {/* Password Toggle or Valid Checkmark */}
        {secureTextEntry ? (
          <Pressable
            onPress={togglePasswordVisibility}
            className="pr-4"
            hitSlop={8}
          >
            <Text className="text-xl">
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </Pressable>
        ) : isValid ? (
          <View className="pr-4">
            <Text className="text-xl">✓</Text>
          </View>
        ) : null}
      </Animated.View>

      {/* Error Message */}
      {error && (
        <Text className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
