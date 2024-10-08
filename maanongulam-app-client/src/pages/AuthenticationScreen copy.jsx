// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';  
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authenticateUser } from '../api/authApi'; // API function for authentication
import logo from '../assets/maulogo.png';
import backgroundImageAuth from '../assets/table4.png';
import chefhat from '../assets/chefhat.png';

const AuthenticationScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');  // New state for error handling
  const [isBlurred, setIsBlurred] = useState(false); // State to trigger the blur effect

  // Initial form values
  const initialValues = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    firstName: isLogin ? Yup.string().nullable() : Yup.string().required('Required'),
    lastName: isLogin ? Yup.string().nullable() : Yup.string().required('Required'),
    email: isLogin ? Yup.string().nullable() : Yup.string().email('Invalid email').required('Required'),
    contactNumber: isLogin ? Yup.string().nullable() : Yup.string().optional(),
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      localStorage.setItem('username', values.username);
      
      const data = await authenticateUser(values, isLogin);
  
      // If authentication is successful
      console.log(data);
      localStorage.setItem('userId', data.userId);
      navigate('/home');
    } catch (error) {
      if (!initialValues.password || !initialValues.username) {
        setFormError("Username or Password is Incorrect . Please try again.");
      } else {
        console.error('Error:', error);
        setFormError("Something Went Wrong. Please try again later.");
      }
    }
  };
  

  // Component for field with error message
  // eslint-disable-next-line react/prop-types
  const FieldWithError = ({ name, placeholder, type = 'text' }) => (
    <div>
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        className="p-2 border rounded w-80"
      />
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </div>
  );

  // Toggle link for switching between login and register
  // eslint-disable-next-line react/prop-types
  const ToggleLoginLink = ({ isLogin, setIsLogin }) => (
    <p className="mt-4">
      {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
      <Link 
        to="#" 
        onClick={() => setIsLogin(!isLogin)} 
        className="text-blue-500 underline"
      >
        {isLogin ? 'Register' : 'Login'}
      </Link>
    </p>
  );

  useEffect(() => {
    // Trigger the blur-out animation after 2.5 seconds
    const timer1 = setTimeout(() => {
      setIsBlurred(true);
    },);

    // Cleanup timers on unmount
    return () => {
      clearTimeout(timer1);
    };
  },);

  return (
    <section 
    className= {`flex flex-col min-h-screen transition-all duration-500 
        ${isBlurred ? '' : 'opacity-0 blur-sm'}`}
    style={{
      backgroundImage: `url(${backgroundImageAuth})`,
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat', 
    }}
    >
      {/* ------------------NAVIGATION BAR------------------ */}
      <nav
      className="flex items-center justify-center p-4 bg-white shadow"
      style={{ backgroundColor: 'rgba(211, 211, 211, 0.4)' }} // Transparent background for the navbar
      >
        {/* Logo - Clickable and Refreshes the Homepage */}
        <Link to="/">
          <img
            src={logo} // Replace 'logo' with the actual path to the logo image if necessary
            alt="Ma! Anong ulam? Logo"
            className="h-32 -mt-7 -mb-5 item"
          />
        </Link>
      </nav>
      {/* ------------------REGISTRATION FORM------------------ */}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="flex flex-col items-center mt-20 bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto w-full space-y-4 relative z-10 border-t-4 border-orange-400 ">
                  <h1 className="text-4xl font-semibold text-red-900 mb-6 font-marmelad">
        {isLogin ? 'Login' : 'Register'}
      </h1>
            {/* Conditional rendering of registration fields */}
            {!isLogin && (
              <>
                <FieldWithError name="firstName" placeholder="First Name" />
                <FieldWithError name="lastName" placeholder="Last Name" />
                <FieldWithError type="email" name="email" placeholder="Email" />
                <FieldWithError name="contactNumber" placeholder="Contact Number (optional)" />
              </>
            )}
              <FieldWithError name="username" placeholder="Username" />
              <FieldWithError type="password" name="password" placeholder="Password" />

              {/* Show error message if there's an error */}
              {formError && <div className="text-red-500 mt-2">{formError}</div>}
              
            <button type="submit" className="w-72 p-2 bg-orange-400 hover:bg-orange-600 text-white text-lg px-6 py-3 rounded-lg shadow-md transition-all">
              {isLogin ? 'Login' : 'Register'}
            </button>
            <ToggleLoginLink isLogin={isLogin} setIsLogin={setIsLogin} />
          </Form>
        )}
      </Formik>

      <div className="flex flex-col justify-center items-end text-right p-8 fixed right-20 top-2/3 z-20">
        <h1 className="text-3xl font-bold text-orange-600 mb-4 font-marmelad">
          Discover, Share, and Cook <br/> with Confidence!
        </h1>
        <p className="text-xl text-red-900 max-w-xs font-marmelad">
          Your trusted culinary hub for reliable, time-saving recipes, crafted by real people, loved by the community.
        </p>
      </div>

         {/* Moving Food Animation */}
         <div className="food-animation">
        <img src={chefhat} alt="Burger" className="w-16 h-16" />
      </div>

      {/* Animation styles */}
      <style>
        {`

          .food-animation {
            position: absolute;
            top: 140px; /* Adjust this to position the chef hat higher */
            left: 47%; /* Center horizontally */
            transform: translateX(-50%); /* Align properly to center */
            animation: float 5s ease-in-out infinite;
          }
          
          .food-animation img {
          width: 100px;
          display: flex;
          position: relative;
          justify-content: center;
          align-items: center;
          }

          @keyframes float {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
            100% {
              transform: translateY(0);
            }
          }
        `}
      </style>
    </section>
  );
};

export default AuthenticationScreen;
