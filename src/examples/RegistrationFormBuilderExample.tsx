/**
 * Example: Registration Form using FormBuilder (Config-Driven)
 *
 * This example demonstrates the EASIEST way to build a form:
 * 1. Define your form as a configuration object
 * 2. FormBuilder handles all the rendering
 * 3. Validation rules are part of the config
 * 4. Automatically submits to Google Sheets
 *
 * This approach is perfect for:
 * - Forms with standard layouts
 * - Rapid prototyping
 * - Consistent structure across multiple forms
 */

import { useState, FormEvent } from 'react';
import { FormBuilder, FormConfig, validationRules } from '../components/form';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { validateFormConfig, hasValidationErrors } from '../utils/formBuilderValidation';

export const RegistrationFormBuilderExample = () => {
  // 1. Define your form data structure
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Account Info
    username: '',
    password: '',
    confirmPassword: '',

    // Preferences
    country: '',
    interests: '',
    comments: '',

    // Agreements
    contactMethod: '',
    newsletter: false,
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 2. Use the submission hook (sends to Google Sheets automatically)
  const { submitForm, isSubmitting, submitSuccess, submitError, resetSubmission } = useFormSubmission({
    onSuccess: () => {
      console.log('Registration successful! Data is in Google Sheets.');
    },
  });

  // 3. Define your form configuration
  const formConfig: FormConfig = {
    sections: [
      // SECTION 1: Personal Information
      {
        title: 'Personal Information',
        description: 'Please provide your personal details',
        fields: [
          {
            fieldType: 'input',
            name: 'nombre_completo',
            label: 'Full Name',
            type: 'text',
            value: '',
            onChange: () => {},
            required: true,
            placeholder: 'John',
            validationRules: [
              validationRules.required('First name is required'),
              validationRules.minLength(2, 'Must be at least 2 characters'),
              validationRules.maxLength(50, 'Must be less than 50 characters'),
            ],
          },
          {
            fieldType: 'input',
            name: 'lastName',
            label: 'Last Name',
            type: 'text',
            value: '',
            onChange: () => {},
            required: true,
            placeholder: 'Doe',
            validationRules: [
              validationRules.required('Last name is required'),
              validationRules.minLength(2, 'Must be at least 2 characters'),
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
            placeholder: 'john.doe@example.com',
            helpText: 'We will send a confirmation email to this address',
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
            placeholder: '+1 (555) 123-4567',
            helpText: 'Optional - For account recovery only',
            validationRules: [
              validationRules.pattern(
                /^[\d\s\-\+\(\)]+$/,
                'Please enter a valid phone number'
              ),
            ],
          },
        ],
      },

      // SECTION 2: Account Information
      {
        title: 'Account Information',
        description: 'Choose your username and password',
        fields: [
          {
            fieldType: 'input',
            name: 'username',
            label: 'Username',
            type: 'text',
            value: '',
            onChange: () => {},
            required: true,
            placeholder: 'johndoe123',
            validationRules: [
              validationRules.required('Username is required'),
              validationRules.minLength(4, 'Username must be at least 4 characters'),
              validationRules.maxLength(20, 'Username must be less than 20 characters'),
              validationRules.pattern(
                /^[a-zA-Z0-9_]+$/,
                'Username can only contain letters, numbers, and underscores'
              ),
            ],
          },
          {
            fieldType: 'input',
            name: 'password',
            label: 'Password',
            type: 'password',
            value: '',
            onChange: () => {},
            required: true,
            helpText: 'Must be at least 8 characters',
            validationRules: [
              validationRules.required('Password is required'),
              validationRules.minLength(8, 'Password must be at least 8 characters'),
              validationRules.custom(
                (value) => /[A-Z]/.test(value),
                'Password must contain at least one uppercase letter'
              ),
              validationRules.custom(
                (value) => /[a-z]/.test(value),
                'Password must contain at least one lowercase letter'
              ),
              validationRules.custom(
                (value) => /[0-9]/.test(value),
                'Password must contain at least one number'
              ),
            ],
          },
          {
            fieldType: 'input',
            name: 'confirmPassword',
            label: 'Confirm Password',
            type: 'password',
            value: '',
            onChange: () => {},
            required: true,
            validationRules: [
              validationRules.required('Please confirm your password'),
            ],
          },
        ],
      },

      // SECTION 3: Preferences
      {
        title: 'Preferences',
        description: 'Tell us more about yourself',
        fields: [
          {
            fieldType: 'select',
            name: 'country',
            label: 'Country',
            value: '',
            onChange: () => {},
            required: true,
            placeholder: 'Select your country',
            options: [
              { value: 'us', label: 'United States' },
              { value: 'ca', label: 'Canada' },
              { value: 'mx', label: 'Mexico' },
              { value: 'co', label: 'Colombia' },
              { value: 'ar', label: 'Argentina' },
              { value: 'br', label: 'Brazil' },
              { value: 'uk', label: 'United Kingdom' },
              { value: 'other', label: 'Other' },
            ],
            validationRules: [
              validationRules.required('Please select your country'),
            ],
          },
          {
            fieldType: 'select',
            name: 'interests',
            label: 'Primary Interest',
            value: '',
            onChange: () => {},
            required: true,
            placeholder: 'What brings you here?',
            options: [
              { value: 'tech', label: 'Technology' },
              { value: 'business', label: 'Business' },
              { value: 'education', label: 'Education' },
              { value: 'health', label: 'Health & Wellness' },
              { value: 'finance', label: 'Finance' },
              { value: 'other', label: 'Other' },
            ],
            validationRules: [
              validationRules.required('Please select your primary interest'),
            ],
          },
          {
            fieldType: 'textarea',
            name: 'comments',
            label: 'Additional Comments',
            value: '',
            onChange: () => {},
            placeholder: 'Tell us anything else you would like us to know...',
            rows: 4,
            maxLength: 500,
            helpText: 'Optional - Share your thoughts or questions',
          },
        ],
      },

      // SECTION 4: Communication Preferences
      {
        title: 'Communication Preferences',
        fields: [
          {
            fieldType: 'radio',
            name: 'contactMethod',
            label: 'Preferred Contact Method',
            value: '',
            onChange: () => {},
            required: true,
            layout: 'horizontal',
            options: [
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
              { value: 'sms', label: 'SMS' },
            ],
            validationRules: [
              validationRules.required('Please select a contact method'),
            ],
          },
          {
            fieldType: 'checkbox',
            name: 'newsletter',
            label: 'Subscribe to our newsletter for updates and special offers',
            checked: false,
            onChange: () => {},
          },
          {
            fieldType: 'checkbox',
            name: 'terms',
            label: 'I agree to the Terms of Service and Privacy Policy',
            checked: false,
            onChange: () => {},
            required: true,
            validationRules: [
              validationRules.custom(
                (value) => value === true,
                'You must accept the terms to continue'
              ),
            ],
          },
        ],
      },
    ],
    submitButton: {
      label: 'Create Account',
      loadingLabel: 'Creating Account...',
    },
  };

  // 4. Handle form changes
  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 5. Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // IMPORTANT: Validate form data against config before submission
    const validationErrors = validateFormConfig(formData, formConfig);

    // Custom validation: Check if passwords match
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    // If there are validation errors, show them and don't submit
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      console.warn('Form has validation errors:', validationErrors);
      return;
    }

    // Clear any previous errors
    setErrors({});

    // Submit to Google Sheets (configured in .env)
    const success = await submitForm(formData);

    if (success) {
      console.log('Registration data saved to Google Sheets:', formData);
    }
  };

  // 6. Reset form after successful submission
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      confirmPassword: '',
      country: '',
      interests: '',
      comments: '',
      contactMethod: '',
      newsletter: false,
      terms: false,
    });
    resetSubmission();
    setErrors({});
  };

  // Success state
  if (submitSuccess) {
    return (
      <div className="success-message">
        <h2>Registration Successful!</h2>
        <p>Your account has been created and data saved to Google Sheets.</p>
        <p>Check your email for a confirmation message.</p>
        <button onClick={resetForm} className="button secondary">
          Register Another Account
        </button>
      </div>
    );
  }

  // Form UI
  return (
    <div className="savings-form-container">
      <div className="form-header">
        <h1>Create Your Account</h1>
        <p>Join us today - it only takes a minute!</p>
      </div>

      {/* Global submit error */}
      {submitError && (
        <div className="error-message">
          <p>{submitError}</p>
        </div>
      )}

      {/* This is it! FormBuilder renders the entire form from config */}
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
