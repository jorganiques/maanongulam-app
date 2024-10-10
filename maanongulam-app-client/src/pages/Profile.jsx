import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/table6.png';
import { fetchUserData } from '../api/userApi';

const MyProfile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [user, setUser] = useState({
    name: '',
    bio: 'Passionate home cook.',
    location: 'Manila, Philippines',
    profilePicture: 'https://via.placeholder.com/150',
    recipes: [
      { id: 1, title: 'Spaghetti Carbonara', image: 'https://via.placeholder.com/300' },
      { id: 2, title: 'Hawaiian Pizza', image: 'https://via.placeholder.com/300' },
    ],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBio, setNewBio] = useState(user.bio);
  const [image, setImage] = useState(null);
  const hiddenFileInput = useRef(null);

  useEffect(() => {
    const getUserData = async () => {
      if (userId) {
        try {
          const data = await fetchUserData(userId);
          setUser({
            ...user,
            name: `${data.firstName} ${data.lastName}`,
            bio: data.bio || user.bio,
            location: data.location || user.location,
            profilePicture: data.profilePicture || user.profilePicture,
          });

          // Load the image from localStorage if it exists
          const storedImage = localStorage.getItem('profilePicture');
          if (storedImage) {
            setImage(storedImage);
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };
    getUserData();
  }, [userId]);

  const handleBioChange = (event) => {
    setNewBio(event.target.value);
  };

  const saveBio = () => {
    setUser({ ...user, bio: newBio });
    setIsModalOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imgname = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = Math.max(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (maxSize - img.width) / 2,
          (maxSize - img.height) / 2
        );
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], imgname, {
              type: "image/png",
              lastModified: Date.now(),
            });

            console.log(file);
            setImage(file);
          },
          "image/jpeg",
          0.8
        );
      };
    };
  };

  const handleUploadButtonClick = (file) => {
    const myHeaders = new Headers();
    const token = "adhgsdaksdhk938742937423";
    myHeaders.append("Authorization", `Bearer ${token}`);

    const formdata = new FormData();
    formdata.append("file", file);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://trickuweb.com/upload/profile_pic", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(JSON.parse(result));
        const profileurl = JSON.parse(result);
        setImage(profileurl.img_url);

        // Store the image URL in localStorage
        localStorage.setItem('profilePicture', profileurl.img_url);
      })
      .catch((error) => console.log("error", error));
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        paddingBottom: '50px',
      }}
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-xl mt-16 w-11/12 md:w-3/4 lg:w-2/3 border-t-4 border-orange-500 relative">
        <button
          onClick={() => navigate('/home')}
          className="bg-orange-500 font-recia text-white px-4 py-2 rounded hover:bg-orange-600 absolute top-4 right-4"
        >
          Back to Home
        </button>
        {/* ------------------IMAGE UPLOAD------------------ */}
        <div className="flex items-center space-x-10"> 
          <div className="w-36 h-36 rounded-full border-4 border-gray-200 shadow-lg overflow-hidden">
            <div>
              <div onClick={handleClick} style={{ cursor: "pointer" }}>
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="upload image" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <img src="./photo.png" alt="upload image" className="w-full h-full object-cover rounded-full" />
                )}

                <input
                  id="image-upload-input"
                  type="file"
                  onChange={handleImageChange}
                  ref={hiddenFileInput}
                  style={{ display: "none" }}
                />
              </div>
              <button
                className="image-upload-button"
                onClick={() => handleUploadButtonClick(image)}
              >
                Upload
              </button>
            </div>
          </div>
          
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.location}</p>
            <p className="text-gray-700 mt-2">{user.bio}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-blue-500 underline"
            >
              Edit Bio
            </button>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-4xl font-bold text-gray-800 mb-10">My Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {user.recipes.map(recipe => (
              <div key={recipe.id} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-3xl font-semibold text-gray-900">{recipe.title}</h3>
                {recipe.image && <img src={recipe.image} alt={recipe.title} className="mt-6 rounded-lg" />}
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Edit Bio</h2>
              <textarea
                value={newBio}
                onChange={handleBioChange}
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBio}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
