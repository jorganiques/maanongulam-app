import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaThumbsUp, FaComment, FaShareAlt, FaArrowLeft } from 'react-icons/fa'; // Import back arrow icon
import backgroundImage from '../assets/table3.png';

const RecipeDetail = () => {
  const { recipeId } = useParams(); // Get recipeId from URL params
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [likes, setLikes] = useState(0); // Added state for likes

  const navigate = useNavigate(); // Use useNavigate to go back to the previous page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeResponse = await axios.get(`http://localhost:5000/api/recipes/${recipeId}`);
        setRecipe(recipeResponse.data);

        const commentsResponse = await axios.get(`http://localhost:5000/api/comments/recipeId/${recipeId}`);
        setComments(commentsResponse.data);

        const ratingsResponse = await axios.get(`http://localhost:5000/api/ratings/recipeId/${recipeId}`);
        setRatings(ratingsResponse.data);

        const likesResponse = await axios.get(`http://localhost:5000/api/ratings/likes/${recipeId}`);
        setTotalLikes(likesResponse.data.likes); // Set total likes from the response
        setLikes(likesResponse.data.likes); // Set the initial likes
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    if (recipeId) {
      fetchData(); // Fetch data only if a recipeId is provided
    }
  }, [recipeId]);

  const handleLike = () => {
    setLikes(likes + 1); // Increment likes when the button is clicked
    // Optionally, you can send this like to the backend using an API call
    // axios.post('http://localhost:5000/api/likes', { recipeId, likes: likes + 1 });
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800 bg-white p-2 rounded-full shadow-md"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* Book Layout */}
      <div className="w-full max-w-5xl p-4 bg-white rounded-lg shadow-lg flex flex-col md:flex-row space-x-4">
        
        {/* Left Page (Title, Image, Creator) */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 overflow-y-auto h-96 border-r-4">
          <h2 className="text-orange-400 font-recia text-3xl font-bold mb-4">{recipe.title}</h2>
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-48 object-cover mb-4 rounded-md"
          />
          <p className="text-black text-lg">Created by: {recipe.creatorName}</p>
        </div>
  
        {/* Right Page (Ingredients, Instructions) */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 overflow-y-auto h-96">
          <h3 className="text-black text-2xl font-bold mb-2">Ingredients</h3>
          <p className="text-black mb-4">{recipe.ingredients.join(', ')}</p>
          
          <h3 className="text-black text-2xl font-bold mb-2">Instructions</h3>
          <p className="text-black">{recipe.instructions}</p>
        </div>
      </div>
  
      {/* Likes, Comments, Share Section */}
      <div className="w-full max-w-5xl p-4 bg-white mt-6 rounded-lg shadow-lg flex justify-between items-center">
        {/* Likes Section */}
        <div className="flex items-center">
          <button onClick={handleLike} className="flex items-center space-x-1">
            <FaThumbsUp className="text-blue-500" />
            <span>{likes}</span>
          </button>
        </div>
        
        {/* Comments Section */}
        <div className="flex items-center">
          <FaComment className="text-gray-500" />
          <span className="ml-2">{comments.length} Comments</span>
        </div>
        
        {/* Share Button */}
        <div>
          <button className="flex items-center space-x-1">
            <FaShareAlt className="text-green-500" />
            <span>Share</span>
          </button>
        </div>
      </div>
  
      {/* Comments List */}
      <div className="w-full max-w-5xl mt-4 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold">Comments</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.commentId} className="border-b py-2">{comment.comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeDetail;