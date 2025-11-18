# Security Policy

## Overview

Unscatter takes security seriously. This document outlines our security architecture and best practices.

## Security Architecture

### Backend API Proxy

**Critical**: The Gemini API key is now secured on the backend server, not exposed in the client-side code.

- All API requests go through a backend proxy at `/api/analyze`
- API key is stored as an environment variable on the server
- Client-side JavaScript cannot access the API key

### Rate Limiting

**Client-Side**: 10 requests per minute per user
**Server-Side**: 20 requests per 5 minutes per IP address

This prevents abuse and protects against DoS attacks.

### Input Sanitization

All user input is sanitized to prevent:
- Prompt injection attacks
- XSS attacks
- Excessive input lengths

### File Upload Security

- File type verification using magic numbers (not just MIME types)
- File size limits (4MB per file, 10 files maximum)
- Accepted formats: PNG, JPEG, WEBP only

### Error Handling

- Error messages are sanitized to prevent information disclosure
- Internal errors are logged but not exposed to users
- Stack traces are never shown in production

### Security Headers

The following security headers are configured:
- `Content-Security-Policy`: Restricts resource loading
- `X-Frame-Options: DENY`: Prevents clickjacking
- `X-Content-Type-Options: nosniff`: Prevents MIME sniffing
- `Strict-Transport-Security`: Enforces HTTPS
- `Permissions-Policy`: Disables unnecessary browser APIs

## Reporting Security Issues

If you discover a security vulnerability, please email security@your-domain.com or create a private security advisory on GitHub.

**Please do not** create public issues for security vulnerabilities.

## Security Best Practices for Deployment

### 1. API Key Management

```bash
# NEVER commit API keys to version control
# Use environment variables
GEMINI_API_KEY=your_key_here

# Rotate keys regularly
# Set up API key restrictions in Google Cloud Console
```

### 2. HTTPS Only

Always deploy with HTTPS enabled. Use services like:
- Let's Encrypt (free SSL certificates)
- Cloudflare (free SSL + DDoS protection)
- Netlify/Vercel (automatic HTTPS)

### 3. Environment Variables

```env
# Backend (.env)
GEMINI_API_KEY=xxx
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com

# Frontend (.env)
VITE_API_URL=https://your-api.com
```

### 4. CORS Configuration

Configure CORS to only allow your frontend domain:

```javascript
cors({
  origin: 'https://yourdomain.com',
  credentials: true
})
```

### 5. Rate Limiting

Monitor and adjust rate limits based on usage patterns.

### 6. Monitoring

Set up monitoring for:
- Failed login attempts (if you add authentication)
- Rate limit violations
- Unusual API usage patterns
- Error rates

## Security Checklist

Before deploying to production:

- [ ] API key stored in environment variables (not in code)
- [ ] HTTPS enabled and enforced
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Error messages sanitized
- [ ] File upload validation enabled
- [ ] CSP headers configured
- [ ] Monitoring and logging set up
- [ ] API key restrictions set in Google Cloud Console

## Known Limitations

1. **Client-Side Rate Limiting**: Can be bypassed by clearing browser cache. Server-side rate limiting is the primary defense.

2. **File Size**: Large files may cause memory issues. Consider adding streaming upload for larger files in the future.

3. **No Authentication**: Currently, there's no user authentication. Consider adding authentication for production use.

## Future Security Enhancements

- [ ] User authentication (OAuth2, JWT)
- [ ] Request signing/HMAC
- [ ] Rate limiting per authenticated user
- [ ] Audit logging
- [ ] Automated security scanning (Snyk, Dependabot)
- [ ] Content integrity monitoring

## Dependencies

All dependencies are regularly audited using `npm audit`. No known vulnerabilities as of last check.

Run security audit:
```bash
npm audit
npm audit fix
```

## Compliance

- **GDPR**: No personal data is stored. API requests are not logged with PII.
- **Data Retention**: Analysis results are cached for 5 minutes, then deleted.
- **Third-Party**: Only Google Gemini API is used for processing.

## Contact

For security concerns, contact: security@your-domain.com
