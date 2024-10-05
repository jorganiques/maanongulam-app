import express from 'express';
import {
  createRating,
  getRatingsByRecipe,
  updateRating,
  deleteRating,
  getLikesByRecipe,
} from '../controllers/ratingController.js';

const router = express.Router();

// Create a new rating
router.post('/', createRating);

// Get ratings for a specific recipe
router.get('/recipeId/:recipeId', getRatingsByRecipe);

// Get the number of likes for a specific recipe
router.get('/likes/:recipeId', getLikesByRecipe); // New route

// Update a rating by ratingId
router.put('/ratingId/:ratingId', updateRating);

// Delete a rating by ratingId
router.delete('/ratingId/:ratingId', deleteRating);

export default router;