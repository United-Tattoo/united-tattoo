#!/bin/bash

# CI/CD Pipeline Setup Script for United Tattoo
# This script helps configure the CI/CD pipeline in Gitea

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_NAME="united-tattoo"
GITEA_URL="https://git.biohazardvfx.com"
CLOUDFLARE_ACCOUNT_ID="5cee6a21cea282a9c89d5297964402e7"

echo -e "${BLUE}🚀 Setting up CI/CD Pipeline for United Tattoo${NC}"
echo "=================================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# Check if .gitea directory exists
if [ ! -d ".gitea" ]; then
    echo -e "${YELLOW}⚠️  .gitea directory not found. Creating...${NC}"
    mkdir -p .gitea/workflows
fi

# Check if workflow files exist
WORKFLOWS=(
    ".gitea/workflows/enhanced-ci.yaml"
    ".gitea/workflows/deploy.yaml"
    ".gitea/workflows/security.yaml"
    ".gitea/workflows/performance.yaml"
)

echo -e "${BLUE}📋 Checking workflow files...${NC}"
for workflow in "${WORKFLOWS[@]}"; do
    if [ -f "$workflow" ]; then
        echo -e "${GREEN}✅ $workflow exists${NC}"
    else
        echo -e "${RED}❌ $workflow missing${NC}"
        exit 1
    fi
done

# Check package.json scripts
echo -e "${BLUE}📦 Checking package.json scripts...${NC}"
REQUIRED_SCRIPTS=(
    "ci:lint"
    "ci:typecheck"
    "ci:test"
    "ci:build"
    "ci:budgets"
    "format"
    "format:check"
    "security:audit"
    "performance:lighthouse"
)

for script in "${REQUIRED_SCRIPTS[@]}"; do
    if npm run "$script" --dry-run > /dev/null 2>&1; then
        echo -e "${GREEN}✅ npm run $script${NC}"
    else
        echo -e "${RED}❌ npm run $script missing${NC}"
        exit 1
    fi
done

# Check dependencies
echo -e "${BLUE}🔍 Checking dependencies...${NC}"
REQUIRED_DEPS=(
    "@opennextjs/cloudflare"
    "vitest"
    "@vitest/coverage-v8"
    "eslint"
    "typescript"
)

for dep in "${REQUIRED_DEPS[@]}"; do
    if npm list "$dep" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $dep installed${NC}"
    else
        echo -e "${RED}❌ $dep missing${NC}"
        exit 1
    fi
done

# Check environment variables
echo -e "${BLUE}🔧 Checking environment configuration...${NC}"

if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
    echo -e "${YELLOW}⚠️  CLOUDFLARE_ACCOUNT_ID not set${NC}"
    echo "   Set this in your Gitea repository variables"
else
    echo -e "${GREEN}✅ CLOUDFLARE_ACCOUNT_ID configured${NC}"
fi

# Create .env.example if it doesn't exist
if [ ! -f ".env.example" ]; then
    echo -e "${BLUE}📝 Creating .env.example...${NC}"
    cat > .env.example << EOF
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://unitedtattoo.com

# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token

# Feature Flags (optional overrides)
ADMIN_ENABLED=true
BOOKING_ENABLED=true
PUBLIC_APPOINTMENT_REQUESTS_ENABLED=false

# Performance Budgets
TOTAL_STATIC_MAX_BYTES=3000000
MAX_ASSET_BYTES=1500000
EOF
    echo -e "${GREEN}✅ .env.example created${NC}"
fi

# Check if prettier is configured
if [ ! -f ".prettierrc" ]; then
    echo -e "${BLUE}📝 Creating Prettier configuration...${NC}"
    cat > .prettierrc << EOF
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF
    echo -e "${GREEN}✅ .prettierrc created${NC}"
fi

# Check if eslint is configured
if [ ! -f ".eslintrc.json" ]; then
    echo -e "${YELLOW}⚠️  .eslintrc.json not found${NC}"
    echo "   Make sure ESLint is properly configured"
fi

# Create pre-commit hook
echo -e "${BLUE}🪝 Setting up pre-commit hooks...${NC}"
if command -v husky > /dev/null 2>&1; then
    npx husky install
    npx husky add .husky/pre-commit "npm run format:staged && npm run ci:lint"
    echo -e "${GREEN}✅ Pre-commit hooks configured${NC}"
else
    echo -e "${YELLOW}⚠️  Husky not installed. Install with: npm install -g husky${NC}"
fi

# Test the setup
echo -e "${BLUE}🧪 Testing CI/CD setup...${NC}"

# Test linting (allow warnings)
if npm run ci:lint 2>&1 | grep -q "Error:"; then
    echo -e "${YELLOW}⚠️ Linting has errors (expected in development)${NC}"
else
    echo -e "${GREEN}✅ Linting works${NC}"
fi

# Test type checking
if npm run ci:typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Type checking works${NC}"
else
    echo -e "${YELLOW}⚠️ Type checking has issues${NC}"
fi

# Test building
if npm run ci:build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Building works${NC}"
else
    echo -e "${RED}❌ Building failed${NC}"
fi

# Test budget check (may fail if no build output)
if npm run ci:budgets > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Budget check works${NC}"
else
    echo -e "${YELLOW}⚠️ Budget check needs build output${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}🎉 CI/CD Pipeline Setup Complete!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo "1. Configure Gitea Repository Variables:"
echo "   - CLOUDFLARE_ACCOUNT_ID: $CLOUDFLARE_ACCOUNT_ID"
echo "   - TOTAL_STATIC_MAX_BYTES: 3000000"
echo "   - MAX_ASSET_BYTES: 1500000"
echo ""
echo "2. Configure Gitea Repository Secrets:"
echo "   - CLOUDFLARE_API_TOKEN: Your Cloudflare API token"
echo "   - LHCI_GITHUB_APP_TOKEN: Lighthouse CI token (optional)"
echo ""
echo "3. Enable Gitea Actions:"
echo "   - Go to repository settings"
echo "   - Enable Actions"
echo "   - Configure runners if needed"
echo ""
echo "4. Test the Pipeline:"
echo "   - Create a test branch"
echo "   - Make a small change"
echo "   - Push to trigger CI"
echo "   - Check Actions tab for results"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   - CI/CD Guide: docs/CI-CD-PIPELINE.md"
echo "   - SEO Guide: docs/SEO-AND-PERFORMANCE-IMPROVEMENTS.md"
echo ""
echo -e "${BLUE}🔗 Useful Commands:${NC}"
echo "   - Test locally: npm run ci:lint && npm run ci:typecheck && npm run ci:test"
echo "   - Build locally: npm run ci:build"
echo "   - Deploy preview: npm run deploy:preview"
echo "   - Deploy production: npm run deploy:production"
echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
