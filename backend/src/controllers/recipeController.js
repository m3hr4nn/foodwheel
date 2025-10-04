import { supabase } from '../config/supabase.js';

// Get all recipes with optional filters
export const getRecipes = async (req, res) => {
  try {
    const { country, maxTime } = req.query;

    let query = supabase
      .from('recipes')
      .select(`
        *,
        countries (
          country_code,
          country_name
        )
      `);

    // Apply filters
    if (country && country !== 'all') {
      query = query.eq('country', country);
    }

    if (maxTime) {
      query = query.lte('cooking_time + prepare_time', parseInt(maxTime));
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        countries (
          country_code,
          country_name
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'Recipe not found'
    });
  }
};

// Get all countries
export const getCountries = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('country_name');

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
