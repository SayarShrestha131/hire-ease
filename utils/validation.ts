/**
 * Validation utility functions for authentication forms
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
};

/**
 * Validates password meets minimum requirements
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters',
    };
  }

  return { isValid: true };
};

/**
 * Validates name meets minimum requirements
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      error: 'Name is required',
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters',
    };
  }

  return { isValid: true };
};

/**
 * Validates password confirmation matches password
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return {
      isValid: false,
      error: 'Please confirm your password',
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }

  return { isValid: true };
};

/**
 * Calculates password strength score (0-7)
 */
export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;

  if (!password) return strength;

  // Length criteria
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character variety
  if (/[a-z]/.test(password)) strength++; // lowercase
  if (/[A-Z]/.test(password)) strength++; // uppercase
  if (/[0-9]/.test(password)) strength++; // numbers
  if (/[^a-zA-Z0-9]/.test(password)) strength++; // special chars

  return strength;
};

/**
 * Gets password strength label based on score
 */
export const getPasswordStrengthLabel = (strength: number): string => {
  if (strength <= 2) return 'Weak';
  if (strength <= 4) return 'Fair';
  if (strength <= 6) return 'Good';
  return 'Strong';
};

/**
 * Gets password strength color based on score
 */
export const getPasswordStrengthColor = (strength: number): string => {
  if (strength <= 2) return '#ef4444'; // red
  if (strength <= 4) return '#f59e0b'; // orange
  if (strength <= 6) return '#10b981'; // green
  return '#059669'; // dark green
};
