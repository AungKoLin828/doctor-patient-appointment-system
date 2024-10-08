import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css'; 
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
    autoplaySpeed: 3000,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Slider ${index + 1}`} className="slider-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};


export default ImageSlider;
