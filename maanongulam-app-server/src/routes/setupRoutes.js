import userRoutes from './userRoutes.js';
import recipeRoutes from './recipeRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import commentRoutes from './commentRoutes.js';  
import ratingRoutes from './ratingRoutes.js';  

const setupRoutes = (app) => {
    app.use('/api/users', userRoutes);
    app.use('/api/recipes', recipeRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/comments', commentRoutes);  
    app.use('/api/ratings', ratingRoutes);  
};

export default setupRoutes;
