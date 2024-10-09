import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchRatingsByRecipeId = async (recipeId) => {
  const response = await axios.get(`${API_URL}/api/ratings/recipeId/${recipeId}`);
  return response.data;
};

export const submitRating = async (userId, recipeId, rating) => {
  await axios.post(`${API_URL}/api/ratings`, {
    userId,
    recipeId,
    rating,
  });
};

export const fetchLikesCount = async (recipeId) => {
  const response = await axios.get(`${API_URL}/api/ratings/likes/${recipeId}`);
  return response.data.likes;
};
