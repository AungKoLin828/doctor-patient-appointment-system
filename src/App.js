import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About/About';
import Login from './components/Login';
import UserRegistration from './components/User/UserRegistration';
import AppointmentForm from './components/Appointments/AppointmentForm';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './components/ErrorPage ';

function App() {
  return (
    <div className="App">
      <Router>
      <Header />
      <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' element={<Login/>}/>
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<UserRegistration />} /> 
            <Route path="/appointment" element={<AppointmentForm/>}/>
            <Route path="/error" element={<ErrorPage />} /> 
          </Routes>
        </ErrorBoundary>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
