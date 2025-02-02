import React, { useState } from 'react';
import '../styles/Carousel.css';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/images/image-carousel1.jpeg',
    '/images/image-carousel2.jpeg',
    '/images/image-carousel3.jpeg'
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel">
      <img src={images[currentIndex]} alt="carousel" />
      <div className="carousel-overlay">
        <div className="carousel-content">
          <h2>Welcome to MyShop!</h2>
          <p>Best deals just for you</p>
        </div>
      </div>
      <button className="carousel-button carousel-button-left" onClick={prevSlide}>
        &#8592;
      </button>
      <button className="carousel-button carousel-button-right" onClick={nextSlide}>
        &#8594;
      </button>
    </div>
  );
};

export default Carousel;
