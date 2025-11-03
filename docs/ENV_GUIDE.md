# Environment Variables Guide

## Overview

This project now uses a `.env` file to store ALL sensitive configuration including:
- Google Sheets URL
- SMTP credentials
- Email addresses
- API endpoints
- Application settings

**Benefits:**
- ✅ Secure: Credentials never committed to git
- ✅ Easy to change: Edit one file instead of multiple config files
- ✅ Environment-specific: Different .env for dev/staging/production
- ✅ Simple: One source of truth for all configuration

---

## Quick Start

### 1. Create your .env file

```bash
# Copy the example file
cp .env.example .env

# Edit with your actual credentials
nano .env  # or use your preferred editor
```

### 2. Configure your settings

Edit `.env` and replace the placeholder values:

```bash
# Frontend - Update these
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec

# Backend - Update these with your SMTP credentials
SMTP_HOST=mail.yourserver.com
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-secure-password
EMAIL_FROM_ADDRESS=your-email@domain.com
EMAIL_BCC_ADDRESSES=admin@domain.com

# Toggle email on/off
EMAIL_ENABLED=true
```

### 3. Build and deploy

```bash
# Development
pnpm run dev

# Production deployment
pnpm run deploy
```

---

## Environment Variables Reference

### Frontend Variables (VITE_ prefix)

All frontend variables MUST start with `VITE_` to be exposed to the client-side code.

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_GOOGLE_SHEETS_URL` | Google Apps Script endpoint URL | _(required)_ | `https://script.google.com/macros/s/ABC123/exec` |
| `VITE_API_ENDPOINT` | Backend PHP API path | `/api/submit.php` | `/api/submit.php` |
| `VITE_MIN_SAVINGS_AMOUNT` | Minimum savings amount in COP | `250000` | `250000` |
| `VITE_MAX_INSTALLMENTS` | Maximum number of monthly installments | `11` | `11` |
| `VITE_FORM_CLOSED` | Close/open enrollment | `false` | `true` or `false` |

### Backend Variables (PHP)

These variables are read by the PHP backend using `vlucas/phpdotenv`.

#### Email Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_ENABLED` | Enable/disable all email functionality | `true` or `false` |
| `EMAIL_FROM_ADDRESS` | Sender email address | `noreply@codecol.com.co` |
| `EMAIL_FROM_NAME` | Sender name | `Codecol` |
| `EMAIL_BCC_ADDRESSES` | BCC recipients (comma-separated) | `admin@example.com,manager@example.com` |
| `EMAIL_SUBJECT` | Email subject line | `Programa de Ahorro 2025` |

#### SMTP Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | `mail.example.com` |
| `SMTP_PORT` | SMTP port | `587` (TLS) or `465` (SSL) |
| `SMTP_SECURE` | Encryption method | `tls` or `ssl` |
| `SMTP_USERNAME` | SMTP username | `user@example.com` |
| `SMTP_PASSWORD` | SMTP password | `your-secure-password` |

#### Application Settings

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_LOG_SUBMISSIONS` | Log form submissions to file | `true` or `false` |
| `APP_LOG_FILE` | Log file name | `submissions.log` |
| `APP_ALLOWED_ORIGINS` | CORS allowed origins | `*` or `https://domain.com` |

---

## Common Tasks

### Updating Google Sheets URL

1. Edit `.env`:
   ```bash
   VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/NEW_SCRIPT_ID/exec
   ```

2. Rebuild:
   ```bash
   pnpm run build
   ```

3. Deploy the new build

### Changing Email Settings

1. Edit `.env`:
   ```bash
   SMTP_HOST=new-smtp.example.com
   SMTP_USERNAME=new-user@example.com
   SMTP_PASSWORD=new-password
   ```

2. No rebuild needed! Just upload the new `.env` to your server

### Disabling Emails (Form Still Works)

1. Edit `.env`:
   ```bash
   EMAIL_ENABLED=false
   ```

2. No rebuild needed! PHP will read this immediately

### Closing Enrollment

1. Edit `.env`:
   ```bash
   VITE_FORM_CLOSED=true
   ```

2. Rebuild and deploy:
   ```bash
   pnpm run deploy
   ```

---

## Security Best Practices

### ✅ DO:
- Keep `.env` in `.gitignore` (already configured)
- Use strong passwords for SMTP
- Limit BCC recipients to trusted emails
- Set proper file permissions on server: `chmod 600 .env`
- Create separate `.env` files for different environments

### ❌ DON'T:
- Never commit `.env` to git
- Don't share `.env` file via email/chat
- Don't use the same credentials across environments
- Don't give `.env` write permissions to web server

---

## Deployment

### Development

```bash
# .env is used automatically by Vite
pnpm run dev
```

### Production

```bash
# Build with environment variables
pnpm run deploy

# This creates:
# - deploy/ directory
# - codecol-savings-deploy.zip
#
# The deployment package includes .env.example but NOT .env
```

### On Server

1. Upload deployment package
2. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   nano .env  # Configure with production values
   ```
3. Set permissions:
   ```bash
   chmod 600 .env
   ```
4. Test the application

---

## How It Works

### Frontend (React/TypeScript)

Vite automatically loads `.env` files and exposes variables prefixed with `VITE_` to the client-side code via `import.meta.env`:

```typescript
// src/types/config.types.ts
export const CONFIG = {
  googleSheetsUrl: import.meta.env.VITE_GOOGLE_SHEETS_URL,
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
  // ...
};
```

**Important:** Frontend variables are compiled into the JavaScript bundle, so changes require a rebuild.

### Backend (PHP)

The PHP backend uses `vlucas/phpdotenv` to load `.env` at runtime:

```php
// api/submit.php
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Access variables
$host = $_ENV['SMTP_HOST'];
$enabled = filter_var($_ENV['EMAIL_ENABLED'], FILTER_VALIDATE_BOOLEAN);
```

**Important:** Backend variables are read at runtime, so changes take effect immediately (no rebuild needed).

---

## Troubleshooting

### Build fails with "env is not defined"

**Solution:** Make sure `src/vite-env.d.ts` exists and includes type definitions for your environment variables.

### Backend can't read .env file

**Solution:**
- Verify `.env` file exists in project root
- Check PHP has read permissions: `ls -la .env`
- Verify `vlucas/phpdotenv` is installed: `composer show vlucas/phpdotenv`

### Environment variables not updating

**Frontend:** You need to rebuild:
```bash
pnpm run build
```

**Backend:** Check that you're editing the correct `.env` file on the server.

### Deployment package missing .env

**This is correct!** For security, `.env` is never included in deployment packages. You must create it manually on the server from `.env.example`.

---

## Migration from Old Config System

If upgrading from the old `api/config.php` system:

1. Old config files are deleted: ✅
   - `api/config.php` - REMOVED
   - `api/config.example.php` - REMOVED

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Migrate your settings:
   - Old `api/config.php` values → `.env` file
   - Frontend values in `src/types/config.types.ts` → `.env` with `VITE_` prefix

4. Test thoroughly:
   ```bash
   pnpm run dev  # Test frontend
   # Submit form and check email
   ```

---

## Summary

| Aspect | Details |
|--------|---------|
| **File Location** | Project root: `.env` |
| **Template** | `.env.example` (committed to git) |
| **Security** | `.env` is in `.gitignore` (never committed) |
| **Frontend Changes** | Require rebuild (`pnpm run build`) |
| **Backend Changes** | Immediate (no rebuild needed) |
| **Deployment** | Manual creation on server from `.env.example` |
| **pnpm Script** | `pnpm run deploy` |

For questions or issues, contact the development team.
