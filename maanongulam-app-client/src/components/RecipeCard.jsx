import React from 'react';

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div onClick={onClick} className="bg-white bg-opacity-30 hover:bg-opacity-80 shadow-md rounded-lg overflow-hidden cursor-pointer">
      <img 
        className="w-full h-40 object-cover" 
        src={recipe.imageUrl || 'fallback-image-url.jpg'} 
        alt={recipe.title} 
      />
      <div className="p-4">
        <h3 className="font-bold font-zina text-lg text-black">{recipe.title}</h3>
      </div>
    </div>
  );
};

export default RecipeCard;
