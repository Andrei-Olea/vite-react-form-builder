/**
 * Example: Contact Form using Config-Driven Approach
 *
 * This example demonstrates how to quickly scaffold a contact form
 * using the FormBuilder component with a configuration object.
 */

import { useState, FormEvent } from 'react';
import { FormBuilder, FormConfig, validationRules } from '../components/form';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
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
    setSubmitSuccess(false);
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
