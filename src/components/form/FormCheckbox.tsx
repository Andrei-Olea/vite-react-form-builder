import { useEffect, useState } from 'react';
import { FormCheckboxProps } from '../../types/formComponents.types';
import { validateField } from '../../utils/componentValidation';

/**
 * Reusable checkbox component with validation
 *
 * @example
 * // Basic usage with label prop
 * <FormCheckbox
 *   name="terms"
 *   label="I accept the terms and conditions"
 *   checked={formData.terms}
 *   onChange={(checked) => setFormData({ ...formData, terms: checked })}
 *   required
 * />
 *
 * @example
 * // With children (allows rich content like links)
 * <FormCheckbox
 *   name="privacy"
 *   checked={formData.privacy}
 *   onChange={(checked) => handleChange('privacy', checked)}
 *   required
 * >
 *   I accept the{' '}
 *   <a href="/privacy" target="_blank">Privacy Policy</a>
 * </FormCheckbox>
 *
 * @example
 * // With custom validation
 * <FormCheckbox
 *   name="agree"
 *   label="I agree to proceed"
 *   checked={formData.agree}
 *   onChange={(checked) => handleChange('agree', checked)}
 *   validationRules={[
 *     validationRules.custom(
 *       (value) => value === true,
 *       'You must agree to continue'
 *     )
 *   ]}
 * />
 */
export const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  show = true,
  helpText,
  validationRules,
  onValidate,
  children,
}: FormCheckboxProps) => {
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
    const isChecked = e.target.checked;

    // Clear error when user interacts
    setInternalError(undefined);

    onChange(isChecked);
  };

  const handleBlur = () => {
    // Validate on blur if validation rules are provided
    if (validationRules) {
      const validationError = validateField(checked, validationRules);
      setInternalError(validationError);
    }

    // Custom validation
    if (onValidate) {
      const validationError = onValidate(checked);
      setInternalError(validationError);
    }
  };

  const checkboxId = `checkbox-${name}`;
  const hasError = !!internalError;

  // Use children if provided, otherwise use label
  const labelContent = children || label;

  return (
    <div className={`form-group checkbox-group ${className}`.trim()}>
      <label htmlFor={checkboxId} className={labelClassName}>
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked || false}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={inputClassName}
          required={required}
        />
        <span>{labelContent}</span>
      </label>

      {helpText && <small>{helpText}</small>}

      {hasError && <span className={`error ${errorClassName}`.trim()}>{internalError}</span>}
    </div>
  );
};
