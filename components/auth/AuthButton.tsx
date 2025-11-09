import React from 'react';
import { Text, Pressable, ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AuthButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  testID,
}: AuthButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const isDisabled = disabled || loading;

  const buttonClasses =
    variant === 'primary'
      ? `w-full py-4 rounded-lg ${
          isDisabled ? 'bg-indigo-300' : 'bg-indigo-500'
        }`
      : `w-full py-4 rounded-lg border-2 ${
          isDisabled ? 'border-gray-300 bg-gray-100' : 'border-indigo-500 bg-white'
        }`;

  const textClasses =
    variant === 'primary'
      ? 'text-base font-semibold text-white text-center'
      : `text-base font-semibold text-center ${
          isDisabled ? 'text-gray-400' : 'text-indigo-500'
        }`;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      className={buttonClasses}
      style={animatedStyle}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : '#6366f1'}
        />
      ) : (
        <Text className={textClasses}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}
