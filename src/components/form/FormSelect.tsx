import { useEffect, useState } from 'react';
import { FormSelectProps } from '../../types/formComponents.types';
import { validateField } from '../../utils/componentValidation';

/**
 * Reusable select/dropdown component with validation
 *
 * @example
 * // Basic usage
 * <FormSelect
 *   name="frequency"
 *   label="Payment Frequency"
 *   value={formData.frequency}
 *   onChange={(value) => setFormData({ ...formData, frequency: value })}
 *   options={[
 *     { value: 'monthly', label: 'Monthly' },
 *     { value: 'yearly', label: 'Yearly' }
 *   ]}
 *   required
 * />
 *
 * @example
 * // With placeholder and validation
 * <FormSelect
 *   name="city"
 *   label="City"
 *   value={formData.city}
 *   onChange={(value) => handleChange('city', value)}
 *   placeholder="Select a city"
 *   options={cities}
 *   validationRules={[validationRules.required('Please select a city')]}
 * />
 */
export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  placeholder,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  show = true,
  helpText,
  validationRules,
  onValidate,
}: FormSelectProps) => {
  const [internalError, setInternalError] = useState<string | undefined>(error);

  // Update internal error when error prop changes
  useEffect(() => {
    setInternalError(error);
  }, [error]);

  // Conditional rendering
  if (!show) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    // Clear error when user makes a selection
    setInternalError(undefined);

    // Convert to number if the original value was a number
    const parsedValue = typeof value === 'number' ? Number(selectedValue) : selectedValue;

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

  const selectId = `select-${name}`;
  const hasError = !!internalError;

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className={labelClassName}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      {helpText && <small>{helpText}</small>}

      <select
        id={selectId}
        name={name}
        value={value ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`${inputClassName} ${hasError ? 'error' : ''}`.trim()}
        required={required}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      {hasError && <span className={`error ${errorClassName}`.trim()}>{internalError}</span>}
    </div>
  );
};
