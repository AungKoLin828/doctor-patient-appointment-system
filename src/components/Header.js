import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import './Header.css';
import logoImg from '../logo.png'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={isScrolled ? 'header scrolled' : 'header'}>
      
      <h1><img className='logo-img' src={logoImg} alt="Logo" /> &nbsp; Doctors & Patients Appointments System</h1>
      <nav>
        <ul>           
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
