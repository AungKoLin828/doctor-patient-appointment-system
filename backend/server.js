const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, './data.json');

// Import data
// Load data from the JSON file
let { users, doctors, patients, admin, appointments } = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
// Middleware to handle CORS
app.use(cors());
app.use(bodyParser.json());

// Registration route
app.post('/api/register', (req, res) => {
  const { username, password, role, id, name, phone, specialty, license, hospital, educationList, age, address } = req.body;

  // Check if username or ID already exists
  const existingUser = users.find(user => user.username === username || user.id === id);
  if (existingUser) {
    return res.status(400).json({ message: 'Username or ID already exists' });
  }

  // Add new user to the users array
  users.push({ username, password, role, id });

  // Add new user to the corresponding role-based array
  if (role === 'doctor') {
    // Push doctor-specific details
    doctors.push({ id, name, phone, specialty, license, hospital, educationList, address });
  } else if (role === 'patient') {
    // Push patient-specific details
    patients.push({ id, name, phone, age, address });
  } else {
    return res.status(400).json({ message: 'Invalid role' });
  }

  // Save updated data to the JSON file
  fs.writeFileSync(dataPath, JSON.stringify({ users, doctors, patients, admin, appointments }, null, 2));

  res.status(201).json({ message: 'Registration successful', user: { username, role, id } });
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    res.status(200).json({ message: 'Login successful', role: user.role, id: user.id });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Routes
app.get('/api/profile/patient/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send('Patient not found');
  }
});

app.get('/api/profile/doctor/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === req.params.id);
  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404).send('Doctor not found');
  }
});

app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

app.get('/api/patients', (req, res) => {
  res.json(patients);
});

app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

// Delete a doctor by ID
app.delete('/api/doctors/:id', (req, res) => {
  const doctorId = req.params.id;

  // Find the index of the doctor with the given ID
  const doctorIndex = doctors.findIndex(doctor => doctor.id === doctorId);
  if (doctorIndex === -1) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // Find the index of the doctor with the given ID
  const userIndex = users.findIndex(user => user.id === doctorId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Remove doctor from the list
  doctors.splice(doctorIndex, 1);
  users.splice(userIndex, 1);
  res.status(200).json({ message: 'Doctor deleted successfully' });
});

// Delete a patient by ID
app.delete('/api/patients/:id', (req, res) => {
  const doctorId = req.params.id;

  // Find the index of the patient with the given ID
  const patientsIndex = patients.findIndex(patient => patient.id === doctorId);
  if (patientsIndex === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  // Find the index of the patient with the given ID
  const userIndex = users.findIndex(user => user.id === doctorId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Remove doctor from the list
  patients.splice(patientsIndex, 1);
  users.splice(userIndex, 1);
  res.status(200).json({ message: 'Patient deleted successfully' });
});

app.get('/api/admin/user-usage', (req, res) => {
  const userData = [
    { name: 'User 1', usage: 5 },
    { name: 'User 2', usage: 8 },
    { name: 'User 3', usage: 12 },
  ];
  res.json(userData);
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
