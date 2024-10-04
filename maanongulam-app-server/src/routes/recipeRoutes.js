import express from 'express';
import upload from '../middlewares/upload.js';
import { 
  createRecipe, 
  getAllRecipes, 
  getRecipeById, 
  updateRecipe, 
  deleteRecipe, 
  searchRecipes,
  fetchAndSaveRecipesByCategory, 
  getRecipesByCategoryId
} from '../controllers/recipeController.js';

const router = express.Router();

// Route for creating a recipe with image upload
router.post('/', upload.single('image'), createRecipe);

// GET /recipes - Get all recipes
router.get('/', getAllRecipes);

// GET /recipes/search - Search for recipes
router.get('/search', searchRecipes); // This should be defined last

// GET /recipes/:recipeId - Get a recipe by ID
router.get('/:recipeId', getRecipeById);

// GET /recipes/category/:categoryId - Get recipes by category ID
router.get('/category/:categoryId', getRecipesByCategoryId);

// Route for updating a recipe with image upload
router.put('/:recipeId', upload.single('image'), updateRecipe);

// DELETE /recipes/:recipeId - Delete a recipe - DONE
router.delete('/:recipeId', deleteRecipe);

// Route for fetching and saving recipes by category
router.post('/fetch-and-save/userId/:userId/categoryId/:categoryId/categoryName/:categoryName', fetchAndSaveRecipesByCategory); // New route

export default router;
