import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
       <Header />
       <div className="content">
        <h1 className="welcome-text">Welcome to Our Doctor-Patient Appointment System</h1>
      </div>
      <Footer />
    </div>
  );
}

export default App;
