import express from 'express';
import {
  getRecipes,
  getRecipeById,
  getCountries,
  getCategories
} from '../controllers/recipeController.js';

const router = express.Router();

// Recipe routes
router.get('/recipes', getRecipes);
router.get('/recipes/:id', getRecipeById);

// Supporting data routes
router.get('/countries', getCountries);
router.get('/categories', getCategories);

export default router;
