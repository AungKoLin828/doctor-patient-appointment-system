import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Common.css'; 

const AppointmentsLists = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsRes = await axios.get('http://localhost:5000/api/appointments');
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
