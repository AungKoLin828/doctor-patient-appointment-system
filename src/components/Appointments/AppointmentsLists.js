// src/components/DataDisplay.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Common.css'; // Create this CSS file for styling

const AppointmentsLists = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsRes = await axios.get('http://localhost:5000/api/doctors');
        const patientsRes = await axios.get('http://localhost:5000/api/patients');
        const appointmentsRes = await axios.get('http://localhost:5000/api/appointments');

        setDoctors(doctorsRes.data);
        setPatients(patientsRes.data);
        setAppointments(appointmentsRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="data-display-container">
      <h1>Doctors, Patients, and Appointments</h1>
      <div className="section">
        <h2>Doctors</h2>
        <ul>
          {doctors.map(doctor => (
            <li key={doctor.id}>
              {doctor.name} - {doctor.specialty}
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>Patients</h2>
        <ul>
          {patients.map(patient => (
            <li key={patient.id}>
              {patient.name} - Age: {patient.age}
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>Appointments</h2>
        <ul>
          {appointments.map(appointment => (
            <li key={appointment.id}>
              Doctor ID: {appointment.doctorId}, Patient ID: {appointment.patientId}, Date: {appointment.date}, Time: {appointment.time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AppointmentsLists;
