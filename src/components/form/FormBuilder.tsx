import { FormBuilderProps, FormFieldConfig } from '../../types/formComponents.types';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormCheckbox } from './FormCheckbox';
import { FormRadioGroup } from './FormRadioGroup';
import { FormTextarea } from './FormTextarea';

/**
 * FormBuilder component - Renders forms from configuration objects
 *
 * This component allows you to build complete forms using a declarative configuration
 * instead of manually writing JSX for each field.
 *
 * @example
 * const formConfig = {
 *   sections: [
 *     {
 *       title: 'Personal Information',
 *       fields: [
 *         {
 *           fieldType: 'input',
 *           name: 'name',
 *           label: 'Full Name',
 *           type: 'text',
 *           required: true,
 *           validationRules: [validationRules.required()]
 *         },
 *         {
 *           fieldType: 'input',
 *           name: 'email',
 *           label: 'Email',
 *           type: 'email',
 *           required: true,
 *           validationRules: [validationRules.required(), validationRules.email()]
 *         }
 *       ]
 *     }
 *   ],
 *   submitButton: {
 *     label: 'Submit',
 *     loadingLabel: 'Submitting...'
 *   }
 * };
 *
 * <FormBuilder
 *   config={formConfig}
 *   formData={formData}
 *   errors={errors}
 *   onChange={handleChange}
 *   onSubmit={handleSubmit}
 *   isSubmitting={isSubmitting}
 * />
 */
export const FormBuilder = ({
  config,
  formData,
  errors = {},
  onChange,
  onSubmit,
  isSubmitting = false,
}: FormBuilderProps) => {
  const renderField = (field: FormFieldConfig) => {
    // Extract fieldType and spread the rest
    const { fieldType, ...fieldProps } = field;

    switch (fieldType) {
      case 'input': {
        const { value: _unused1, onChange: _unused2, ...props } = fieldProps as any;
        return (
          <FormInput
            key={field.name}
            {...props}
            error={errors[field.name]}
            value={formData[field.name] ?? ''}
            onChange={(value) => onChange(field.name, value)}
          />
        );
      }

      case 'select': {
        const { value: _unused1, onChange: _unused2, ...props } = fieldProps as any;
        return (
          <FormSelect
            key={field.name}
            {...props}
            error={errors[field.name]}
            value={formData[field.name] ?? ''}
            onChange={(value) => onChange(field.name, value)}
          />
        );
      }

      case 'checkbox': {
        const { checked: _unused1, onChange: _unused2, ...props } = fieldProps as any;
        return (
          <FormCheckbox
            key={field.name}
            {...props}
            error={errors[field.name]}
            checked={formData[field.name] ?? false}
            onChange={(checked) => onChange(field.name, checked)}
          />
        );
      }

      case 'radio': {
        const { value: _unused1, onChange: _unused2, ...props } = fieldProps as any;
        return (
          <FormRadioGroup
            key={field.name}
            {...props}
            error={errors[field.name]}
            value={formData[field.name] ?? ''}
            onChange={(value) => onChange(field.name, value)}
          />
        );
      }

      case 'textarea': {
        const { value: _unused1, onChange: _unused2, ...props } = fieldProps as any;
        return (
          <FormTextarea
            key={field.name}
            {...props}
            error={errors[field.name]}
            value={formData[field.name] ?? ''}
            onChange={(value) => onChange(field.name, value)}
          />
        );
      }

      default:
        console.warn(`Unknown field type: ${(field as any).fieldType}`);
        return null;
    }
  };

  return (
    <form onSubmit={onSubmit} className="savings-form" noValidate>
      {config.sections.map((section, sectionIndex) => {
        // Skip section if show is false
        if (section.show === false) {
          return null;
        }

        return (
          <div key={sectionIndex} className={`form-section ${section.className || ''}`.trim()}>
            {section.title && <h2>{section.title}</h2>}
            {section.description && <p>{section.description}</p>}

            {section.fields.map((field) => renderField(field))}
          </div>
        );
      })}

      {config.submitButton && (
        <button
          type="submit"
          className={`button primary ${config.submitButton.className || ''}`.trim()}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? config.submitButton.loadingLabel || 'Loading...'
            : config.submitButton.label || 'Submit'}
        </button>
      )}
    </form>
  );
};
