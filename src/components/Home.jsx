import React, { useState, useEffect } from "react";
import "./Home.scss";

import ImageSlider from "./side/ImageSlider";

const Home = ({slides}) => {


  const [imageSlides, setImageSlides] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    setImageSlides(slides.map((row, index) => {
      return ({
        src: row,
        alt: `Slide ${index + 1}`
      });
    }))
  }, [slides]);
  

  return (
    <div className="homepage-layout">
      <div className="imageSlider-container">
        <ImageSlider imageSlides={imageSlides}/>
      </div>

      <div className="text-under-image">
        <p className="star-ad">
          <span>Add some excitement to your mealtime with our tasty donairs</span>
          <span>a mouthwatering treat that's hard to resist!</span>
        </p>
        <div className="delivery">
          <div className="delivery-imgs">
            <img src='../skip-logo.png' alt="skip" className="delivery-img"/>
            <img src='../uber-logo.png' alt="uber" className="delivery-img"/>
            <img src='../doordash-logo.png' alt="doordash" className="delivery-img"/>
          </div>
          <span className="delivery-txt">
            Order Online
          </span>
        </div>
        <p className="bio">
          <span className="bio-title">About US</span>
          <span className="bio-text">
            We opened our doors in 2020 on Commercial Drive in Vancouver. 
          </span>
          <span className="bio-text">
            Our specialty? Mouthwatering donairs that bring a taste of Greece to your plate.
          </span>
          <span className="bio-text">
            Join us for a flavorful experience that's perfect for locals and visitors alike.
          </span>
        </p>
      </div>
    </div>
  );
};

export default Home;