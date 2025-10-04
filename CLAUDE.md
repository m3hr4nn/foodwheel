# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a food spinning wheel web application that randomly selects Iranian and international dishes when users don't know what to eat. The project includes a comprehensive database of foods with recipes and will be deployed via GitHub Pages with automated GitHub Actions.

## Database Structure

The project uses a MariaDB/MySQL database (`food_product.sql`) with the following tables:

- **temp_recipes**: Main recipe table containing:
  - `id`, `name`, `description`
  - `cooking_time`, `prepare_time`, `serving_size`
  - `instructions` (detailed cooking steps)
  - `category_id` (FK to temp_categories)
  - `country` (2-char country code, FK to temp_countries)

- **temp_categories**: Food categories (e.g., desserts, kebabs, pasta, pizza)
  - Categories include Persian names like "شیرینی خشک و شیرینی تر", "کباب‌ها", "پاستاها"

- **temp_countries**: Country information with:
  - Country code (`country_code`), name (`country_name`)
  - `food_description`, `food_features`
  - Countries include Iran (IR), Italy (IT), Japan (JP), Mexico (MX), Yemen (YE), Saudi Arabia (SA), etc.

- **temp_ingredients**: Ingredient list (Persian and international)

- **temp_recipe_ingredient**: Many-to-many relationship table linking recipes to ingredients

## Language & Content

- Database content is primarily in Persian (Farsi) with UTF-8 encoding
- Recipes include both Iranian traditional foods and international cuisines
- Instructions are detailed and written in Persian

## Architecture Notes

Since this is currently just a SQL database file, the web application architecture will need:

1. **Data Layer**: Convert SQL to JSON for client-side usage (no backend needed for GitHub Pages)
2. **Frontend**: HTML/CSS/JavaScript spinning wheel interface
3. **Recipe Display**: Modal or page to show selected recipe with ingredients and instructions
4. **Deployment**: GitHub Actions workflow for automated deployment to GitHub Pages
- KISS: Keep It Short & Simple. Make the created files minimal and direct to point.