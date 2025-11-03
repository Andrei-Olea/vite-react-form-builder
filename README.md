# Codecol - Programa de Ahorro 2025

Modern web application for Codecol's savings program enrollment, built with React, TypeScript, and Vite.

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Modern CSS** - Native CSS with variables and nesting

### Backend
- **PHP 7.4+** - Server-side processing
- **PHPMailer** - Email notifications
- **Apache** - Web server

## Project Structure

```
.
├── src/                          # Source code
│   ├── components/               # React components
│   │   ├── form/                # Form scaffolding components
│   │   └── SavingsForm.tsx      # Main production form
│   ├── examples/                 # Example forms
│   ├── hooks/                    # Custom React hooks
│   │   ├── useSavingsForm.ts    # Form logic hook
│   │   └── useFormSubmission.ts # Generic submission hook
│   ├── styles/                   # CSS styles
│   │   └── main.css             # Main stylesheet
│   ├── types/                    # TypeScript definitions
│   │   ├── form.types.ts        # Form data types
│   │   └── config.types.ts      # Configuration types
│   ├── utils/                    # Utility functions
│   │   ├── api.ts               # API calls
│   │   ├── calculations.ts      # Business logic
│   │   └── validation.ts        # Form validation
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
│
├── api/                          # PHP backend
│   ├── submit.php               # Form submission handler
│   ├── config.php               # Configuration (gitignored)
│   ├── config.example.php       # Configuration template
│   └── .htaccess                # Apache config
│
├── docs/                         # Documentation
│   ├── FORM_SCAFFOLDING_GUIDE.md
│   ├── GOOGLE_SHEETS_INTEGRATION.md
│   ├── ENV_GUIDE.md
│   ├── QUICKSTART.md
│   └── DEPLOYMENT_SECURITY.md
│
├── public/                       # Static assets
│   ├── img/                     # Images
│   ├── fonts/                   # Web fonts
│   └── .htaccess                # Apache routing
│
├── dist/                         # Build output (gitignored)
├── vendor/                       # PHP dependencies
├── node_modules/                 # Node dependencies
│
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Node dependencies
├── composer.json                # PHP dependencies
├── deploy.sh                    # Deployment script
├── README.md                    # Project documentation
└── CLAUDE.md                    # Claude Code instructions
```

## Development

### Prerequisites

