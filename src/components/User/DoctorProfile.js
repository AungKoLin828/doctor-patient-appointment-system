import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Common.css';
import profileImg from '../../assets/images/download.jpg';
import { useAuth } from '../AuthContext';
import CustomModal from '../CustomModal'; // Import Custom Modal

const DoctorProfile = () => {
  const { id } = useParams();
  const { isAuthenticated, userRole } = useAuth(); // Fetch user data from AuthContext
  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [appointmentModalIsOpen, setAppointmentModalIsOpen] = useState(false);
  const [appointmentListModalIsOpen, setAppointmentListModalIsOpen] = useState(false);
  const [appointmentDetailsModalIsOpen, setAppointmentDetailsModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Store selected appointment
  const [appointments, setAppointments] = useState([]); 
  const navigate = useNavigate();
  var loginId = localStorage.getItem('userId')

  const [editedDoctor, setEditedDoctor] = useState({
    name: '',
    phone: '',
    hospital: '',
    specialty: '',
    address: '',
    license: '',
  });

  const [appointment, setAppointment] = useState({
    doctorName: '',
    patientName: '',
    patientPhone: '',
    date: '',
    time: '',
    reason: '',
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/doctor/${id}`);
        setDoctor(response.data);
        setEditedDoctor(response.data);
      } catch (error) {
        setError('Error fetching doctor details.');
      }
    };

    fetchDoctor();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!doctor) return <div>Loading...</div>;

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditToggle = () => {
    setEditModalIsOpen(true);
  };

  const fetchPatientDetails = async () => {
    console.log("Patient ID => " + loginId);
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/patient/${loginId}`);
      setPatient(response.data);
      return response.data;
    } catch (error) {
      setError('Error fetching patient details.');
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/view-appointments?doctorId=${id}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleMakeAppointment = async () => {

    const patientData = await fetchPatientDetails(); // Wait for patient data

    setAppointment({
      doctorName: doctor.name, // Auto-bind doctor name
      patientName: patientData.name || '', // Auto-bind patient name
      patientPhone: patientData.phone || '', // Auto-bind patient phone
      date: '',
      time: '',
      reason: '',
    });
    setAppointmentModalIsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDoctor({ ...editedDoctor, [name]: value });
  };

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointment({ ...appointment, [name]: value });
  };

  const handleViewAppointments = () => {
    fetchAppointments();
    setAppointmentListModalIsOpen(true);
  };

  const handleOpenAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentDetailsModalIsOpen(true);
  };

  const handleSaveChanges = async () => {
    console.log('Updating Doctor:', editedDoctor); // Debugging
  
    try {
      await axios.put(`http://localhost:5000/api/update/doctor/${id}`, editedDoctor);
      setDoctor(editedDoctor);
      setEditModalIsOpen(false);
    } catch (error) {
      console.error('Error updating doctor:', error);
      setError('Error updating doctor details.');
    }
  };

  const handleBookAppointment = async () => {

    try {
      await axios.post(`http://localhost:5000/api/appointments`, {
        doctorId: doctor.id,
        doctorName: doctor.name,
        patientId: patient.id, // Include patient ID
        ...appointment,
      });
      alert('Appointment booked successfully!');
      setAppointmentModalIsOpen(false);
    } catch (error) {
      setError('Error booking appointment.');
    }
  };

  return (
    <div className="doctor-profile">
      <h1>Doctor Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <img src={profileImg} alt="Doctor Profile" className="profile-img" />
          <h2>Dr. {doctor.name}</h2>
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
                <button onClick={handleViewAppointments}>View Appointments</button>
              </>
            )}
            {isAuthenticated && userRole === 'patient' && (
              <>
                <button onClick={handleBack}>Back</button>
                <button onClick={handleMakeAppointment}>Make Appointment</button>
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
      <CustomModal isOpen={editModalIsOpen} onClose={() => setEditModalIsOpen(false)}>
        <h2>Edit Doctor Profile</h2>
        <div className="edit-form">
          <label>Name:</label>
          <input type="text" name="name" value={editedDoctor.name} onChange={handleInputChange} disabled />

          <label>Phone:</label>
          <input type="text" name="phone" value={editedDoctor.phone} onChange={handleInputChange} />

          <label>Hospital:</label>
          <input type="text" name="hospital" value={editedDoctor.hospital} onChange={handleInputChange} />

          <label>Specialty:</label>
          <select name="specialty" value={editedDoctor.specialty} onChange={handleInputChange} className="select-custom">
            <option value="">Select One</option>
            <option value="Neurology Specialist">Neurology Specialist</option>
            <option value="Eye Specialist">Eye Specialist</option>
            <option value="Heart Specialist">Heart Specialist</option>
            <option value="Osteoporosis Specialist">Osteoporosis Specialist</option>
            <option value="ENT Specialist">ENT Specialist</option>
         </select>

          <label>Medical License:</label>
          <input type="text" name="license" value={editedDoctor.license} disabled />

          <label>Address:</label>
          <input type="text" name="address" value={editedDoctor.address} onChange={handleInputChange} />

          <div className="modal-actions">
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={() => setEditModalIsOpen(false)}>Cancel</button>
          </div>
        </div>
      </CustomModal>

      {/* Custom Modal for Appointments */}
      <CustomModal isOpen={appointmentModalIsOpen} onClose={() => setAppointmentModalIsOpen(false)}>
        <h2>Book Appointment</h2>
        <div className="edit-form">
          <label>Doctor Name:</label>
          <input type="text" name="doctorName" value={appointment.doctorName} readOnly />

          <label>Patient Name:</label>
          <input type="text" name="patientName" value={appointment.patientName} readOnly />

          <label>Phone:</label>
          <input type="text" name="patientPhone" value={appointment.patientPhone} readOnly />

          <label>Date:</label>
          <input type="date" name="date" value={appointment.date} onChange={handleAppointmentChange} />

          <label>Time:</label>
          <input type="time" name="time" value={appointment.time} onChange={handleAppointmentChange} />

          <label>Reason:</label>
          <textarea
              name="reason"
              className="textarea-custom"
              value={appointment.reason}
              onChange={handleAppointmentChange}
              placeholder="Enter reason for appointment..."
            />

          <div className="modal-actions">
            <button onClick={handleBookAppointment}>Confirm Appointment</button>
            <button onClick={() => setAppointmentModalIsOpen(false)}>Cancel</button>
          </div>
        </div>
      </CustomModal>

      {/* Modal: View All Appointments */}
      <CustomModal isOpen={appointmentListModalIsOpen} onClose={() => setAppointmentListModalIsOpen(false)}>
        <h2>Appointments for Dr. {doctor.name}</h2>
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
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <button onClick={() => handleOpenAppointmentDetails(appointment)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No appointments found.</p>
        )}
      </CustomModal>

      {/* Modal: Appointment Details */}
      <CustomModal isOpen={appointmentDetailsModalIsOpen} onClose={() => setAppointmentDetailsModalIsOpen(false)}>
        {selectedAppointment && (
          <div>
            <h2>Appointment Details</h2>
            <p><strong>ID:</strong> {selectedAppointment.id}</p>
            <p><strong>Patient Name:</strong> {selectedAppointment.patientName}</p>
            <p><strong>Phone:</strong> {selectedAppointment.patientPhone}</p>
            <p><strong>Date:</strong> {selectedAppointment.date}</p>
            <p><strong>Time:</strong> {selectedAppointment.time}</p>
            <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
          </div>
        )}
      </CustomModal>

    </div>
  );
};

export default DoctorProfile;