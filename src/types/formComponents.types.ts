/**
 * Type definitions for reusable form components
 */

// Validation rule types
export type ValidationRule = {
  type: 'required' | 'email' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
};

// Value transformer types
export type ValueTransformer = {
  format?: (value: any) => string;  // Transform value for display
  parse?: (value: string) => any;   // Transform input to value
};

// Base props for all form components
export interface BaseFormFieldProps {
  label?: string;
  name: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  show?: boolean;  // Conditional rendering
  helpText?: string;  // Additional help text below input
  validationRules?: ValidationRule[];
  onValidate?: (value: any) => string | undefined;  // Custom validation function
}

// FormInput props
export interface FormInputProps extends BaseFormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  readOnly?: boolean;
  transformer?: ValueTransformer;
  autoComplete?: string;
}

// FormSelect props
export interface FormSelectProps extends BaseFormFieldProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// FormCheckbox props
export interface FormCheckboxProps extends Omit<BaseFormFieldProps, 'label'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;  // Can include links, formatted text
  children?: React.ReactNode;  // Alternative to label
}

// FormRadioGroup props
export interface FormRadioGroupProps extends BaseFormFieldProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: RadioOption[];
  layout?: 'vertical' | 'horizontal';
}

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// FormTextarea props
export interface FormTextareaProps extends BaseFormFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

// Config-driven form types
export type FormFieldConfig =
  | ({ fieldType: 'input' } & FormInputProps)
  | ({ fieldType: 'select' } & FormSelectProps)
  | ({ fieldType: 'checkbox' } & FormCheckboxProps)
  | ({ fieldType: 'radio' } & FormRadioGroupProps)
  | ({ fieldType: 'textarea' } & FormTextareaProps);

export interface FormSectionConfig {
  title?: string;
  description?: string;
  className?: string;
  fields: FormFieldConfig[];
  show?: boolean;  // Conditional rendering for entire section
}

export interface FormConfig {
  sections: FormSectionConfig[];
  submitButton?: {
    label: string;
    loadingLabel?: string;
    className?: string;
  };
}

// Form builder props
export interface FormBuilderProps {
  config: FormConfig;
  formData: Record<string, any>;
  errors?: Record<string, string>;
  onChange: (name: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}
