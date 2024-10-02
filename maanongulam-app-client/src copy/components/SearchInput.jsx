// src/components/SearchInput.jsx
import React, { useState, useContext } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RecipeContext } from '../context/RecipeContext';
import { searchRecipes } from '../api/recipeApi';

const SearchInput = () => {
  const { setRecipes } = useContext(RecipeContext);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await searchRecipes(searchTerm); // Use the API function

      // Check if the data is an array and has recipes
      if (Array.isArray(data) && data.length > 0) {
        setRecipes(data); // Set the entire array of recipes
      } else {
        console.error('No recipes found');
        setRecipes([]); // Clear the recipes if none are found
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="flex mt-4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search recipes..."
        className="p-2 border rounded-l"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchInput;
