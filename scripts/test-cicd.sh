#!/bin/bash

# CI/CD Pipeline Test Script for United Tattoo
# This script tests the CI/CD pipeline components locally

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testing CI/CD Pipeline Components${NC}"
echo "============================================="

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_WARNED=0

# Function to run a test and track results
run_test() {
    local test_name="$1"
    local test_command="$2"
    local allow_warnings="${3:-false}"
    
    echo -e "${BLUE}Testing: $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $test_name passed${NC}"
        ((TESTS_PASSED++))
    else
        if [ "$allow_warnings" = "true" ]; then
            echo -e "${YELLOW}⚠️ $test_name has warnings (expected)${NC}"
            ((TESTS_WARNED++))
        else
            echo -e "${RED}❌ $test_name failed${NC}"
            ((TESTS_FAILED++))
        fi
    fi
    echo ""
}

# Test 1: Check workflow files exist
echo -e "${BLUE}📋 Testing Workflow Files${NC}"
echo "------------------------"

WORKFLOWS=(
    ".gitea/workflows/enhanced-ci.yaml"
    ".gitea/workflows/deploy.yaml"
    ".gitea/workflows/security.yaml"
    ".gitea/workflows/performance.yaml"
)

for workflow in "${WORKFLOWS[@]}"; do
    if [ -f "$workflow" ]; then
        echo -e "${GREEN}✅ $workflow exists${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $workflow missing${NC}"
        ((TESTS_FAILED++))
    fi
done
echo ""

# Test 2: Check package.json scripts
echo -e "${BLUE}📦 Testing Package Scripts${NC}"
echo "------------------------"

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
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ npm run $script missing${NC}"
        ((TESTS_FAILED++))
    fi
done
echo ""

# Test 3: Code Quality Checks
echo -e "${BLUE}🔍 Testing Code Quality${NC}"
echo "------------------------"

# Test linting (allow warnings in development)
run_test "ESLint" "npm run ci:lint" "true"

# Test type checking
run_test "TypeScript" "npm run ci:typecheck" "false"

# Test formatting
run_test "Prettier" "npm run format:check" "true"

# Test 4: Build Process
echo -e "${BLUE}🏗️ Testing Build Process${NC}"
echo "------------------------"

# Test build
run_test "Next.js Build" "npm run ci:build" "false"

# Test budget check (may fail if no build output)
run_test "Budget Check" "npm run ci:budgets" "true"

# Test 5: Security Checks
echo -e "${BLUE}🔒 Testing Security${NC}"
echo "------------------------"

# Test security audit
run_test "Security Audit" "npm run security:audit" "true"

# Test outdated packages
run_test "Outdated Packages" "npm run security:outdated" "true"

# Test 6: Dependencies
echo -e "${BLUE}📚 Testing Dependencies${NC}"
echo "------------------------"

REQUIRED_DEPS=(
    "@opennextjs/cloudflare"
    "vitest"
    "@vitest/coverage-v8"
    "eslint"
    "typescript"
    "prettier"
)

for dep in "${REQUIRED_DEPS[@]}"; do
    if npm list "$dep" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $dep installed${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $dep missing${NC}"
        ((TESTS_FAILED++))
    fi
done
echo ""

# Test 7: Environment Configuration
echo -e "${BLUE}🔧 Testing Environment${NC}"
echo "------------------------"

# Check Node.js version
NODE_VERSION=$(node --version)
if [[ "$NODE_VERSION" =~ v20\. ]]; then
    echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️ Node.js version: $NODE_VERSION (recommend v20.x)${NC}"
    ((TESTS_WARNED++))
fi

# Check npm version
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm version: $NPM_VERSION${NC}"
((TESTS_PASSED++))

# Check if we're in a git repository
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Git repository detected${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ Not in a git repository${NC}"
    ((TESTS_FAILED++))
fi
echo ""

# Test 8: Configuration Files
echo -e "${BLUE}📝 Testing Configuration${NC}"
echo "------------------------"

CONFIG_FILES=(
    "package.json"
    "next.config.mjs"
    "tailwind.config.ts"
    "tsconfig.json"
    "vitest.config.ts"
    "open-next.config.ts"
)

for config in "${CONFIG_FILES[@]}"; do
    if [ -f "$config" ]; then
        echo -e "${GREEN}✅ $config exists${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $config missing${NC}"
        ((TESTS_FAILED++))
    fi
done
echo ""

# Test 9: Documentation
echo -e "${BLUE}📚 Testing Documentation${NC}"
echo "------------------------"

DOC_FILES=(
    "docs/CI-CD-PIPELINE.md"
    "docs/CI-CD-QUICK-REFERENCE.md"
    "docs/SEO-AND-PERFORMANCE-IMPROVEMENTS.md"
    "README.md"
)

for doc in "${DOC_FILES[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✅ $doc exists${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $doc missing${NC}"
        ((TESTS_FAILED++))
    fi
done
echo ""

# Summary
echo -e "${BLUE}📊 Test Results Summary${NC}"
echo "=========================="
echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
echo -e "${YELLOW}⚠️ Tests Warned: $TESTS_WARNED${NC}"
echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"
echo ""

TOTAL_TESTS=$((TESTS_PASSED + TESTS_WARNED + TESTS_FAILED))
SUCCESS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))

echo -e "${BLUE}Success Rate: $SUCCESS_RATE%${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical tests passed! CI/CD pipeline is ready.${NC}"
    exit 0
elif [ $TESTS_FAILED -le 2 ]; then
    echo -e "${YELLOW}⚠️ Some tests failed, but pipeline should work with minor fixes.${NC}"
    exit 1
else
    echo -e "${RED}❌ Multiple tests failed. Please fix issues before deploying.${NC}"
    exit 2
fi
