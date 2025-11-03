# Quick Start Guide

## First Time Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env file
cp .env.example .env
nano .env  # Configure your settings

# 3. Ensure parent DDEV is running
cd .. && ddev describe  # Should show codecol project running

# 4. Done! Ready to develop
```

---

## Development (Daily Use)

### Option 1: Vite Dev Server (Recommended for development)

**Start Vite with hot reload:**
```bash
pnpm dev              # Standard mode
# OR
pnpm run dev:smart    # Smart mode (checks DDEV + finds available port)
```

Output:
```
Port 3000 is in use, trying another one...
VITE v6.x ready in Xms
➜  Local:   http://localhost:3001/
```

**Open:** The URL shown in the output (auto-detects available port)

> **Best for:** Active development with instant hot module replacement
>
> **Port Management:** Vite automatically finds the next available port starting from 3000

### Option 2: DDEV URL (Production-like testing)

**Build and access via DDEV:**
```bash
pnpm build
```

**Open:** https://codecol.ddev.site/vinculacion-ahorro-bono-navideno-2025/

> **Best for:** Testing the built app in a production-like environment

> **Note:** Vite proxies `/api` requests to the parent DDEV at https://codecol.ddev.site

---

## Common Tasks

| Task | Command |
|------|---------|
| **Start Vite** | `pnpm dev` |
| **Type Check** | `pnpm type-check` |
| **Build** | `pnpm build` |
| **Deploy** | `pnpm deploy` |
| **Preview Build** | `pnpm preview` |
| **Check Parent DDEV** | `cd .. && ddev describe` |

---

## Troubleshooting

### ❌ "Unexpected end of JSON input"

**Problem:** Parent DDEV not running or not accessible.

**Fix:**
```bash
# Check parent DDEV status
cd .. && ddev describe

# Should show codecol project running
# If not, start it from parent directory
cd .. && ddev start
```

### ❌ "Failed to fetch" / "Connection refused"

**Problem:** Parent DDEV container not accessible.

**Fix:**
```bash
# Check parent DDEV status
cd .. && ddev describe

# Restart parent DDEV if needed
cd .. && ddev restart
```

### ❌ Email not sending

**Problem:** Email disabled or SMTP misconfigured.

**Fix:**
```bash
# Check .env file
cat .env | grep EMAIL

# Enable emails
EMAIL_ENABLED=true

# Configure SMTP (in .env)
SMTP_HOST=mail.example.com
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password

# Restart DDEV to load new variables
pnpm run ddev:restart
```

### ❌ Environment variables not loading

**Problem:** .env file not found or incorrectly formatted.

**Fix:**
```bash
# Verify .env exists
ls -la .env

# Compare with example
diff .env.example .env

# Restart Vite after changing .env
pnpm dev
```

---

## What's Running?

```
┌─────────────────────────────────────────┐
│  Browser: http://localhost:3000         │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Vite Dev Server (port 3000)            │
│  - React app with HMR                   │
│  - Proxies /api/* to parent DDEV        │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Parent DDEV (OrbStack)                 │
│  - nginx + PHP-FPM                      │
│  - URL: https://codecol.ddev.site       │
│  - Handles API requests                 │
│  - Sends emails (if enabled)            │
└─────────────────────────────────────────┘
```

---

## File Structure

```
.env                 ← Your configuration (NOT committed)
.env.example         ← Template (safe to commit)
api/submit.php       ← Form handler (runs on parent DDEV)
src/                 ← React app
  ├── components/    ← React components
  ├── hooks/         ← Custom hooks
  ├── types/         ← TypeScript types
  ├── utils/         ← Utility functions
  └── styles/        ← CSS styles
dist/                ← Production build
```

---

## Production Deployment

```bash
pnpm deploy
```

Creates:
- `deploy/` directory
- `codecol-savings-deploy.zip`

Upload to Apache server and configure `.env` there.

---

## Need Help?

- **DDEV Setup:** [DDEV_SETUP.md](DDEV_SETUP.md) ← Comprehensive guide
- **Environment variables:** [ENV_GUIDE.md](ENV_GUIDE.md)
- **Full documentation:** [README.md](README.md)
- **Architecture:** [CLAUDE.md](CLAUDE.md)

---

## Why Parent DDEV?

- ✅ **No nested containers** - simpler setup
- ✅ **Fast with OrbStack** (native Mac performance)
- ✅ **Matches production** (nginx + PHP)
- ✅ **Shared across projects** in parent directory
- ✅ **HTTPS support** built-in
- ✅ **Already configured** - no setup needed

---

## Quick Reference

```bash
# First time
pnpm install
cp .env.example .env
# Edit .env with your settings

# Daily development
pnpm dev  # Just one command!

# Deploy to production
pnpm deploy

# Check parent DDEV
cd .. && ddev describe
```

That's it! 🚀
