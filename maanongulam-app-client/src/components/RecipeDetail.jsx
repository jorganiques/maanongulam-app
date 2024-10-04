import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

const RecipeDetail = ({ recipeId }) => {  // Accept recipeId as a prop
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
        setTotalLikes(likesResponse.data.likes);  // Set total likes from the response
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    if (recipeId) {
      fetchData();  // Fetch data only if a recipeId is provided
    }
  }, [recipeId]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{recipe.title}</h2>
      <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-64 object-cover mb-4" />
      <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
      <p><strong>Instructions:</strong> {recipe.instructions}</p>

      {/* Interaction Stats Section */}
      <InteractionStats totalLikes={totalLikes} totalComments={comments.length} />
      
      {/* Interaction Buttons Section */}
      <InteractionButtons />

      <h3 className="mt-6 mb-2">Comments</h3>
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
                <span key={index} className="text-yellow-500">&#9733;</span>  // Star symbol
              ))}
              {Array.from({ length: 5 - rating.rating }).map((_, index) => (
                <span key={index} className="text-gray-300">&#9734;</span>  // Empty star symbol
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeDetail;
