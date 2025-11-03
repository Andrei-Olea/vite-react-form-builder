# Form Scaffolding Guide

This guide explains how to use the form scaffolding system to quickly build new landing pages with forms.

## Table of Contents

1. [Overview](#overview)
2. [Available Components](#available-components)
3. [Two Approaches](#two-approaches)
4. [Quick Start](#quick-start)
5. [Component Reference](#component-reference)
6. [Validation](#validation)
7. [Examples](#examples)
8. [Advanced Features](#advanced-features)

## Overview

This form scaffolding system provides reusable form components that make it easy to build landing pages with forms. All form groups (label + input/select/checkbox/radio) have been converted into reusable components with built-in:

- **Validation** - Component-level validation with customizable rules
- **Error handling** - Automatic error display and clearing
- **Styling** - Pre-styled with existing CSS design system
- **Transformers** - Value formatting and parsing (e.g., currency)
- **Conditional rendering** - Show/hide fields based on conditions

## Available Components

Located in `src/components/form/`:

- **FormInput** - Text, email, password, number, tel, url inputs
- **FormSelect** - Dropdown selects with options
- **FormCheckbox** - Single checkbox with rich label support
- **FormRadioGroup** - Radio button groups (vertical/horizontal)
- **FormTextarea** - Multi-line text input with character counter
- **FormBuilder** - Config-driven form renderer

## Two Approaches

### 1. Component Composition (Direct JSX)

Best for: Forms with complex logic, custom layouts, or unique interactions

```tsx
import { FormInput, FormSelect, FormCheckbox } from '@/components/form';

<form onSubmit={handleSubmit}>
  <FormInput
    name="email"
    label="Email"
    type="email"
    value={formData.email}
    onChange={(value) => handleChange('email', value)}
    required
  />

  <FormSelect
    name="city"
    label="City"
    value={formData.city}
    onChange={(value) => handleChange('city', value)}
    options={cities}
  />

  <button type="submit">Submit</button>
</form>
```

### 2. Config-Driven (FormBuilder)

Best for: Simple forms, rapid prototyping, consistent structure

```tsx
import { FormBuilder, FormConfig } from '@/components/form';

const config: FormConfig = {
  sections: [
    {
      title: 'Contact Info',
      fields: [
        {
          fieldType: 'input',
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          value: '',
          onChange: () => {}
        }
      ]
    }
  ],
  submitButton: { label: 'Submit' }
};

<FormBuilder
  config={config}
  formData={formData}
  onChange={handleChange}
  onSubmit={handleSubmit}
/>
```

## Google Sheets Integration

**✨ All forms built with this scaffolding system can automatically submit to Google Sheets!**

We provide a generic `useFormSubmission` hook that makes it incredibly easy to send any form data to Google Sheets.

### Quick Example:

```tsx
import { useFormSubmission } from '../hooks/useFormSubmission';

const { submitForm, isSubmitting, submitSuccess, submitError } = useFormSubmission();

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  await submitForm(formData); // That's it! Data goes to Google Sheets
};
```

### Features:

- ✅ **Works with ANY form structure** - No special field requirements
- ✅ **3 lines of code** - Import hook, call `submitForm(formData)`, done!
- ✅ **Auto-adds metadata** - IP address, timestamp (configurable)
- ✅ **Dual submission** - Google Sheets (required) + Backend (optional)
- ✅ **Full error handling** - Loading states, success, errors all managed

### Complete Documentation:

👉 **See `GOOGLE_SHEETS_INTEGRATION.md` for:**
- Step-by-step setup guide
- Google Apps Script configuration
- Complete code examples
- Hook options and customization
- Troubleshooting tips

### Two Patterns for Google Sheets Integration:

**1. Direct Usage (Simple Forms):**
```tsx
// For simple forms without complex logic
const { submitForm } = useFormSubmission();
await submitForm(formData);
```
*See: `NewsletterFormExample.tsx`, `ContactFormExample.tsx`*

**2. Custom Hook Pattern (Complex Forms):**
```tsx
// For forms with calculations, dynamic fields, etc.
// Create a custom hook that USES useFormSubmission internally
export const useMyForm = () => {
  const { submitForm, ... } = useFormSubmission();
  // Add your business logic here
  return { ... };
};
```
*See: `useSavingsForm.ts` - Perfect example of this pattern!*

### Live Examples:

All example forms submit to Google Sheets automatically:

**FormBuilder Examples (Config-Driven):**
- **`src/examples/RegistrationFormBuilderExample.tsx`** - ⭐ COMPLETE FormBuilder example with all field types and validation
- `src/examples/ContactFormExample.tsx` - Simpler FormBuilder example

**Component Composition Examples:**
- **`src/components/SavingsForm.tsx`** - Production form with calculations and business logic
- **`src/hooks/useSavingsForm.ts`** - Custom hook pattern (recommended for complex forms)
- `src/examples/NewsletterFormExample.tsx` - Simple form with direct component usage

## Quick Start

### Step 1: Import Components

```tsx
// For component composition
import { FormInput, FormSelect, FormCheckbox, validationRules } from '@/components/form';

// For config-driven
import { FormBuilder, FormConfig, validationRules } from '@/components/form';
```

### Step 2: Set Up Form State

```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  subscribe: false
});

const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitting, setIsSubmitting] = useState(false);
```

### Step 3: Handle Changes

```tsx
const handleChange = (name: string, value: any) => {
  setFormData(prev => ({ ...prev, [name]: value }));
  // Clear error when user types
  if (errors[name]) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }
};
```

### Step 4: Handle Submission

```tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Your submission logic
    await submitToAPI(formData);
  } catch (error) {
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};
```

### Step 5: Build Your Form

See [Examples](#examples) section below.

## Component Reference

### FormInput

Text, email, password, number, tel, url inputs with validation and transformers.

**Props:**
```tsx
{
  name: string;                        // Field name (required)
  label?: string;                      // Label text
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string | number;              // Current value (required)
  onChange: (value: string | number) => void;  // Change handler (required)
  required?: boolean;                  // Mark as required
  disabled?: boolean;                  // Disable input
  readOnly?: boolean;                  // Make read-only
  placeholder?: string;                // Placeholder text
  error?: string;                      // External error message
  helpText?: string;                   // Help text below label
  validationRules?: ValidationRule[];  // Validation rules
  transformer?: ValueTransformer;      // Format/parse values
  className?: string;                  // Container class
  inputClassName?: string;             // Input element class
  show?: boolean;                      // Conditional rendering (default: true)
}
```

**Example:**
```tsx
<FormInput
  name="amount"
  label="Amount"
  value={formData.amount}
  onChange={(value) => handleChange('amount', value)}
  required
  transformer={{
    format: (value) => formatCurrency(value),
    parse: (value) => parseCurrency(value)
  }}
  validationRules={[
    validationRules.required(),
    validationRules.min(250000, 'Minimum $250,000')
  ]}
/>
```

### FormSelect

Dropdown select with options.

**Props:**
```tsx
{
  name: string;
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];             // Array of {value, label, disabled?}
  placeholder?: string;                // Placeholder option
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  validationRules?: ValidationRule[];
  className?: string;
  show?: boolean;
}
```

**Example:**
```tsx
<FormSelect
  name="frequency"
  label="Payment Frequency"
  value={formData.frequency}
  onChange={(value) => handleChange('frequency', value)}
  placeholder="Select frequency"
  options={[
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ]}
  required
/>
```

### FormCheckbox

Single checkbox with rich label support (can include links, formatted text).

**Props:**
```tsx
{
  name: string;
  label?: React.ReactNode;             // Simple label
  children?: React.ReactNode;          // Rich content label (preferred)
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  validationRules?: ValidationRule[];
  className?: string;
  show?: boolean;
}
```

**Example:**
```tsx
<FormCheckbox
  name="terms"
  checked={formData.terms}
  onChange={(checked) => handleChange('terms', checked)}
  required
  validationRules={[
    validationRules.custom(
      (value) => value === true,
      'You must accept the terms'
    )
  ]}
>
  I accept the <a href="/terms">Terms and Conditions</a>
</FormCheckbox>
```

### FormRadioGroup

Radio button group (vertical or horizontal layout).

**Props:**
```tsx
{
  name: string;
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: RadioOption[];              // Array of {value, label, disabled?}
  layout?: 'vertical' | 'horizontal'; // Default: 'vertical'
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  validationRules?: ValidationRule[];
  className?: string;
  show?: boolean;
}
```

**Example:**
```tsx
<FormRadioGroup
  name="contactMethod"
  label="Preferred Contact Method"
  value={formData.contactMethod}
  onChange={(value) => handleChange('contactMethod', value)}
  layout="horizontal"
  options={[
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' }
  ]}
  required
/>
```

### FormTextarea

Multi-line text input with optional character counter.

**Props:**
```tsx
{
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;                       // Default: 4
  maxLength?: number;                  // Show character counter if set
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  validationRules?: ValidationRule[];
  className?: string;
  show?: boolean;
}
```

**Example:**
```tsx
<FormTextarea
  name="message"
  label="Message"
  value={formData.message}
  onChange={(value) => handleChange('message', value)}
  rows={6}
  maxLength={500}
  placeholder="Enter your message..."
  validationRules={[
    validationRules.required(),
    validationRules.minLength(10, 'Minimum 10 characters')
  ]}
/>
```

## Validation

### Built-in Validation Rules

```tsx
import { validationRules } from '@/components/form';

// Required field
validationRules.required('Custom error message')

// Email validation
validationRules.email('Invalid email')

// Numeric min/max
validationRules.min(100, 'Minimum 100')
validationRules.max(1000, 'Maximum 1000')

// String length
validationRules.minLength(5, 'At least 5 characters')
validationRules.maxLength(100, 'Max 100 characters')

// Pattern matching
validationRules.pattern(/^\d{3}-\d{3}-\d{4}$/, 'Format: XXX-XXX-XXXX')

// Custom validation
validationRules.custom(
  (value) => value > 0,
  'Must be positive'
)
```

### Using Validation

```tsx
<FormInput
  name="email"
  label="Email"
  value={formData.email}
  onChange={(value) => handleChange('email', value)}
  validationRules={[
    validationRules.required('Email is required'),
    validationRules.email()
  ]}
/>
```

### Custom Validation Function

```tsx
<FormInput
  name="username"
  label="Username"
  value={formData.username}
  onChange={(value) => handleChange('username', value)}
  onValidate={(value) => {
    if (value.includes(' ')) {
      return 'Username cannot contain spaces';
    }
    return undefined; // No error
  }}
/>
```

## Examples

### Example 1: Contact Form (Config-Driven)

See `src/examples/ContactFormExample.tsx` for a complete contact form using FormBuilder.

### Example 2: Newsletter Signup (Component Composition)

See `src/examples/NewsletterFormExample.tsx` for a newsletter form using direct component composition.

### Example 3: Simple Login Form

```tsx
import { FormInput, FormCheckbox, validationRules } from '@/components/form';

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Handle login
  };

  return (
    <form onSubmit={handleSubmit} className="savings-form">
      <div className="form-section">
        <h2>Sign In</h2>

        <FormInput
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => handleChange('email', value)}
          required
          validationRules={[
            validationRules.required(),
            validationRules.email()
          ]}
        />

        <FormInput
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => handleChange('password', value)}
          required
          validationRules={[
            validationRules.required(),
            validationRules.minLength(8, 'Password must be at least 8 characters')
          ]}
        />

        <FormCheckbox
          name="remember"
          label="Remember me"
          checked={formData.remember}
          onChange={(checked) => handleChange('remember', checked)}
        />

        <button type="submit" className="button primary">
          Sign In
        </button>
      </div>
    </form>
  );
};
```

## Advanced Features

### Conditional Rendering

Show/hide fields based on conditions:

```tsx
<FormInput
  name="otherOption"
  label="Please specify"
  value={formData.otherOption}
  onChange={(value) => handleChange('otherOption', value)}
  show={formData.option === 'other'} // Only show if option is 'other'
/>
```

### Value Transformers

Format display values and parse input:

```tsx
import { formatCurrency, parseCurrency } from '@/utils/calculations';

<FormInput
  name="price"
  label="Price"
  value={formData.price}
  onChange={(value) => handleChange('price', value)}
  transformer={{
    format: (value) => formatCurrency(value),  // Display as $1,000
    parse: (value) => parseCurrency(value)     // Parse to 1000
  }}
/>
```

### Custom Styling

Override default styles:

```tsx
<FormInput
  name="email"
  label="Email"
  value={formData.email}
  onChange={(value) => handleChange('email', value)}
  className="my-custom-group"      // Container class
  labelClassName="my-label"        // Label class
  inputClassName="my-input"        // Input element class
  errorClassName="my-error"        // Error message class
/>
```

### Read-Only Fields (Calculated Values)

```tsx
<FormInput
  name="total"
  label="Total Amount"
  value={calculateTotal(formData)}
  onChange={() => {}} // Required but won't be called
  readOnly
/>
```

### Help Text

Add helpful hints below labels:

```tsx
<FormInput
  name="phone"
  label="Phone Number"
  value={formData.phone}
  onChange={(value) => handleChange('phone', value)}
  helpText="We'll only call if there's an issue with your order"
/>
```

## Best Practices

1. **Use TypeScript** - Leverage the type definitions for better autocompletion and type safety
2. **Clear errors on change** - Clear field errors when user starts typing
3. **Validate on blur** - Components validate automatically on blur
4. **Use validationRules** - Prefer built-in validation rules over custom logic
5. **Choose the right approach** - Use component composition for complex forms, FormBuilder for simple ones
6. **Consistent naming** - Use clear, descriptive field names
7. **Required indicators** - Always mark required fields
8. **Helpful errors** - Provide clear, actionable error messages

## File Structure

```
src/
├── components/
│   └── form/
│       ├── FormInput.tsx         # Input component
│       ├── FormSelect.tsx        # Select component
│       ├── FormCheckbox.tsx      # Checkbox component
│       ├── FormRadioGroup.tsx    # Radio group component
│       ├── FormTextarea.tsx      # Textarea component
│       ├── FormBuilder.tsx       # Config-driven form renderer
│       └── index.ts              # Exports all components
├── types/
│   └── formComponents.types.ts   # TypeScript definitions
├── utils/
│   └── componentValidation.ts    # Validation utilities
└── examples/
    ├── ContactFormExample.tsx    # Config-driven example
    └── NewsletterFormExample.tsx # Component composition example
```

## Need Help?

- Check the examples in `src/examples/`
- Look at component JSDoc comments for inline documentation
- Review the existing `SavingsForm.tsx` for reference
- Check type definitions in `src/types/formComponents.types.ts`
