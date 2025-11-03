# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Form Scaffolding System** for quickly building landing pages with forms. Includes reusable form components and supports both component composition and config-driven approaches.

Originally built as a savings program enrollment form for Codecol, now refactored as a form builder starter kit. Built with React, TypeScript, Vite, and PHP backend.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Modern CSS with native features (CSS variables, nesting)
- **Backend**: PHP 7.4+ with PHPMailer (runs on parent DDEV)
- **Build Tool**: Vite 6
- **Package Managers**: pnpm for Node, Composer for PHP
- **Local Dev**: Parent DDEV instance at https://codecol.ddev.site (OrbStack)
- **Deployment**: Apache web server

## Form Scaffolding System

This project includes a comprehensive form scaffolding system for building landing pages with forms that **automatically submit to Google Sheets**.

### Quick Start for New Forms

**See `FORM_SCAFFOLDING_GUIDE.md` for complete documentation.**

**See `GOOGLE_SHEETS_INTEGRATION.md` for Google Sheets setup and integration.**

### 🎯 Any Form → Google Sheets in 3 Lines of Code

```tsx
const { submitForm, isSubmitting } = useFormSubmission();
const handleSubmit = async (e) => {
  await submitForm(formData); // Done! Data is in Google Sheets
};
```

### Available Components

Located in `src/components/form/`:

- **FormInput** - Text, email, password, number, tel, url inputs
- **FormSelect** - Dropdown selects
- **FormCheckbox** - Checkboxes with rich label support
- **FormRadioGroup** - Radio button groups
- **FormTextarea** - Multi-line text inputs
- **FormBuilder** - Config-driven form renderer

### Two Approaches

1. **Component Composition** - Import and compose components in JSX (flexible, full control)
2. **Config-Driven** - Define forms as configuration objects (fast, consistent)

### Example: Component Composition

```tsx
import { FormInput, FormSelect, FormCheckbox, validationRules } from '@/components/form';

<form onSubmit={handleSubmit}>
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

  <FormSelect
    name="city"
    label="City"
    value={formData.city}
    onChange={(value) => handleChange('city', value)}
    options={[
      { value: 'bogota', label: 'Bogotá' },
      { value: 'medellin', label: 'Medellín' }
    ]}
  />

  <button type="submit">Submit</button>
</form>
```

### Example: Config-Driven

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

