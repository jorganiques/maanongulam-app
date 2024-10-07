import dotenv from 'dotenv';
import { Server } from 'socket.io'; 
import connectDB from './src/config/db.js';
import app from './src/middlewares/app.js';
import commentRoutes from './src/routes/commentRoutes.js'; // Import comment routes

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start the server after MongoDB connection is successful
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: '*', // Adjust the origin as per your frontend
      },
    });

    // Socket.IO logic
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // Listen for chat messages
      socket.on('chatMessage', (message) => {
        console.log('Message received:', message);

        // Broadcast message to all users
        io.emit('chatMessage', message);
      });

      // Disconnect event
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    // Use comment routes
    app.use('/api/comments', commentRoutes);

  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });