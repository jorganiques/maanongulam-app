import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateUser, deleteUser, deactivateUser, fetchUserData } from '../api/userApi'; // Importing API functions

const AccountSettings = ({ userId, onClose }) => {
  const userIdentifier = userId || localStorage.getItem('userId');

  const formik = useFormik({
    initialValues: {
      username: '', // Set this to an appropriate default if necessary
      email: '',
      firstName: '',
      lastName: '',
      contactNumber: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      contactNumber: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const updatedUser = await updateUser(userIdentifier, values);
        console.log('User updated successfully', updatedUser);
      } catch (error) {
        console.error('Error updating user:', error);
        alert(`Update failed: ${error.message}`); // Inform the user of the failure
      }
    },
  });

  useEffect(() => {
    const getUserData = async () => {
      if (userIdentifier) {
        try {
          const data = await fetchUserData(userIdentifier); // Fetching user data
          // Set default values to prevent uncontrolled input
          formik.setValues({
            username: data.username || '',
            email: data.email || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            contactNumber: data.contactNumber || '',
          });
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };
    getUserData();
  }, [userIdentifier]);

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(userIdentifier);
      console.log('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account', error);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      await deactivateUser(userIdentifier);
      console.log('Account deactivated successfully');
    } catch (error) {
      console.error('Error deactivating account', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h3 className="text-lg font-bold mb-4">Account Information</h3>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            name="username"
            value={formik.values.username}
            readOnly
            className="border p-2 rounded w-full mb-2 bg-gray-200" // Added gray background for readonly
          />
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Email"
            className={`border p-2 rounded w-full mb-2 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 mb-2">{formik.errors.email}</div>
          )}
          <input
            type="text"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="First Name"
            className={`border p-2 rounded w-full mb-2 ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : ''}`}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className="text-red-500 mb-2">{formik.errors.firstName}</div>
          )}
          <input
            type="text"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Last Name"
            className={`border p-2 rounded w-full mb-2 ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : ''}`}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div className="text-red-500 mb-2">{formik.errors.lastName}</div>
          )}
          <input
            type="text"
            name="contactNumber"
            value={formik.values.contactNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Contact Number"
            className={`border p-2 rounded w-full mb-4 ${formik.touched.contactNumber && formik.errors.contactNumber ? 'border-red-500' : ''}`}
          />
          {formik.touched.contactNumber && formik.errors.contactNumber && (
            <div className="text-red-500 mb-2">{formik.errors.contactNumber}</div>
          )}
          <div className="flex justify-between mb-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
            <button type="button" onClick={handleDeactivateAccount} className="bg-yellow-500 text-white px-4 py-2 rounded">Deactivate Account</button>
            <button type="button" onClick={handleDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded">Delete Account</button>
          </div>
        </form>
        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded w-full">Exit</button>
      </div>
    </div>
  );
};

export default AccountSettings;
