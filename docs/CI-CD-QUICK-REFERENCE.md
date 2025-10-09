# CI/CD Quick Reference Guide

## 🚀 Quick Start

### Setup CI/CD Pipeline
```bash
# Run the setup script
./scripts/setup-cicd.sh

# Or manually check workflow files
ls -la .gitea/workflows/
```

### Test Locally
```bash
# Run all quality checks
npm run ci:lint && npm run ci:typecheck && npm run ci:test

# Build and test
npm run ci:build

# Check performance
npm run performance:bundle
```

---

## 📋 Workflow Files

| File | Purpose | Triggers |
|------|---------|----------|
| `enhanced-ci.yaml` | Main CI/CD pipeline | Push, PR, Manual |
| `deploy.yaml` | Deployment pipeline | Manual, Scheduled |
| `security.yaml` | Security scanning | Push, PR, Daily |
| `performance.yaml` | Performance monitoring | Push, PR, Daily |

---

## 🔧 Configuration

### Required Environment Variables
```bash
CLOUDFLARE_ACCOUNT_ID=5cee6a21cea282a9c89d5297964402e7
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
```

### Optional Variables
```bash
TOTAL_STATIC_MAX_BYTES=3000000
MAX_ASSET_BYTES=1500000
LHCI_GITHUB_APP_TOKEN=your-lighthouse-ci-token
```

---

## 🎯 Quality Gates

### Code Quality
- ✅ ESLint passes
- ✅ TypeScript compiles
- ✅ Code formatted
- ✅ Tests pass

### Performance
- ✅ Lighthouse Performance ≥ 80
- ✅ Lighthouse SEO ≥ 90
- ✅ Bundle size under budget
- ✅ Core Web Vitals OK

### Security
- ✅ No critical vulnerabilities
- ✅ Approved licenses
- ✅ No hardcoded secrets
- ✅ Security headers present

---

## 🚀 Deployment Commands

### Local Development
```bash
# Start development server
npm run dev

# Build for production
npm run ci:build

# Preview locally
npm run preview
```

### Deploy to Preview
```bash
# Via npm script
npm run deploy:preview

# Via Gitea Actions
# Go to Actions → Deploy → Select "preview"
```

### Deploy to Production
```bash
# Via npm script
npm run deploy:production

# Via Gitea Actions
# Go to Actions → Deploy → Select "production"
```

---

## 📊 Monitoring

### Performance Metrics
- **Lighthouse Performance**: Target ≥ 80
- **Lighthouse SEO**: Target ≥ 90
- **Bundle Size**: Target < 3MB total
- **Response Time**: Target < 2s

### Security Metrics
- **Critical Vulnerabilities**: 0 allowed
- **High Vulnerabilities**: Monitor closely
- **License Compliance**: Approved licenses only

### SEO Metrics
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ JSON-LD structured data
- ✅ Canonical URLs
- ✅ Meta descriptions

---

## 🛠️ Troubleshooting

### Common Issues

**Build Fails**
```bash
# Check Node.js version
node --version  # Should be 20.x

# Check dependencies
npm ci

# Check TypeScript
npm run ci:typecheck
```

**Deployment Fails**
```bash
# Check Cloudflare credentials
echo $CLOUDFLARE_ACCOUNT_ID
echo $CLOUDFLARE_API_TOKEN

# Test build locally
npm run ci:build

# Check build artifacts
ls -la .vercel/output/
```

**Performance Issues**
```bash
# Check bundle size
npm run ci:budgets

# Run Lighthouse
npm run performance:lighthouse

# Check for large files
find .vercel/output/static -size +500k
```

**Security Issues**
```bash
# Audit dependencies
npm run security:audit

# Check outdated packages
npm run security:outdated

# Fix vulnerabilities
npm audit fix
```

---

## 🔍 Debug Commands

### Pipeline Status
```bash
# View workflow runs
gh run list

# View specific run
gh run view <run-id>

# Download artifacts
gh run download <run-id>
```

### Local Debugging
```bash
# Verbose build
npm run ci:build --verbose

# Test with coverage
npm run ci:test --coverage

# Check bundle analysis
npm run ci:budgets
```

---

## 📚 Useful Scripts

### Package.json Scripts
```bash
# CI Scripts
npm run ci:lint      # ESLint
npm run ci:typecheck # TypeScript
npm run ci:test      # Unit tests
npm run ci:build     # Build
npm run ci:budgets   # Bundle analysis

# Formatting
npm run format       # Format code
npm run format:check # Check formatting

# Security
npm run security:audit    # Audit dependencies
npm run security:outdated # Check outdated
npm run security:fix      # Fix vulnerabilities

# Performance
npm run performance:lighthouse # Lighthouse audit
npm run performance:bundle     # Bundle analysis

# Deployment
npm run deploy:preview    # Deploy to preview
npm run deploy:production # Deploy to production
```

---

## 🎯 Best Practices

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

## 📞 Support

### Getting Help
- Check workflow logs in Gitea Actions
- Review error messages carefully
- Consult documentation
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
