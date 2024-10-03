import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoriteController.js';

const router = express.Router();

// Route to add a favorite
router.post('/', addFavorite);

// Route to remove a favorite (unfavorite)
router.delete('/', removeFavorite);

// Route to get favorites for a user
router.get('/:userId', getFavorites);

export default router;
