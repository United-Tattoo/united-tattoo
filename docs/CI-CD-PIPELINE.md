# CI/CD Pipeline Documentation

## Overview

This document describes the comprehensive CI/CD pipeline for the United Tattoo website, built with Next.js and deployed to Cloudflare Workers via Gitea Actions.

---

## 🚀 Pipeline Architecture

### Workflow Files

1. **`enhanced-ci.yaml`** - Main CI/CD pipeline with quality gates
2. **`deploy.yaml`** - Deployment pipeline with manual triggers
3. **`security.yaml`** - Security scanning and dependency checks
4. **`performance.yaml`** - Performance monitoring and Lighthouse audits

### Pipeline Stages

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Quality Gates │    │   Build & Test  │    │    Deploy       │
│                 │    │                 │    │                 │
│ • Lint & Format │───▶│ • Build App     │───▶│ • Preview       │
│ • Security Scan │    │ • Unit Tests    │    │ • Production    │
│ • Type Check    │    │ • Coverage      │    │ • Health Check  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Post-Deploy    │    │   Performance    │    │   Monitoring    │
│                 │    │                 │    │                 │
│ • Lighthouse    │    │ • Bundle Size   │    │ • Core Web Vitals│
│ • SEO Check     │    │ • Budget Check  │    │ • Security Headers│
│ • Health Check  │    │ • Performance   │    │ • Uptime Monitor │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📋 Workflow Details

### 1. Enhanced CI Pipeline (`enhanced-ci.yaml`)

**Triggers:**
- Push to `main`, `master`, or `ci-run-*` branches
- Pull requests to `main`/`master`
- Manual workflow dispatch

**Jobs:**

#### Quality Gates
- **Code Quality**: ESLint, TypeScript check, format validation
- **Security Scan**: Dependency audit, license check, outdated packages
- **Tests**: Unit tests with coverage reporting

#### Build & Deploy
- **Build**: Next.js build with OpenNext Cloudflare adapter
- **Deploy Preview**: Automatic deployment for PRs
- **Deploy Production**: Deployment to production environment

#### Post-Deployment
- **Lighthouse CI**: Performance audit
- **SEO Check**: Metadata validation
- **Security Headers**: Security configuration check

### 2. Deployment Pipeline (`deploy.yaml`)

**Features:**
- Manual deployment triggers
- Environment selection (preview/production)
- Emergency deployment options
- Rollback capability
- Health checks and verification

**Deployment Flow:**
1. Pre-deployment checks (optional)
2. Build application
3. Database migrations (production only)
4. Deploy to Cloudflare
5. Health check verification
6. Performance validation
7. SEO verification

### 3. Security Pipeline (`security.yaml`)

**Security Checks:**
- **Dependency Scan**: npm audit, license check, outdated packages
- **Code Security**: ESLint security rules, hardcoded secrets check
- **Container Security**: Dockerfile security analysis
- **Security Report**: Comprehensive security status report

**Scheduled Runs:**
- Daily security scans at 3 AM UTC
- Automatic vulnerability detection
- License compliance checking

### 4. Performance Pipeline (`performance.yaml`)

**Performance Monitoring:**
- **Lighthouse Audit**: Performance, accessibility, SEO scores
- **Bundle Analysis**: Bundle size monitoring, budget enforcement
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **SEO Performance**: Meta tags, structured data validation

**Scheduled Runs:**
- Daily performance checks at 4 AM UTC
- Performance regression detection
- SEO compliance monitoring

---

## 🔧 Configuration

### Environment Variables

**Required:**
```bash
CLOUDFLARE_ACCOUNT_ID=5cee6a21cea282a9c89d5297964402e7
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
```

**Optional:**
```bash
TOTAL_STATIC_MAX_BYTES=3000000
MAX_ASSET_BYTES=1500000
LHCI_GITHUB_APP_TOKEN=your-lighthouse-ci-token
```

### Secrets

Configure these in your Gitea repository settings:

1. **`CLOUDFLARE_API_TOKEN`** - Cloudflare API token with Pages permissions
2. **`LHCI_GITHUB_APP_TOKEN`** - Lighthouse CI token (optional)

### Variables

Set these in your Gitea repository variables:

1. **`CLOUDFLARE_ACCOUNT_ID`** - Your Cloudflare account ID
2. **`TOTAL_STATIC_MAX_BYTES`** - Maximum total static assets size
3. **`MAX_ASSET_BYTES`** - Maximum individual asset size

---

## 📊 Quality Gates

### Code Quality
- ✅ ESLint passes with no errors
- ✅ TypeScript compilation successful
- ✅ Code formatting consistent
- ✅ No security vulnerabilities (critical/high)

### Performance
- ✅ Lighthouse Performance score ≥ 80
- ✅ Lighthouse SEO score ≥ 90
- ✅ Bundle size under budget limits
- ✅ Core Web Vitals within thresholds

### Security
- ✅ No critical dependency vulnerabilities
- ✅ Approved licenses only
- ✅ No hardcoded secrets
- ✅ Security headers present

---

## 🚀 Deployment Process

### Automatic Deployments

**Pull Requests:**
- Automatic preview deployment
- Quality gates must pass
- Performance checks run
- Security scan executed

