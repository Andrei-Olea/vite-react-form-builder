/**
 * Form Builder Validation Utilities
 *
 * These utilities validate form data against FormConfig definitions.
 * Use this to validate FormBuilder forms before submission.
 */

import { FormConfig, FormFieldConfig } from '../types/formComponents.types';
import { validateField } from './componentValidation';

/**
 * Validate form data against a FormConfig
 *
 * @param formData - The form data object
 * @param formConfig - The form configuration
 * @returns Object with field names as keys and error messages as values
 *
 * @example
 * const errors = validateFormConfig(formData, formConfig);
 * if (Object.keys(errors).length > 0) {
 *   setErrors(errors);
 *   return; // Don't submit
 * }
 */
export const validateFormConfig = (
  formData: Record<string, any>,
  formConfig: FormConfig
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Iterate through all sections and fields
  for (const section of formConfig.sections) {
    // Skip hidden sections
    if (section.show === false) {
      continue;
    }

    for (const field of section.fields) {
      // Skip hidden fields
      if (field.show === false) {
        continue;
      }

      // Skip paragraph fields (display-only, no validation needed)
      if (field.fieldType === 'paragraph') {
        continue;
      }

      const fieldError = validateFormField(field, formData[field.name]);
      if (fieldError) {
        errors[field.name] = fieldError;
      }
    }
  }

  return errors;
};

/**
 * Validate a single form field
 */
const validateFormField = (field: FormFieldConfig, value: any): string | undefined => {
  // Check if field has validation rules
  if ('validationRules' in field && field.validationRules) {
    const error = validateField(value, field.validationRules);
    if (error) {
      return error;
    }
  }

  // Check if field has custom validation function
  if ('onValidate' in field && field.onValidate) {
    const error = field.onValidate(value);
    if (error) {
      return error;
    }
  }

  // For required fields without explicit validation rules, check if empty
  // Type-safe check for required property (not all field types have it)
  if ('required' in field && field.required) {
    // For checkboxes
    if (field.fieldType === 'checkbox') {
      if (!value || value === false) {
        return 'This field is required';
      }
    }
    // For other fields
    else if (value === null || value === undefined || value === '' ||
             (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
  }

  return undefined;
};

/**
 * Check if errors object has any errors
 */
export const hasValidationErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};
