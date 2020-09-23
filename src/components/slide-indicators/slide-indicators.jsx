import React from "react";
import PropTypes from "prop-types";

const SlideIndicators = (props) => {
  const {
    activeSlide,
    isInfinite,
    isCaption,
    slides,
    slidesToShow,
    onIndicatorDotClick,
  } = props;

  let slidesLengthCorrection = 0;

  if (!isInfinite && slidesToShow > 1) {
    slidesLengthCorrection = slidesToShow - 1;
  }

  let indicatorsItem = [];
  for (let i = slidesToShow; i <= (slides.length - 1 - slidesLengthCorrection) + slidesToShow; i++) {
    indicatorsItem.push(
        <div
          key={i}
          className={`indicators__item ${i === activeSlide ? `indicators__item--active` : ``}`}
          id={i}
          onClick={onIndicatorDotClick}
        >
          <div
            className={`indicators__item-inner ${i === activeSlide ? `indicators__item-inner--active` : ``}`}
            id={i}
            onClick={onIndicatorDotClick}
          >
          </div>
        </div>);
  }
  return (
    <div className={`slider__indicators  indicators ${isCaption ? `` : `indicators--without-caption`}`}>
      {indicatorsItem}
    </div>
  );
};

SlideIndicators.propTypes = {
  activeSlide: PropTypes.number.isRequired,
  isInfinite: PropTypes.bool.isRequired,
  isCaption: PropTypes.bool.isRequired,
  slides: PropTypes.arrayOf(PropTypes.node).isRequired,
  slidesToShow: PropTypes.number.isRequired,
  onIndicatorDotClick: PropTypes.func.isRequired,
};

export default SlideIndicators;
