/**
 * Example: Contact Form using Config-Driven Approach
 *
 * This example demonstrates how to quickly scaffold a contact form
 * using the FormBuilder component with a configuration object.
 */

import { useState, FormEvent } from 'react';
import { FormBuilder, FormConfig, validationRules } from '../components/form';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { validateFormConfig, hasValidationErrors } from '../utils/formBuilderValidation';

/**
 * Contact Form Example - Now submits to Google Sheets!
 *
 * This example demonstrates:
 * 1. Using FormBuilder (config-driven approach)
 * 2. Submitting to Google Sheets using the generic useFormSubmission hook
 * 3. All data is automatically sent to the Google Sheets URL configured in .env
 */
export const ContactFormExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactPreference: '',
    newsletter: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use the generic submission hook - automatically handles Google Sheets + Backend
  const { submitForm, isSubmitting, submitSuccess, submitError, resetSubmission } = useFormSubmission({
    onSuccess: () => {
      console.log('Contact form submitted successfully!');
    },
    onError: (error) => {
      console.error('Contact form submission failed:', error);
    },
  });

  // Define form configuration
  const formConfig: FormConfig = {
    sections: [
      {
        title: 'Contact Information',
        description: 'Please provide your contact details',
        fields: [
          {
            fieldType: 'input',
            name: 'name',
            label: 'Full Name',
            type: 'text',
            value: '',
            onChange: () => {},
            required: true,
            placeholder: 'John Doe',
            validationRules: [
              validationRules.required('Name is required'),
              validationRules.minLength(2, 'Name must be at least 2 characters'),
            ],
          },
          {
            fieldType: 'input',
            name: 'email',
            label: 'Email Address',
            type: 'email',
            value: '',
            onChange: () => {},
            required: true,
            placeholder: 'john@example.com',
            validationRules: [
              validationRules.required('Email is required'),
              validationRules.email(),
            ],
          },
          {
            fieldType: 'input',
            name: 'phone',
            label: 'Phone Number',
            type: 'tel',
            value: '',
            onChange: () => {},
            placeholder: '(555) 123-4567',
            helpText: 'Optional - We will only call if necessary',
          },
        ],
      },
      {
        title: 'Your Message',
        fields: [
          {
            fieldType: 'select',
            name: 'subject',
            label: 'Subject',
            value: '',
            onChange: () => {},
            required: true,
            placeholder: 'Select a subject',
            options: [
              { value: 'general', label: 'General Inquiry' },
              { value: 'support', label: 'Technical Support' },
              { value: 'sales', label: 'Sales Question' },
              { value: 'feedback', label: 'Feedback' },
            ],
            validationRules: [validationRules.required('Please select a subject')],
          },
          {
            fieldType: 'textarea',
            name: 'message',
            label: 'Message',
            value: '',
            onChange: () => {},
            required: true,
            placeholder: 'How can we help you?',
            rows: 6,
            maxLength: 1000,
            validationRules: [
              validationRules.required('Message is required'),
              validationRules.minLength(10, 'Message must be at least 10 characters'),
            ],
          },
          {
            fieldType: 'radio',
            name: 'contactPreference',
            label: 'Preferred Contact Method',
            value: '',
            onChange: () => {},
            required: true,
            layout: 'horizontal',
            options: [
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
            ],
            validationRules: [validationRules.required('Please select a contact preference')],
          },
          {
            fieldType: 'checkbox',
            name: 'newsletter',
            label: 'Subscribe to our newsletter for updates and special offers',
            checked: false,
            onChange: () => {},
          },
        ],
      },
    ],
    submitButton: {
      label: 'Send Message',
      loadingLabel: 'Sending...',
    },
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form data against config before submission
    const validationErrors = validateFormConfig(formData, formConfig);

    // If there are validation errors, show them and don't submit
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      console.warn('Form has validation errors:', validationErrors);
      return;
    }

    // Clear any previous errors
    setErrors({});

    // Submit to Google Sheets (and backend if enabled)
    const success = await submitForm(formData);

    if (success) {
      // Form data is now in Google Sheets!
      console.log('Data saved to Google Sheets:', formData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      contactPreference: '',
      newsletter: false,
    });
    resetSubmission();
    setErrors({});
  };

  if (submitSuccess) {
    return (
      <div className="success-message">
        <h2>Thank you for contacting us!</h2>
        <p>We will get back to you soon.</p>
        <button onClick={resetForm} className="button secondary">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="savings-form-container">
      <div className="form-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="error-message">
          <p>{submitError}</p>
        </div>
      )}

      <FormBuilder
        config={formConfig}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
