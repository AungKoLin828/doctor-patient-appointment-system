const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Middleware to handle CORS
app.use(cors());
app.use(bodyParser.json());

// Dummy user data with roles and IDs
const users = [
  { username: 'doctor1', password: 'password1', role: 'doctor', id: 1 },
  { username: 'doctor2', password: 'password2', role: 'doctor', id: 2 },
  { username: 'patient1', password: 'password1', role: 'patient', id: 1 },
  { username: 'patient2', password: 'password2', role: 'patient', id: 2 }
];

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

// Dummy data for profiles
const doctors = [
  { id: 1, name: 'Dr. John Doe',education:'M.B.B.S(YGN)', specialty: 'Cardiology',address:'Insein',hospital:'Yangon' },
  { id: 2, name: 'Dr. Jane Smith',education:'M.B.B.S(YGN)', specialty: 'Neurology',address:'Insein',hospital:'Yangon' },
];

const patients = [
  { id: 1, name: 'Patient A', age: 30 },
  { id: 2, name: 'Patient B', age: 25 },
];

const appointments = [
  { id: 1, doctorId: 1, patientId: 1, date: '2024-08-01', time: '10:00' },
  { id: 2, doctorId: 2, patientId: 2, date: '2024-08-02', time: '14:00' },
];

// Routes
app.get('/api/profile/patient/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send('Patient not found');
  }
});

app.get('/api/profile/doctor/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
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

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
