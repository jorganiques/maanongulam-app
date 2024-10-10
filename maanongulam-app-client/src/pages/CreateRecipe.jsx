import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../api/categoryApi';
import { createRecipe } from '../api/recipeApi';
import { FaCamera } from 'react-icons/fa';

const CreateRecipe = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: [''],
    instructions: '',
    categoryId: '',
    userId: '',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setRecipe((prev) => ({ ...prev, userId: storedUserId }));
    } else {
      console.error('User ID not found');
    }
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
    setImageFiles(files);
    
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipe.userId) {
      console.error('User ID is missing');
      return;
    }

    const formData = new FormData();
    formData.append('title', recipe.title);
    formData.append('ingredients', JSON.stringify(recipe.ingredients));
    formData.append('instructions', recipe.instructions);
    formData.append('categoryId', recipe.categoryId);
    formData.append('userId', recipe.userId);

    imageFiles.forEach((file) => {
      formData.append('image', file);
    });

    try {
      await createRecipe(formData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h2 className="text-3xl font-bold text-center text-gray-700">Create a Recipe</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        
        {/* Image Upload with Camera Icon */}
        <div className="w-full md:w-1/2 mx-auto">
        <label class="flex justify-center items-center block text-lg font-semibold text-gray-600 mb-2">Image Upload:</label>
          <div className="flex items-center justify-center">
            <label 
              htmlFor="imageUpload"
              className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-400 rounded-full cursor-pointer hover:bg-gray-100 transition"
            >
              <FaCamera className="text-4xl text-gray-500" />
              <span className="text-2xl text-gray-500 absolute top-12 right-12">+</span>
            </label>
            <input
              id="imageUpload"
              type="file"
              onChange={handleImageChange}
              className="hidden" // Hide the file input
              accept="image/*"
              multiple
              required
            />
          </div>
          
          {/* Preview images */}
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-4">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Recipe Title and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-600">Title:</label>
            <input
              type="text"
              name="title"
              value={recipe.title}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full mt-2 focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-600">Category:</label>
            <select
              name="categoryId"
              value={recipe.categoryId}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full mt-2 focus:ring-2 focus:ring-orange-400"
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

        {/* Ingredients with Add/Remove */}
        <div>
          <label className="block text-lg font-semibold text-gray-600">Ingredients:</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="p-2 border rounded w-full focus:ring-2 focus:ring-orange-400"
                placeholder={`Ingredient ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-1 text-red-500 hover:text-red-700 transition-colors"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-lg font-semibold text-gray-600">Instructions:</label>
          <textarea
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
            required
            className="p-2 border rounded w-full mt-2 focus:ring-2 focus:ring-orange-400"
            rows="5"
          />
        </div>

        {/* Submit/Cancel Buttons */}
        <div className="flex justify-end space-x-4">
          <button type="submit" className="bg-orange-400 text-white py-2 px-6 rounded hover:bg-orange-500 transition-all">
            Create
          </button>
          <button type="button" onClick={handleCancel} className="text-blue-500 hover:text-blue-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;