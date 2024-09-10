import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import profileImg from '../../assets/images/download.jpg';
import '../Common.css'; 
import { useAuth } from '../AuthContext';

const PatientProfile = () => {
  const { id } = useParams();
  const { isAuthenticated ,userRole} = useAuth();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/patient/${id}`);
        setPatient(response.data);
        // Only set loginUserName if the patient data exists
        if (response.data && response.data.name) {
          localStorage.setItem('loginUserName', response.data.name);
        }
      } catch (error) {
        setError('Error fetching patient profile');
      }
    };

    fetchPatientProfile();
  }, [id]);

  
  if (error) return <div className="error">{error}</div>;
  if (!patient) return <div>Loading...</div>;

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page in the history stack
  };

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
          {isAuthenticated && userRole === 'patient' && (
            <>
              <button>Edit Profile</button>
              <button>View Appointments</button>
            </>
          )} 
          {isAuthenticated && userRole === 'admin' && (
            <>
              <button className='add-btn' onClick={handleBack}>Back</button>
            </>
          )}             
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
