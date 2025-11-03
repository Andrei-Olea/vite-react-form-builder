import { useEffect, useState } from 'react';
import { FormRadioGroupProps } from '../../types/formComponents.types';
import { validateField } from '../../utils/componentValidation';

/**
 * Reusable radio button group component with validation
 *
 * @example
 * // Basic usage
 * <FormRadioGroup
 *   name="paymentMethod"
 *   label="Payment Method"
 *   value={formData.paymentMethod}
 *   onChange={(value) => setFormData({ ...formData, paymentMethod: value })}
 *   options={[
 *     { value: 'credit', label: 'Credit Card' },
 *     { value: 'debit', label: 'Debit Card' },
 *     { value: 'cash', label: 'Cash' }
 *   ]}
 *   required
 * />
 *
 * @example
 * // Horizontal layout with validation
 * <FormRadioGroup
 *   name="size"
 *   label="Size"
 *   value={formData.size}
 *   onChange={(value) => handleChange('size', value)}
 *   options={[
 *     { value: 's', label: 'Small' },
 *     { value: 'm', label: 'Medium' },
 *     { value: 'l', label: 'Large' }
 *   ]}
 *   layout="horizontal"
 *   validationRules={[validationRules.required('Please select a size')]}
 * />
 */
export const FormRadioGroup = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  layout = 'vertical',
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  show = true,
  helpText,
  validationRules,
  onValidate,
}: FormRadioGroupProps) => {
  const [internalError, setInternalError] = useState<string | undefined>(error);

  // Update internal error when error prop changes
  useEffect(() => {
    setInternalError(error);
  }, [error]);

  // Conditional rendering
  if (!show) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const hasError = !!internalError;
  const layoutClass = layout === 'horizontal' ? 'radio-group-horizontal' : 'radio-group-vertical';

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label className={labelClassName}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      {helpText && <small>{helpText}</small>}

      <div className={`radio-group ${layoutClass}`.trim()}>
        {options.map((option) => {
          const radioId = `radio-${name}-${option.value}`;
          return (
            <label key={option.value} htmlFor={radioId} className="radio-option">
              <input
                type="radio"
                id={radioId}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled || option.disabled}
                className={inputClassName}
                required={required}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>

      {hasError && <span className={`error ${errorClassName}`.trim()}>{internalError}</span>}
    </div>
  );
};
