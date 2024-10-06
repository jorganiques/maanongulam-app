import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams
import backgroundImage from '../assets/table3.png'

const InteractionStats = ({ totalLikes, totalComments }) => (
  <div className="flex items-center mb-4">
    <span className="flex items-center mr-6">
      <span className="text-blue-500">&#128077;</span> {/* Like symbol */}
      <span className="ml-2">{totalLikes} Likes</span>
    </span>
    <span className="flex items-center">
      <button className="text-gray-600 hover:text-gray-800 mr-2">
        💬 Comment
      </button>
      <span>{totalComments} Comments</span>
    </span>
  </div>
);

const InteractionButtons = () => (
  <div className="flex items-center">
    <button className="text-gray-600 hover:text-gray-800 mr-4">
      💬 Comment
    </button>
    <button className="text-gray-600 hover:text-gray-800 mr-4">
      🔗 Share
    </button>
  </div>
);

const RecipeDetail = () => {
  const { recipeId } = useParams(); // Get recipeId from URL params
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);

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
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    if (recipeId) {
      fetchData(); // Fetch data only if a recipeId is provided
    }
  }, [recipeId]);

  if (!recipe) return <p>Loading...</p>;

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
      <div className="container mx-auto p-4 bg-cover bg-center">
        <h2 className="text-orange-400 font-recia text-3xl font-bold mb-4">{recipe.title}</h2>
        <div className="font-recia text-black text-lg grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-64 object-cover mb-4" />
          </div>
          <div>
            <p className=""><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
          </div>
          <div>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
          </div>
          <div className="col-span-2">
            <InteractionStats totalLikes={totalLikes} totalComments={comments.length} />
            <InteractionButtons />
          </div>
        </div>
        <div className="mt-6">
          <h3 className="mb-2">Comments</h3>
          <ul>
            {comments.map(comment => (
              <li key={comment.commentId} className="border-b py-2">{comment.comment}</li>
            ))}
          </ul>
          <h3 className="mt-6 mb-2">Ratings</h3>
          <ul className="flex flex-col space-y-2">
            {ratings.map(rating => (
              <li key={rating.ratingId} className="border-b py-2 flex items-center">
                <span className="flex items-center">
                  {Array.from({ length: rating.rating }).map((_, index) => (
                    <span key={index} className="text-yellow-500">★</span>
                  ))}
                  {Array.from({ length: 5 - rating.rating }).map((_, index) => (
                    <span key={index} className="text-gray-300">★</span>
                  ))}
                </span>
                <span className="ml-2">by {rating.username}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  
  
  
  
  
  
  
};

export default RecipeDetail;
