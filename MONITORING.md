# Production Monitoring Guide

## Overview

This guide covers monitoring for the Next.js 15.2.2+ upgrade and CVE-2025-48068 mitigation implemented in the production deployment.

## Key Areas to Monitor

### 1. Next.js Upgrade Issues
- **Server-side rendering errors**: Check for hydration mismatches
- **Build output**: Verify `.next` directory structure
- **Performance**: Monitor response times and bundle sizes
- **Compatibility**: Ensure all dependencies work with Next.js 15.2.2+

### 2. Content Security Policy (CSP)
- **Header presence**: Verify CSP headers are being sent
- **Policy violations**: Monitor for CSP violation reports
- **Script execution**: Check for blocked inline scripts or eval usage
- **Cross-origin requests**: Ensure allowed origins are properly configured

### 3. CVE-2025-48068 Mitigation
- **allowedDevOrigins**: Verify configuration is applied
- **Development mode security**: Check for unauthorized access attempts
- **Origin validation**: Monitor for bypassed origin checks

## Monitoring Tools

### Automated Monitoring Script

Use the provided `monitor-production.js` script:

```bash
# Set your production URL
export PRODUCTION_URL="https://your-production-site.com"

# Run a single health check
node monitor-production.js check

# Start continuous monitoring (every 60 seconds)
node monitor-production.js start

# Generate a monitoring report
node monitor-production.js report
```

### Manual Checks

#### 1. Verify CSP Headers
```bash
curl -I https://your-site.com | grep -i content-security-policy
```

Expected CSP policy:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';
```

#### 2. Check Next.js Version
```bash
curl -I https://your-site.com | grep -i x-powered-by
```

Should show: `X-Powered-By: Next.js`

#### 3. Test Key Endpoints
```bash
# Homepage
curl -o /dev/null -s -w "%{http_code} %{time_total}s\n" https://your-site.com

# Blog
curl -o /dev/null -s -w "%{http_code} %{time_total}s\n" https://your-site.com/blog

# Support page
curl -o /dev/null -s -w "%{http_code} %{time_total}s\n" https://your-site.com/support
```

#### 4. Verify allowedDevOrigins Configuration
Check that the Next.js config contains the security fix:
```bash
grep -n "allowedDevOrigins" next.config.js
```

## Log Analysis

### Server Logs
Monitor your hosting platform's logs for:
- **Error messages** containing "Next.js", "CSP", or "eval"
- **500/502/503 errors** indicating server issues
- **Performance warnings** about slow responses
- **Security alerts** related to CSP violations

### Browser Console
Check client-side for:
- **CSP violation reports**
- **JavaScript errors** after the upgrade
- **Network failures** for API endpoints
- **Hydration errors** in React components

## CI/CD Pipeline Monitoring

The GitHub Actions workflow (`.github/workflows/ci.yml`) includes:
- ✅ **allowedDevOrigins verification**
- ✅ **Build success validation**
- ✅ **Linting and testing**
- ✅ **Next.js compatibility checks**

Monitor failed builds and ensure all checks pass before deployment.

## Alert Thresholds

### Critical Issues (Immediate Action Required)
- **HTTP 5xx errors**: Server is down or misconfigured
- **Build failures**: Deployment pipeline broken
- **CSP violations**: Security policy being bypassed
- **Response times > 10s**: Severe performance degradation

### Warnings (Monitor Closely)
- **HTTP 4xx errors**: Client-side issues or broken links
- **Missing CSP headers**: Security headers not being sent
- **Response times > 5s**: Performance concerns
- **High error rates**: Increased failure percentage

## Troubleshooting Common Issues

### 1. CSP Violations
```bash
# Check if CSP is too restrictive
curl -H "Content-Security-Policy-Report-Only: default-src 'self'" https://your-site.com
```

### 2. Next.js Hydration Errors
- Check for client/server rendering mismatches
- Verify environment variables are consistent
- Ensure dynamic imports work correctly

### 3. Performance Issues
```bash
# Check bundle size
npm run build && du -sh .next/static/

# Analyze performance
npx next build --profile
```

### 4. CVE-2025-48068 Verification
Verify the fix is working:
```bash
# Check that allowedDevOrigins is configured
node -e "console.log(require('./next.config.js').allowedDevOrigins)"
```

## Maintenance Tasks

### Daily
- [ ] Review monitoring logs for errors
- [ ] Check response times and availability
- [ ] Verify CSP headers are present

### Weekly
- [ ] Generate monitoring report
- [ ] Review CI/CD pipeline success rates
- [ ] Check for new security advisories

### Monthly
- [ ] Audit CSP policy effectiveness
- [ ] Review and update monitoring thresholds
- [ ] Validate Next.js version and dependencies

## Emergency Response

If critical issues are detected:

1. **Check service availability** using monitoring tools
2. **Review recent deployments** for potential causes
3. **Check server logs** for detailed error information
4. **Consider rollback** if issues persist
5. **Update monitoring** to prevent future occurrences

## Resources

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [Content Security Policy Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CVE-2025-48068 Details](https://github.com/vercel/next.js/security/advisories)
