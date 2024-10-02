// src/api/authApi.js
export const authenticateUser = async (values, isLogin) => {
    const url = isLogin 
      ? 'http://localhost:5000/api/users/login' 
      : 'http://localhost:5000/api/users/register';
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
  
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Something went wrong');
    }
  
    return await response.json();
  };
  