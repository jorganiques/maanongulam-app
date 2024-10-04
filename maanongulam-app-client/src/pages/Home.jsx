import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'; 
import { FaBars } from 'react-icons/fa';
import RecipeGrid from '../components/RecipeGrid';
import SearchInput from '../components/SearchInput';
import Chat from '../components/Chat';
import CategoriesCarousel from '../components/CategoriesCarousel';
import RecipeDetail from '../components/RecipeDetail'; // Import RecipeDetail
import logo from '../assets/maulogo.png';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Profile dropdown state
  const navigate = useNavigate(); 
  const { recipeId } = useParams(); // Get the recipeId from the URL

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown

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
      <nav className="flex items-center justify-between p-4 bg-white shadow" style={{ backgroundColor: 'rgba(255, 238, 173, 0.1)' }}>
        {/* Logo - Clickable and Refreshes the Homepage */}
        <Link to="/">
          <img
            src={logo} 
            alt="Ma! Anong ulam? Logo"
            className="h-32 -mt-6 -mb-4" 
          />
        </Link>

        {/* Create Post Button and Profile Picture Dropdown Container */}
        <div className="flex items-center space-x-4">
          {/* Create Post Button */}
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create Recipe
          </button>

          {/* Profile Picture Dropdown */}
          <div className="relative">
            <button onClick={toggleDropdown} className="focus:outline-none">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </button>
            {isDropdownOpen && (
              <ul className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-48">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link to="/account-settings" className="text-black">
                    Account Settings
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <button onClick={handleLogout} className="text-red-500">
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>  

      {/* Main Content */}
      <main className="flex-grow">
        <section className="flex flex-col items-center justify-center h-64 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://source.unsplash.com/random/800x600/?food")' }}>
          <h2 className="text-3xl text-black font-bold">Discover Delicious Recipes</h2>
          <p className="text-lg text-black">Is there anything specific you're craving today? 🍕🍫🍦</p>
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

      {/* Chat Popup Button */}
      <button onClick={toggleChat} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 fixed bottom-5 right-5">
        Chat
      </button>

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
