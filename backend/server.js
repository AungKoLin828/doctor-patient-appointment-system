const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
//const port = 5000;
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, './data.json');

const http = require('http');
const WebSocket = require('ws');

// Create HTTP server
const server = http.createServer(app);

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

// Import data
// Load data from the JSON file
let { users, doctors, patients, admin, appointments } = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
// Middleware to handle CORS
app.use(cors());
app.use(bodyParser.json());

// Function to read doctors from the JSON file
const readDoctorsFromFile = () => {
  try {
    // Read the file synchronously
    const data = fs.readFileSync(dataPath, 'utf-8');

    // Parse the JSON string into an array of doctors
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading the doctors file:', error);
    return []; // Return an empty array if there's an error
  }
};

// Registration route
app.post('/api/register', (req, res) => {
  const { username, password, role, id, name, phone, specialty, license, hospital, educationList, age, address } = req.body;

  // Check if username or ID already exists
  const existingUser = users.find(user => user.phone === phone || user.id === id);
  if (existingUser) {
    return res.status(400).json({ message: 'Username or ID already exists' });
  }

  // Add new user to the users array
  //users.push({ username, password, role, id });
  users.push({ phone, password, role, id });

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

  res.status(201).json({ message: 'Registration successful', user: { phone, role, id } });
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.phone === username && user.password === password);

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

app.put('/api/user/update/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    // Update user data in the database
    await users.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Delete a doctor by ID
app.delete('/api/doctors/:id', (req, res) => {
  const doctorId = req.params.id;

  let doctors = readDoctorsFromFile();
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
  writeDoctorsToFile(doctors); 
  writeDoctorsToFile(users); 
  res.status(200).json({ message: 'Doctor deleted successfully' });
});

// Delete a patient by ID
app.delete('/api/patients/:id', (req, res) => {
  const patientId = req.params.id;

  // Find the index of the patient with the given ID
  const patientsIndex = patients.findIndex(patient => patient.id === patientId);
  if (patientsIndex === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  // Find the index of the patient with the given ID
  const userIndex = users.findIndex(user => user.id === patientId);
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

// WebSocket server logic
const clients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      const { type, sender, recipient, content } = parsedMessage;

      if (type === 'register') {
        // Register the user with their WebSocket connection
        clients.set(sender, ws);
      } else if (type === 'private_message') {
        // Send private message to the recipient
        const recipientSocket = clients.get(recipient);

        if (recipientSocket) {
          // Send the message
          recipientSocket.send(JSON.stringify({ sender, content }));
          console.log(`Message Work Normally ${sender} + ${recipient} + ${content}`);
          // Send a notification to the sender that the message was delivered
          ws.send(JSON.stringify({ notification: `Message sent to ${recipient}` }));
        } else {
          // Notify the sender that the recipient is not online
          ws.send(JSON.stringify({ notification: 'Recipient is not online' }));
        }
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    // Remove disconnected clients
    for (const [user, socket] of clients.entries()) {
      if (socket === ws) {
        clients.delete(user);
        break;
      }
    }
  });
});

// Start both HTTP and WebSocket servers
const port = 5000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`WebSocket server running at ws://localhost:${port}`);
});
