import React, { useState, useContext } from 'react'; 
import { FaSearch } from 'react-icons/fa';
import { RecipeContext } from '../context/RecipeContext';
import { searchRecipes } from '../api/recipeApi';

const SearchInput = () => {
  const { setRecipes } = useContext(RecipeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setDropdownVisible(e.target.value.length > 0); // Show dropdown when there's input
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

  const handleOptionClick = async (option) => {
    console.log(`Selected: ${option}`); // For debugging or further actions
    const searchQuery = option.replace(' in Recipes', ''); // Extract the search term
    setSearchTerm(searchQuery); // Set search term to the selected option
    setDropdownVisible(false); // Hide dropdown after selection
    
    // Fetch recipes based on the selected option
    try {
      const data = await searchRecipes(searchQuery); // Use the API function

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

  // Dynamically generate dropdown options based on the current input
  const dropdownOptions = searchTerm ? [
    `${searchTerm} in Recipes`,
    `${searchTerm} in Users`
  ] : [];

  return (
    <div className="relative">
      <form onSubmit={handleSearchSubmit} className="flex mt-4 font-recia">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for recipes here..."
          className="p-4 w-full border rounded-l"
        />
        <button type="submit" className="p-4 bg-orange-400 text-white rounded-r hover:bg-red-900 transition duration-300">
          <FaSearch />
        </button>
      </form>
      {dropdownVisible && dropdownOptions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
          {dropdownOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
