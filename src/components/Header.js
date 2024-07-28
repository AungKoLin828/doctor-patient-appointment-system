import React from 'react';
import './Header.css'; // Create a CSS file for styling the banner

const Header = () => {
  return (
    <div className="header">
      <div className="header-content">
        <h1>Doctor-Patient Appointment System</h1>
        <p>Schedule your appointments with ease and convenience</p>
        <button className="header-button">Book Now</button>
      </div>
    </div>
  );
};

export default Header;
