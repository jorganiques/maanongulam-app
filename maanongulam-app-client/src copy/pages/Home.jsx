import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaComment } from 'react-icons/fa';
import RecipeGrid from '../components/RecipeGrid';
import SearchInput from '../components/SearchInput';
import Chat from '../components/Chat'; // Import Chat component

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // State for chat visibility
  const userId = localStorage.getItem('userId'); // Retrieve userId

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen); // Toggle chat visibility
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-bold text-black">Ma! Anong ulam?</h1>
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <FaBars className="text-2xl" />
          </button>
        </div>
        <ul className={`absolute md:static bg-white w-full md:w-auto transition-transform ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:translate-y-0 md:flex md:items-center`}>
          <li className="p-4"><Link className="text-black" to="/">Home</Link></li>
          <li className="p-4"><Link className="text-black" to="/recipes">Recipes</Link></li>
          <li className="p-4"><Link className="text-black" to="/about">About</Link></li>
          <li className="p-4"><Link className="text-black" to="/contact">Contact</Link></li>
          <li className="p-4">
            <Link className="text-blue-500" to={`/create-recipe?userId=${userId}`}>Create a Recipe</Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-64 bg-cover bg-center" style={{ backgroundImage: 'url("https://source.unsplash.com/random/800x600/?food")' }}>
        <h2 className="text-3xl text-black font-bold">Discover Delicious Recipes</h2>
        <p className="text-lg text-black">Explore, Cook, Enjoy!</p>
        {/* Search Input */}
        <SearchInput />
      </section>

      {/* Recipe Grid */}
      <RecipeGrid />

      {/* Chat Button */}
      <button
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        onClick={toggleChat}
      >
        <FaComment className="text-2xl" />
      </button>

      {/* Chat Component in Pop-up Mode */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-lg rounded-lg p-4">
          <Chat />
        </div>
      )}
    </div>
  );
};

export default Home;
