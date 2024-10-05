// src/components/RecipeGrid.jsx
import React, { useContext } from 'react';
import RecipeCard from './RecipeCard';
import { RecipeContext } from '../context/RecipeContext';

const RecipeGrid = () => {
  const { recipes } = useContext(RecipeContext);
  console.log('Recipes in context:', recipes); // Debugging line

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Featured Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <RecipeCard key={recipe.recipeId} recipe={recipe} />
        ))
        ) : (
        <p>No recipes available.</p>
        )}
      </div>
    </div>
  );  
};

export default RecipeGrid;
