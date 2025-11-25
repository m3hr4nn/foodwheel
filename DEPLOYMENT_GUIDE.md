# 🚀 FoodWheel Complete Deployment Guide

This guide will walk you through deploying FoodWheel with:
- **Database**: Supabase (PostgreSQL)
- **Backend API**: Render.com
- **Frontend**: GitHub Pages

Total setup time: ~30-45 minutes | Cost: **100% FREE** 🎉

---

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] GitHub account (for hosting frontend)
- [ ] Supabase account (free) - Sign up at https://supabase.com/
- [ ] Render account (free) - Sign up at https://render.com/
- [ ] Git installed on your computer
- [ ] Node.js 18+ installed (for local testing)

---

## Part 1: Setup Supabase Database (15 minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com/ and sign in
2. Click **"New Project"** button
3. Fill in the project details:
   - **Name**: `foodwheel` (or any name you prefer)
   - **Database Password**: Create a strong password and **SAVE IT SOMEWHERE SAFE**
   - **Region**: Choose the closest region to you (e.g., "West US (North California)")
   - **Pricing Plan**: Free (selected by default)
4. Click **"Create new project"**
5. Wait 2-3 minutes for the database to initialize ☕

### Step 2: Run Database Schema

1. In your Supabase dashboard, click on the **SQL Editor** icon in the left sidebar
2. Click **"New query"** button
3. Open the file `backend/supabase-schema.sql` from this repository
4. Copy **ALL** the SQL code from that file
5. Paste it into the Supabase SQL Editor
6. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
7. You should see "Success. No rows returned" message ✅

### Step 3: Get API Credentials

