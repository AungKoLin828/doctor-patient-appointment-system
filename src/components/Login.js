import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Common.css';
import { useAuth } from './AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Get login function and other state from AuthContext
  const { login, userRole, userId } = useAuth(); // Extract userRole and userId
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      await login(username, password);

      // Redirect based on user role
      if (userRole === 'doctor') {
        navigate(`/doctor/${userId}`);
      } else if (userRole === 'patient') {
        navigate(`/patient/${userId}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred. Please try again.';
      setError(message);
    } finally {
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Phone:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
};

export default Login;
