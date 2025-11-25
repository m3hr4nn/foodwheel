-- FoodWheel Database Schema for Supabase
-- Run this SQL in Supabase SQL Editor to create all necessary tables

-- Enable UUID extension (optional, but useful)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. COUNTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  country_code CHAR(2) NOT NULL UNIQUE,
  country_name VARCHAR(100) NOT NULL,
  food_description TEXT,
  food_features TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(country_code);

-- Add some sample countries
INSERT INTO countries (id, country_code, country_name) VALUES
  (9, 'IR', 'ایران'),
  (10, 'IT', 'ایتالیا'),
  (11, 'JP', 'ژاپن'),
  (12, 'MX', 'مکزیک'),
  (13, 'YE', 'یمن'),
  (14, 'SA', 'عربستان سعودی')
ON CONFLICT (country_code) DO NOTHING;

-- ============================================
-- 2. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Add some sample categories
INSERT INTO categories (id, name) VALUES
  (39, 'شیرینی خشک و شیرینی تر'),
  (11, 'مرغ'),
  (24, 'دسرها'),
  (16, 'خورش'),
  (13, 'خمیرها'),
  (34, 'ترشی'),
  (156, 'غذاهای یمنی'),
  (154, 'غذاهای عربی'),
  (10, 'غذاهای دریایی')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. RECIPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  description TEXT,
  cooking_time INTEGER DEFAULT 0,
  prepare_time INTEGER DEFAULT 0,
  serving_size INTEGER DEFAULT 0,
  instructions TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  country CHAR(2) NOT NULL REFERENCES countries(country_code) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_recipes_country ON recipes(country);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category_id);
CREATE INDEX IF NOT EXISTS idx_recipes_cooking_time ON recipes(cooking_time);
CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes(name);

-- ============================================
-- 4. INGREDIENTS TABLE (For future use)
-- ============================================
CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);

-- ============================================
-- 5. RECIPE_INGREDIENTS TABLE (For future use)
-- ============================================
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INTEGER NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity VARCHAR(100),
  unit VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recipe_id, ingredient_id)
);

CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_id);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for frontend)
CREATE POLICY "Allow public read access on countries" ON countries
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on recipes" ON recipes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on ingredients" ON ingredients
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on recipe_ingredients" ON recipe_ingredients
  FOR SELECT USING (true);

-- ============================================
-- 7. FUNCTIONS & TRIGGERS
-- ============================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for recipes table
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. USEFUL VIEWS (Optional)
-- ============================================
-- View for recipes with country and category names
CREATE OR REPLACE VIEW recipes_full AS
SELECT
  r.*,
  c.country_name,
  cat.name as category_name
FROM recipes r
LEFT JOIN countries c ON r.country = c.country_code
LEFT JOIN categories cat ON r.category_id = cat.id;

-- Grant access to the view
GRANT SELECT ON recipes_full TO anon, authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything is set up correctly:
-- SELECT * FROM countries;
-- SELECT * FROM categories;
-- SELECT COUNT(*) FROM recipes;
-- SELECT * FROM recipes_full LIMIT 5;
