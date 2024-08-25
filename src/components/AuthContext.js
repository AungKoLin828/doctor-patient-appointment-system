import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loginUserName, setLoginUserName] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated by checking localStorage
    const savedAuthState = localStorage.getItem('isAuthenticated');
    const savedUserRole = localStorage.getItem('userRole');
    const savedUserId = localStorage.getItem('userId');
    const savedUserName = localStorage.getItem('loginUserName');

    if (savedAuthState) {
      setIsAuthenticated(JSON.parse(savedAuthState));
      setUserRole(savedUserRole);
      setUserId(savedUserId);
      setLoginUserName(savedUserName);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/login', { username, password });
      setIsAuthenticated(true);
      setUserRole(data.role);
      setUserId(data.id);
      setLoginUserName(data.name);
      console.log(data);
      // Persist login state in localStorage
      localStorage.setItem('isAuthenticated', true);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', data.name);
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setLoginUserName(null);
    
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('loginUserName');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId,loginUserName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
