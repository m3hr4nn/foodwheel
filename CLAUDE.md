# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FoodWheel is a full-stack web application that helps users decide what to eat by spinning an interactive wheel to randomly select from 50+ Iranian and international dishes. The application features a complete recipe database with detailed cooking instructions, ingredient lists, and multi-language support (Persian/English).

**Live Demo**: https://m3hr4nn.github.io/foodwheel/

## Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│  GitHub Pages   │─────▶│  Render.com API  │─────▶│  Supabase   │
│   (Frontend)    │      │    (Backend)     │      │ (Database)  │
└─────────────────┘      └──────────────────┘      └─────────────┘
```

### Tech Stack

**Frontend**:
- Pure vanilla JavaScript (no frameworks)
- HTML5 Canvas API for wheel rendering
- Web Audio API for sound effects
- CSS3 with RTL support for Persian
- Deployed on GitHub Pages

**Backend**:
- Node.js 18+ with ES Modules
- Express.js REST API
- Supabase JavaScript client
- CORS enabled for cross-origin requests
- Deployed on Render.com (free tier)

**Database**:
- PostgreSQL via Supabase
- UTF-8 encoding for Persian content
- Relational schema with foreign keys

## Project Structure

```
foodwheel/
├── index.html              # Main HTML file (RTL for Persian)
├── app.js                  # Frontend JavaScript (389 lines)
├── style.css               # Styles with responsive design (463 lines)
├── config.js               # API endpoint configuration
├── backend/
│   ├── package.json        # Backend dependencies
│   ├── src/
│   │   ├── index.js        # Express server entry point
│   │   ├── config/
│   │   │   └── supabase.js # Supabase client configuration
│   │   ├── routes/
│   │   │   └── recipes.js  # API route definitions
│   │   └── controllers/
│   │       └── recipeController.js # Business logic
│   └── migrate-data.js     # Data migration script
├── data/
│   └── foods.json          # Recipe data (81KB, fallback/migration source)
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions for Pages deployment
├── SETUP.md                # Detailed deployment guide
└── README.md               # User-facing documentation
```

## Database Schema

The Supabase PostgreSQL database has the following tables:

### `recipes` (Main Table)
- `id` (PRIMARY KEY)
- `name` (VARCHAR) - Recipe name in Persian or English
- `description` (TEXT)
- `cooking_time` (INTEGER) - Minutes
- `prepare_time` (INTEGER) - Minutes
- `serving_size` (INTEGER)
- `instructions` (TEXT) - Detailed cooking steps
- `category_id` (INTEGER, FK)
- `country` (CHAR(2), FK) - ISO country code (e.g., 'IR', 'IT')

### `countries`
- `country_code` (CHAR(2), PRIMARY KEY) - ISO 3166-1 alpha-2
- `country_name` (VARCHAR) - Country name
- `food_description` (TEXT) - Cuisine description
- `food_features` (TEXT) - Culinary characteristics

**Included countries**: Iran (IR), Italy (IT), Japan (JP), Mexico (MX), Yemen (YE), Saudi Arabia (SA), and more

### `categories`
- `id` (PRIMARY KEY)
- `name` (VARCHAR) - Category name (Persian/English)

**Examples**: شیرینی خشک و شیرینی تر (cookies/pastries), کباب‌ها (kebabs), پاستاها (pasta), pizza

### `ingredients` (Not actively used yet)
- Ingredient list for future recipe-ingredient linking

## API Endpoints

Base URL (Production): `https://foodwheel-api.onrender.com/api`
Base URL (Local): `http://localhost:3000/api`

| Endpoint | Method | Query Params | Description |
|----------|--------|--------------|-------------|
| `/recipes` | GET | `country`, `maxTime` | Get all recipes (with optional filters) |
| `/recipes/:id` | GET | - | Get single recipe by ID |
| `/countries` | GET | - | Get all countries |
| `/categories` | GET | - | Get all categories |

