import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Common.css';
import profileImg from '../../assets/images/download.jpg';
import { useAuth } from '../AuthContext';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // To avoid accessibility issues

const DoctorProfile = () => {
  const { id } = useParams();
  const { isAuthenticated, userRole } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState('');
  // const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  const [editedDoctor, setEditedDoctor] = useState({
    name: '',
    phone: '',
    hospital: '',
    specialty: '',
    address: ''
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        console.log("ID" + id);
        const response = await axios.get(`http://localhost:5000/api/profile/doctor/${id}`);
        setDoctor(response.data);
        setEditedDoctor(response.data); // Set initial values for editing
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

  const handleEditToggle = () => {
    setModalIsOpen(true); // Open the modal for editing
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDoctor({ ...editedDoctor, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/api/profile/doctor/${id}`, editedDoctor);
      setDoctor(editedDoctor); // Update the local state with the new data
      setModalIsOpen(false); // Close the modal after saving
    } catch (error) {
      setError('Error updating doctor details.');
    }
  };

  return (
    <div className="doctor-profile">
      <h1>Doctor Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <img src={profileImg} alt="Doctor Profile" className="profile-img" />
          <h2>{doctor.name}</h2>
          {doctor.educationList && doctor.educationList.length > 0 ? (
            <p className="specialty">
              {doctor.educationList.map((education, index) => (
                `${education.degree}${index < doctor.educationList.length - 1 ? ', ' : ''}`
              )).join('')}
            </p>
          ) : (
            <p>No education details available.</p>
          )}
        </div>
        <div className="profile-body">
          <div className="profile-info">
            <h3>Information</h3>
            <p><strong>ID:</strong> {doctor.id}</p>
            <p><strong>Phone:</strong> {doctor.phone}</p>
            <p><strong>Hospital:</strong> {doctor.hospital}</p>
            <p><strong>Specialty:</strong> {doctor.specialty}</p>
            <p><strong>Medical License:</strong> {doctor.license}</p>
            <p><strong>Address:</strong> {doctor.address}</p>
          </div>
          <div className="profile-actions">
            {isAuthenticated && userRole === 'doctor' && (
              <>
                <button onClick={handleEditToggle}>Edit Profile</button>
                <button>View Appointments</button>
              </>
            )}
            {isAuthenticated && userRole === 'patient' && (
              <>
                <button onClick={handleBack}>Back</button>
                <button onClick={() => handleMakeAppointment(doctor)}>Make Appointment</button>
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

      {/* Modal for Editing */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Edit Doctor Profile"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Edit Doctor Profile</h2>
        <div className="edit-form">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={editedDoctor.name}
            onChange={handleInputChange}
          />
          
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={editedDoctor.phone}
            onChange={handleInputChange}
          />
          
          <label>Hospital:</label>
          <input
            type="text"
            name="hospital"
            value={editedDoctor.hospital}
            onChange={handleInputChange}
          />
          
          <label>Specialty:</label>
          <select
            name="specialty"
            value={editedDoctor.specialty}
            onChange={handleInputChange}
          >
            <option value="">Select One</option>
            <option value="Neurology Specialist">Neurology Specialist</option>
            <option value="Eye Specialist">Eye Specialist</option>
            <option value="Heart Specialist">Heart Specialist</option>
            <option value="Osteoporosis Specialist">Osteoporosis Specialist</option>
            <option value="ENT Specialist">ENT Specialist</option>
          </select>
          
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={editedDoctor.address}
            onChange={handleInputChange}
          />

          <div className="modal-actions">
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={() => setModalIsOpen(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorProfile;
