import React, { useEffect, useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';

const CreateRecipe = () => {
  const [categories, setCategories] = useState([]);
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: [''],
    instructions: '',
    categoryId: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null); // State for the image file
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
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

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', recipe.title);
    formData.append('ingredients', JSON.stringify(recipe.ingredients)); // Stringify ingredients
    formData.append('instructions', recipe.instructions);
    formData.append('categoryId', recipe.categoryId);
    if (imageFile) {
      formData.append('imageUrl', imageFile); // Append the image file
    }

    try {
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        navigate('/'); // Redirect to home after successful submission
      } else {
        console.error('Error creating recipe:', await response.json());
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h2 className="text-2xl font-bold">Create a Recipe</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block">Title:</label>
          <input type="text" name="title" value={recipe.title} onChange={handleChange} required className="p-2 border rounded w-full" />
        </div>
        <div className="mb-4">
          <label className="block">Ingredients:</label>
          {recipe.ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="p-2 border rounded w-full mb-2"
              placeholder={`Ingredient ${index + 1}`}
            />
          ))}
          <button type="button" onClick={addIngredient} className="text-blue-500">Add Ingredient</button>
        </div>
        <div className="mb-4">
          <label className="block">Instructions:</label>
          <textarea name="instructions" value={recipe.instructions} onChange={handleChange} required className="p-2 border rounded w-full" rows="4" />
        </div>
        <div className="mb-4">
          <label className="block">Category:</label>
          <select name="categoryId" value={recipe.categoryId} onChange={handleChange} required className="p-2 border rounded w-full">
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Image Upload:</label>
          <input type="file" onChange={handleImageChange} className="p-2 border rounded w-full" accept="image/*" required />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Recipe</button>
        <Link to="/" className="text-blue-500 ml-4">Cancel</Link>
      </form>
    </div>
  );
};

export default CreateRecipe;
