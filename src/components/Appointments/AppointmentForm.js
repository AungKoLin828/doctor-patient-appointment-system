import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // For retrieving passed doctor data
import '../Common.css';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Assuming you're using an AuthContext for authentication

const AppointmentForm = ({ fetchAppointments }) => {
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const location = useLocation();
  const { userId, loginUserName } = useAuth(); // Retrieve logged-in user data

  useEffect(() => {
    // Auto-bind the doctor info from location state (passed from DoctorList)
    if (location.state) {
      setDoctorId(location.state.doctorId || '');
      setDoctorName(location.state.doctorName || '');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/appointments', {
        doctor_id: doctorId,
        patient_id: userId, // Auto-bind the logged-in user's ID
        date,
        time,
      });
      setDate('');
      setTime('');
      fetchAppointments(); // Fetch updated appointments after submitting
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label>Doctor:</label>
        <input
          type="text"
          value={doctorName} // Auto-bind the selected doctor's name
          disabled
        />
      </div>
      <div className="form-group">
        <label>Patient:</label>
        <input
          type="text"
          value={loginUserName || 'Loading...'} // Auto-bind the logged-in user's name
          disabled
        />
      </div>
      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <button type="submit">Book Appointment</button>
    </form>
  );
};

export default AppointmentForm;
