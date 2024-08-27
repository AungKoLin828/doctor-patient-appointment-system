import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
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
import DoctorList from './components/User/DoctorsLists';
import PatientsLists from './components/User/PatientsLists';
import { AuthProvider } from './components/AuthContext';
import AdminDashboard from './components/User/AdminDashboard ';

function App() {

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
            <Route path="/doctorlist" element={<DoctorList />} />
            <Route path="/patientlist" element={<PatientsLists />} />
            <Route path="/patient/:id" element={<PatientProfile />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