**Example Requests**:
```bash
# Get all recipes
curl https://foodwheel-api.onrender.com/api/recipes

# Filter by country
curl https://foodwheel-api.onrender.com/api/recipes?country=IR

# Filter by max cooking time (30 minutes)
curl https://foodwheel-api.onrender.com/api/recipes?maxTime=30
```

**Response Format**:
```json
{
  "success": true,
  "count": 50,
  "data": [...]
}
```

## Key Features & Implementation

### 1. Spinning Wheel (`app.js`)
- Canvas-based rendering with dynamic segment colors
- Smooth CSS/JavaScript animations with easing
- Configurable rotation speed and duration
- Indicator at top center points to winner
- Responsive canvas sizing

### 2. Sound Effects
- Web Audio API for click/spin/win sounds
- No external audio files needed
- Oscillator-based sound generation

### 3. Multi-language Support
- Toggle between English and Persian (فا)
- RTL layout support via `dir="rtl"` on `<html>`
- Language-specific content rendering
- Uses `currentLang` state variable

### 4. Filter System
- **Cuisine Filter**: Dropdown populated from `/api/countries`
- **Time Filter**: Quick (<30min), Medium (30-60min), Long (>60min)
- Filters update `recipes` array and redraw wheel
- Client-side filtering with server support

### 5. Recipe Display
- Right-side panel shows selected recipe details
- Difficulty indicator
- Ingredient list (if available)
- Step-by-step instructions
- Country and category information

## Development Workflows

### Local Development

**Frontend**:
```bash
# No build step needed - pure vanilla JavaScript
# Open index.html with any HTTP server:
python -m http.server 8000
# or use VS Code Live Server extension
```

**Backend**:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with Supabase credentials
npm run dev  # Uses nodemon for auto-reload
```

### Environment Variables

Backend requires (`.env` in `backend/` directory):
```
PORT=3000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxx...
NODE_ENV=development
```

**Never commit `.env` files** - they contain sensitive credentials.

### Deployment

**Frontend** (GitHub Pages):
- Automatic deployment via GitHub Actions (`.github/workflows/deploy.yml`)
- Triggers on push to `main` branch
- Deploys entire root directory to Pages
- No build step required

**Backend** (Render.com):
- Connected to GitHub repo
- Root directory: `backend/`
- Build command: `npm install`
- Start command: `npm start`
- Auto-deploys on push to `main`
- Environment variables set in Render dashboard
- **Note**: Free tier spins down after 15 minutes of inactivity (first request takes ~30 seconds to wake up)

### Data Migration

To update Supabase database from `data/foods.json`:
```bash
cd backend
node migrate-data.js
```

This script reads `foods.json` and bulk inserts/updates recipes in Supabase.

## Code Conventions & Best Practices

### JavaScript
- **ES Modules**: Use `import/export` syntax (not CommonJS `require`)
- **No frameworks**: Keep vanilla JavaScript approach
- **Async/await**: Preferred for API calls over `.then()` chains
- **Semicolons**: Used consistently (see existing code)
- **Comments**: Minimal; code should be self-documenting
- **Error handling**: Try/catch blocks in API controllers

### Styling
- **CSS Variables**: Not heavily used, but can be added for theming
- **Mobile-first**: Responsive design with media queries
- **RTL Support**: Use logical properties (`margin-inline-start` vs `margin-left`)
- **BEM-like naming**: Classes like `.wheel-container`, `.recipe-section`

### API Design
- **RESTful**: Standard HTTP methods and status codes
- **JSON responses**: All endpoints return JSON with `success` boolean
- **Pagination**: Not implemented (only 50 recipes currently)
- **Rate limiting**: None (consider adding if traffic grows)

### Git Workflow
- **Main branch**: Production-ready code
- **Feature branches**: `feature/description` or `fix/description`
- **Commit messages**: Descriptive, imperative mood ("Add feature" not "Added feature")
- **No direct pushes**: PRs recommended for non-trivial changes

## Language & Content

- **Primary language**: Persian (Farsi) for recipe content
- **UI**: Bilingual (English/Persian toggle)
- **Encoding**: UTF-8 throughout (critical for Persian characters)
- **Recipe content**: Primarily Iranian dishes with international variety
- **Instructions**: Detailed, step-by-step in Persian

## Common Tasks

### Adding a New Recipe
1. Add to Supabase via dashboard Table Editor, OR
2. Edit `data/foods.json` and run `migrate-data.js`
3. No deployment needed - changes reflect immediately

### Changing UI
1. Edit `index.html`, `app.js`, or `style.css`
2. Test locally
3. Commit and push to `main`
4. GitHub Actions auto-deploys

### Updating API Logic
1. Edit files in `backend/src/`
2. Test locally with `npm run dev`
3. Commit and push to `main`
4. Render auto-deploys

### Adding a New API Endpoint
1. Add route in `backend/src/routes/recipes.js`
2. Add controller function in `backend/src/controllers/recipeController.js`
3. Use Supabase client for database queries
4. Return JSON with `success` and `data` fields

## Performance Considerations

- **API Cold Starts**: Render free tier sleeps after inactivity (~30s wake time)
- **Canvas Rendering**: Throttled to avoid performance issues on mobile
- **Data Size**: `foods.json` is 81KB (acceptable for client-side loading if needed)
- **No Caching**: Consider adding service worker for offline support

## Security Notes

- **CORS**: Backend explicitly allows GitHub Pages domain
- **Environment Variables**: Supabase keys are public-facing (anon key)
- **RLS**: Ensure Supabase Row Level Security policies are set correctly
- **Input Validation**: Minimal (trusted data source), add if accepting user input
- **SQL Injection**: Not applicable (Supabase client uses parameterized queries)

## Troubleshooting

### API Not Loading
- Check browser console for CORS errors
- Verify Render service is running (check dashboard)
- Test API endpoint directly: `curl https://foodwheel-api.onrender.com/api/recipes`
- Check Supabase connection in Render logs

