import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthContainer({ children, title, subtitle }: AuthContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow justify-center p-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-md mx-auto">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                {title}
              </Text>
              {subtitle && (
                <Text className="text-base text-gray-500">
                  {subtitle}
                </Text>
              )}
            </View>

            {/* Content */}
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
