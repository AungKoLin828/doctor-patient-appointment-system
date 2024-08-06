import React from 'react';
import './Footer.css'; // Create a CSS file for styling the footer

const Footer = () => {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; Design & Developed By AungKoLin. {year} Doctors & Patients Appointments System. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
