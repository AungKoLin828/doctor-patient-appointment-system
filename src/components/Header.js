import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoImg from '../logo.png';
import { useAuth } from './AuthContext';  // Assume this provides the login state

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();  // AuthContext provides authentication state
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // Clear authentication state
    navigate('/login');  // Redirect to login page
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <h1>
          <img className="logo-img" src={logoImg} alt="Logo" />
          <span>Doctors & Patients Appointments System</span>
        </h1>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>

            {isAuthenticated ? (
              <>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/appointment">Appointment</Link></li>
                <li><Link to="/userlists">User List</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/about">About</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
