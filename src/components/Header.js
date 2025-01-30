import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoImg from '../logo.png';
import { useAuth } from './AuthContext';
import { useWebSocket } from './WebSocketProvider';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, userRole, userId, logout } = useAuth();
  const navigate = useNavigate();
  const { disconnectWebSocket } = useWebSocket();

  const handleLogout = () => {
    logout();
    disconnectWebSocket();
    navigate('/login');
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
                {userRole === 'doctor' && (
                  <>
                  <li><Link to={`/doctor/${userId}`}>Profile</Link></li>
                  <li><Link to="/messages">Messages</Link></li>
                  </>
                )}
                {userRole === 'patient' && (
                  <>
                  <li><Link to={`/patient/${userId}`}>Profile</Link></li>
                  <li><Link to={"/doctorlist"}>All Doctors</Link></li>
                  </>
                )}
                {userRole === 'admin' && (
                  <>
                  <li><Link to={`/dashboard`}>Dashboard</Link></li>
                  <li><Link to={"/doctorlist"}>All Doctors</Link></li>
                  {/* <li><Link to="/userlists">Appointment List</Link></li> */}
                  <li><Link to="/patientlist">All Patients</Link></li>
                  </>
                )}
                <li>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    Logout
                  </Link>
                </li>
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
