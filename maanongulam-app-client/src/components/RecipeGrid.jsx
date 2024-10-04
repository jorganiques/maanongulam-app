import React, { useContext, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { RecipeContext } from '../context/RecipeContext';
import { fetchRecipesByCategory } from '../api/recipeApi';

const RecipeGrid = ({ selectedCategoryId, onRecipeSelect }) => {
  const { recipes, setRecipes } = useContext(RecipeContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (selectedCategoryId) {
        try {
          const fetchedRecipes = await fetchRecipesByCategory(selectedCategoryId);
          setRecipes(fetchedRecipes);
        } catch (error) {
          console.error('Error fetching recipes by category:', error);
          setRecipes([]); // Reset recipes if there's an error
        }
      } else {
        setRecipes([]); // Reset recipes if no category is selected
      }
    };

    fetchRecipes();
  }, [selectedCategoryId, setRecipes]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Featured Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <RecipeCard key={recipe.recipeId} recipe={recipe} onClick={() => onRecipeSelect(recipe.recipeId)} />
          ))
        ) : (
          <p>No recipes available.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeGrid;
