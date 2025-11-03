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
 *
 * @example
 * // Loading spinner
 * import { Loader } from '@/components/form';
 * {isSubmitting && <Loader message="Submitting..." />}
 */

// Export all form components
export { FormInput } from './FormInput';
export { FormSelect } from './FormSelect';
export { FormCheckbox } from './FormCheckbox';
export { FormRadioGroup } from './FormRadioGroup';
export { FormTextarea } from './FormTextarea';
export { FormBuilder } from './FormBuilder';
export { Loader } from './Loader';

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

export type { LoaderProps } from './Loader';

// Export validation utilities
export { validationRules, validateField } from '../../utils/componentValidation';
