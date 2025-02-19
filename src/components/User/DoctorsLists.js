import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Common.css';
import { useAuth } from '../AuthContext';
import CustomModal from '../CustomModal';
import AppointmentModalReg from '../AppointmentModalReg'; // Import Appointment Modal


const DoctorList = () => {
  const [doctor, setDoctors] = useState([]);
  const [patient, setPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const { isAuthenticated, userRole } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorDetailsModalIsOpen, setDoctorDetailsModalIsOpen] = useState(false);
  const [appointmentModalIsOpen, setAppointmentModalIsOpen] = useState(false);
  const [appointment, setAppointment] = useState({
    doctorName: '',
    patientName: '',
    patientPhone: '',
    doctorPhone: '',
    date: '',
    time: '',
    reason: '',
  });

  var loginId = localStorage.getItem('userId')

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch doctors from the backend
  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Error fetching doctors');
    }
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

  // Filter doctors based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDoctors(doctor);
    } else {
      const filtered = doctor.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, doctor]);

  if (error) return <div className="error">{error}</div>;

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open Doctor Details in Modal
  const handleOpenDoctorDetails = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/doctor/${doctorId}`);
      setSelectedDoctor(response.data);
      setDoctorDetailsModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  // Delete Doctor
  const deleteDoctor = async (doctorId) => {
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${doctorId}`);
      setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor.id !== doctorId));
      setFilteredDoctors((prevFiltered) => prevFiltered.filter((doctor) => doctor.id !== doctorId));
    } catch (error) {
      setError('Error deleting doctor.');
    }
  };

  // Chat with Doctor
  const chatWithDoctor = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/doctor/${doctorId}`);
      localStorage.setItem('receiverName', response.data.name);
    } catch (error) {
      console.error('Doctor not found', error);
    }
    navigate(`/doctor/chat/${doctorId}`);
  };

  const handleMakeAppointment = async (doctorId) => {
    try {
      // Fetch doctor details
      const doctorResponse = await axios.get(`http://localhost:5000/api/profile/doctor/${doctorId}`);
      const doctorData = doctorResponse.data;
  
      // Fetch patient details
      const patientData = await fetchPatientDetails();
  
      // Ensure doctorData and patientData are loaded before setting appointment
      if (doctorData && patientData) {
        setAppointment({
          doctorId: doctorData.id,
          doctorName: doctorData.name,
          doctorPhone: doctorData.phone,
          patientId: patientData.id,
          patientName: patientData.name,
          patientPhone: patientData.phone || '',
          date: '',
          time: '',
          reason: '',
        });
  
        // Open the appointment modal after setting the correct details
        setAppointmentModalIsOpen(true);
      } else {
        alert('Error: Could not fetch doctor or patient details.');
      }
    } catch (error) {
      console.error('Error fetching doctor or patient details:', error);
      alert('Error fetching details. Please try again.');
    }
  };

  // Handle Appointment Form Change
  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointment({
      ...appointment,
      [name]: value,
    });
  };

  const handleBookAppointment = async () => {

    try {
      await axios.post(`http://localhost:5000/api/appointments`, {
        doctorId: doctor.id,
        doctorName: doctor.name,
        patientId: patient.id, // Include patient ID
        doctorPhone: doctor.phone,
        ...appointment,
      });
      alert('Appointment booked successfully!');
      setAppointmentModalIsOpen(false);
    } catch (error) {
      setError('Error booking appointment.');
    }
  };

  return (
    <div className="doctor-patient-list-container">
      <h1 className="doctor-patient-list-title">Doctors List</h1>
      <input
        type="text"
        className="search-box"
        placeholder="Search by name, specialty, or hospital..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table className="doctor-patient-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>Hospital</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentDoctors.length > 0 ? (
            currentDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialty}</td>
                <td>{doctor.hospital}</td>
                <td>
                  <button
                    type="button"
                    className="add-btn" style={{ width: '30%', height:'55px'}}
                    onClick={() => handleOpenDoctorDetails(doctor.id)}
                  >
                    Detail
                  </button>
                  {isAuthenticated && userRole === 'patient' && (
                    <>
                      <button
                        type="button"
                        className="add-btn" style={{ width: '30%',height:'55px'}}
                        onClick={() => chatWithDoctor(doctor.id)}
                      >
                        Chat
                      </button>
                      <button
                        type="button"
                        className="add-btn" style={{ width: '38%'}}
                        onClick={() => handleMakeAppointment(doctor.id)}
                      >
                        Make Appointment
                      </button>
                    </>
                  )}
                  {isAuthenticated && userRole === 'admin' && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => deleteDoctor(doctor.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No doctors found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        doctorsPerPage={doctorsPerPage}
        totalDoctors={filteredDoctors.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      {/* Doctor Details Modal */}
      <CustomModal isOpen={doctorDetailsModalIsOpen} onClose={() => setDoctorDetailsModalIsOpen(false)}>
        <div className="modal-container">
          {selectedDoctor && (
            <div className="appointment-details-card">
              <h2 className="modal-title">Doctor Information</h2>
              <p><strong>ID:</strong> {selectedDoctor.id}</p>
              <p><strong>Phone:</strong> {selectedDoctor.phone}</p>
              <p><strong>Hospital:</strong> {selectedDoctor.hospital}</p>
              <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
              <p><strong>Medical License:</strong> {selectedDoctor.license}</p>
              <p><strong>Address:</strong> {selectedDoctor.address}</p>
            </div>
          )}
        </div>
      </CustomModal>

      {/* Appointment Booking Modal */}
      <AppointmentModalReg isOpen={appointmentModalIsOpen} onClose={() => setAppointmentModalIsOpen(false)}>
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
      </AppointmentModalReg>
    </div>
  );
};

const Pagination = ({ doctorsPerPage, totalDoctors, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalDoctors / doctorsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-nav">
      <ul className="pagination">
        {pageNumbers.length > 0 ? (
          pageNumbers.map((number) => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))
        ) : (
          <li>No pages available</li>
        )}
      </ul>
    </nav>
  );
};

export default DoctorList;