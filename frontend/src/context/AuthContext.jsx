import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the Provider component
// This component will wrap our entire app and manage the auth state
export const AuthProvider = ({ children }) => {
  // The state holds whether the user is logged in.
  // We initialize it to null, meaning we don't know yet.
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // The value that will be provided to all children components
  const value = { isLoggedIn, setIsLoggedIn };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy access to the context
// This is a convenience hook so we don't have to import useContext everywhere
export const useAuth = () => {
  return useContext(AuthContext);
};