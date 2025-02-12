import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import profileImg from '../../assets/images/download.jpg';
import '../Common.css';
import { useAuth } from '../AuthContext';
import CustomModal from '../CustomModal'; // Import Custom Modal
import AppointmentModal from '../AppointmentModal'; // Import Appointment Modal

const PatientProfile = () => {
  const { id } = useParams();
  const { isAuthenticated, userRole } = useAuth();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [appointmentListModalIsOpen, setAppointmentListModalIsOpen] = useState(false);
  const [appointmentDetailsModalIsOpen, setAppointmentDetailsModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Store selected appointment
  const [appointments, setAppointments] = useState([]); 

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

  const fetchAppointments = async () => {
    try {
      console.log("Patient Id " + {id});
      const response = await axios.get(`http://localhost:5000/api/view-patient-appointments?patientId=${id}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleViewAppointments = () => {
    fetchAppointments();
    setAppointmentListModalIsOpen(true);
  };

  const handleOpenAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentDetailsModalIsOpen(true);
  };

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
                <button onClick={handleViewAppointments}>View Appointments</button>
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
      
      {/* Modal: View All Appointments */}
      <AppointmentModal isOpen={appointmentListModalIsOpen} onClose={() => setAppointmentListModalIsOpen(false)}>
        <div className="app-modal-container">
          <h2 className="app-modal-title">Appointments for Patient {patient.name}</h2>
          {appointments.length > 0 ? (
            <table className="appointment-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="appointment-row">
                    <td>{appointment.id}</td>
                    <td>{appointment.doctorName}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <span className={`status ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                    </td>
                    <td>
                      <button className="view-btn" style={{ width: '100%', height: '30px'}} onClick={() => handleOpenAppointmentDetails(appointment)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No appointments found.</p>
          )}
        </div>
      </AppointmentModal>

      {/* Modal: Appointment Details */}
      <CustomModal isOpen={appointmentDetailsModalIsOpen} onClose={() => setAppointmentDetailsModalIsOpen(false)}>
        <div className="modal-container">
          {selectedAppointment && (
            <div className="appointment-details-card">
              <h2 className="modal-title">Appointment Details</h2>
              <p><strong>ID:</strong> {selectedAppointment.id}</p>
              <p><strong>Patient Name:</strong> {selectedAppointment.doctorName}</p>
              <p><strong>Phone:</strong> {selectedAppointment.doctorPhone}</p>
              <p><strong>Date:</strong> {selectedAppointment.date}</p>
              <p><strong>Time:</strong> {selectedAppointment.time}</p>
              <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
              <p><strong>Status:</strong> <span className={`status ${selectedAppointment.status.toLowerCase()}`}>{selectedAppointment.status}</span></p>
            </div>
          )}
        </div>
      </CustomModal>
    </div>
  );
};

export default PatientProfile;
