import React, { useState } from 'react'; // Removed useEffect as it's no longer needed
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import { FaBars } from 'react-icons/fa';
import RecipeGrid from '../components/RecipeGrid';
import SearchInput from '../components/SearchInput';
import CategoriesCarousel from '../components/CategoriesCarousel';
import RecipeDetail from '../components/RecipeDetail'; // Import RecipeDetail
import logo from '../assets/maulogo.png';
import backgroundImage from '../assets/table3.png';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Profile dropdown state
  const navigate = useNavigate(); 
  const { recipeId } = useParams(); // Get the recipeId from the URL
  const userId = localStorage.getItem('userId'); // Get userId from local storage

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
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

  const handleAccountSettings = () => {
    navigate('/account-settings'); // Navigate to AccountSettings page
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
      }}
    >
      {/* Navbar */}
      <nav
        className="flex items-center justify-between p-4 bg-white shadow"
        style={{ backgroundColor: 'rgba(211, 211, 211, 0.4)' }} // Transparent background for the navbar
      >
        {/* Logo - Clickable and Refreshes the Homepage */}
        <Link to="/">
          <img
            src={logo} // Replace 'logo' with the actual path to the logo image if necessary
            alt="Ma! Anong ulam? Logo"
            className="h-32 -mt-7 -mb-5"
          />
        </Link>
  
        {/* Create Post Button and Profile Picture Dropdown Container */}
        <div className="flex items-center space-x-4">
          {/* Create Post Button */}
          <button className="bg-orange-400 font-recia text-white px-4 py-2 rounded hover:bg-red-900">
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
                  <button onClick={() => navigate('/profile')} className="text-black">
                    My Profile
                  </button>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <button onClick={handleAccountSettings} className="text-black">
                    Account Settings
                  </button>
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
        <section
          className="flex flex-col items-center justify-center h-64 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://source.unsplash.com/random/800x600/?food")' }} // Replace or keep the Unsplash image for this section
        >
          <h2 className="text-7xl text-orange-400 font-bold font-zina">
            Discover. Delicious. Recipes.
          </h2>
          <p className="text-2xl text-red-900 font-recia">
            Is there anything specific you're craving today?
          </p>
          <SearchInput />
        </section>
        <CategoriesCarousel onCategorySelect={handleCategorySelect} />
  
        {/* Render RecipeDetail if recipeId is present */}
        {recipeId ? (
          <RecipeDetail recipeId={recipeId} />
        ) : (
          <RecipeGrid
            selectedCategoryId={selectedCategoryId}
            onRecipeSelect={handleRecipeSelect}
          />
        )}
      </main>
  
      {/* Footer */}
      <footer className="bg-white p-2 text-center shadow mt-4"
      style={{ backgroundColor: 'rgba(211, 211, 211, 0.4)'}}>
        <p className="text-black">&copy; 2024 Kurimau. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