1. In Supabase dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **API** under Project Settings
3. Find and copy these two values (you'll need them later):

   **Project URL** (looks like):
   ```
   https://abcdefghijklmnop.supabase.co
   ```

   **Anon/Public Key** (starts with `eyJ...` and is very long):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
   ```

4. **IMPORTANT**: Save these in a text file on your computer. Keep them safe but accessible.

### Step 4: Verify Database Setup

1. In Supabase dashboard, click **Table Editor** in the left sidebar
2. You should see 5 tables:
   - ✅ `countries` (with 6 rows)
   - ✅ `categories` (with 9 rows)
   - ✅ `recipes` (empty for now - we'll populate it later)
   - ✅ `ingredients` (empty)
   - ✅ `recipe_ingredients` (empty)

If you see all these tables, **you're done with Supabase!** 🎉

---

## Part 2: Setup Backend on Render.com (10 minutes)

### Step 1: Connect GitHub Repository

1. Make sure this repository is pushed to your GitHub account
2. Go to https://render.com/ and sign in
3. Click **"New +"** button in the top right
4. Select **"Web Service"**
5. Click **"Connect GitHub"** or use the existing connection
6. Find and select your `foodwheel` repository
7. Click **"Connect"**

### Step 2: Configure Web Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `foodwheel-api` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** plan (should be selected by default)

### Step 3: Add Environment Variables

Scroll down to the **Environment Variables** section and add these **3 variables**:

1. Click **"Add Environment Variable"**
   - **Key**: `SUPABASE_URL`
   - **Value**: Paste your Supabase Project URL (from Part 1, Step 3)

2. Click **"Add Environment Variable"** again
   - **Key**: `SUPABASE_ANON_KEY`
   - **Value**: Paste your Supabase Anon Key (from Part 1, Step 3)

3. Click **"Add Environment Variable"** one more time
   - **Key**: `NODE_ENV`
   - **Value**: `production`

### Step 4: Deploy!

1. Click **"Create Web Service"** button at the bottom
2. Render will start building and deploying your backend
3. This takes about 2-3 minutes ☕
4. Watch the logs - you should see:
   ```
   🚀 Server running on port 10000
   📍 Environment: production
   ```
5. Once you see "Live" badge at the top, your API is ready! ✅

### Step 5: Get Your API URL

1. At the top of the Render dashboard, you'll see your service URL:
   ```
   https://foodwheel-api.onrender.com
   ```
2. **COPY THIS URL** - you'll need it later
3. Test it by visiting: `https://your-api-url.onrender.com/api/recipes`
   - You should see: `{"success":true,"count":0,"data":[]}`

**Note**: On the free tier, your API will "sleep" after 15 minutes of inactivity. The first request after sleep takes ~30 seconds to wake up. This is normal! 😴

---

## Part 3: Migrate Recipe Data (5 minutes)

Now let's populate your Supabase database with recipes!

### Step 1: Setup Local Environment

1. Open a terminal and navigate to your project:
   ```bash
   cd /path/to/foodwheel
   cd backend
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with your favorite text editor:
   ```bash
   nano .env
   # or: code .env
   # or: vim .env
   ```

5. Fill in your credentials:
   ```
   PORT=3000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUz...your-long-key
   NODE_ENV=development
   ```

6. Save and close the file

### Step 2: Run Migration Script

1. From the `backend/` directory, run:
   ```bash
   node migrate-data.js
   ```

2. You should see output like:
   ```
   📦 Reading JSON data...
   🌍 Migrating countries...
   ✅ Migrated 14 countries
   📁 Migrating categories...
   ✅ Migrated 37 categories
   🍽️  Migrating recipes...
   ✅ Migrated 50 recipes (0 skipped due to invalid country codes)
   🎉 Migration completed successfully!
   ```

### Step 3: Verify Data

1. Go back to your Supabase dashboard
2. Click **Table Editor** → **recipes**
3. You should now see **50+ recipes** 🎉
4. Test your API: Visit `https://your-api-url.onrender.com/api/recipes`
   - You should see all recipes returned!

---

## Part 4: Deploy Frontend to GitHub Pages (5 minutes)

### Step 1: Update Frontend Configuration

1. Open `config.js` in the root directory
2. Verify the API URL is correct:
   ```javascript
   export const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
     ? 'http://localhost:3000/api'
     : 'https://foodwheel-api.onrender.com/api';  // ← Update this with YOUR Render URL
   ```

3. If your Render URL is different, update it accordingly
4. Save the file

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/m3hr4nn/foodwheel
2. Click **Settings** tab
3. Scroll down and click **Pages** in the left sidebar
4. Under **Source**, select:
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
5. Click **Save**
6. GitHub will show you the URL where your site will be published:
   ```
   https://m3hr4nn.github.io/foodwheel/
   ```

### Step 3: Commit and Push

1. If you made changes to `config.js`, commit them:
   ```bash
   git add config.js
   git commit -m "Update API URL for production"
   git push origin main
   ```

2. GitHub Actions will automatically deploy your site (check the **Actions** tab)
3. Wait 1-2 minutes for deployment to complete

### Step 4: Update CORS Settings

**IMPORTANT**: Your backend needs to allow requests from your GitHub Pages URL!

1. Go back to Render.com dashboard
2. Open your `foodwheel-api` service
3. Click **Environment** in the left sidebar
4. The CORS is already configured in your code (`backend/src/index.js`):
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5500',
       'http://127.0.0.1:5500',
       'https://m3hr4nn.github.io'  // ← Your GitHub Pages URL
     ]
   }));
   ```

5. If your GitHub username is different, you'll need to update this in the code and push to trigger a new deployment

---

## Part 5: Test Everything! (5 minutes)

### Test Checklist

Visit your live site: **https://m3hr4nn.github.io/foodwheel/**

1. ✅ Page loads without errors
2. ✅ Spinning wheel displays with food names
3. ✅ Click "SPIN!" button - wheel spins smoothly
4. ✅ After spin, recipe details appear on the right
5. ✅ Language toggle (فا) switches between English/Persian
6. ✅ Filter dropdowns work (Cuisine, Time)
7. ✅ Filters update the wheel items
8. ✅ No errors in browser console (press F12)

### If Something's Wrong

**Wheel not showing items:**
- Open browser console (F12) → Console tab
- Check for API errors
- Verify your Render API is running: visit `https://your-api-url.onrender.com/api/recipes`

