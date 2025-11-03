# Google Sheets Integration Guide

**Every form built with this scaffolding system can automatically submit to Google Sheets!**

This guide explains how to connect any form to Google Sheets using the built-in `useFormSubmission` hook.

## Table of Contents

1. [Quick Start](#quick-start)
2. [How It Works](#how-it-works)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Hook Options](#hook-options)
5. [Complete Examples](#complete-examples)
6. [Google Apps Script Setup](#google-apps-script-setup)
7. [Troubleshooting](#troubleshooting)

## Quick Start

**3 Simple Steps to Submit Any Form to Google Sheets:**

```tsx
import { useState, FormEvent } from 'react';
import { FormInput } from './components/form';
import { useFormSubmission } from './hooks/useFormSubmission';

export const MyForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  // 1. Use the hook
  const { submitForm, isSubmitting, submitSuccess, submitError } = useFormSubmission();

  // 2. Handle submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitForm(formData); // Sends to Google Sheets!
  };

  // 3. Build your form
  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        name="name"
        label="Name"
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
      />
      {submitError && <div className="error-message">{submitError}</div>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

**That's it!** Your form now submits to Google Sheets automatically.

## How It Works

The system provides a generic `useFormSubmission` hook that:

1. ✅ **Accepts ANY form data structure** - Works with any fields you define
2. ✅ **Submits to Google Sheets** - Uses the URL configured in `.env`
3. ✅ **Optionally submits to Backend** - For emails/logging (if DDEV is running)
4. ✅ **Handles loading states** - `isSubmitting`, `submitSuccess`, `submitError`
5. ✅ **Auto-adds metadata** - IP address, timestamp (configurable)
6. ✅ **Type-safe** - Full TypeScript support

## Step-by-Step Setup

### Step 1: Configure Google Sheets URL

Edit your `.env` file:

```bash
# Your Google Apps Script Web App URL
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### Step 2: Import the Hook

```tsx
import { useFormSubmission } from '../hooks/useFormSubmission';
```

### Step 3: Use the Hook in Your Component

```tsx
const { submitForm, isSubmitting, submitSuccess, submitError, resetSubmission } = useFormSubmission({
  onSuccess: () => {
    console.log('Form submitted successfully!');
  },
  onError: (error) => {
    console.error('Form submission failed:', error);
  },
});
```

### Step 4: Submit Your Form Data

```tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  const success = await submitForm(formData);
  if (success) {
    // Data is now in Google Sheets!
  }
};
```

### Step 5: Handle Success/Error States

```tsx
if (submitSuccess) {
  return <div className="success-message">Form submitted!</div>;
}

return (
  <form onSubmit={handleSubmit}>
    {/* Your form fields */}
    {submitError && <div className="error-message">{submitError}</div>}
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  </form>
);
```

## Hook Options

The `useFormSubmission` hook accepts an options object:

```tsx
interface UseFormSubmissionOptions {
  onSuccess?: () => void;              // Called when submission succeeds
  onError?: (error: string) => void;   // Called when submission fails
  includeBackend?: boolean;            // Submit to backend PHP (default: true)
  includeIpAddress?: boolean;          // Fetch and include IP address (default: true)
  includeTimestamp?: boolean;          // Include ISO timestamp (default: true)
}
```

### Examples:

**Basic usage (all defaults):**
```tsx
const { submitForm, isSubmitting } = useFormSubmission();
```

**With callbacks:**
```tsx
const { submitForm } = useFormSubmission({
  onSuccess: () => {
    alert('Form submitted successfully!');
    // Reset form, show message, etc.
  },
  onError: (error) => {
    console.error('Submission failed:', error);
  },
});
```

**Google Sheets only (no backend):**
```tsx
const { submitForm } = useFormSubmission({
  includeBackend: false,  // Skip backend submission
});
```

**Minimal metadata:**
```tsx
const { submitForm } = useFormSubmission({
  includeIpAddress: false,  // Don't fetch IP address
  includeTimestamp: false,  // Don't add timestamp
});
```

## Complete Examples

### Example 1: Simple Contact Form

```tsx
import { useState, FormEvent } from 'react';
import { FormInput, FormTextarea } from '../components/form';
import { useFormSubmission } from '../hooks/useFormSubmission';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const { submitForm, isSubmitting, submitSuccess, submitError, resetSubmission } = useFormSubmission();

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitForm(formData);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    resetSubmission();
  };

  if (submitSuccess) {
    return (
      <div className="success-message">
        <h2>Thank you for your message!</h2>
        <button onClick={handleReset}>Send Another Message</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="savings-form">
      <FormInput
        name="name"
        label="Name"
        value={formData.name}
        onChange={(value) => handleChange('name', value)}
        required
      />

      <FormInput
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => handleChange('email', value)}
        required
      />

      <FormTextarea
        name="message"
        label="Message"
        value={formData.message}
        onChange={(value) => handleChange('message', value)}
        required
        rows={5}
      />

      {submitError && (
        <div className="error-message">{submitError}</div>
      )}

      <button type="submit" className="button primary" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};
```

### Example 2: Newsletter Signup (Minimal)

```tsx
import { useState, FormEvent } from 'react';
import { FormInput } from '../components/form';
import { useFormSubmission } from '../hooks/useFormSubmission';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { submitForm, isSubmitting, submitSuccess } = useFormSubmission({
    includeBackend: false,  // Google Sheets only
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await submitForm({ email });
    if (success) setEmail('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        name="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
      {submitSuccess && <p>✓ Subscribed!</p>}
    </form>
  );
};
```

### Example 3: With Custom Validation

```tsx
import { useState, FormEvent } from 'react';
import { FormInput } from '../components/form';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { validateForm } from '../utils/validation';

export const SignupForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const { submitForm, isSubmitting, submitSuccess } = useFormSubmission();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Custom validation
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit to Google Sheets
    await submitForm(formData);
  };

  if (submitSuccess) {
    return <div>Account created!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        name="email"
        label="Email"
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        error={errors.email}
        required
      />
      <button type="submit" disabled={isSubmitting}>Sign Up</button>
    </form>
  );
};
```

## Google Apps Script Setup

To receive form submissions in Google Sheets, you need to create a Google Apps Script web app.

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it (e.g., "Form Submissions")

### Step 2: Create Apps Script

1. In your sheet, go to **Extensions > Apps Script**
2. Delete the default code
3. Paste this script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // If this is the first submission, add headers
    if (sheet.getLastRow() === 0) {
      const headers = Object.keys(data);
      sheet.appendRow(headers);
    }

    // Get headers to ensure correct column order
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Create row data in the same order as headers
    const rowData = headers.map(header => {
      const value = data[header];
      // Handle different data types
      if (value === null || value === undefined) return '';
      if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
      return String(value);
    });

    // Append the row
    sheet.appendRow(rowData);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data added successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Select **Web app**
4. Configure:
   - **Description:** "Form Submission Endpoint"
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**
6. Copy the **Web app URL** (it will look like: `https://script.google.com/macros/s/.../exec`)
7. Paste this URL into your `.env` file as `VITE_GOOGLE_SHEETS_URL`

### Step 4: Test It

```bash
# Start the dev server
pnpm dev

# Fill out and submit your form
# Check your Google Sheet - you should see a new row!
```

## Troubleshooting

### Issue: "Google Sheets: Unknown error"

**Solution:** Check that:
- Your Google Apps Script is deployed as a web app
- The URL in `.env` is correct
- The Apps Script has permission to edit the sheet

### Issue: Form submits but no data appears in sheet

**Solution:**
- Check the Apps Script execution logs (View > Execution log)
- Verify the script is parsing the data correctly
- Make sure you deployed the **latest version** of the script

### Issue: CORS errors in development

**Solution:** This is normal! Google Apps Script requires `no-cors` mode. The submission still works, you just can't read the response in development.

### Issue: Backend errors appear in console

**Solution:** This is expected if DDEV is not running. The form still works because it saves to Google Sheets (primary). Backend is optional for emails/logging.

### Issue: IP address shows as empty

**Solution:** The IP fetch service (ipify.org) might be blocked. You can disable it:

```tsx
const { submitForm } = useFormSubmission({
  includeIpAddress: false,
});
```

## Advanced: Custom Business Logic with useFormSubmission

If your form has complex business logic (calculations, dynamic fields, etc.), you can create a custom hook that USES `useFormSubmission` internally.

**Pattern: Custom Hook + Generic Submission**

```tsx
// src/hooks/useMyComplexForm.ts
import { useState, useEffect } from 'react';
import { useFormSubmission } from './useFormSubmission';

export const useMyComplexForm = () => {
  const [formData, setFormData] = useState({ price: 0, quantity: 1, total: 0 });

  // Use the generic submission hook
  const { submitForm, isSubmitting, submitSuccess, submitError, resetSubmission } = useFormSubmission();

  // Add your custom business logic
  useEffect(() => {
    // Auto-calculate total
    setFormData(prev => ({
      ...prev,
      total: prev.price * prev.quantity
    }));
  }, [formData.price, formData.quantity]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Your custom validation
    if (formData.price <= 0) {
      alert('Price must be positive');
      return;
    }

    // Submit using the generic hook
    await submitForm(formData);
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting,
    submitSuccess,
    submitError,
  };
};
```

**Real Example: See `src/hooks/useSavingsForm.ts`**

The Savings Form hook demonstrates this pattern:
- Uses `useFormSubmission` for submission
- Adds custom calculations (installments)
- Adds custom validation
- Adds dynamic field updates

This is the recommended pattern for complex forms!

## Advanced: Custom Data Transformation

If you need to transform data before sending to Google Sheets:

```tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  // Transform your data
  const transformedData = {
    ...formData,
    fullName: `${formData.firstName} ${formData.lastName}`,
    submittedAt: new Date().toLocaleString(),
  };

  await submitForm(transformedData);
};
```

## See Also

- **Live Examples:**
  - ⭐ **`src/examples/RegistrationFormBuilderExample.tsx`** - Complete FormBuilder example with all features
  - `src/components/SavingsForm.tsx` - Production form with custom hook
  - `src/examples/NewsletterFormExample.tsx` - Simple newsletter form
  - `src/examples/ContactFormExample.tsx` - Contact form with FormBuilder

- **Related Files:**
  - `src/hooks/useFormSubmission.ts` - The submission hook
  - `src/hooks/useSavingsForm.ts` - Example of custom hook pattern
  - `src/utils/api.ts` - Low-level API functions
  - `.env` - Configuration file

## Questions?

Check the main `FORM_SCAFFOLDING_GUIDE.md` for more information about building forms with the scaffolding system.
