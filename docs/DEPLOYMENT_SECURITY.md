# Production Deployment - Security Best Practices

## Critical: .env File Placement

### ⚠️ Security Risk

**NEVER** place `.env` inside your web root in production! Even with `.htaccess` protection, there's risk if:
- Apache misconfigures
- .htaccess is disabled
- Server switches to nginx (doesn't use .htaccess)

### Recommended Directory Structure

#### ❌ INSECURE (Don't do this)
```
/var/www/html/                    ← Web root
├── .env                          ← EXPOSED! Anyone can access via HTTP!
├── index.html
├── api/
└── vendor/
```

#### ✅ SECURE (Recommended)
```
/var/www/
├── .env                          ← Outside web root (safe!)
├── .env.example                  ← Template (safe to include)
└── html/                         ← Web root (Apache serves from here)
    ├── index.html
    ├── api/
    │   └── submit.php            ← Looks for .env one level up
    ├── vendor/
    └── .htaccess
```

## Deployment Instructions

### Step 1: Upload Files

Upload the contents of `deploy/` to your web root:

```bash
# Option A: Using FTP/SFTP
# Upload deploy/* → /var/www/html/

# Option B: Using scp
scp -r deploy/* user@yourserver.com:/var/www/html/

# Option C: Extract the zip
unzip yourapp-savings-deploy.zip -d /var/www/html/
```

### Step 2: Create .env OUTSIDE Web Root

```bash
# SSH into your server
ssh user@yourserver.com

# Navigate to parent directory (outside web root)
cd /var/www/

# Create .env from the example inside web root
cp html/.env.example .env

# Edit with your actual credentials
nano .env
```

**Important:** Configure all variables in `.env`:
- `VITE_GOOGLE_SHEETS_URL` - Your Google Sheets script URL
- `EMAIL_ENABLED` - true/false
- `SMTP_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD` - Your SMTP credentials
- All other required variables

### Step 3: Verify .env Location

The PHP backend will automatically search for `.env` in:
1. **First:** `../../.env` (outside web root - production)
2. **Fallback:** `../.env` (inside web root - local dev)

Verify the file exists:
```bash
# Should be outside web root
ls -la /var/www/.env

# Should NOT be inside web root
ls -la /var/www/html/.env  # This should NOT exist!
```

### Step 4: Set Permissions

```bash
# .env should be readable only by web server user
chmod 600 /var/www/.env
chown www-data:www-data /var/www/.env  # Adjust user as needed

# API directory needs write access for logs
chmod 755 /var/www/html/api/
touch /var/www/html/api/submissions.log
chmod 666 /var/www/html/api/submissions.log
```

### Step 5: Test the Application

1. **Test the app loads:**
   ```bash
   curl https://yourdomain.com/
   ```

2. **Verify .env is NOT accessible:**
   ```bash
   curl https://yourdomain.com/.env
   # Should return: 403 Forbidden
   ```

3. **Test form submission:**
   - Open the app in browser
   - Fill out and submit the form
   - Verify success message appears

4. **Check logs:**
   ```bash
   tail -f /var/www/html/api/submissions.log
   ```

## Environment Comparison

### Local Development
```
/Users/you/project/
├── .env                          ✓ Safe (not on public internet)
├── src/
├── api/
│   └── submit.php                → Loads from ../.env
└── public/
```

### Production (Secure)
```
/var/www/
├── .env                          ✓ Safe (outside web root)
└── html/                         ← Web root
    ├── index.html
    ├── api/
    │   └── submit.php            → Loads from ../../.env
    └── vendor/
```

## How It Works

The PHP code in `api/submit.php` tries multiple locations:

```php
$envPaths = [
    __DIR__ . '/../..',  // Production: outside web root
    __DIR__ . '/..',     // Development: project root
];
```

This allows the same code to work in:
- ✅ Local development (project root)
- ✅ Production (outside web root)

## Troubleshooting

### Error: "Configuration error: .env file not found"

**Cause:** PHP cannot find `.env` file

**Solution:**
```bash
# Check if .env exists outside web root
ls -la /var/www/.env

# If not, create it
cd /var/www/
cp html/.env.example .env
nano .env  # Configure your settings
```

### Error: "Permission denied" when reading .env

**Cause:** Web server user cannot read `.env`

**Solution:**
```bash
# Make readable by web server
chmod 644 /var/www/.env
chown www-data:www-data /var/www/.env
```

### Form submissions not logging

**Cause:** API directory not writable

**Solution:**
```bash
chmod 755 /var/www/html/api/
chmod 666 /var/www/html/api/submissions.log
```

## Security Checklist

Before going live, verify:

- [ ] `.env` is **outside** web root (e.g., `/var/www/.env`)
- [ ] `.env` is **not** accessible via HTTP (test: `curl https://domain.com/.env` returns 403)
- [ ] `.env` has proper permissions (600 or 644, owned by web server user)
- [ ] `.htaccess` files are in place (root and api/)
- [ ] Form submissions work
- [ ] Emails send correctly (if enabled)
- [ ] Logs are being written to `api/submissions.log`
- [ ] Google Sheets submissions work

## Additional Security Measures

### 1. Use Environment Variables (Alternative)

Instead of `.env` file, use server environment variables:

```apache
# In Apache VirtualHost config
SetEnv VITE_GOOGLE_SHEETS_URL "https://..."
SetEnv EMAIL_ENABLED "true"
SetEnv SMTP_HOST "mail.example.com"
# etc...
```

### 2. Enable HTTPS

Uncomment in `.htaccess`:
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 3. Restrict API Access

Add IP whitelisting in `api/.htaccess`:
```apache
<Files "submit.php">
    Order deny,allow
    Deny from all
    Allow from your.office.ip.address
</Files>
```

### 4. Add Rate Limiting

Consider using fail2ban or CloudFlare to prevent abuse.

## Summary

| Environment | .env Location | Security Level |
|-------------|---------------|----------------|
| **Local Dev** | Project root | ⚠️ Medium (not public) |
| **Production (Bad)** | Inside web root | 🔴 Low (relies on .htaccess) |
| **Production (Good)** | Outside web root | ✅ High (unreachable via HTTP) |

**Always use the "Production (Good)" approach for live servers!**
