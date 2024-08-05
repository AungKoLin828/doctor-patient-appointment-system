import React from 'react';
import { Link } from 'react-router-dom';
import './Common.css';

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h1>Something went wrong</h1>
      <p>We're sorry, but something went wrong. Please try again later.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default ErrorPage;
