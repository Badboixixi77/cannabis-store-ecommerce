# 🚀 Deployment Guide

## GitHub Repository Setup

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `cannabis-store-ecommerce`
3. Description: `Full-stack cannabis e-commerce platform with Next.js, Node.js, PostgreSQL & Stripe`
4. Set to Public or Private (your choice)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 2. Push to GitHub
```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cannabis-store-ecommerce.git

# Push to GitHub
git push -u origin main
```

## 🌐 Vercel Deployment (Frontend)

### 1. Deploy Frontend
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your `cannabis-store-ecommerce` repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2. Environment Variables (Vercel)
Add these in Vercel dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

## 🔧 Backend Deployment Options

### Option 1: Railway
1. Go to https://railway.app
2. Connect GitHub repository
3. Select backend folder
4. Add environment variables:
```
PORT=5000
FRONTEND_URL=https://your-vercel-app.vercel.app
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=cannabis_store
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Option 2: Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-cannabis-store-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
heroku config:set FRONTEND_URL=https://your-vercel-app.vercel.app

# Deploy
git subtree push --prefix backend heroku main
```

### Option 3: DigitalOcean App Platform
1. Create new app from GitHub
2. Select backend folder
3. Configure environment variables
4. Deploy

## 🗄️ Database Setup (Production)

### Option 1: Railway PostgreSQL
- Automatically provisioned with Railway deployment
- Get connection details from Railway dashboard

### Option 2: Heroku Postgres
- Add Heroku Postgres addon
- Connection details in Heroku config vars

### Option 3: Supabase
1. Create project at https://supabase.com
2. Get connection details
3. Run schema in SQL editor

### Option 4: PlanetScale (MySQL alternative)
1. Create database at https://planetscale.com
2. Adapt schema for MySQL
3. Update connection config

## 🔐 Production Security Checklist

### Environment Variables
- [ ] Strong JWT secret (32+ characters)
- [ ] Production Stripe keys
- [ ] Secure database credentials
- [ ] CORS configured for production domains

### Database Security
- [ ] Database user with minimal privileges
- [ ] SSL connections enabled
- [ ] Regular backups configured

### Application Security
- [ ] Rate limiting configured
- [ ] Helmet security headers
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced

## 📊 Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Uptime Monitoring**: UptimeRobot
- **Performance**: Vercel Analytics

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🌍 Domain Setup

### Custom Domain
1. Purchase domain (e.g., yourstore.com)
2. Add to Vercel project
3. Configure DNS records
4. Enable SSL certificate

### Subdomain Structure
- `www.yourstore.com` → Frontend
- `api.yourstore.com` → Backend
- `admin.yourstore.com` → Admin panel

## 📈 Post-Deployment

### 1. Test Everything
- [ ] User registration/login
- [ ] Product browsing
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Payment processing
- [ ] Order management

### 2. SEO Setup
- [ ] Google Search Console
- [ ] Sitemap generation
- [ ] Meta tags optimization
- [ ] Schema markup for products

### 3. Legal Compliance
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Age verification
- [ ] Local cannabis regulations compliance

## 🎯 Performance Optimization

### Frontend
- [ ] Image optimization
- [ ] Code splitting
- [ ] Caching strategies
- [ ] CDN setup

### Backend
- [ ] Database indexing
- [ ] Query optimization
- [ ] Redis caching
- [ ] Load balancing

---

**Ready to deploy your cannabis store to the world! 🌿🚀**