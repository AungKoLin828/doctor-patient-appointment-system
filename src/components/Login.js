import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Common.css';
import axios from 'axios'; // Make sure you have axios installed

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (username === '' || password === '') {
      setError('Username and password are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      
      if (response.status === '200' ){
        console.log(response.data.message);
      // Handle successful login, e.g., redirect to another page or save token
      }else{
        setError('Invalid username or password');
        console.log(response.data.message);
      }
    } catch (error) {
      setError('Invalid username or password');
    }

    // Reset the form
    setUsername('');
    setPassword('');
    setError('');
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
