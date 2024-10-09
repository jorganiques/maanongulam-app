// src/pages/CreateRecipe.js
import React, { useEffect, useState } from 'react';  
import { fetchCategories } from '../api/categoryApi'; 
import { createRecipe } from '../api/recipeApi'; 

const CreateRecipe = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: [''],
    instructions: '',
    categoryId: '',
    userId: '',
  });
  const [imageFiles, setImageFiles] = useState([]); // State to hold multiple files

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setRecipe((prev) => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files); // Update state to hold multiple files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', recipe.title);
    formData.append('ingredients', JSON.stringify(recipe.ingredients));
    formData.append('instructions', recipe.instructions);
    formData.append('categoryId', recipe.categoryId);
    formData.append('userId', recipe.userId); // Include userId

    // Append all selected images
    imageFiles.forEach((file) => {
      formData.append('image', file); // Use 'image' to match the backend
    });

    try {
      await createRecipe(formData);
      onClose(); // Close the modal on successful creation
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    onClose(); // Close the modal when cancel is clicked
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h2 className="text-2xl font-bold">Create a Recipe</h2>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap">
        {/* First Column */}
        <div className="w-full md:w-1/2 p-2">
          <div className="mb-4">
            <label className="block">Image Upload:</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="p-2 border rounded w-full"
              accept="image/*"
              multiple // Accept multiple files
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Title:</label>
            <input
              type="text"
              name="title"
              value={recipe.title}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Category:</label>
            <select
              name="categoryId"
              value={recipe.categoryId}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Column */}
        <div className="w-full md:w-1/2 p-2">
          <div className="mb-4">
            <label className="block">Ingredients:</label>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className="p-2 border rounded w-full"
                  placeholder={`Ingredient ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="text-blue-500">
              Add Ingredient
            </button>
          </div>
          <div className="mb-4">
            <label className="block">Instructions:</label>
            <textarea
              name="instructions"
              value={recipe.instructions}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
              rows="4"
            />
          </div>
        </div>
        
        <div className="w-full flex justify-end">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Recipe</button>
          <button type="button" onClick={handleCancel} className="text-blue-500 ml-4">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;