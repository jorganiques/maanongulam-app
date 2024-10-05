import React, { useState } from 'react';  
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authenticateUser } from '../api/authApi'; // API function for authentication

const AuthenticationScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

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
      const data = await authenticateUser(values, isLogin);
      console.log(data);
      localStorage.setItem('userId', data.userId);
      navigate('/home');
    } catch (error) {
      console.error('Error:', error);
      // Optionally handle error feedback here
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">
        {isLogin ? 'Login' : 'Register'}
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="w-80 space-y-4">
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
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>
      <ToggleLoginLink isLogin={isLogin} setIsLogin={setIsLogin} />
    </div>
  );
};

// Component for field with error message
const FieldWithError = ({ name, placeholder, type = 'text' }) => (
  <div>
    <Field
      type={type}
      name={name}
      placeholder={placeholder}
      className="p-2 border rounded"
    />
    <ErrorMessage name={name} component="div" className="text-red-500" />
  </div>
);

// Toggle link for switching between login and register
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

export default AuthenticationScreen;
