const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Middleware to handle CORS
app.use(cors());
app.use(bodyParser.json());

// Dummy user data (for demonstration purposes)
const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' }
];

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Dummy data
const doctors = [
  { id: 1, name: 'Dr. John Doe', specialty: 'Cardiology' },
  { id: 2, name: 'Dr. Jane Smith', specialty: 'Neurology' },
];

const patients = [
  { id: 1, name: 'Patient A', age: 30 },
  { id: 2, name: 'Patient B', age: 25 },
];

const appointments = [
  { id: 1, doctorId: 1, patientId: 1, date: '2024-08-01', time: '10:00' },
  { id: 2, doctorId: 2, patientId: 2, date: '2024-08-02', time: '14:00' },
];

// Routes to get data
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
