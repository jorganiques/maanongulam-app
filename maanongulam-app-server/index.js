import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Server } from 'socket.io'; // Import Socket.IO
import connectDB from './src/config/db.js';
import setupMiddlewares from './src/middlewares/setupMiddlewares.js';
//import routes from './routes/setupRoutes.js'; // Adjust the path as needed

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Connect to MongoDB
connectDB()
  .then(() => {
    // Middleware setup
    setupMiddlewares(app);

    // Setup routes
    // routes(app);

    // Generic route
    app.get('/', (req, res) => {
      res.send('Welcome to the Ma! Anong Ulam? App!');
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
