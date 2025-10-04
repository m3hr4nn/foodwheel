import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function migrateData() {
  try {
    console.log('📦 Reading JSON data...');
    const data = JSON.parse(readFileSync('../data/foods.json', 'utf-8'));

    // Migrate countries (remove duplicates first)
    console.log('🌍 Migrating countries...');
    const uniqueCountries = [];
    const seenCodes = new Set();

    for (const c of data.countries) {
      if (!seenCodes.has(c.code)) {
        seenCodes.add(c.code);
        uniqueCountries.push({
          id: c.id,
          country_code: c.code,
          country_name: c.name
        });
      }
    }

    const { error: countriesError } = await supabase
      .from('countries')
      .upsert(uniqueCountries, { onConflict: 'country_code' });

    if (countriesError) throw countriesError;
    console.log(`✅ Migrated ${uniqueCountries.length} countries`);

    // Migrate categories
    console.log('📁 Migrating categories...');
    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert(data.categories || [], { onConflict: 'id' });

    if (categoriesError) throw categoriesError;
    console.log(`✅ Migrated ${data.categories?.length || 0} categories`);

    // Migrate recipes (only those with valid country codes)
    console.log('🍽️  Migrating recipes...');
    const validCountryCodes = new Set(uniqueCountries.map(c => c.country_code));

    const recipes = data.recipes
      .filter(r => validCountryCodes.has(r.country))
      .map(r => ({
        id: r.id,
        name: r.name,
        description: r.description || null,
        cooking_time: r.cookingTime || 0,
        prepare_time: r.prepareTime || 0,
        serving_size: r.servingSize || 0,
        instructions: r.instructions || null,
        category_id: r.categoryId || null,
        country: r.country
      }));

    const { error: recipesError } = await supabase
      .from('recipes')
      .upsert(recipes, { onConflict: 'id' });

    if (recipesError) throw recipesError;
    console.log(`✅ Migrated ${recipes.length} recipes (${data.recipes.length - recipes.length} skipped due to invalid country codes)`);

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateData();
