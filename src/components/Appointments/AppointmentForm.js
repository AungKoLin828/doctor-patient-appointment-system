import React, { useState, useEffect } from 'react';
import '../Common.css';
import axios from 'axios';

const AppointmentForm = ({ fetchAppointments }) => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const fetchDoctorsAndPatients = async () => {
      try {
        const [doctorsResponse, patientsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/doctors'),
          axios.get('http://localhost:5000/api/patients'),
        ]);
        setDoctors(doctorsResponse.data);
        setPatients(patientsResponse.data);
      } catch (error) {
        console.error('Error fetching doctors or patients:', error);
      }
    };
    fetchDoctorsAndPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/appointments', {
        doctor_id: doctorId,
        patient_id: patientId,
        date,
        time,
      });
      setDoctorId('');
      setPatientId('');
      setDate('');
      setTime('');
      fetchAppointments();
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label>Doctor:</label>
        <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} ({doctor.specialty})
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Patient:</label>
        <select value={patientId} onChange={(e) => setPatientId(e.target.value)} required>
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name} ({patient.email})
            </option>
          ))}
        </select>
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
