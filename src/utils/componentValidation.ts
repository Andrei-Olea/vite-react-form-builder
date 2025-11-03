/**
 * Validation utilities for form components
 */

import { ValidationRule } from '../types/formComponents.types';

/**
 * Validate a value against an array of validation rules
 */
export const validateField = (value: any, rules?: ValidationRule[]): string | undefined => {
  if (!rules || rules.length === 0) {
    return undefined;
  }

  for (const rule of rules) {
    const error = validateRule(value, rule);
    if (error) {
      return error;
    }
  }

  return undefined;
};

/**
 * Validate a value against a single rule
 */
const validateRule = (value: any, rule: ValidationRule): string | undefined => {
  switch (rule.type) {
    case 'required':
      if (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
        return rule.message;
      }
      break;

    case 'email':
      if (value && typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return rule.message;
        }
      }
      break;

    case 'min':
      if (typeof value === 'number' && rule.value !== undefined) {
        if (value < rule.value) {
          return rule.message;
        }
      }
      break;

    case 'max':
      if (typeof value === 'number' && rule.value !== undefined) {
        if (value > rule.value) {
          return rule.message;
        }
      }
      break;

    case 'minLength':
      if (typeof value === 'string' && rule.value !== undefined) {
        if (value.length < rule.value) {
          return rule.message;
        }
      }
      break;

    case 'maxLength':
      if (typeof value === 'string' && rule.value !== undefined) {
        if (value.length > rule.value) {
          return rule.message;
        }
      }
      break;

    case 'pattern':
      if (value && typeof value === 'string' && rule.value) {
        const regex = new RegExp(rule.value);
        if (!regex.test(value)) {
          return rule.message;
        }
      }
      break;

    case 'custom':
      if (rule.validator) {
        const isValid = rule.validator(value);
        if (!isValid) {
          return rule.message;
        }
      }
      break;

    default:
      break;
  }

  return undefined;
};

/**
 * Common validation rule factories
 */
export const validationRules = {
  required: (message = 'Este campo es requerido'): ValidationRule => ({
    type: 'required',
    message,
  }),

  email: (message = 'Ingresa un correo electrónico válido'): ValidationRule => ({
    type: 'email',
    message,
  }),

  min: (value: number, message?: string): ValidationRule => ({
    type: 'min',
    value,
    message: message || `El valor mínimo es ${value}`,
  }),

  max: (value: number, message?: string): ValidationRule => ({
    type: 'max',
    value,
    message: message || `El valor máximo es ${value}`,
  }),

  minLength: (value: number, message?: string): ValidationRule => ({
    type: 'minLength',
    value,
    message: message || `Debe tener al menos ${value} caracteres`,
  }),

  maxLength: (value: number, message?: string): ValidationRule => ({
    type: 'maxLength',
    value,
    message: message || `Debe tener máximo ${value} caracteres`,
  }),

  pattern: (pattern: string | RegExp, message: string): ValidationRule => ({
    type: 'pattern',
    value: typeof pattern === 'string' ? pattern : pattern.source,
    message,
  }),

  custom: (validator: (value: any) => boolean, message: string): ValidationRule => ({
    type: 'custom',
    validator,
    message,
  }),
};
