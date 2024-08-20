import { BrowserRouter as Router, Route, Routes,Link  } from 'react-router-dom';
import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About/About';
import Login from './components/Login';
import UserRegistration from './components/User/UserRegistration';
import AppointmentForm from './components/Appointments/AppointmentForm';
import AppointmentsLists from './components/Appointments/AppointmentsLists';
import PatientProfile from './components/User/PatientProfile';
import DoctorProfile from './components/User/DoctorProfile';
import { AuthProvider } from './components/AuthContext';

function App() {

  // Check inactivity on page load
  useEffect(() => {
    const checkInactivity = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      const now = new Date().getTime();
      const thirtyMinutes = 30 * 60 * 1000;

      if (lastActivity && (now - lastActivity) > thirtyMinutes) {
        localStorage.clear();
        alert('You have been logged out due to inactivity.');
        Link('/login'); // Redirect to login
      }
    };

    const resetTimer = () => {
      localStorage.setItem('lastActivity', new Date().getTime());
    };

    // Attach event listeners to reset the timer on activity
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onkeypress = resetTimer;

    // Call the inactivity check function on page load
    checkInactivity();
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/appointment" element={<AppointmentForm />} />
            <Route path="/userlists" element={<AppointmentsLists />} />
            <Route path="/patient/:id" element={<PatientProfile />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
