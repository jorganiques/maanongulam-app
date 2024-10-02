import axios from 'axios';
import mongoose from 'mongoose';
import Category from '../models/Category.js'; // Corrected import

// MongoDB connection
// const mongoURI = 'mongodb+srv://joannaabinuman:3LHdBmKGdwrV8qLm@cluster0.9hbk1.mongodb.net/RecipeSharing?retryWrites=true&w=majority';
// const mongoURI = 'mongodb+srv://maanongulam:FOedTGxM4bO29gwF@maanongulam.4l2du.mongodb.net/?retryWrites=true&w=majority&appName=maanongulam';
const mongoURI = 'mongodb+srv://maanongulam:FOedTGxM4bO29gwF@maanongulam.4l2du.mongodb.net/maanongulam?retryWrites=true&w=majority';

mongoose.connect(mongoURI);

async function fetchAndStoreCategories() {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
        const categories = response.data.categories;

        for (const category of categories) {
            // Check if categoryId is valid and not null
            if (category.idCategory && category.idCategory !== null) {
                // Check if category already exists
                const existingCategory = await Category.findOne({ categoryId: category.idCategory });

                if (!existingCategory) {
                    const newCategory = new Category({
                        categoryId: category.idCategory,
                        categoryName: category.strCategory,
                        categoryImageUrl: category.strCategoryThumb,
                        categoryDescription: category.strCategoryDescription,
                    });
                    await newCategory.save();
                    console.log(`Saved category: ${category.strCategory}`);
                } else {
                    console.warn(`Category already exists: ${category.strCategory}`);
                }
            } else {
                console.warn('Category with missing or invalid idCategory:', category);
            }
        }

        console.log('All valid categories processed successfully!');
    } catch (error) {
        console.error('Error fetching or storing categories data:', error);
    } finally {
        mongoose.connection.close();
    }
}

fetchAndStoreCategories();
