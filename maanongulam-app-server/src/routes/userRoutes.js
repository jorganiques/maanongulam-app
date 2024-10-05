import express from 'express';
import { registerUser, loginUser, updateUser, deleteUser, getUserByUsername, deactivateUser } from '../controllers/userController.js';

const router = express.Router();

// User registration and login routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:userId', updateUser); // Update user
router.delete('/:userId', deleteUser); // Soft delete user
router.put('/deactivate/:userId', deactivateUser); // Deactivate user
router.get('/:username', getUserByUsername); // Get user by username

export default router;