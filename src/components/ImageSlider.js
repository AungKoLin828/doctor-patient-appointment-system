import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import image1 from '../assets/images/bg-image.jpg'; 
// import image2 from '../assets/images/nursing-care4.jpg'; 
// import image3 from '../assets/images/01.jpg'; 
// import image4 from '../assets/images/img02.jpg'; 
import './ImageSlider.css'

const images = [
  require('../assets/images/bg-image.jpg'),
  require('../assets/images/nursing-care4.jpg'),
  require('../assets/images/01.jpg'),
  require('../assets/images/img02.jpg')
];

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: true,
    centerPadding: '0',
  };
  
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Slide ${index + 1}`} className="slider-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
