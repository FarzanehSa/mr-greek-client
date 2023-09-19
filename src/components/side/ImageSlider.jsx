import React, { useState, useEffect } from "react";

import "./ImageSlider.scss";

function ImageSlider({imageSlides}) {

  const [slide, setSlide] = useState(0);

  console.log(slide);
  useEffect(() => {
    const rotatePhoto = setTimeout(() => {
      const num = imageSlides.length - 1;
      slide === num ? setSlide(0) : setSlide(x => x + 1);
    },5000);
    
    return (() => clearTimeout(rotatePhoto))
  },[imageSlides, slide])

  const imgs = imageSlides.map((img, index) => {
    return (
      <img src={img.src} alt={img.alt} key={index} className={slide === index ? "slide" : "slide slide-hidden"}/>
    )
  });

  const indicators = imageSlides.map((_, index) => {
    return (
      <button onClick={() => setSlide(index)} key={index} className={index === slide ? "indicator" : "indicator indicator-inactive"}></button>
    )
  });

  return (
    <div className="imageSlider-main">
      {imgs}
      <span className="indicators">
        {indicators}
      </span>
    </div>
  );
}

export default ImageSlider;
