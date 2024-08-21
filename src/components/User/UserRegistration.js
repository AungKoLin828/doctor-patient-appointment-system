import React, { useState } from 'react';
import axios from 'axios';
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
  const [license, setLicense] = useState('');
  const [educationList, setEducationList] = useState([{ degree: '', institution: '', year: '' }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/user', {
        name,
        phoneNo,
        password,
        age,
        address,
        role,
        specialty,
        license,
        educationList, // Send education list
      });
      // Reset form fields
      setName('');
      setPhoneNo('');
      setPassword('');
      setConfirmPassword('');
      setAge('');
      setAddress('');
      setRole('');
      setSpecialty('');
      setLicense('');
      setEducationList([{ degree: '', institution: '', year: '' }]);
      fetchUser();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Regex to check for URLs
  const urlPattern = /https?:\/\/[^\s]+/;

  const validateInput = (value) => {
    if (urlPattern.test(value)) {
      alert('URL input is not allowed.');
      return false;
    }
    return true;
  };

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setter(value);
    }
  };

  // Handle education input changes
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const newEducationList = [...educationList];
    newEducationList[index][name] = value;
    setEducationList(newEducationList);
  };

  // Add new education field
  const addEducationField = () => {
    setEducationList([...educationList, { degree: '', institution: '', year: '' }]);
  };

  // Remove education field
  const removeEducationField = (index) => {
    const newEducationList = educationList.filter((_, idx) => idx !== index);
    setEducationList(newEducationList);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={handleInputChange(setName)}
          required
        />
      </div>
      <div className="form-group">
        <label>Phone:</label>
        <input
          type="text"
          value={phoneNo}
          onChange={handleInputChange(setPhoneNo)}
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
          onChange={handleInputChange(setAddress)}
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

      {role === 'doctor' && (
        <>
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
          <div className="form-group">
            <label>Medical License:</label>
            <input
              type="text"
              value={license}
              onChange={handleInputChange(setLicense)}
              required
            />
          </div>

          <h3>Education Details</h3>
          <button
            type="button"
            className="add-btn"
            onClick={addEducationField}
          >
            + Add Education
          </button>
          {educationList.map((education, index) => (
            <div key={index} className="form-group education-group">
              <label> {index + 1}:</label>
              <input
                type="text"
                name="degree"
                placeholder="Degree"
                value={education.degree}
                onChange={(e) => handleEducationChange(index, e)}
                required
              />
              <input
                type="text"
                name="institution"
                placeholder="Institution"
                value={education.institution}
                onChange={(e) => handleEducationChange(index, e)}
                required
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={education.year}
                onChange={(e) => handleEducationChange(index, e)}
                required
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeEducationField(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </>
      )}

      <button type="submit">Add User</button>
    </form>
  );
};

export default UserRegistration;
