# 🚀 Quick Deployment Guide

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import `cannabis-store-ecommerce` repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js (auto-detected)
6. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url.railway.app/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_your_stripe_key
   ```
7. Click "Deploy"

### Option 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: cannabis-store-frontend
# - Directory: ./
# - Override settings? No
```

## Backend Deployment (Railway)

### Deploy Backend to Railway
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `cannabis-store-ecommerce`
5. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   ```
   PORT = 5000
   FRONTEND_URL = https://your-vercel-app.vercel.app
   JWT_SECRET = your_super_secret_jwt_key_here
   STRIPE_SECRET_KEY = sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET = whsec_your_webhook_secret
   ```
7. Add PostgreSQL Database:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will auto-configure DB environment variables

## Quick Setup Commands

### 1. Test Local Build
```bash
# Test frontend build
cd frontend
npm run build
npm start

# Test backend
cd ../backend
npm start
```

### 2. Environment Variables Template

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

**Backend (.env):**
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cannabis_store
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Post-Deployment Checklist

### ✅ Frontend Deployed
- [ ] Vercel deployment successful
- [ ] Custom domain configured (optional)
- [ ] Environment variables set
- [ ] Site loads correctly

### ✅ Backend Deployed  
- [ ] Railway deployment successful
- [ ] Database connected
- [ ] Environment variables configured
- [ ] API endpoints responding

### ✅ Integration Testing
- [ ] Frontend can reach backend API
- [ ] User registration works
- [ ] Product loading works
- [ ] Cart functionality works
- [ ] Stripe payments work (test mode)

## Live URLs
After deployment, you'll have:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.railway.app
- **API**: https://your-backend.railway.app/api

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check package.json dependencies
2. **API Not Connecting**: Verify CORS settings and URLs
3. **Database Issues**: Check connection strings
4. **Environment Variables**: Ensure all required vars are set

### Debug Commands:
```bash
# Check build logs
vercel logs

# Test API endpoint
curl https://your-backend.railway.app/api/health

# Check database connection
# (Run in Railway console)
npm run test-db
```

---
**Your cannabis store will be live in minutes! 🌿🚀**