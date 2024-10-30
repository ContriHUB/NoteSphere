import React, { createContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setLoading(false);
  };

  // Simulate fetching user data, replace with your actual API call
  useEffect(() => {
    // Mock fetch user
    const fetchUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user')); // Or replace with your API call
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
