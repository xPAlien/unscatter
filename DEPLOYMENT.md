# Deployment Guide

This guide covers deploying both the frontend (React app) and backend (API server) for Unscatter.

## Architecture Overview

```
┌─────────────┐      HTTPS      ┌──────────────┐      API Key      ┌────────────────┐
│   Frontend  │ ───────────────> │    Backend   │ ───────────────> │  Gemini API   │
│  (React)    │   /api/analyze   │   (Node.js)  │   Secure Server  │   (Google)    │
└─────────────┘                  └──────────────┘                   └────────────────┘
```

## Prerequisites

- Node.js 16+ installed
- Gemini API key from https://aistudio.google.com/apikey
- Git repository
- Accounts on chosen hosting platforms

---

## Backend Deployment

The backend MUST be deployed first since the frontend depends on it.

### Option 1: Railway (Recommended)

**Pros**: Easy setup, automatic deploys, generous free tier

1. **Create account** at railway.app
2. **New Project** → **Deploy from GitHub**
3. **Select your repository**
4. **Configure**:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables**:
   ```
   GEMINI_API_KEY=your_api_key_here
   NODE_ENV=production
   PORT=3001
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```
6. **Deploy** → Copy the generated URL (e.g., `https://your-app.up.railway.app`)

### Option 2: Render

1. **Create account** at render.com
2. **New** → **Web Service**
3. **Connect repository**
4. **Configure**:
   - Name: unscatter-api
   - Root Directory: `server`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables** (same as Railway)
6. **Create Web Service** → Copy the URL

### Option 3: Heroku

1. Install Heroku CLI
2. Create `Procfile` in server directory:
   ```
   web: node index.js
   ```
3. Deploy:
   ```bash
   cd server
   heroku create unscatter-api
   heroku config:set GEMINI_API_KEY=your_key_here
   heroku config:set NODE_ENV=production
   git subtree push --prefix server heroku main
   ```

### Option 4: DigitalOcean App Platform

1. Create account at digitalocean.com
2. **Apps** → **Create App**
3. **Select GitHub repository**
4. Configure app spec:
   ```yaml
   name: unscatter-api
   services:
   - name: api
     source_dir: /server
     environment_slug: node-js
     http_port: 3001
     envs:
     - key: GEMINI_API_KEY
       value: your_key_here
       type: SECRET
   ```

---

## Frontend Deployment

### Update Frontend Configuration

1. Create `.env` file:
   ```env
   VITE_API_URL=https://your-backend-url.com
   ```

2. Update for production in your deployment platform's environment variables.

### Option 1: Netlify (Recommended for Frontend)

**Pros**: CDN, automatic SSL, easy setup

1. **Create account** at netlify.com
2. **New site from Git**
3. **Connect repository**
4. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Environment variables**:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
6. **Deploy**

**Note**: The `public/_headers` file will automatically configure security headers.

### Option 2: Vercel

1. **Create account** at vercel.com
2. **Import Project** from GitHub
3. **Configure**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
5. **Deploy**

### Option 3: Cloudflare Pages

1. **Create account** at cloudflare.com
2. **Pages** → **Create a project**
3. **Connect to Git**
4. **Build settings**:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
5. **Environment variables**: Add `VITE_API_URL`
6. **Save and Deploy**

---

## Post-Deployment Configuration

### 1. Update CORS on Backend

Update your backend's `ALLOWED_ORIGINS` environment variable with your actual frontend URL:

```env
ALLOWED_ORIGINS=https://your-app.netlify.app,https://www.yourdomain.com
```

### 2. Configure Google API Key Restrictions

In Google Cloud Console:

1. Go to **APIs & Services** → **Credentials**
2. Click on your API key
3. Under **Application restrictions**:
   - Select **HTTP referrers**
   - Add your frontend URLs:
     - `https://your-app.netlify.app/*`
     - `https://www.yourdomain.com/*`
4. Under **API restrictions**:
   - Select **Restrict key**
   - Select: Generative Language API
5. **Save**

### 3. Set Up Custom Domain (Optional)

**Netlify**:
1. **Domain settings** → **Add custom domain**
2. Follow DNS configuration steps
3. SSL is automatic

**Vercel**:
1. **Settings** → **Domains**
2. Add your domain
3. Configure DNS
4. SSL is automatic

### 4. Enable Analytics (Optional)

Add privacy-friendly analytics like [Plausible](https://plausible.io) or [Simple Analytics](https://simpleanalytics.com).

---

## Testing Deployment

### Health Check

Test backend:
```bash
curl https://your-backend-url.com/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-..."}
```

### End-to-End Test

1. Visit your frontend URL
2. Enter some text
3. Click "Unscatter"
4. Verify analysis appears

### Check Security Headers

```bash
curl -I https://your-frontend-url.com
```

Should include:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy: ...`

---

## Monitoring

### Backend Monitoring

Most platforms provide built-in monitoring:
- Railway: Metrics tab
- Render: Metrics & Logs
- Heroku: Application metrics

### Error Tracking

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [Better Stack](https://betterstack.com) for uptime monitoring

### Set Up Alerts

Configure alerts for:
- Server downtime
- High error rates
- Unusual traffic patterns
- API quota warnings

---

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        # Add your deployment steps

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Netlify
        # Add your deployment steps
```

---

## Rollback Procedure

### Frontend (Netlify/Vercel)

Both platforms keep deployment history:
1. Go to **Deploys**
2. Find previous working deployment
3. Click **Publish deploy** or **Promote to Production**

### Backend

1. Revert to previous commit in Git
2. Push to trigger redeploy
3. Or use platform's rollback feature if available

---

## Cost Estimates

### Free Tier (Hobby Projects)

- **Backend**: Railway/Render free tier (~500 hours/month)
- **Frontend**: Netlify/Vercel free tier (unlimited)
- **Total**: $0/month for low traffic

### Production (Moderate Traffic)

- **Backend**: Railway Pro ($5/month) or Render Starter ($7/month)
- **Frontend**: Netlify Pro ($19/month) or Vercel Pro ($20/month)
- **Gemini API**: Pay-as-you-go (~$0.10 per 1K requests)
- **Total**: ~$30-50/month

---

## Troubleshooting

### "Failed to fetch" errors

- Check `VITE_API_URL` is correct
- Verify backend is running
- Check CORS configuration
- Look at browser console for details

### "Authentication error"

- Verify `GEMINI_API_KEY` is set on backend
- Check API key is valid in Google Cloud Console
- Ensure API restrictions allow your backend's IP/domain

### "Rate limit exceeded"

- Backend rate limit: Wait 5 minutes
- Adjust rate limits in `server/index.js` if needed

### Build failures

- Clear build cache
- Delete `node_modules` and `package-lock.json`
- Run `npm install` and `npm run build` locally first

---

## Security Checklist

Before going live:

- [ ] HTTPS enabled on both frontend and backend
- [ ] API key stored in environment variables (not in code)
- [ ] CORS properly configured
- [ ] API key restrictions set in Google Cloud Console
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Error messages sanitized
- [ ] Monitoring and alerts set up

---

## Support

For deployment issues:
- Check platform-specific documentation
- Review application logs
- Open an issue on GitHub
- Contact support@your-domain.com
