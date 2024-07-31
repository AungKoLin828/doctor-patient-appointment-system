import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageSlider from './components/ImageSlider';

function App() {
  return (
    <div className="App">
       <Header />
       <div className="content">
        <h1 className="welcome-text">Welcome to Our Doctors & Patients Appointments Services</h1>
        <p>Schedule your appointments with ease and convenience</p>
        <button className="header-button">Book Now</button>
        <div style={{paddingRight :100,paddingLeft:500,paddingTop:50}}>
          <ImageSlider/>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
