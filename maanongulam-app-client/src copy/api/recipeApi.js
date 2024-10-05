// src/api/recipeApi.js

// Create a new recipe
export const createRecipe = async (formData) => {
  try {
    const response = await fetch('http://localhost:5000/api/recipes', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to create recipe');
    }
    return await response.json();
  } catch (error) {
    console.error('Error submitting recipe:', error);
    throw error;
  }
};

// Search for recipes
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
