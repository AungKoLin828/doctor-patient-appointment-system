import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Common.css';
import { useAuth } from '../AuthContext';
import CustomModal from '../CustomModal'; // Import Custom Modal

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const { isAuthenticated, userRole } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorDetailsModalIsOpen, setDoctorDetailsModalIsOpen] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Function to fetch doctors from the backend
  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(response.data);
      setFilteredDoctors(response.data); // Initially show all doctors
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Error fetching doctors');
    }
  };

  // Filter doctors based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, doctors]);

  if (error) return <div className="error">{error}</div>;
  if (!doctors.length) return <div>Loading...</div>;

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
      setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
      fetchDoctors();
    } catch (error) {
      setError('Error deleting doctor.');
    }
  };

  const chatWithDoctor = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/doctor/${doctorId}`);
      localStorage.setItem('receiverName', response.data.name);
    } catch (error) {
      console.error('Doctor not found', error);
    }
    navigate(`/doctor/chat/${doctorId}`);
  };

  return (
    <div className="doctor-patient-list-container">
      <h1 className="doctor-patient-list-title">Doctor List</h1>
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
            <th>Profiles</th>
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
                    className="add-btn"
                    onClick={() => handleOpenDoctorDetails(doctor.id)}
                  >
                    Detail
                  </button>
                  {isAuthenticated && userRole === 'patient' && (
                    <button
                      type="button"
                      className="add-btn"
                      onClick={() => chatWithDoctor(doctor.id)}
                    >
                      Chat
                    </button>
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
