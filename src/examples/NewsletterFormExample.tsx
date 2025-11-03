/**
 * Example: Newsletter Signup using Component Composition Approach
 *
 * This example demonstrates building a form by directly composing
 * form components in JSX (not using FormBuilder config).
 */

import { useState, FormEvent } from 'react';
import { FormInput, FormSelect, FormCheckbox, validationRules } from '../components/form';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { validateField } from '../utils/componentValidation';

/**
 * Newsletter Form Example - Now submits to Google Sheets!
 *
 * This example demonstrates:
 * 1. Using form scaffolding components
 * 2. Submitting to Google Sheets using the generic useFormSubmission hook
 * 3. All data is automatically sent to the Google Sheets URL configured in .env
 */
export const NewsletterFormExample = () => {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    lastName: '',
    email: '',
    interests: '',
    frequency: '',
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use the generic submission hook - automatically handles Google Sheets + Backend
  const { submitForm, isSubmitting, submitSuccess, submitError, resetSubmission } = useFormSubmission({
    onSuccess: () => {
      console.log('Newsletter signup successful!');
    },
    onError: (error) => {
      console.error('Newsletter signup failed:', error);
    },
  });

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const validationErrors: Record<string, string> = {};

    // Validate nombre_completo
    const nombreError = validateField(formData.nombre_completo, [
      validationRules.required('First name is required'),
      validationRules.minLength(2, 'Must be at least 2 characters'),
    ]);
    if (nombreError) validationErrors.nombre_completo = nombreError;

    // Validate email
    const emailError = validateField(formData.email, [
      validationRules.required('Email is required'),
      validationRules.email(),
    ]);
    if (emailError) validationErrors.email = emailError;

    // Validate interests
    const interestsError = validateField(formData.interests, [
      validationRules.required('Please select an interest'),
    ]);
    if (interestsError) validationErrors.interests = interestsError;

    // Validate frequency
    const frequencyError = validateField(formData.frequency, [
      validationRules.required('Please select a frequency'),
    ]);
    if (frequencyError) validationErrors.frequency = frequencyError;

    // Validate terms checkbox
    const termsError = validateField(formData.terms, [
      validationRules.custom((value) => value === true, 'You must accept the terms'),
    ]);
    if (termsError) validationErrors.terms = termsError;

    // If there are validation errors, show them and don't submit
    if (Object.keys(validationErrors).length > 0) {
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
      nombre_completo: '',
      lastName: '',
      email: '',
      interests: '',
      frequency: '',
      terms: false,
    });
    setErrors({});
    resetSubmission();
  };

  if (submitSuccess) {
    return (
      <div className="success-message">
        <h2>Welcome to our newsletter!</h2>
        <p>Check your email to confirm your subscription.</p>
        <button onClick={resetForm} className="button secondary">
          Subscribe Another Email
        </button>
      </div>
    );
  }

  return (
    <div className="savings-form-container">
      <div className="form-header">
        <h1>Subscribe to Our Newsletter</h1>
        <p>Stay updated with our latest news and offers</p>
      </div>

      <form onSubmit={handleSubmit} className="savings-form" noValidate>
        {/* Personal Information Section */}
        <div className="form-section">
          <h2>Your Information</h2>

          <FormInput
            name="nombre_completo"
            label="Nombre Completo"
            type="text"
            value={formData.nombre_completo}
            onChange={(value) => handleChange('nombre_completo', value)}
            error={errors.nombre_completo}
            required
            placeholder="John"
            validationRules={[
              validationRules.required('First name is required'),
              validationRules.minLength(2, 'Must be at least 2 characters'),
            ]}
          />

          <FormInput
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            error={errors.email}
            required
            placeholder="john@example.com"
            validationRules={[
              validationRules.required('Email is required'),
              validationRules.email(),
            ]}
          />
        </div>

        {/* Preferences Section */}
        <div className="form-section">
          <h2>Newsletter Preferences</h2>

          <FormSelect
            name="interests"
            label="Primary Interest"
            value={formData.interests}
            onChange={(value) => handleChange('interests', value)}
            error={errors.interests}
            required
            placeholder="Select your interest"
            options={[
              { value: 'tech', label: 'Technology' },
              { value: 'business', label: 'Business' },
              { value: 'lifestyle', label: 'Lifestyle' },
              { value: 'finance', label: 'Finance' },
            ]}
            validationRules={[validationRules.required('Please select an interest')]}
          />

          <FormSelect
            name="frequency"
            label="Email Frequency"
            value={formData.frequency}
            onChange={(value) => handleChange('frequency', value)}
            error={errors.frequency}
            required
            placeholder="How often?"
            options={[
              { value: 'daily', label: 'Daily Digest' },
              { value: 'weekly', label: 'Weekly Summary' },
              { value: 'monthly', label: 'Monthly Newsletter' },
            ]}
            helpText="You can change this preference anytime"
            validationRules={[validationRules.required('Please select a frequency')]}
          />
        </div>

        {/* Terms Checkbox */}
        <FormCheckbox
          name="terms"
          checked={formData.terms}
          onChange={(checked) => handleChange('terms', checked)}
          error={errors.terms}
          required
          validationRules={[
            validationRules.custom((value) => value === true, 'You must accept the terms'),
          ]}
        >
          I agree to receive marketing emails and accept the{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </FormCheckbox>

        {/* Submit Error */}
        {submitError && (
          <div className="error-message">
            <p>{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="button primary" disabled={isSubmitting}>
          {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
        </button>
      </form>
    </div>
  );
};
