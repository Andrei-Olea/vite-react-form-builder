import { useEffect, useState } from 'react';
import { FormInputProps } from '../../types/formComponents.types';
import { validateField } from '../../utils/componentValidation';

/**
 * Reusable text/email/number input component with validation and transformation
 *
 * @example
 * // Basic usage
 * <FormInput
 *   name="email"
 *   label="Email"
 *   type="email"
 *   value={formData.email}
 *   onChange={(value) => setFormData({ ...formData, email: value })}
 *   required
 * />
 *
 * @example
 * // With custom validation and transformation (currency)
 * <FormInput
 *   name="amount"
 *   label="Amount"
 *   value={formData.amount}
 *   onChange={(value) => handleChange('amount', value)}
 *   required
 *   transformer={{
 *     format: (value) => formatCurrency(value),
 *     parse: (value) => parseCurrency(value)
 *   }}
 *   validationRules={[
 *     validationRules.required(),
 *     validationRules.min(250000, 'Minimum amount is $250,000')
 *   ]}
 * />
 */
export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  readOnly = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  show = true,
  helpText,
  validationRules,
  onValidate,
  transformer,
  autoComplete,
}: FormInputProps) => {
  const [internalError, setInternalError] = useState<string | undefined>(error);
  const [displayValue, setDisplayValue] = useState<string>('');

  // Update display value when value prop changes
  useEffect(() => {
    if (transformer?.format) {
      setDisplayValue(transformer.format(value));
    } else {
      setDisplayValue(String(value ?? ''));
    }
  }, [value, transformer]);

  // Update internal error when error prop changes
  useEffect(() => {
    setInternalError(error);
  }, [error]);

  // Conditional rendering
  if (!show) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Clear error when user starts typing
    setInternalError(undefined);

    // Apply parser if provided
    let parsedValue: string | number = inputValue;
    if (transformer?.parse) {
      parsedValue = transformer.parse(inputValue);
    }

    onChange(parsedValue);
  };

  const handleBlur = () => {
    // Validate on blur if validation rules are provided
    if (validationRules) {
      const validationError = validateField(value, validationRules);
      setInternalError(validationError);
    }

    // Custom validation
    if (onValidate) {
      const validationError = onValidate(value);
      setInternalError(validationError);
    }
  };

  const inputId = `input-${name}`;
  const hasError = !!internalError;

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className={labelClassName}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      {helpText && <small>{helpText}</small>}

      <input
        type={type}
        id={inputId}
        name={name}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        className={`${inputClassName} ${hasError ? 'error' : ''} ${readOnly ? 'readonly' : ''}`.trim()}
        required={required}
      />

      {hasError && <span className={`error ${errorClassName}`.trim()}>{internalError}</span>}
    </div>
  );
};
