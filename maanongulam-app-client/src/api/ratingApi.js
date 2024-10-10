import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchRatingsByRecipeId = async (recipeId) => {
  const response = await axios.get(`${API_URL}/api/ratings/recipeId/${recipeId}`);
  return response.data; // Assuming response.data is an array of ratings
};

export const submitRating = async (userId, recipeId, rating, isLiked) => { // Added isLiked parameter
  await axios.post(`${API_URL}/api/ratings`, {
    userId,
    recipeId,
    rating,
    isLiked,
  });
};

export const fetchLikesCount = async (recipeId) => {
  const response = await axios.get(`${API_URL}/api/ratings/likes/${recipeId}`);
  return response.data.likes; // Assuming response.data has a likes property
};

// Example API function to toggle like/unlike
export const toggleLike = async (userId, recipeId, isLiked) => {
  try {
    const response = await axios.post(`${API_URL}/api/recipes/${recipeId}/like`, {
      userId,
      isLiked
    });

    return response.data;  // Return the response from the server
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};