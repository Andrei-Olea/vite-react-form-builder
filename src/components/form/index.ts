/**
 * Form Components - Reusable form field components for building landing pages
 *
 * This module exports all form components and utilities needed to build forms.
 * You can use components directly or use FormBuilder for config-driven forms.
 *
 * @example
 * // Direct component usage
 * import { FormInput, FormSelect, FormCheckbox } from '@/components/form';
 *
 * @example
 * // Config-driven forms
 * import { FormBuilder } from '@/components/form';
 *
 * @example
 * // Validation utilities
 * import { validationRules } from '@/components/form';
 */

// Export all form components
export { FormInput } from './FormInput';
export { FormSelect } from './FormSelect';
export { FormCheckbox } from './FormCheckbox';
export { FormRadioGroup } from './FormRadioGroup';
export { FormTextarea } from './FormTextarea';
export { FormBuilder } from './FormBuilder';

// Export types
export type {
  FormInputProps,
  FormSelectProps,
  FormCheckboxProps,
  FormRadioGroupProps,
  FormTextareaProps,
  FormBuilderProps,
  FormConfig,
  FormSectionConfig,
  FormFieldConfig,
  SelectOption,
  RadioOption,
  ValidationRule,
  ValueTransformer,
} from '../../types/formComponents.types';

// Export validation utilities
export { validationRules, validateField } from '../../utils/componentValidation';
