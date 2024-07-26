import React, { useState } from 'react';
import axios from 'axios';

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
    try {
      await axios.post('http://localhost:5000/api/user', {name, phoneNo, password,age, address, role, specialty});
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
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Phone:</label>
        <input
          type="text"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="text"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Address:</label>
        <textarea
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        ></textarea>
      </div>
      <div>
        <label>Role:</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Specialty:</label>
        <select id="specialty" class="form-select" onChange={(e) => setSpecialty(e.target.value)}>
          <option value="">Select One</option>
          <option value="Neurology Specialist">Neurology Specialist</option>
          <option value="Eye Specialist">Eye Specialist</option>
          <option value="Heart Specialist">Heart Specialist</option>
          <option value="Osteoporosis Specialist">Osteoporosis Specialist</option>
          <option value="ENT Specialist">ENT Specialist</option>
        </select>
      </div>
      <button type="submit">Add User</button>
    </form>
  );
};

export default UserRegistration;
