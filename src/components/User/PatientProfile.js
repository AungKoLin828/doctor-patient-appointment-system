import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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

  if (error) return <p>{error}</p>;

  return (
    <div>
      {patient ? (
        <div>
          <h2>{patient.name}</h2>
          <p>Age: {patient.age}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PatientProfile;