**API returning empty data:**
- Double-check you ran the migration script successfully
- Check Supabase Table Editor - recipes table should have data

**CORS errors:**
- Verify your GitHub Pages URL is in the CORS whitelist in `backend/src/index.js`
- Push changes and wait for Render to redeploy

---

## 🎉 You're Done!

Congratulations! You now have a fully deployed full-stack application:

- ✅ **Database**: Supabase PostgreSQL with 50+ recipes
- ✅ **Backend API**: Render.com with Express.js
- ✅ **Frontend**: GitHub Pages with vanilla JavaScript
- ✅ **Cost**: $0.00 per month!

### What's Next?

- Add more recipes via Supabase Table Editor
- Share your app with friends!
- Customize the design
- Add new features

---

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│  User Browser                           │
│  https://m3hr4nn.github.io/foodwheel/   │
└──────────────┬──────────────────────────┘
               │
               │ HTTP Requests
               ↓
┌─────────────────────────────────────────┐
│  Render.com API Server                  │
│  https://foodwheel-api.onrender.com     │
│  (Express.js + Node.js)                 │
└──────────────┬──────────────────────────┘
               │
               │ SQL Queries
               ↓
┌─────────────────────────────────────────┐
│  Supabase PostgreSQL Database           │
│  (Recipes, Countries, Categories)       │
└─────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Issue: Render API is slow to respond

**Solution**: This is normal on the free tier. The first request after 15 minutes of inactivity takes ~30 seconds. Subsequent requests are fast.

### Issue: GitHub Pages shows 404

**Solution**:
- Make sure you pushed to the correct branch
- Check Settings → Pages is enabled
- Wait a few minutes for GitHub Actions to complete

### Issue: Data not loading

**Solution**:
1. Check if migration completed successfully
2. Verify Supabase has data: Table Editor → recipes
3. Test API directly: `https://your-api-url.onrender.com/api/recipes`
4. Check browser console for errors

### Issue: Persian text shows as boxes/gibberish

**Solution**: This shouldn't happen with modern browsers, but ensure:
- UTF-8 encoding in HTML
- `<html lang="fa" dir="rtl">` is set correctly

---

## 📝 Important URLs to Save

Once deployed, save these URLs:

| Service | URL | Notes |
|---------|-----|-------|
| **Frontend** | https://m3hr4nn.github.io/foodwheel/ | Your live app |
| **Backend API** | https://foodwheel-api.onrender.com | Your API |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/YOUR_PROJECT_ID | Manage database |
| **Render Dashboard** | https://dashboard.render.com/ | Manage API |

---

## 🔄 Updating Your App

### Update Recipes (via Supabase Dashboard)
1. Go to Supabase → Table Editor → recipes
2. Click "Insert" or edit existing rows
3. Changes are live immediately!

### Update Frontend Code
1. Make changes locally
2. Commit and push to GitHub
3. GitHub Actions auto-deploys (1-2 minutes)

### Update Backend Code
1. Make changes in `backend/` directory
2. Commit and push to GitHub
3. Render auto-deploys (2-3 minutes)

---

## 🆘 Need Help?

- **Repository Issues**: https://github.com/m3hr4nn/foodwheel/issues
- **Supabase Docs**: https://supabase.com/docs
- **Render Docs**: https://render.com/docs
- **GitHub Pages Docs**: https://docs.github.com/pages

---

## 📄 Free Tier Limits

| Service | Free Tier Limit | Notes |
|---------|----------------|-------|
| **Supabase** | 500MB database, 2GB bandwidth/month | More than enough for this app |
| **Render** | 750 hours/month, sleeps after 15min | Perfect for personal projects |
| **GitHub Pages** | Unlimited static hosting | No limits! |

**Total Cost**: $0/month forever! 🎉

---

Made with ❤️ for FoodWheel
