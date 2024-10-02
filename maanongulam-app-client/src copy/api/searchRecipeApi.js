// src/api/searchRecipeApi.js

export const searchRecipes = async (searchTerm) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/search?query=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  };
  