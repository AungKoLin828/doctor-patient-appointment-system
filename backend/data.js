// Dummy user data with roles and IDs
const users = [
    { username: 'doctor1', password: 'password1', role: 'doctor', id: 'D0001' },
    { username: 'doctor2', password: 'password2', role: 'doctor', id: 'D0002' },
    { username: 'patient1', password: 'password1', role: 'patient', id: 'P0001' },
    { username: 'patient2', password: 'password2', role: 'patient', id: 'P0002' },
    { username: 'admin', password: 'admin123', role: 'admin', id: 'A0001' }
  ];
  
  const doctors = [
    { id: 'D0001', name: 'Dr. John Doe', phone: '09450821620', education: 'M.B.B.S(YGN)', specialty: 'Cardiology', address: 'Insein', hospital: 'Yangon' },
    { id: 'D0002', name: 'Dr. Jane Smith', phone: '09450821620', education: 'M.B.B.S(YGN)', specialty: 'Neurology', address: 'Insein', hospital: 'Yangon' },
    { id: 'D0003', name: 'Dr. Jane Smith', phone: '09450821620', education:'M.B.B.S(YGN)', specialty: 'Neurology',address:'Insein',hospital:'Yangon' },
    { id: 'D0004', name: 'Dr. Jane Smith', phone: '09450821620', education:'M.B.B.S(YGN)', specialty: 'Neurology',address:'Insein',hospital:'Yangon' },
    { id: 'D0005', name: 'Dr. Jane Smith', phone: '09450821620', education:'M.B.B.S(YGN)', specialty: 'Neurology',address:'Insein',hospital:'Yangon' },
    { id: 'D0006', name: 'Dr. Jane Smith', phone: '09450821620', education:'M.B.B.S(YGN)', specialty: 'Neurology',address:'Insein',hospital:'Yangon' },
    { id: 'D0007', name: 'Dr. Jane Smith', phone: '09450821620', education:'M.B.B.S(YGN)', specialty: 'Neurology',address:'Insein',hospital:'Yangon' },
    { id: 'D0008', name: 'Dr. Jane Smith', phone: '09450821620', education:'M.B.B.S(YGN)', specialty: 'Neurology',address:'Insein',hospital:'Yangon' },
    { id: 'D0009', name: 'Dr. Jane Smith', phone: '09450821620', education:'M.B.B.S(YGN)', specialty: 'Neurology',address:'Insein',hospital:'Yangon' },
    { id: 'D0010', name: 'Dr. Jane Smith', phone: '09450821620', education:'M.B.B.S(YGN)', specialty: 'Neurology',address:'Insein',hospital:'Yangon' },
    { id: 'D0011', name: 'Dr. Aung Ko Smith', phone:'09450821620', education:'M.B.B.S(YGN)', specialty: 'Neurology',address:'Insein',hospital:'Yangon' },
  ];
  
  const patients = [
    { id: 'P0001', name: 'Patient A', phone: '09450821620', age: 30, gender: 'Male', address: 'Insein' },
    { id: 'P0002', name: 'Patient B', phone: '09450821620', age: 25, gender: 'Male', address: 'Thaketa' },
    { id: 'P0003', name: 'Patient C', phone:'09450821620', age: 25 ,gender: 'Female', address:'Thaketa'},
    { id: 'P0004', name: 'Patient D', phone:'09450821620', age: 25 , gender: 'Female', address:'Thaketa'},
    { id: 'P0005', name: 'Patient E', phone:'09450821620', age: 25 , gender: 'Female', address:'Thaketa'},
    { id: 'P0006', name: 'Patient F', phone:'09450821620', age: 25 , gender: 'Female', address:'Thaketa'},
    { id: 'P0007', name: 'Patient G', phone:'09450821620', age: 25 , gender: 'Female', address:'Thaketa'},
    { id: 'P0008', name: 'Patient H', phone:'09450821620', age: 25 , gender: 'Female', address:'Thaketa'},
    { id: 'P0009', name: 'Patient I', phone:'09450821620', age: 25 , gender: 'Male', address:'Thaketa'},
    { id: 'P0010', name: 'Patient J', phone:'09450821620', age: 25 , gender: 'Female', address:'Thaketa'},
  ];
  
  const admin = [
    { id: 'A0001', name: 'Administrator' },
  ];
  
  const appointments = [
    { id: 1, doctorId: 'D0001', patientId: 'P0001', date: '2024-08-01', time: '10:00' },
    { id: 2, doctorId: 'D0002', patientId: 'P0002', date: '2024-08-02', time: '14:00' },
  ];
  
  module.exports = { users, doctors, patients, admin, appointments };
  