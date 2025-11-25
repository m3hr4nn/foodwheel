# ⚡ Quick Start Guide

**Already know what you're doing?** Use this checklist!

## 🎯 3-Step Deployment

### 1️⃣ Supabase (Database)
```bash
# 1. Create project at https://supabase.com/
# 2. Run backend/supabase-schema.sql in SQL Editor
# 3. Save these from Settings → API:
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxx...
```

### 2️⃣ Render (Backend)
```bash
# 1. Create Web Service at https://render.com/
# 2. Connect GitHub repo
# 3. Settings:
Root Directory: backend
Build Command: npm install
Start Command: npm start
# 4. Add Environment Variables (from step 1)
# 5. Deploy!
# 6. Save your API URL:
API_URL=https://foodwheel-api.onrender.com
```

### 3️⃣ GitHub Pages (Frontend)
```bash
# 1. Enable Pages: Settings → Pages → Source: main branch
# 2. Migrate data:
cd backend
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
node migrate-data.js
# 3. Done! Visit: https://m3hr4nn.github.io/foodwheel/
```

## 📝 Quick Commands

### Local Development
```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with credentials
npm run dev

# Frontend (no build needed)
python -m http.server 8000
# or use VS Code Live Server
```

### Migrate Data
```bash
cd backend
node migrate-data.js
```

### Test API
```bash
curl https://your-api-url.onrender.com/api/recipes
```

## 🔗 Important URLs

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Render Dashboard**: https://dashboard.render.com/
- **GitHub Pages**: https://m3hr4nn.github.io/foodwheel/
- **API**: https://foodwheel-api.onrender.com/api

## 📚 Full Guide

For detailed step-by-step instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
