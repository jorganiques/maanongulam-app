// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust the server URL if needed

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Listen for incoming chat messages from the server
    socket.on('chatMessage', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('chatMessage', message); // Send message to the server
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
