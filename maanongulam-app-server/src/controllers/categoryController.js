import Category from '../models/Category.js';

// Create a new category
export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories', error });
  }
};

// Get a category by ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving category', error });
  }
};

// Get a category by category name
export const getCategoryByStrCategory = async (req, res) => {
    const { categoryName } = req.params; // Parameter name
    console.log('Searching for category:', categoryName); // Log for debugging

    try {
        const categories = await Category.find({ categoryName: categoryName });
        if (categories.length === 0) return res.status(404).json({ message: 'No categories found' });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error retrieving categories:', error); // Log the error
        res.status(500).json({ message: 'Error retrieving categories', error });
    }
};

// Update a category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error updating category', error });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};