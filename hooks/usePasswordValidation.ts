import { useMemo } from 'react';

export interface PasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  isValid: boolean;
}

/**
 * Custom hook for real-time password validation
 * 
 * @param password - The password string to validate
 * @returns Validation flags for each requirement and overall validity
 */
export function usePasswordValidation(password: string): PasswordValidation {
  const validation = useMemo(() => {
    // Check minimum length (8 characters)
    const hasMinLength = password.length >= 8;

    // Check for at least one uppercase letter
    const hasUppercase = /[A-Z]/.test(password);

    // Check for at least one lowercase letter
    const hasLowercase = /[a-z]/.test(password);

    // Check for at least one number
    const hasNumber = /[0-9]/.test(password);

    // Overall validity - all requirements must be met
    const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;

    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      isValid,
    };
  }, [password]);

  return validation;
}
