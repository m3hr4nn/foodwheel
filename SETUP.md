# 🎡 FoodWheel - Full Stack Setup Guide

## 🏗️ Architecture

```
Frontend (GitHub Pages) → Backend API (Render.com) → Database (Supabase)
```

## 📋 Prerequisites

- Node.js 18+ installed
- GitHub account
- Supabase account (free tier)
- Render.com account (free tier)

---

## 1️⃣ Supabase Setup

### Step 1: Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Name: `foodwheel`
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Click "Create new project"

### Step 2: Run SQL Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy contents from `backend/supabase-schema.sql`
3. Paste and run it
4. Verify tables created: countries, categories, recipes, ingredients

### Step 3: Get API Credentials
1. Go to Settings → API
2. Copy:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **Anon/Public Key** (starts with `eyJ...`)

---

## 2️⃣ Backend Setup (Local Development)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
PORT=3000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxx...
NODE_ENV=development
```

### Step 3: Migrate Data to Supabase
```bash
node migrate-data.js
```

This will import all recipes from `data/foods.json` to Supabase.

### Step 4: Start Development Server
```bash
npm run dev
```

API will be running at `http://localhost:3000`

Test endpoints:
- http://localhost:3000/api/recipes
- http://localhost:3000/api/countries
- http://localhost:3000/api/categories

---

## 3️⃣ Render.com Deployment

### Step 1: Create Web Service
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo: `m3hr4nn/foodwheel`
4. Configure:
   - **Name**: `foodwheel-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 2: Add Environment Variables
In Render dashboard, add:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `NODE_ENV`: `production`

### Step 3: Deploy
1. Click "Create Web Service"
2. Wait for deployment (~2-3 minutes)
3. Your API URL will be: `https://foodwheel-api.onrender.com`

### Step 4: Test API
```bash
curl https://foodwheel-api.onrender.com/api/recipes
```

---

## 4️⃣ Frontend Setup

### Local Development
```bash
# Open with Live Server or any HTTP server
# Frontend will automatically use localhost:3000 for API
```

### Production (GitHub Pages)
Frontend is already configured to use:
- **Local**: `http://localhost:3000/api`
- **Production**: `https://foodwheel-api.onrender.com/api`

No changes needed! Just push to GitHub.

---

## 🚀 Deployment Checklist

- [ ] Supabase project created
- [ ] SQL schema executed
- [ ] Data migrated to Supabase
- [ ] Render.com web service created
- [ ] Environment variables set on Render
- [ ] API deployed and accessible
- [ ] Frontend pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Test full application flow

---

## 🧪 Testing

### Test API Endpoints
```bash
# Get all recipes
curl https://foodwheel-api.onrender.com/api/recipes

# Get recipes by country
curl https://foodwheel-api.onrender.com/api/recipes?country=IR

# Get countries
curl https://foodwheel-api.onrender.com/api/countries
```

### Test Frontend
1. Open: https://m3hr4nn.github.io/foodwheel/
2. Check browser console for API calls
3. Spin the wheel
4. Try filters

---

## 🔄 Update Workflow

### Update Recipes
1. Edit in Supabase dashboard (Table Editor)
2. Changes reflect immediately (no deployment needed)

### Update Backend Code
1. Commit changes to GitHub
2. Render auto-deploys from `main` branch

### Update Frontend
1. Commit changes to GitHub
2. GitHub Actions auto-deploys to Pages

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/recipes` | GET | Get all recipes |
| `/api/recipes?country=IR` | GET | Filter by country |
| `/api/recipes?maxTime=30` | GET | Filter by cooking time |
| `/api/recipes/:id` | GET | Get single recipe |
| `/api/countries` | GET | Get all countries |
| `/api/categories` | GET | Get all categories |

---

## 🐛 Troubleshooting

### API Not Responding
- Check Render logs in dashboard
- Verify environment variables are set
- Check Supabase connection

### CORS Errors
- Verify GitHub Pages URL in backend CORS config
- Check API URL in frontend config

### Data Not Loading
- Check browser console for errors
- Verify Supabase RLS policies are set
- Test API endpoints directly

---

## 💰 Cost (Free Tier Limits)

- **Supabase**: 500MB database, 2GB bandwidth/month
- **Render**: 750 hours/month (sleeps after 15min inactivity)
- **GitHub Pages**: Unlimited static hosting

**Note**: Render free tier spins down after inactivity. First request after sleep takes ~30 seconds.

---

## 🎉 You're Done!

Your FoodWheel app is now fully deployed with:
- ✅ Frontend on GitHub Pages
- ✅ Backend API on Render.com
- ✅ Database on Supabase
- ✅ Automatic deployments
- ✅ Free hosting!
