import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import profileImg from '../../assets/images/download.jpg';
import '../Common.css'; 

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/patient/${id}`);
        setPatient(response.data);
      } catch (error) {
        setError('Error fetching patient profile');
      }
    };

    fetchPatientProfile();
  }, [id]);

  
  if (error) return <div className="error">{error}</div>;
  if (!patient) return <div>Loading...</div>;

  return (
    <div className="doctor-profile">
      <h1>Patient Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <img src={profileImg} alt="Doctor Profile" className="profile-img" />
          <h2>{patient.name}</h2>
        </div>
        <div className="profile-body">
          <div className="profile-info">
            <h3>Information</h3>
            <p><strong>ID:</strong> {patient.id}</p>
            <p><strong>Phone:</strong> {patient.phone}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Address:</strong> {patient.address}</p>
          </div>
          <div className="profile-actions">
            <button>Edit Profile</button>
            <button>View Appointments</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
