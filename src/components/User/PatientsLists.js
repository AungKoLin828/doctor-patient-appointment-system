import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Common.css';
import { useAuth } from '../AuthContext'; // Ensure useAuth is correctly set up

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const { isAuthenticated, userRole } = useAuth(); // Ensure this hook works properly
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(6); // Number of patients per page

  // Fetch patients data on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patients');
      setPatients(response.data || []); // Ensure patients is always an array
      setFilteredPatients(response.data || []); // Initially show all patients
    } catch (error) {
      setError('Error fetching patients list.');
    }
  };

  // Filter patients based on search query
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query === '') {
      // Show all patients if search query is empty
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter((patient) => {
        const nameMatch = patient.name.toLowerCase().includes(query);
        const conditionMatch = patient.condition?.toLowerCase().includes(query); // Handle potential null/undefined fields
        const phoneMatch = patient.phone.includes(query);
        const ageMatch = patient.age?.toString().includes(query); // Convert age to string
        const addressMatch = patient.address?.toLowerCase().includes(query); // Ensure address is handled

        // Match any of the fields
        return nameMatch || conditionMatch || phoneMatch || ageMatch || addressMatch;
      });
      setFilteredPatients(filtered);
    }
    setCurrentPage(1); // Reset to first page when search query changes
  }, [searchQuery, patients]);

  if (error) return <div className="error">{error}</div>;
  if (!patients.length) return <div>Loading...</div>;

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // View Patient Profile
  const viewProfile = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  // Delete Patient
  const deletePatient = async (patientId) => {
    try {
      await axios.delete(`http://localhost:5000/api/patients/${patientId}`);
      setPatients(patients.filter((patient) => patient.id !== patientId)); // Remove deleted patient from state
      setFilteredPatients(filteredPatients.filter((patient) => patient.id !== patientId)); // Update filtered list as well
      fetchPatients();
    } catch (error) {
      setError('Error deleting patient.');
    }
  };

  return (
    <div className="doctor-patient-list-container">
      <h1 className="doctor-patient-list-title">Patient List</h1>
      
      {/* Search Box */}
      <input
        type="text"
        className="search-box"
        placeholder="Search by name, condition, phone, age, or address..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table className="doctor-patient-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Condition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.length > 0 ? (
            currentPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.address}</td>
                <td>{patient.phone}</td>
                <td>{patient.condition}</td>
                <td>
                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => viewProfile(patient.id)}
                  >
                    Detail
                  </button>
                  {isAuthenticated && userRole === 'admin' && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => deletePatient(patient.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No patients found</td> {/* Updated colspan to match column count */}
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        patientsPerPage={patientsPerPage}
        totalPatients={filteredPatients.length} // Use filteredPatients length
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

// Pagination Component
const Pagination = ({ patientsPerPage, totalPatients, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPatients / patientsPerPage); i++) {
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

export default PatientsList;