**Main Branch:**
- Automatic production deployment
- All quality gates enforced
- Database migrations (if needed)
- Health checks performed

### Manual Deployments

**Via Gitea UI:**
1. Go to Actions → Deploy
2. Select environment (preview/production)
3. Choose deployment options
4. Monitor deployment progress

**Via CLI:**
```bash
# Deploy to preview
npm run deploy:preview

# Deploy to production
npm run deploy:production
```

### Emergency Deployments

**Skip Tests:**
- Use `skip_tests: true` option
- Bypasses quality gates
- Use only for critical fixes

**Force Deploy:**
- Use `force_deploy: true` option
- Deploys even if checks fail
- Use with extreme caution

---

## 📈 Monitoring & Reporting

### Performance Monitoring

**Lighthouse Scores:**
- Performance: Target ≥ 80
- Accessibility: Target ≥ 90
- Best Practices: Target ≥ 80
- SEO: Target ≥ 90

**Core Web Vitals:**
- LCP (Largest Contentful Paint): Target < 2.5s
- FID (First Input Delay): Target < 100ms
- CLS (Cumulative Layout Shift): Target < 0.1

**Bundle Size:**
- Total static assets: Target < 3MB
- Individual assets: Target < 1.5MB

### Security Monitoring

**Dependency Security:**
- Critical vulnerabilities: 0 allowed
- High vulnerabilities: Monitor closely
- Moderate vulnerabilities: Review regularly

**License Compliance:**
- Approved licenses: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, Unlicense, CC0-1.0
- All other licenses: Manual review required

### SEO Monitoring

**Required Elements:**
- ✅ Open Graph tags present
- ✅ Twitter Card tags present
- ✅ JSON-LD structured data
- ✅ Canonical URLs
- ✅ Meta descriptions

**Performance:**
- ✅ Page load time < 2s
- ✅ Mobile-friendly
- ✅ HTTPS enabled
- ✅ Security headers present

---

## 🛠️ Local Development

### Pre-commit Hooks

Install pre-commit hooks:
```bash
npm install -g husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Local Testing

**Run Quality Checks:**
```bash
npm run ci:lint      # ESLint
npm run ci:typecheck # TypeScript
npm run ci:test      # Unit tests
npm run ci:build     # Build check
```

**Run Security Checks:**
```bash
npm run security:audit    # Dependency audit
npm run security:outdated # Check outdated packages
```

**Run Performance Checks:**
```bash
npm run performance:bundle    # Bundle analysis
npm run performance:lighthouse # Lighthouse audit
```

### Local Deployment

**Preview Deployment:**
```bash
npm run pages:build
npm run preview
```

**Production Deployment:**
```bash
CLOUDFLARE_ACCOUNT_ID=your-account-id npm run deploy:production
```

---

## 🔍 Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version (requires 20.x)
- Verify all dependencies installed
- Check for TypeScript errors
- Review ESLint configuration

**Deployment Failures:**
- Verify Cloudflare credentials
- Check account ID configuration
- Review build artifacts
- Check network connectivity

**Performance Issues:**
- Review bundle size limits
- Check for large dependencies
- Optimize images and assets
- Review Lighthouse recommendations

**Security Issues:**
- Update vulnerable dependencies
- Review license compliance
- Check for hardcoded secrets
- Verify security headers

### Debug Commands

**Check Pipeline Status:**
```bash
# View recent workflow runs
gh run list

# View specific workflow
gh run view <run-id>

# Download artifacts
gh run download <run-id>
```

**Local Debugging:**
```bash
# Build with verbose output
npm run ci:build --verbose

# Run tests with coverage
npm run ci:test --coverage

# Check bundle size
npm run ci:budgets
```

---

## 📚 Best Practices

### Code Quality
- Write meaningful commit messages
- Keep PRs small and focused
- Add tests for new features
- Follow TypeScript best practices
- Use ESLint and Prettier consistently

### Security
- Regularly update dependencies
- Use environment variables for secrets
- Review security scan results
- Follow OWASP guidelines
- Implement proper access controls

### Performance
- Monitor bundle sizes
- Optimize images and assets
- Use lazy loading appropriately
- Implement proper caching
- Monitor Core Web Vitals

### Deployment
- Test in preview environment first
- Use feature flags for gradual rollouts
- Monitor deployment health
- Have rollback plan ready
- Document deployment procedures

---

## 🔄 Continuous Improvement

### Pipeline Optimization
- Monitor pipeline execution times
- Optimize build processes
- Reduce unnecessary steps
- Improve error handling
- Add more comprehensive tests

### Monitoring Enhancement
- Add more performance metrics
- Implement alerting systems
- Create dashboards
- Track deployment success rates
- Monitor user experience metrics

### Security Hardening
- Implement additional security scans
- Add compliance checks
- Enhance vulnerability detection
- Implement security policies
- Regular security reviews

---

## 📞 Support

### Getting Help
- Check workflow logs in Gitea Actions
- Review error messages carefully
- Consult this documentation
- Check GitHub Issues
- Contact development team

### Reporting Issues
- Use GitHub Issues for bugs
- Provide detailed error messages
- Include relevant logs
- Describe reproduction steps
- Suggest potential solutions

---

**Last Updated:** 2025-10-09  
**Version:** 1.0.0  
**Maintainer:** Development Team
