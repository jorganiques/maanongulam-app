import Rating from '../models/Rating.js';

// Create a new rating
export const createRating = async (req, res) => {
  const { userId, recipeId, rating, isLiked } = req.body;

  try {
    // Check if the user has already rated this recipe
    const existingRating = await Rating.findOne({ userId, recipeId });
    if (existingRating) {
      return res.status(400).json({ message: 'User has already rated this recipe' });
    }

    const newRating = new Rating({ userId, recipeId, rating, isLiked });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ message: 'Error creating rating', error });
  }
};

// Get all ratings for a specific recipe
export const getRatingsByRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const ratings = await Rating.find({ recipeId, isDeleted: false }); // Filter out deleted ratings
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings', error });
  }
};

// Update a rating by ratingId
export const updateRating = async (req, res) => {
  const { ratingId } = req.params;
  const { rating, isLiked } = req.body;

  try {
    const updatedRating = await Rating.findOneAndUpdate(
      { _id: ratingId },
      { rating, isLiked, lastUpdated: Date.now() }, // Update lastUpdated and isLiked
      { new: true }
    );

    if (!updatedRating || updatedRating.isDeleted) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.status(200).json(updatedRating);
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Error updating rating', error });
  }
};

// Soft delete a rating by ratingId
export const deleteRating = async (req, res) => {
  const { ratingId } = req.params;

  try {
    const deletedRating = await Rating.findOneAndUpdate(
      { _id: ratingId },
      { isDeleted: true }, // Set isDeleted to true
      { new: true }
    );

    if (!deletedRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ message: 'Error deleting rating', error });
  }
};

// Get the number of likes for a specific recipe
export const getLikesByRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const likeCount = await Rating.countDocuments({ recipeId, isLiked: true, isDeleted: false });
    res.status(200).json({ likes: likeCount });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ message: 'Error fetching likes', error });
  }
};

// Get the average rating for a specific recipe
export const getAverageRating = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const ratings = await Rating.find({ recipeId, isDeleted: false }); // Ensure we only consider non-deleted ratings
    if (ratings.length === 0) {
      return res.status(200).json({ averageRating: 0 }); // Return 0 if no ratings exist
    }
    const avgRating = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
    res.status(200).json({ averageRating: avgRating });
  } catch (error) {
    console.error('Failed to fetch average rating:', error);
    res.status(500).json({ error: 'Failed to fetch average rating.' });
  }
};