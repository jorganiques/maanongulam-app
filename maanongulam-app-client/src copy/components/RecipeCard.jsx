// src/components/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipes/${recipe.recipeId}`}>
      <div className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer">
        <img 
          className="w-full h-40 object-cover" 
          src={recipe.imageUrl || 'fallback-image-url.jpg'} 
          alt={recipe.title} 
        />
        <div className="p-4">
          <h3 className="font-bold text-lg text-black">{recipe.title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
