import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Common.css';
import { useAuth } from '../AuthContext';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const { isAuthenticated, userRole } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(response.data);
        setFilteredDoctors(response.data); // Initially show all doctors
      } catch (error) {
        setError('Error fetching doctor list.');
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If search query is empty, show all doctors
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
    setCurrentPage(1); // Reset to the first page when search query changes
  }, [searchQuery, doctors]);

  if (error) return <div className="error">{error}</div>;
  if (!doctors.length) return <div>Loading...</div>;

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // View Doctor Profile
  const viewProfile = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  // Delete Doctor
  const deleteDoctor = async (doctorId) => {
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${doctorId}`);
      setDoctors(doctors.filter((doctor) => doctor.id !== doctorId)); // Remove the doctor from the list
    } catch (error) {
      setError('Error deleting doctor.');
    }
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
          {currentDoctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.name}</td>
              <td>{doctor.specialty}</td>
              <td>{doctor.hospital}</td>
              <td>
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => viewProfile(doctor.id)}
                >
                  View Detail
                </button>
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
          ))}
        </tbody>
      </table>
      <Pagination
        doctorsPerPage={doctorsPerPage}
        totalDoctors={filteredDoctors.length} // Use filteredDoctors length here
        paginate={paginate}
        currentPage={currentPage}
      />
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
        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DoctorList;