- Node.js 18+ and pnpm
- Parent DDEV instance running (https://codecol.ddev.site)
- Composer (for PHP dependencies)

### Setup

1. **Install dependencies:**

```bash
pnpm install
composer install
```

2. **Configure environment variables (REQUIRED):**

```bash
cp .env.example .env
nano .env  # Edit with your actual settings
```

⚠️ **Important:** All `VITE_*` variables are required. The app will fail with a clear error if any are missing.

Configure in `.env`:
- Google Sheets URL
- API endpoint
- Minimum savings amount
- Form availability
- SMTP credentials
- Email settings

3. **Ensure parent DDEV is running:**

The parent directory already has DDEV configured. Make sure it's running:
```bash
cd .. && ddev describe
```

You should see the `codecol` project running at https://codecol.ddev.site

4. **Start development:**

**For local development with hot reload:**
```bash
pnpm dev
```
Then open http://localhost:3000

**To access via parent DDEV:**
```bash
pnpm build  # Build the app first
```
Then open https://codecol.ddev.site/vinculacion-ahorro-bono-navideno-2025/

> **Note:**
> - For development, use `pnpm dev` (localhost:3000) for hot module replacement
> - The parent DDEV instance at https://codecol.ddev.site handles PHP backend requests
> - To access via DDEV URL, you must build the app first with `pnpm build`

### Development Commands

```bash
# Start Vite dev server
pnpm dev              # Standard mode (uses port 3000, auto-finds next if busy)
pnpm run dev:smart    # Smart mode (checks DDEV status + finds available port)

# Development tools
pnpm run type-check   # TypeScript type checking
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run deploy       # Create deployment package
```

**Port Management:**
- Vite automatically finds the next available port if 3000 is busy (3001, 3002, etc.)
- Use `pnpm run dev:smart` for enhanced startup with DDEV status check
- Configure `strictPort: false` in `vite.config.ts` (already set)

## Configuration

### Frontend Configuration

Edit `src/types/config.types.ts` to update:
- Google Sheets URL
- API endpoint
- Minimum savings amount
- Form availability

### Backend Configuration (api/config.php)

```php
return [
    'email' => [
        'enabled' => true,  // Toggle email notifications
        'smtp' => [
            'host' => 'mail.example.com',
            'port' => 587,
            'secure' => 'tls',
            'username' => 'your-username',
            'password' => 'your-password',
        ],
        'from' => [
            'address' => 'noreply@example.com',
            'name' => 'Your Name',
        ],
        'bcc' => 'admin@example.com',
    ],
    'app' => [
        'log_submissions' => true,
        'log_file' => 'submissions.log',
    ],
];
```

### Toggle Email Functionality

To **enable** email notifications:
```php
'enabled' => true,
```

To **disable** email notifications (form will still work, just no emails):
```php
'enabled' => false,
```

## Building for Production

### Option 1: Using the deploy script (Recommended)

```bash
./deploy.sh
```

This will:
1. Install dependencies
2. Run type checking
3. Build the project
4. Create a `deploy/` directory with all necessary files
5. Create `codecol-savings-deploy.zip` for easy upload

### Option 2: Manual build

```bash
pnpm run build
```

The optimized files will be in the `dist/` directory.

## Deployment to Apache Server

### Quick Deployment

1. **Upload files:**
   - Extract `codecol-savings-deploy.zip` or upload the `deploy/` directory contents to your server

2. **Configure:**
   ```bash
   cd /path/to/your/webroot
   cp api/config.example.php api/config.php
   nano api/config.php  # Edit with your settings
   ```

3. **Set permissions:**
   ```bash
   chmod 755 api/
   chmod 644 api/config.php
   touch api/submissions.log
   chmod 666 api/submissions.log
   ```

4. **Test:**
   - Visit your domain
   - Submit a test form
   - Check `api/submissions.log` for entries

### Apache Requirements

- PHP 7.4 or higher
- mod_rewrite enabled
- PHP extensions: json, mbstring, openssl

### Apache Configuration

If deploying to a subdirectory, update `.htaccess`:

```apache
RewriteBase /your-subdirectory/
```

## Features

### Form Features
- Real-time installment calculation
- Input validation with error messages
- Currency formatting (Colombian Peso)
- IP address capture
- Data policy and terms acceptance

### Email Features
- Configurable SMTP settings
- HTML and plain text versions
- BCC to admin
- Personalized confirmation emails
- Easy enable/disable toggle

### Submission Features
- Dual submission: Google Sheets + Backend
- Automatic logging
- Error handling
- CORS support
- JSON API responses

## Security

- Config files protected by .htaccess
- Input sanitization
- XSS protection
- CSRF tokens (implement if needed)
- Secure SMTP connections
- Sensitive files in .gitignore

## Troubleshooting

### Build fails with TypeScript errors
```bash
pnpm run type-check
```
Fix any type errors before building.

### Emails not sending
1. Check `api/config.php` settings
2. Verify SMTP credentials
3. Check PHP error logs
4. Test SMTP connection manually

### Form submission fails
1. Check browser console for errors
2. Verify `api/submit.php` is accessible
3. Check `api/submissions.log` for entries
4. Review PHP error logs

### Apache 404 errors
1. Ensure mod_rewrite is enabled
2. Check .htaccess file is uploaded
3. Verify RewriteBase is correct

## Maintenance

### Updating Google Sheets URL
Edit `src/types/config.types.ts`:
```typescript
googleSheetsUrl: 'your-new-url'
```
Then rebuild: `pnpm run build`

### Closing enrollment
Edit `src/types/config.types.ts`:
```typescript
formClosed: true
```
Then rebuild: `pnpm run build`

### Viewing submissions log
```bash
tail -f api/submissions.log
```

## Documentation

Additional documentation is available in the `docs/` folder:

- **[Form Scaffolding Guide](docs/FORM_SCAFFOLDING_GUIDE.md)** - Complete guide for building forms with the scaffolding system
- **[Google Sheets Integration](docs/GOOGLE_SHEETS_INTEGRATION.md)** - Setup and integration guide for Google Sheets
- **[Environment Variables Guide](docs/ENV_GUIDE.md)** - Detailed explanation of all environment variables
- **[Quick Start Guide](docs/QUICKSTART.md)** - Fast setup for development
- **[Deployment Security](docs/DEPLOYMENT_SECURITY.md)** - Security best practices

## Support

For issues or questions, contact the development team.

## License

Proprietary - Codecol 2025
