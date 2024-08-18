import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated by checking localStorage
    const savedAuthState = localStorage.getItem('isAuthenticated');
    const savedUserRole = localStorage.getItem('userRole');
    const savedUserId = localStorage.getItem('userId');

    if (savedAuthState) {
      setIsAuthenticated(JSON.parse(savedAuthState));
      setUserRole(savedUserRole);
      setUserId(savedUserId);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/login', { username, password });
      setIsAuthenticated(true);
      setUserRole(data.role);
      setUserId(data.id);
      console.log(data);
      // Persist login state in localStorage
      localStorage.setItem('isAuthenticated', true);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userId', data.id);
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
