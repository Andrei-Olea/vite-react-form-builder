#!/bin/bash

###############################################################################
# Deployment Script for YourApp Form Builder
# This script builds the project and prepares it for Apache deployment
###############################################################################

set -e  # Exit on error

echo "================================================"
echo "  YourApp Form Builder - Deployment Script"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}ERROR: .env file not found!${NC}"
    echo "Please create a .env file from .env.example before deploying:"
    echo "  cp .env.example .env"
    echo "  nano .env  # Edit with your settings"
    exit 1
fi

# Load environment variables from .env
echo -e "${BLUE}Loading environment configuration...${NC}"
export $(grep -v '^#' .env | grep -v '^$' | xargs)

# Get deployment configuration from .env
DEPLOY_CREATE_ZIP=${DEPLOY_CREATE_ZIP:-true}
DEPLOY_ZIP_NAME=${DEPLOY_ZIP_NAME:-yourapp-deploy}
DEPLOY_APP_URL=${DEPLOY_APP_URL:-https://yourapp.ddev.site}

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing Node dependencies...${NC}"
    pnpm install
fi

# Check if vendor exists
if [ ! -d "vendor" ]; then
    echo -e "${BLUE}Installing PHP dependencies...${NC}"
    composer install --no-dev --optimize-autoloader
fi

# Type check
echo -e "${BLUE}Running TypeScript type check...${NC}"
pnpm run type-check

# Build the project
echo -e "${BLUE}Building project for production...${NC}"
pnpm run build

# Create deployment directory if it doesn't exist
DEPLOY_DIR="deploy"
if [ -d "$DEPLOY_DIR" ]; then
    echo -e "${BLUE}Removing old deployment directory...${NC}"
    rm -rf "$DEPLOY_DIR"
fi

echo -e "${BLUE}Creating deployment directory...${NC}"
mkdir -p "$DEPLOY_DIR"

# Copy built files
echo -e "${BLUE}Copying built files to deployment directory...${NC}"
cp -r dist/* "$DEPLOY_DIR/"

# Copy API directory
echo -e "${BLUE}Copying API files...${NC}"
mkdir -p "$DEPLOY_DIR/api"
cp api/submit.php "$DEPLOY_DIR/api/"
cp api/.htaccess "$DEPLOY_DIR/api/"

# Copy vendor directory (PHP dependencies)
echo -e "${BLUE}Copying PHP dependencies...${NC}"
cp -r vendor "$DEPLOY_DIR/"

# Copy composer files
cp composer.json "$DEPLOY_DIR/"
cp composer.lock "$DEPLOY_DIR/"

# Copy .env.example (NOT .env - for security)
echo -e "${BLUE}Copying environment template...${NC}"
cp .env.example "$DEPLOY_DIR/"

# Copy .htaccess files
echo -e "${BLUE}Copying .htaccess files...${NC}"
if [ -f ".htaccess" ]; then
    cp .htaccess "$DEPLOY_DIR/"
fi
if [ -f "public/.htaccess" ]; then
    cp public/.htaccess "$DEPLOY_DIR/"
fi

# Copy index.php (entry point for DDEV/Apache)
if [ -f "index.php" ]; then
    cp index.php "$DEPLOY_DIR/"
fi

# Create README for deployment
cat > "$DEPLOY_DIR/README.txt" << EOF
YourApp Form Builder - Deployment Package
=============================================

IMPORTANT: Configuration Required!
-----------------------------------

1. Create your .env file:
   - Copy .env.example to .env
   - Edit .env with your actual settings:
     * Google Sheets URL
     * SMTP credentials
     * Email addresses
     * Other configuration options

2. Upload all files in this directory to your Apache server

3. Ensure these directories have write permissions:
   - api/ (for log files)

4. If not using root directory, update the RewriteBase in .htaccess

5. Verify PHP extensions are installed:
   - php-json
   - php-mbstring
   - php-openssl (for SMTP)
   - php-curl (optional, for better performance)

6. Test the application:
   - Visit your domain
   - Submit a test form
   - Check api/submissions.log for entries
   - Verify email delivery

Environment Variables:
----------------------
All configuration is now in the .env file. You must create this file
from .env.example and configure it before the application will work.

Frontend variables (VITE_ prefix):
- VITE_GOOGLE_SHEETS_URL
- VITE_API_ENDPOINT
- VITE_MIN_SAVINGS_AMOUNT
- VITE_MAX_INSTALLMENTS
- VITE_FORM_CLOSED

Backend variables:
- EMAIL_ENABLED, EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME, etc.
- SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, etc.
- APP_LOG_SUBMISSIONS, APP_ALLOWED_ORIGINS, etc.

Security Note:
--------------
NEVER commit your .env file to version control!
It contains sensitive credentials and should be kept secure.

For support, contact the development team.
EOF

# Create a zip file for easy upload (if enabled in .env)
if [ "$DEPLOY_CREATE_ZIP" = "true" ]; then
    echo -e "${BLUE}Creating deployment archive...${NC}"
    cd "$DEPLOY_DIR"
    zip -r ../${DEPLOY_ZIP_NAME}.zip . > /dev/null
    cd ..

    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}  Deployment package created successfully!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo "Deployment files location:"
    echo "  Directory: ./deploy/"
    echo "  Archive:   ./${DEPLOY_ZIP_NAME}.zip"
else
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}  Deployment directory created successfully!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo "Deployment files location:"
    echo "  Directory: ./deploy/"
    echo ""
    echo -e "${YELLOW}Note: Zip file creation is disabled in .env${NC}"
    echo "Set DEPLOY_CREATE_ZIP=true in .env to enable zip creation"
fi
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Post-Deployment Steps${NC}"
echo "  1. Upload files to your Apache server"
echo "  2. Create .env from .env.example on the server"
echo "  3. Configure .env with your actual credentials"
echo "  4. Set proper permissions for api directory"
echo "  5. Test the application thoroughly"
echo ""
echo -e "${YELLOW}⚠️  SECURITY REMINDER:${NC}"
echo "  Your .env file was NOT included in the deployment"
echo "  package for security. You must create it manually"
echo "  on the server with your actual credentials."
echo ""
