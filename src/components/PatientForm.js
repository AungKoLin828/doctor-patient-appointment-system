import React, { useState } from 'react';
import axios from 'axios';

const PatientForm = ({ fetchPatients }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/patients', { name, email, phone });
      setName('');
      setEmail('');
      setPhone('');
      fetchPatients();
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="patient-form">
      <div>
        <label>Patient Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Phone:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Patient</button>
    </form>
  );
};

export default PatientForm;
