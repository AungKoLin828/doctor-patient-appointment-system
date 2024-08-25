import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Common.css'; 
import profileImg from '../../assets/images/download.jpg';
import { useAuth } from '../AuthContext';

const DoctorProfile = () => {
  const { id } = useParams();
  const { isAuthenticated ,userRole} = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        console.log("ID" + id);
        const response = await axios.get(`http://localhost:5000/api/profile/doctor/${id}`);
        setDoctor(response.data);
      } catch (error) {
        setError('Error fetching doctor details.');
      }
    };

    fetchDoctor();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!doctor) return <div>Loading...</div>;

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page in the history stack
  };

  const handleMakeAppointment = (doctor) => {
    navigate('/appointment', { state: { doctorId: doctor.id, doctorName: doctor.name } });
  };

  return (
    <div className="doctor-profile">
      <h1>Doctor Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <img src={profileImg} alt="Doctor Profile" className="profile-img" />
          <h2>{doctor.name}</h2>
          <p className="specialty">{doctor.education}</p>
        </div>
        <div className="profile-body">
          <div className="profile-info">
            <h3>Information</h3>
            <p><strong>ID:</strong> {doctor.id}</p>
            <p><strong>Phone:</strong> {doctor.phone}</p>
            <p><strong>Hospital:</strong> {doctor.hospital}</p>
            <p><strong>Specialty:</strong> {doctor.specialty}</p>
            <p><strong>Address:</strong> {doctor.address}</p>
          </div>
          <div className="profile-actions">
          {isAuthenticated && userRole === 'doctor' && (
            <>
              <button>Edit Profile</button>
              <button>View Appointments</button>
            </>
          )} 
          {isAuthenticated && userRole === 'patient' && (
            <>
              <button onClick={handleBack}>Back</button>
              <button onClick={() => handleMakeAppointment(doctor)}>Make Appointments</button>
            </>
          )}           
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;