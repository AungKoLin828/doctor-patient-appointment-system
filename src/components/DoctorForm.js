import React, { useState } from 'react';
import axios from 'axios';

const DoctorForm = ({ fetchDoctors }) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/doctors', { name, specialty });
      setName('');
      setSpecialty('');
      fetchDoctors();
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="doctor-form">
      <div>
        <label>Doctor Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Specialty:</label>
        <input
          type="text"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Doctor</button>
    </form>
  );
};

export default DoctorForm;