### Wheel Not Spinning
- Check console for JavaScript errors
- Verify Canvas API support (should work in all modern browsers)
- Check if `recipes` array is populated

### Persian Text Not Displaying
- Ensure UTF-8 encoding in HTML `<meta charset="UTF-8">`
- Verify `dir="rtl"` on `<html lang="fa">`
- Check font supports Persian characters

### GitHub Actions Failing
- Check workflow logs in Actions tab
- Ensure Pages is enabled in repo settings
- Verify permissions in `deploy.yml`

## Future Enhancements (Not Yet Implemented)

- Ingredient search/filtering
- User favorites (requires authentication)
- Recipe ratings and comments
- Image uploads for recipes
- Nutritional information
- Shopping list generator
- Multi-recipe meal planning

## Dependencies

**Frontend**: None (vanilla JavaScript)

**Backend** (`backend/package.json`):
- `express` ^4.18.2 - Web framework
- `cors` ^2.8.5 - CORS middleware
- `@supabase/supabase-js` ^2.39.0 - Supabase client
- `dotenv` ^16.3.1 - Environment variable management
- `nodemon` ^3.0.2 (dev) - Auto-reload during development

## Testing

Currently no automated tests. Consider adding:
- Frontend: Jest + Testing Library
- Backend: Jest + Supertest for API tests
- E2E: Playwright or Cypress

## License

MIT License - free to use and modify.

## Important Reminders for AI Assistants

1. **Keep it simple**: This is a vanilla JavaScript project - no build tools, no frameworks
2. **Preserve Persian content**: UTF-8 encoding is critical
3. **Test locally first**: Both frontend and backend have simple local dev setups
4. **Check both deployments**: Changes may affect GitHub Pages AND Render
5. **Respect existing patterns**: Follow the established code style and architecture
6. **Don't over-engineer**: The KISS principle is core to this project
7. **Supabase is source of truth**: Database data overrides `foods.json`
