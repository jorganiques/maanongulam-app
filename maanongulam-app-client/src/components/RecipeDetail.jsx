import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaThumbsUp, FaComment, FaShareAlt, FaArrowLeft, FaStar, FaHeart, FaEllipsisV } from 'react-icons/fa';
import backgroundImage from '../assets/table2.png';
import { fetchUserData } from '../api/userApi';
import { fetchCommentsByRecipeId, postComment, deleteComment, updateComment } from '../api/commentApi';
import { fetchFavoritesCount, checkIfFavorited, addFavorite, removeFavorite} from '../api/favoriteApi';
import { fetchRatingsByRecipeId, submitRating, fetchLikesCount } from '../api/ratingApi';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [likes, setLikes] = useState(0);
  const [creator, setCreator] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recipe details
        const recipeResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recipes/${recipeId}`);
        const recipeData = await recipeResponse.json();
        setRecipe(recipeData);

        // Fetch recipe creator
        const creatorResponse = await fetchUserData(recipeData.userId);
        setCreator(creatorResponse);

        // Get the logged in user ID
        const loggedInUserId = localStorage.getItem('userId');
        setUserId(loggedInUserId);

        // Fetch comments
        const commentsData = await fetchCommentsByRecipeId(recipeId);
        const enrichedComments = await Promise.all(commentsData.map(async comment => {
          const user = await fetchUserData(comment.userId);
          return { ...comment, user };
        }));
        setComments(enrichedComments);

        // Fetch ratings
        const ratingsData = await fetchRatingsByRecipeId(recipeId);
        const totalRatings = ratingsData.reduce((acc, rating) => acc + rating.rating, 0);
        const average = ratingsData.length > 0 ? totalRatings / ratingsData.length : 0;
        setAverageRating(average);

        const userRatingData = ratingsData.find(rating => rating.userId === loggedInUserId);
        if (userRatingData) {
          setUserRating(userRatingData.rating);
          setHasRated(true);
        }

        // Fetch likes count
        const likesCount = await fetchLikesCount(recipeId);
        setLikes(likesCount);

        // Fetch favorites
        const favoritesCount = await fetchFavoritesCount(recipeId);
        setFavoriteCount(favoritesCount);
        const userFavorite = checkIfFavorited(favoritesCount.favorites, loggedInUserId);
        setIsFavorited(!!userFavorite);

      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    if (recipeId) {
      fetchData();
    }
  }, [recipeId]);

  const handleRating = async (rating) => {
    try {
      if (hasRated) {
        alert("You have already rated this recipe.");
        return;
      }

      await submitRating(userId, recipeId, rating);
      setUserRating(rating);
      setHasRated(true);
      
      const updatedRatingsResponse = await fetchRatingsByRecipeId(recipeId);
      const totalUpdatedRatings = updatedRatingsResponse.reduce((acc, rating) => acc + rating.rating, 0);
      const updatedAverage = updatedRatingsResponse.length > 0 ? totalUpdatedRatings / updatedRatingsResponse.length : 0;
      setAverageRating(updatedAverage);

    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorited) {
        await removeFavorite(userId, recipeId);
        setIsFavorited(false);
        setFavoriteCount(prevCount => prevCount - 1);
      } else {
        await addFavorite(userId, recipeId);
        setIsFavorited(true);
        setFavoriteCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error('Error favoriting recipe:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await postComment(userId, recipeId, newComment);
      const userComment = await fetchUserData(userId);
      setComments(prevComments => [...prevComments, { ...response, user: userComment }]);
      setNewComment('');

    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Recipe link copied to clipboard!');
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const openEditModal = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.comment);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleEditComment = async () => {
    try {
      await updateComment(editingCommentId, editingCommentText);
      setComments(prevComments => prevComments.map(comment => 
        comment._id === editingCommentId ? { ...comment, comment: editingCommentText } : comment
      ));
      closeEditModal();
    } catch (error) {
      console.error('Error editing comment:', error);
    }
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
      <button onClick={() => navigate(-1)} className="bg-orange-400 text-red-900 absolute top-4 left-4 flex items-center hover:bg-red-900 hover:text-orange-400 p-2 rounded-full shadow-md transition duration-300">
        <FaArrowLeft className="mr-2" /> Back
      </button>

  
      {/* Two-column layout for recipe details */}
      <div className="w-full max-w-5xl p-4 bg-white rounded-lg shadow-lg flex flex-col md:flex-row space-x-4">
        <div className="w-full md:w-1/2 bg-gray-50 p-6 overflow-y-auto h-96 border-r-4">
          <h2 className="text-orange-400 font-recia text-3xl font-bold mb-4">{recipe.title}</h2>
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 object-cover mb-4 rounded-md" />
          {creator && (
            <p className="text-black text-md">Recipe by: {creator.firstName} {creator.lastName} </p>
          )}
  
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`cursor-pointer ${i < userRating ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => handleRating(i + 1)}
              />
            ))}
            <span className="ml-2 text-sm">Rating: {averageRating.toFixed(1)}</span>
          </div>
        </div>
  
        <div className="w-full md:w-1/2 bg-gray-50 p-6 overflow-y-auto h-96">
          <h3 className="text-black text-2xl font-bold mb-2">Ingredients</h3>
          <ul className="list-disc pl-5">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">{ingredient}</li>
            ))}
          </ul>
  
          <h3 className="text-black text-2xl font-bold mt-4 mb-2">Instructions</h3>
          <p className="text-gray-700">{recipe.instructions}</p>
        </div>
      </div>
  
      {/* Likes and Comments Section */}
      <div className="w-full max-w-5xl p-4 bg-white rounded-lg shadow-lg mt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <button onClick={handleFavorite} className={`flex items-center ${isFavorited ? 'text-red-500' : 'text-gray-600'} hover:text-red-500 transition duration-300`}>
              <FaHeart className="mr-1" /> {favoriteCount} {isFavorited ? 'Unfavorite' : 'Favorite'}
            </button>
            <span className="ml-4 flex items-center"><FaThumbsUp className="mr-1" /> {likes}</span>
            <span className="ml-4 flex items-center"><FaComment className="mr-1" /> {comments.length}</span>
            <button onClick={handleShare} className="ml-4 flex items-center text-gray-600 hover:text-gray-800 transition duration-300"><FaShareAlt className="mr-1" /> Share</button>
          </div>
        </div>
  
        {/* Comments Section */}
        <div className="max-h-64 overflow-y-scroll">
        {comments.map(comment => (
          <div key={comment._id} className="flex items-start border-b py-2">
            <img src={comment.user.profilePicture || 'default-profile.png'} alt={comment.user.firstName} className="w-8 h-8 rounded-full mr-2" />
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-bold">{comment.user.firstName} {comment.user.lastName}</span>
                {/* Show 3-dot menu only if the comment belongs to the logged-in user */}
                {comment.userId === userId && (
                  <div className="relative">
                    <button onClick={() => setEditingCommentId(comment._id)} className="text-gray-500 hover:text-gray-700 transition duration-300">
                      <FaEllipsisV />
                    </button>

                    {/* Conditionally render the dropdown when the ellipsis is clicked */}
                    {editingCommentId === comment._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            openEditModal(comment); // Opens the modal
                            setEditingCommentId(null); // Hide the dropdown after clicking Edit
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 transition duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p>{comment.comment}</p>
              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}

        {/* Edit Comment Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-1/3">
              <h3 className="text-xl font-bold mb-2">Edit Comment</h3>
              <textarea
                value={editingCommentText}
                onChange={e => setEditingCommentText(e.target.value)}
                className="w-full h-24 border rounded-md px-2 py-1"
              />
              <div className="flex justify-end mt-4">
                <button onClick={closeEditModal} className="mr-2 bg-gray-500 text-white rounded-md px-4 py-2">Cancel</button>
                <button onClick={handleEditComment} className="bg-green-500 text-white rounded-md px-4 py-2">Save</button>
              </div>
            </div>
          </div>
        )}

        </div>

        {/* Comment Input */}
        <form onSubmit={handleCommentSubmit} className="flex mt-4">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border rounded-md px-4 py-2"
          />
          <button type="submit" className="ml-2 bg-orange-400 text-red-900 hover:bg-red-900 hover:text-orange-400 rounded-full shadow-md transition duration-300 rounded-md px-4 py-2">Post</button>
        </form>
      </div>
    </div>
  );
};

export default RecipeDetail;
