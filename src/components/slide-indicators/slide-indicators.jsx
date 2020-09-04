import React from "react";
import PropTypes from "prop-types";
import slides from "../slides/slides.jsx";

const SlideIndicators = (props) => {
  const {caption, activeSlide, onIndicatorDotClick} = props;
  return (
    <div className={`slider__indicators ${caption ? `slider__indicators--with-caption` : ``}`}>
      {slides.map((item, index) => {
        return (
          <div
            key={index}
            className={`slide__indicator ${index === activeSlide ? `slide__indicator--active` : ``}`}
            id={index}
            onClick={(evt) => onIndicatorDotClick(evt)}
          >
            <div
              className={`slide__indicator-inner ${index === activeSlide ? `slide__indicator-inner--active` : ``}`}
              id={index}
              onClick={(evt) => onIndicatorDotClick(evt)}
            >
              {index + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
};

SlideIndicators.propTypes = {
  caption: PropTypes.bool.isRequired,
  activeSlide: PropTypes.number.isRequired,
  onIndicatorDotClick: PropTypes.func.isRequired
};

export default SlideIndicators;
