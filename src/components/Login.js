import React, { useState } from 'react';
import './Common.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation
    if (username === '' || password === '') {
      setError('Username and password are required');
      return;
    }

    // TODO: Implement authentication logic here
    // For now, we'll just log the inputs
    console.log('Username:', username);
    console.log('Password:', password);

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
      </form>
    </div>
  );
};

export default Login;
