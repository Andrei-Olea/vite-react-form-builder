/**
 * Example: Newsletter Signup using Component Composition Approach
 *
 * This example demonstrates building a form by directly composing
 * form components in JSX (not using FormBuilder config).
 */

import { useState, FormEvent } from 'react';
import { FormInput, FormSelect, FormCheckbox, validationRules } from '../components/form';

export const NewsletterFormExample = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interests: '',
    frequency: '',
    terms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Newsletter signup:', formData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      interests: '',
      frequency: '',
      terms: false,
    });
    setSubmitSuccess(false);
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
            name="firstName"
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={(value) => handleChange('firstName', value)}
            required
            placeholder="John"
            validationRules={[
              validationRules.required('First name is required'),
              validationRules.minLength(2, 'Must be at least 2 characters'),
            ]}
          />

          <FormInput
            name="lastName"
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={(value) => handleChange('lastName', value)}
            required
            placeholder="Doe"
            validationRules={[validationRules.required('Last name is required')]}
          />

          <FormInput
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
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

        {/* Submit Button */}
        <button type="submit" className="button primary" disabled={isSubmitting}>
          {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
        </button>
      </form>
    </div>
  );
};
