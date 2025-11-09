import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

interface PasswordStrengthMeterProps {
  password: string;
}

type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

interface StrengthResult {
  score: number;
  level: StrengthLevel;
  label: string;
}

function calculatePasswordStrength(password: string): StrengthResult {
  if (!password) {
    return { score: 0, level: 'weak', label: '' };
  }

  let score = 0;

  // Length scoring
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1; // lowercase
  if (/[A-Z]/.test(password)) score += 1; // uppercase
  if (/[0-9]/.test(password)) score += 1; // numbers
  if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special chars

  // Determine level
  let level: StrengthLevel;
  let label: string;

  if (score <= 2) {
    level = 'weak';
    label = 'Weak';
  } else if (score <= 4) {
    level = 'fair';
    label = 'Fair';
  } else if (score <= 6) {
    level = 'good';
    label = 'Good';
  } else {
    level = 'strong';
    label = 'Strong';
  }

  return { score, level, label };
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = calculatePasswordStrength(password);
  const progress = useSharedValue(0);

  useEffect(() => {
    // Animate progress bar width (0 to 1)
    const targetProgress = password ? strength.score / 7 : 0;
    progress.value = withTiming(targetProgress, { duration: 300 });
  }, [password, strength.score]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.3, 0.5, 0.7, 1],
      ['#ef4444', '#ef4444', '#f59e0b', '#10b981', '#10b981']
    );

    return {
      width: `${progress.value * 100}%`,
      backgroundColor: withTiming(backgroundColor, { duration: 300 }),
    };
  });

  if (!password) {
    return null;
  }

  const labelColors = {
    weak: 'text-red-500',
    fair: 'text-orange-500',
    good: 'text-green-500',
    strong: 'text-green-600',
  };

  return (
    <View className="w-full mt-2">
      {/* Progress Bar Background */}
      <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        {/* Animated Progress Bar */}
        <Animated.View
          style={animatedProgressStyle}
          className="h-full rounded-full"
        />
      </View>

      {/* Strength Label */}
      <Text className={`text-sm font-medium mt-1 ${labelColors[strength.level]}`}>
        {strength.label}
      </Text>
    </View>
  );
}