<FormBuilder config={config} formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
```

### Examples

**FormBuilder (Config-Driven) - Easiest approach:**
- **`src/examples/RegistrationFormBuilderExample.tsx`** - ⭐ Complete FormBuilder reference with all field types
- `src/examples/ContactFormExample.tsx` - Simpler contact form with FormBuilder

**Component Composition - Maximum flexibility:**
- **`src/components/SavingsForm.tsx`** - Production form with calculations (submits to Google Sheets + Backend)
- `src/examples/NewsletterFormExample.tsx` - Simple newsletter signup form

### Features

- **Component-level validation** - Each component validates its own data
- **Custom error messages** - Configurable validation messages
- **Value transformers** - Format display values and parse input (e.g., currency)
- **Conditional rendering** - Show/hide fields based on conditions
- **Custom styling** - Override default styles via className props
- **Help text** - Add helpful hints below labels
- **Character counters** - Automatic for textareas with maxLength

## Build & Development Commands

### Development
```bash
pnpm dev                # Start Vite dev server (auto-finds available port from 3000+)
pnpm run dev:smart      # Smart dev mode (checks DDEV status + port availability)
pnpm build              # Build for production (TypeScript + Vite + create symlinks)
pnpm type-check         # Run TypeScript type checking without building
pnpm preview            # Preview production build locally
```

**Port Management:**
- `strictPort: false` in vite.config.ts allows automatic port detection
- Vite tries 3000, 3001, 3002... until it finds an available port
- `dev:smart` script additionally checks parent DDEV status before starting

**Two ways to access the app:**
1. **Development (recommended):** `pnpm dev` → http://localhost:3000 (hot reload)
2. **DDEV testing:** `pnpm build` → https://codecol.ddev.site/vinculacion-ahorro-bono-navideno-2025/

**Development without DDEV:**
- The app works in development mode even if DDEV is not running
- Form submits to Google Sheets (primary data store) - always works
- Backend PHP submission is optional (only for email notifications and logging)
- You may see proxy errors in console (safe to ignore): `http proxy error: /api/submit.php`
- To run with full backend support, start parent DDEV: `cd .. && ddev start`

**How DDEV access works:**
- `index.php` serves the built app from `dist/index.html`
- Symlinks (`assets`, `fonts`, `img`) point to `dist/` subdirectories
- Symlinks are auto-created by `postbuild` script
- nginx prefers `index.php` over `index.html`

### Deployment
```bash
./deploy.sh           # Complete deployment build (creates deploy/ directory and .zip)
```

### PHP Dependencies
```bash
composer install      # Install PHP dependencies (PHPMailer)
```

## Application Architecture

### Frontend Architecture (React + TypeScript)

**Component Structure:**
- `src/App.tsx` - Root application component
- `src/main.tsx` - React entry point, creates root and renders App
- `src/components/SavingsForm.tsx` - Main form component with all UI logic

**State Management:**
- Custom hook pattern: `src/hooks/useSavingsForm.ts` handles all form state, validation, and submission logic
- No external state management library - uses React hooks (useState, useEffect, useCallback)
- Form data flow: User input → Hook state → Validation → Dual submission (Google Sheets + Backend)

**Configuration System** (`src/types/config.types.ts`):
- **Single source of truth:** `.env` file is the ONLY configuration source
- **No fallback values:** Missing env vars throw clear errors at build time
- **Type-safe:** TypeScript interface ensures configuration consistency
- **Required variables:** All `VITE_*` vars must be set in `.env` (see `.env.example`)
- **Build-time embedding:** Environment variables are baked into the JavaScript bundle during build
- **Important:** Changes to `.env` require rebuild (`pnpm build`) or dev server restart (`pnpm dev`)

**Key Logic Flows:**

1. **Form Initialization:**
   - Fetches user's IP address on mount (stored in form data)
   - Initializes form state with empty/default values

2. **Dynamic Calculations** (`src/utils/calculations.ts`):
   - When user enters annual savings goal + selects frequency, automatically calculates installment values
   - Monthly: divides goal by number of installments (1-11)
   - Semester: divides goal by 2
   - Uses Colombian Peso formatting

3. **Validation** (`src/utils/validation.ts`):
   - Real-time validation on field change
   - Comprehensive validation on submit
   - Minimum savings amount: $250,000 COP
   - Required fields: personal info, savings details, checkboxes

4. **Form Submission** (`src/utils/api.ts`):
   - Dual submission pattern: sends data to both Google Sheets and PHP backend simultaneously
   - Google Sheets: via Google Apps Script endpoint
   - PHP Backend: via `/api/submit.php` endpoint
   - Both must succeed for submission to be marked successful

### Backend Architecture (PHP)

**Configuration System:**
- `api/config.php` - Main configuration (gitignored, contains credentials)
- `api/config.example.php` - Template for configuration
- Config structure allows easy enable/disable of email functionality

**Email Toggle:**
```php
'email' => ['enabled' => true]   // Emails enabled
'email' => ['enabled' => false]  // Emails disabled (form still works)
```

**Request Flow:**
1. Frontend submits JSON to `/api/submit.php`
2. CORS headers applied based on config
3. Data validated and sanitized
4. Logged to `api/submissions.log` if enabled
5. Email sent via PHPMailer if enabled
6. JSON response returned

**Email System:**
- Uses PHPMailer with SMTP
- Sends HTML and plain text versions
- Personalized with user data
- BCC to admin email
- Graceful degradation: form works even if email fails

### File Structure & Responsibilities

```
src/
├── components/SavingsForm.tsx    # UI component, renders form
├── hooks/useSavingsForm.ts       # Form state, logic, submission orchestration
├── types/
│   ├── form.types.ts             # TypeScript interfaces for form data
│   └── config.types.ts           # App configuration constants
├── utils/
│   ├── api.ts                    # API calls (IP fetch, submissions)
│   ├── calculations.ts           # Business logic (installments, currency)
│   └── validation.ts             # Form validation rules
└── styles/main.css               # Design system (CSS variables, components)
```

### CSS Architecture

Modern CSS with native features (no preprocessor):
- CSS Custom Properties (variables) for design tokens
- Organized sections: variables, reset, layout, typography, forms, buttons, messages
- Responsive design with mobile-first approach
- Consistent spacing scale using variables
- Component-based class naming

### Build Configuration

**Vite Configuration** (`vite.config.ts`):
- Base path: `./` (relative for Apache deployment)
- Output: `dist/` directory
- Code splitting: separate vendor chunk for React/React-DOM
- Asset naming with hashes for cache busting
- Dev server with API proxy to PHP backend

**TypeScript Configuration** (`tsconfig.json`):
- Strict mode enabled
- Modern ES2020 target
- React JSX transform
- Bundler module resolution

## Important Patterns & Conventions

### Form Data Flow
1. User types → `handleInputChange()` → Update state → Clear field error
2. Frequency change → `handleFrequencyChange()` → Update dependent fields
3. Annual goal/installments change → `useEffect` → Calculate values automatically
4. Submit → Validate → Submit both endpoints → Show success/error

### Error Handling
- Field-level errors stored in `errors` state object
- Cleared when user starts typing in that field
- Displayed below each input
- Submit blocked if validation errors exist

### Currency Handling
- User input: accepts any format, strips non-digits
- Display: formatted as COP currency with thousands separators
- Storage: numeric value (number type)
- Use `formatCurrency()` for display, `parseCurrency()` for input

### Type Safety
- All form data typed with `SavingsFormData` interface
- API responses typed with `ApiResponse` interface
- No `any` types - use proper TypeScript types throughout

## Common Development Tasks

### Adding a New Form Field
1. Add to `SavingsFormData` interface in `src/types/form.types.ts`
2. Add validation rule in `src/utils/validation.ts`
3. Add form control in `src/components/SavingsForm.tsx`
4. Update email template in `api/submit.php` (if needed)

### Changing Minimum Savings Amount
Edit `src/types/config.types.ts`:
```typescript
minSavingsAmount: 250000  // Change this value
```

### Updating Google Sheets URL
Edit `src/types/config.types.ts`:
```typescript
googleSheetsUrl: 'your-new-url'
```

### Closing/Opening Enrollment
Edit `src/types/config.types.ts`:
```typescript
formClosed: true   // Shows "enrollment ended" message
formClosed: false  // Shows active form
```

### Toggling Email Notifications
Edit `api/config.php`:
```php
'email' => ['enabled' => false]  // Disable emails
```

### Viewing Submissions
```bash
tail -f api/submissions.log
```

## Deployment Notes

### Production Build Process
1. Run `./deploy.sh` to create deployment package
2. Outputs to `deploy/` directory and `codecol-savings-deploy.zip`
3. Includes only necessary files (dist, api, vendor, config.example.php)
4. Optimized and minified assets

### Apache Requirements
- mod_rewrite enabled
- PHP 7.4+ with json, mbstring, openssl extensions
- Write permissions on `api/` directory for log files

### Post-Deployment Checklist
1. Copy `api/config.example.php` to `api/config.php`
2. Configure SMTP settings in `api/config.php`
3. Set proper file permissions (755 for directories, 644 for files, 666 for logs)
4. Test form submission
5. Check `api/submissions.log` for entries
6. Verify email delivery

### Subdirectory Deployment
If deploying to subdirectory, update `.htaccess` RewriteBase:
```apache
RewriteBase /your-subdirectory/
```

## Security Considerations

- Config files protected by `.htaccess` (deny direct access)
- Input sanitization in PHP backend
- CORS headers configurable
- Sensitive files in `.gitignore`
- SMTP credentials in config file (not committed)
- Log files protected from web access

## Dependencies Management

### When to Update Dependencies
- Security vulnerabilities: `pnpm audit` / `composer audit`
- Major React/Vite updates: test thoroughly before deploying
- PHPMailer updates: verify SMTP compatibility

### Adding New Dependencies
- Frontend: `pnpm install <package>` + update `package.json`
- Backend: `composer require <package>` + update `composer.json`
- Always test after adding dependencies
- Rebuild and redeploy

## Testing Strategy

- No automated tests currently
- Manual testing required:
  1. Fill all form fields
  2. Test validation (empty fields, invalid email, low savings amount)
  3. Test calculations (monthly/semester installments)
  4. Submit and verify both Google Sheets and email
  5. Check log file entries
  6. Test with email disabled
  7. Test form closed message

## Troubleshooting Common Issues

### Build Fails
- Run `pnpm run type-check` to see TypeScript errors
- Fix type errors before building
- Clear node_modules and reinstall if dependencies corrupted

### Form Not Submitting
- Check browser console for API errors
- Verify `api/submit.php` is accessible
- Check PHP error logs
- Ensure CORS headers allow your domain

### Emails Not Sending
- Set `'enabled' => false` to test form without email
- Check SMTP credentials in config
- Verify PHP openssl extension enabled
- Check submission log shows attempts
- Test SMTP server accessibility from hosting

### Styling Issues
- Check CSS is being loaded (Network tab)
- Verify CSS custom properties are supported (modern browsers only)
- Check for CSS specificity conflicts

## Code Style & Best Practices

- Use TypeScript strict mode - no `any` types
- Functional components with hooks (no class components)
- Custom hooks for complex logic (keep components focused on UI)
- Descriptive variable names (no abbreviations)
- Comments for complex business logic
- Error boundaries for production (not implemented yet)
- Consistent formatting (2 spaces, semicolons, single quotes for JSX)
