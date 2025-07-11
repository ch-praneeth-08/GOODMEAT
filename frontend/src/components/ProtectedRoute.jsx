import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// This component takes another component as its 'children'
function ProtectedRoute({ children }) {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // We use useEffect to check the login status with our backend
  useEffect(() => {
    // Only check status if we don't know it yet (isLoggedIn is null)
    if (isLoggedIn === null) {
      axios.get('http://localhost:5000/auth/status', { withCredentials: true })
        .then(response => {
          // Update the global auth state based on the server's response
          setIsLoggedIn(response.data.isLoggedIn);
        })
        .catch(error => {
          // If there's an error (e.g., server is down), assume not logged in
          console.error('Error checking auth status:', error);
          setIsLoggedIn(false);
        });
    }
  }, [isLoggedIn, setIsLoggedIn]);

  // --- Render Logic ---

  // 1. If we are still checking the status, show a loading message
  if (isLoggedIn === null) {
    return <div style={{padding: '5rem', textAlign: 'center'}}>Loading...</div>;
  }

  // 2. If we have checked and the user is logged in, show the protected content
  if (isLoggedIn) {
    return children;
  }

  // 3. If we have checked and the user is NOT logged in, redirect to the login page
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;