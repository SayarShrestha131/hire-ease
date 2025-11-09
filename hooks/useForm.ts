import { useState, useCallback } from 'react';
import { ValidationResult } from '../utils/validation';

export interface FieldConfig {
  value: string;
  error?: string;
  validate?: (value: string, formValues?: Record<string, string>) => ValidationResult;
}

export interface FormConfig {
  [key: string]: FieldConfig;
}

export interface UseFormReturn<T extends FormConfig> {
  values: Record<keyof T, string>;
  errors: Record<keyof T, string | undefined>;
  handleChange: (field: keyof T) => (value: string) => void;
  handleBlur: (field: keyof T) => () => void;
  validateForm: () => boolean;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  setError: (field: keyof T, error: string) => void;
  resetForm: () => void;
}

/**
 * Custom hook for managing form state and validation
 * 
 * @param initialConfig - Initial form configuration with fields and validators
 * @returns Form state and handlers
 */
export function useForm<T extends FormConfig>(
  initialConfig: T
): UseFormReturn<T> {
  // Initialize state from config
  const [formState, setFormState] = useState<T>(() => {
    const state = {} as T;
    Object.keys(initialConfig).forEach((key) => {
      state[key as keyof T] = {
        value: initialConfig[key].value,
        error: undefined,
        validate: initialConfig[key].validate,
      };
    });
    return state;
  });

  /**
   * Get current form values
   */
  const values = Object.keys(formState).reduce((acc, key) => {
    acc[key as keyof T] = formState[key as keyof T].value;
    return acc;
  }, {} as Record<keyof T, string>);

  /**
   * Get current form errors
   */
  const errors = Object.keys(formState).reduce((acc, key) => {
    acc[key as keyof T] = formState[key as keyof T].error;
    return acc;
  }, {} as Record<keyof T, string | undefined>);

  /**
   * Handle field value change
   */
  const handleChange = useCallback((field: keyof T) => {
    return (value: string) => {
      setFormState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          value,
          error: undefined, // Clear error when user starts typing
        },
      }));
    };
  }, []);

  /**
   * Handle field blur - triggers validation
   */
  const handleBlur = useCallback((field: keyof T) => {
    return () => {
      setFormState((prev) => {
        const fieldConfig = prev[field];
        
        if (!fieldConfig.validate) {
          return prev;
        }

        // Get all current values for cross-field validation
        const currentValues = Object.keys(prev).reduce((acc, key) => {
          acc[key] = prev[key as keyof T].value;
          return acc;
        }, {} as Record<string, string>);

        const validationResult = fieldConfig.validate(
          fieldConfig.value,
          currentValues
        );

        return {
          ...prev,
          [field]: {
            ...fieldConfig,
            error: validationResult.isValid ? undefined : validationResult.error,
          },
        };
      });
    };
  }, []);

  /**
   * Validate all fields in the form
   * @returns true if all fields are valid
   */
  const validateForm = useCallback((): boolean => {
    let isFormValid = true;
    const newState = { ...formState };

    // Get all current values for cross-field validation
    const currentValues = Object.keys(formState).reduce((acc, key) => {
      acc[key] = formState[key as keyof T].value;
      return acc;
    }, {} as Record<string, string>);

    Object.keys(formState).forEach((key) => {
      const field = key as keyof T;
      const fieldConfig = formState[field];

      if (fieldConfig.validate) {
        const validationResult = fieldConfig.validate(
          fieldConfig.value,
          currentValues
        );

        if (!validationResult.isValid) {
          isFormValid = false;
          newState[field] = {
            ...fieldConfig,
            error: validationResult.error,
          };
        }
      }
    });

    setFormState(newState);
    return isFormValid;
  }, [formState]);

  /**
   * Clear error for a specific field
   */
  const clearError = useCallback((field: keyof T) => {
    setFormState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        error: undefined,
      },
    }));
  }, []);

  /**
   * Clear all errors
   */
  const clearAllErrors = useCallback(() => {
    setFormState((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        newState[key as keyof T] = {
          ...newState[key as keyof T],
          error: undefined,
        };
      });
      return newState;
    });
  }, []);

  /**
   * Set error for a specific field
   */
  const setError = useCallback((field: keyof T, error: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        error,
      },
    }));
  }, []);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    const state = {} as T;
    Object.keys(initialConfig).forEach((key) => {
      state[key as keyof T] = {
        value: initialConfig[key].value,
        error: undefined,
        validate: initialConfig[key].validate,
      };
    });
    setFormState(state);
  }, [initialConfig]);

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    clearError,
    clearAllErrors,
    setError,
    resetForm,
  };
}
