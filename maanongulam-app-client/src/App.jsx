// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecipeProvider } from './context/RecipeContext';
import SplashScreen from './pages/SplashScreen';
import Home from './pages/Home';
import AuthenticationScreen from './pages/AuthenticationScreen';
import CreateRecipe from './pages/CreateRecipe'; 
import Chat from './components/Chat'; 

const App = () => {
  return (
    <RecipeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/auth" element={<AuthenticationScreen />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/chat" element={<Chat />} /> {/* Add the Chat route */}
        </Routes>
      </Router>
    </RecipeProvider>
  );
};

export default App;
