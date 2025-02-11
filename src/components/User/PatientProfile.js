import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import profileImg from '../../assets/images/download.jpg';
import '../Common.css';
import { useAuth } from '../AuthContext';
import CustomModal from '../CustomModal'; // Import Custom Modal

const PatientProfile = () => {
  const { id } = useParams();
  const { isAuthenticated, userRole } = useAuth();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [editedPatient, setEditedPatient] = useState({
    name: '',
    phone: '',
    age: '',
    address: ''
  });

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/patient/${id}`);
        setPatient(response.data);
        setEditedPatient(response.data);
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
    navigate(-1);
  };

  const handleEditToggle = () => {
    setModalIsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient({ ...editedPatient, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/api/update/patient/${id}`, editedPatient);
      setPatient(editedPatient);
      setModalIsOpen(false);
    } catch (error) {
      setError('Error updating patient details.');
    }
  };

  return (
    <div className="doctor-profile">
      <h1>Patient Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <img src={profileImg} alt="Patient Profile" className="profile-img" />
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
                <button onClick={handleEditToggle}>Edit Profile</button>
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

      {/* Custom Modal for Editing */}
      <CustomModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <h2>Edit Patient Profile</h2>
        <div className="edit-form">
          <label>Name:</label>
          <input type="text" name="name" value={editedPatient.name} onChange={handleInputChange} disabled/>

          <label>Phone:</label>
          <input type="text" name="phone" value={editedPatient.phone} onChange={handleInputChange} />

          <label>Age:</label>
          <input type="number" name="age" value={editedPatient.age} onChange={handleInputChange} />

          <label>Address:</label>
          <input type="text" name="address" value={editedPatient.address} onChange={handleInputChange} />

          <div className="modal-actions">
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={() => setModalIsOpen(false)}>Cancel</button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default PatientProfile;
