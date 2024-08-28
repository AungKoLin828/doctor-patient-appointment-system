const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Import data
const { users, doctors, patients, admin, appointments } = require('./data');
// Middleware to handle CORS
app.use(cors());
app.use(bodyParser.json());

const findUserByUsername = (username) => users.find(user => user.username === username);

// Register new user
app.post('/api/register', (req, res) => {
  const { username, password, role } = req.body;

  if (findUserByUsername(username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Generate a new ID based on the role
  const newId = `${role.charAt(0).toUpperCase()}${Math.floor(Math.random() * 10000)}`;

  const newUser = { username, password, role, id: newId };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully', id: newId });
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

// DELETE route to delete a doctor by ID
app.delete('/doctors/:id', async (req, res) => {
  try {
    const index = doctors.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res.status(404).send('Doctor not found');
    }
    doctors.splice(index, 1);
    res.status(200).send('Doctor deleted successfully');
  } catch (error) {
    res.status(500).send('Server Error');
  }
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
