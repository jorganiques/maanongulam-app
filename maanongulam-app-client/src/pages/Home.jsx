import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { FaBars } from 'react-icons/fa';
import RecipeGrid from '../components/RecipeGrid';
import SearchInput from '../components/SearchInput';
import Chat from '../components/Chat';
import CategoriesCarousel from '../components/CategoriesCarousel';
import RecipeDetail from '../components/RecipeDetail'; // Import RecipeDetail
import { useParams } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const navigate = useNavigate(); 
  const { recipeId } = useParams(); // Get the recipeId from the URL

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleRecipeSelect = (recipeId) => {
    navigate(`/recipes/${recipeId}`); // Navigate to RecipeDetail page
  };

  const handleHomeClick = () => {
    setSelectedCategoryId(null); // Reset selected category on home click
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); 
    navigate('/auth'); 
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <nav className="flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-bold text-black">Ma! Anong ulam?</h1>
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <FaBars className="text-2xl" />
          </button>
        </div>
        <ul
          className={`absolute md:static bg-white w-full md:w-auto transition-transform ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:translate-y-0 md:flex md:items-center`}
        >
          <li className="p-4">
            <Link className="text-black" to="/" onClick={handleHomeClick}>
              Home
            </Link>
          </li>
          <li className="p-4">
            <Link className="text-black" to="/recipes">Recipes</Link>
          </li>
          <li className="p-4">
            <Link className="text-black" to="/about">About</Link>
          </li>
          <li className="p-4">
            <Link className="text-black" to="/contact">Contact</Link>
          </li>
          <li className="p-4">
            <button className="text-red-500" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
      
      {/* Main Content */}
      <main className="flex-grow">
        <section className="flex flex-col items-center justify-center h-64 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://source.unsplash.com/random/800x600/?food")' }}>
          <h2 className="text-3xl text-black font-bold">Discover Delicious Recipes</h2>
          <p className="text-lg text-black">Explore, Cook, Enjoy!</p>
          <SearchInput />
        </section>
        <CategoriesCarousel onCategorySelect={handleCategorySelect} />
        
        {/* Render RecipeDetail if recipeId is present */}
        {recipeId ? (
          <RecipeDetail recipeId={recipeId} />
        ) : (
          <RecipeGrid selectedCategoryId={selectedCategoryId} onRecipeSelect={handleRecipeSelect} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white p-4 text-center shadow mt-4">
        <p className="text-black">&copy; 2024 Ma! Anong ulam? All rights reserved.</p>
      </footer>

      {/* Chat Popup */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-lg rounded-lg p-4">
          <Chat />
        </div>
      )}
    </div>
  );
};

export default Home;
