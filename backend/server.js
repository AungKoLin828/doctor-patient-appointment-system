const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
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

//Update Patient
app.put('/api/update/patient/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Find patient index
  const patientIndex = patients.findIndex(patient => patient.id === id);
  if (patientIndex === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  // Find corresponding user index
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update patient details
  patients[patientIndex] = { ...patients[patientIndex], ...updatedData };

  // Update user details (especially phone)
  users[userIndex].phone = updatedData.phone;

  // Write updated data back to the JSON file
  fs.writeFileSync(dataPath, JSON.stringify({ users, doctors, patients, admin, appointments }, null, 2), 'utf-8');

  res.status(200).json({ message: 'Patient updated successfully', patient: patients[patientIndex] });
});

//Update doctor
app.put("/api/update/doctor/:id", (req, res) => {
  try {
    // Read existing data from the JSON file
    let rawData = fs.readFileSync(dataPath, "utf-8");
    let data = JSON.parse(rawData);

    const { id } = req.params;
    const updatedData = req.body;

    console.log("Received Data:", updatedData); // Debugging

    // Find user associated with the doctor
    const userIndex = data.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find doctor in the doctors list
    const doctorIndex = data.doctors.findIndex((doctor) => doctor.id === id);
    if (doctorIndex === -1) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Update user details (especially phone)
    data.users[userIndex].phone = updatedData.phone || data.users[userIndex].phone;

    // Update doctor details
    data.doctors[doctorIndex] = {
      ...data.doctors[doctorIndex], // Preserve existing details
      ...updatedData, // Apply new updates
    };

    // Update doctor name & phone in all associated appointments
    data.appointments = data.appointments.map((appt) =>
      appt.doctorId === id
        ? { 
            ...appt, 
            doctorName: updatedData.name || appt.doctorName, 
            doctorPhone: updatedData.phone || appt.doctorPhone 
          }
        : appt
    );

    // Save updated data back to the JSON file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");

    res.status(200).json({ message: "Doctor updated successfully", doctor: data.doctors[doctorIndex] });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Error updating doctor" });
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


// Function to generate a unique appointment ID
function generateAppointmentId() {
  return "APT-" + Math.random().toString().slice(2, 6).toUpperCase();
}

// Make Appointment 
app.post("/api/appointments", (req, res) => {
  try {
    // Read existing data
    let rawData = fs.readFileSync(dataPath);
    let data = JSON.parse(rawData);

    // Generate a new unique appointment ID
    const appointmentId = generateAppointmentId();

    // Extract appointment details from request body
    const { doctorId, doctorName, patientId, patientName, patientPhone,doctorPhone, date, time, reason } = req.body;

    // Create new appointment object
    const newAppointment = {
      id: appointmentId,
      doctorId,
      doctorName,
      patientId,
      patientName,
      patientPhone,
      doctorPhone,
      date,
      time,
      reason,
      status: "Pending", // Default status
    };

    console.log('Appointment Data:', newAppointment); // Debugging
    // Add the new appointment to the appointments array
    data.appointments.push(newAppointment);

    // Save updated data back to the JSON file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    // Send response
    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Error booking appointment" });
  }
});

// View Appointment lists
app.get('/api/view-appointments', (req, res) => {
  const { doctorId } = req.query;
  console.log('Doctor ID is :', doctorId); // Debugging
  if (!doctorId) return res.status(400).json({ message: "Doctor ID required" });

  try {
    const rawData = fs.readFileSync(dataPath);
    const data = JSON.parse(rawData);
    
    const doctorAppointments = data.appointments.filter(app => app.doctorId === doctorId);
    console.log('Appointment List:', doctorAppointments); // Debugging
    res.status(200).json(doctorAppointments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving appointments" });
  }
});

// View Appointment lists
app.get('/api/view-patient-appointments', (req, res) => {
  const { patientId } = req.query;
  console.log('Patient ID is :', patientId); // Debugging
  if (!patientId) return res.status(400).json({ message: "patient ID required" });

  try {
    const rawData = fs.readFileSync(dataPath);
    const data = JSON.parse(rawData);
    
    const doctorAppointments = data.appointments.filter(app => app.patientId === patientId);
    console.log('Appointment List:', doctorAppointments); // Debugging
    res.status(200).json(doctorAppointments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving appointments" });
  }
});

// For Admin Site
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
