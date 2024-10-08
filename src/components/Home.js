import React from 'react';
import { useNavigate } from 'react-router-dom';
import ImageSlider from './ImageSlider.js';
import './Home.css';
import { useAuth } from './AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated ,userRole} = useAuth();

    const handleBookNow = () => {
        if(isAuthenticated){
          if(userRole === 'patient'){
            navigate('/doctorlist');
          }
          return;
        }else{
          navigate('/login');
        }
    };

    return (
      <div className="home-container">
        <h1 className="welcome-text">Welcome to Our Doctors & Patients Appointments Services</h1>
        <p className='home-desc'>Our platform is designed to simplify the process of booking appointments and facilitate meaningful discussions between doctors and patients.</p>
        <p className='home-desc'>Schedule your appointments with ease and convenience</p>
        {isAuthenticated && userRole === 'patient' && (
          <button className="header-button" onClick={handleBookNow}>Book Now</button>
        )}
        {!isAuthenticated && (
          <button className="header-button" onClick={handleBookNow}>Book Now</button>
        )}
        <div className="slider-container">
          <ImageSlider />
        </div>
      </div>
    );
  };
  
export default Home;
