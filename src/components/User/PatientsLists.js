import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Common.css';
import { useAuth } from '../AuthContext'; // Ensure useAuth is correctly set up
import CustomModal from '../CustomModal'; // Import Custom Modal

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const { isAuthenticated, userRole } = useAuth(); // Ensure this hook works properly
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(6); // Number of patients per page
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetailsModalIsOpen, setPatientDetailsModalIsOpen] = useState(false);

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

  // Open Patient Details in Modal
  const handleOpenPatientDetails = async (patientId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/patient/${patientId}`);
      setSelectedPatient(response.data);
      setPatientDetailsModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  // Delete Patient
  const deletePatient = async (patientId) => {
    try {
      await axios.delete(`http://localhost:5000/api/patients/${patientId}`);
      
      // Update both patients and filteredPatients states
      setPatients((prevPatients) => {
        const updatedPatients = prevPatients.filter((patient) => patient.id !== patientId);
        console.log('Updated patients:', updatedPatients);
        return updatedPatients;
      });
      setFilteredPatients((prevFiltered) => {
        const updatedFiltered = prevFiltered.filter((patient) => patient.id !== patientId);
        console.log('Updated filtered patients:', updatedFiltered);
        return updatedFiltered;
      });
    } catch (error) {
      setError('Error deleting patient.');
    }
  };

  return (
    <div className="doctor-patient-list-container">
      <h1 className="doctor-patient-list-title">Patients List</h1>
      
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
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.length > 0 ? (
            currentPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.phone}</td>
                <td>
                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => handleOpenPatientDetails(patient.id)}
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

      {/* Patient Details Modal */}
      <CustomModal isOpen={patientDetailsModalIsOpen} onClose={() => setPatientDetailsModalIsOpen(false)}>
        <div className="modal-container">
          {selectedPatient && (
            <div className="appointment-details-card">
              <h2 className="modal-title">Patient Information</h2>
              <p><strong>ID:</strong> {selectedPatient.id}</p>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Phone:</strong> {selectedPatient.phone}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
            </div>
          )}
        </div>
      </CustomModal>

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