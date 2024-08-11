import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Common.css'; // Import the CSS file

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/doctor/${id}`);
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        setError('Error fetching doctor profile');
      }
    };

    if (id) {
      fetchDoctorProfile();
    } else {
      setError('Invalid doctor ID');
    }
  }, [id]);

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="doctor-profile-container">
      {doctor ? (
        <div className="doctor-profile">
          <h2 className="doctor-name">{doctor.name}</h2>
          <p className="doctor-specialty">Specialty: {doctor.specialty}</p>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
};

export default DoctorProfile;
