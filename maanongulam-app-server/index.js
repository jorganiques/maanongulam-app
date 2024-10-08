import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import app from './src/middlewares/app.js';
import commentRoutes from './src/routes/commentRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

let chatHistory = []; // Store chat history

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    io.on('connection', (socket) => {
      console.log(`A user connected: ${socket.id}`);

      // Send previous messages when a user connects
      socket.emit('previousMessages', chatHistory);

      socket.on('chatMessage', (message) => {
        try {
          console.log('Message received:', message);

          if (message.user && message.text) {
            chatHistory.push(message); // Save message to history
            io.emit('chatMessage', message);
          } else {
            console.error('Invalid message structure:', message);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      socket.on('typing', (user) => {
        socket.broadcast.emit('typing', user); // Broadcast typing status
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });

      socket.on('error', (err) => {
        console.error(`Socket error for user ${socket.id}:`, err);
      });
    });

    app.use('/api/comments', commentRoutes);

    process.on('unhandledRejection', (error) => {
      console.error('Unhandled Rejection:', error);
      server.close(() => process.exit(1));
    });

  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
