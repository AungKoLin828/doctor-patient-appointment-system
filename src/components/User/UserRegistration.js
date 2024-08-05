import React, { useState } from 'react';
//import axios from 'axios';
import '../Common.css';

const UserRegistration = ({ fetchUser }) => {
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      // await axios.post('http://localhost:5000/api/user', { name, phoneNo, password, age, address, role, specialty });
      setName('');
      setPhoneNo('');
      setPassword('');
      setConfirmPassword('');
      setAge('');
      setAddress('');
      setRole('');
      setSpecialty('');
      fetchUser();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Phone:</label>
        <input
          type="text"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Address:</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="form-group">
        <label>Patient/Doctor:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select One</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>
      </div>
      { role === 'doctor' &&(
        <div className="form-group">
          <label>Specialty:</label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
          >
            <option value="">Select One</option>
            <option value="Neurology Specialist">Neurology Specialist</option>
            <option value="Eye Specialist">Eye Specialist</option>
            <option value="Heart Specialist">Heart Specialist</option>
            <option value="Osteoporosis Specialist">Osteoporosis Specialist</option>
            <option value="ENT Specialist">ENT Specialist</option>
          </select>
        </div>
      )}
      <button type="submit">Add User</button>
    </form>
  );
};

export default UserRegistration;
