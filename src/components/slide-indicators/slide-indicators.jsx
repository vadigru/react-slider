import React from "react";
import PropTypes from "prop-types";
// import slides from "../slides/slides.jsx";

const SlideIndicators = (props) => {
  const {caption, activeSlide, onIndicatorDotClick, slides} = props;
  return (
    <div className={`slider__indicators ${caption ? `slider__indicators--with-caption` : ``}`}>
      {slides.map((item, index) => {
        return (
          <div
            key={item + index}
            className={`slide__indicator ${index === activeSlide ? `slide__indicator--active` : ``}`}
          >
            <div
              className={`slide__indicator-inner ${index === activeSlide ? `slide__indicator-inner--active` : ``}`}
              id={index}
              onClick={onIndicatorDotClick}
            >
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
  onIndicatorDotClick: PropTypes.func.isRequired,
  slides: PropTypes.arrayOf(PropTypes.shape({}))
};

export default SlideIndicators;
