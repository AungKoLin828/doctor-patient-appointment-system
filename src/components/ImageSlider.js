import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import image1 from '../assets/images/bg-image.jpg'; 
import image2 from '../assets/images/nursing-care4.jpg'; 
import image3 from '../assets/images/01.jpg'; 
import './ImageSlider.css'

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
    <div style={{maxWidth: '95%',alignItems:'center'}} className='slider-container'>
    <Slider {...settings}>
      <div>
        <img src={image1} alt="Slide 1" style={{ width: '50%', height: '60%'}} />
      </div>
      <div>
        <img src={image2} alt="Slide 2" style={{ width: '50%', height: '60%'}} />
      </div>
      <div>
        <img src={image3} alt="Slide 2" style={{ width: '50%', height: '60%'}} />
      </div>
      <div>
        <img src={image3} alt="Slide 2" style={{ width: '50%', height: '40%'}} />
      </div>
      <div>
        <img src={image3} alt="Slide 2" style={{ width: '50%', height: '40%'}} />
      </div>
    </Slider>
    </div>
  );
};

export default ImageSlider;
