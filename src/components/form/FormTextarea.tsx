import { useEffect, useState } from 'react';
import { FormTextareaProps } from '../../types/formComponents.types';
import { validateField } from '../../utils/componentValidation';

/**
 * Reusable textarea component with validation
 *
 * @example
 * // Basic usage
 * <FormTextarea
 *   name="comments"
 *   label="Comments"
 *   value={formData.comments}
 *   onChange={(value) => setFormData({ ...formData, comments: value })}
 *   rows={5}
 * />
 *
 * @example
 * // With validation and character limit
 * <FormTextarea
 *   name="description"
 *   label="Description"
 *   value={formData.description}
 *   onChange={(value) => handleChange('description', value)}
 *   placeholder="Enter a description..."
 *   maxLength={500}
 *   validationRules={[
 *     validationRules.required(),
 *     validationRules.minLength(10, 'Description must be at least 10 characters')
 *   ]}
 * />
 */
export const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  rows = 4,
  maxLength,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  show = true,
  helpText,
  validationRules,
  onValidate,
}: FormTextareaProps) => {
  const [internalError, setInternalError] = useState<string | undefined>(error);

  // Update internal error when error prop changes
  useEffect(() => {
    setInternalError(error);
  }, [error]);

  // Conditional rendering
  if (!show) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    // Clear error when user starts typing
    setInternalError(undefined);

    onChange(inputValue);
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

  const textareaId = `textarea-${name}`;
  const hasError = !!internalError;
  const currentLength = value?.length || 0;
  const showCharCount = maxLength !== undefined;

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={textareaId} className={labelClassName}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      {helpText && <small>{helpText}</small>}

      <textarea
        id={textareaId}
        name={name}
        value={value ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`${inputClassName} ${hasError ? 'error' : ''}`.trim()}
        required={required}
      />

      {showCharCount && (
        <small className="char-count">
          {currentLength} / {maxLength} caracteres
        </small>
      )}

      {hasError && <span className={`error ${errorClassName}`.trim()}>{internalError}</span>}
    </div>
  );
};
