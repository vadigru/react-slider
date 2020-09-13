import React from "react";
import PropTypes from "prop-types";

const SlideIndicators = (props) => {
  const {isCaption, activeSlide, onIndicatorDotClick, slides, slidesToShow} = props;

  let indicatorsItem = [];
  for (let i = slidesToShow; i <= (slides.length - 1) + slidesToShow; i++) {
    indicatorsItem.push(
        <div
          key={i}
          className={`slide__indicator ${i === activeSlide ? `slide__indicator--active` : ``}`}
        >
          <div
            className={`slide__indicator-inner ${i === activeSlide ? `slide__indicator-inner--active` : ``}`}
            id={i}
            onClick={onIndicatorDotClick}
          >
          </div>
        </div>);
  }
  return (
    <div className={`slider__indicators ${isCaption ? `slider__indicators--with-caption` : ``}`}>
      {indicatorsItem}
    </div>
  );
};

SlideIndicators.propTypes = {
  isCaption: PropTypes.bool.isRequired,
  activeSlide: PropTypes.number.isRequired,
  onIndicatorDotClick: PropTypes.func.isRequired,
  slides: PropTypes.arrayOf(PropTypes.node).isRequired,
  slidesToShow: PropTypes.number.isRequired
};

export default SlideIndicators;
