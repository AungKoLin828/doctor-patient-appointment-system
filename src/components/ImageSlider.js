import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import image1 from '../assets/images/bg-image.jpg'; 
import image2 from '../assets/images/nursing-care4.jpg'; 
import image3 from '../assets/images/01.jpg'; 

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    centerMode: true,
  };
  
  return (
    <div style={{maxWidth: '95%',alignItems:'center'}}>
    <Slider {...settings}>
      <div>
        <img src={image1} alt="Slide 1" style={{ width: '50%', height: '40%'}} />
      </div>
      <div>
        <img src={image2} alt="Slide 2" style={{ width: '50%', height: '60%'}} />
      </div>
      <div>
        <img src={image3} alt="Slide 2" style={{ width: '50%', height: '40%'}} />
      </div>
    </Slider>
    </div>
  );
};

export default ImageSlider;
