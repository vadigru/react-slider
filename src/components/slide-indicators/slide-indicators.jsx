import React from "react";
import PropTypes from "prop-types";

const SlideIndicators = (props) => {
  const {
    activeSlide,
    slidesToShow,
    indicators,
    onIndicatorDotClick,
  } = props;

  let indicatorsItem = [];
  for (let i = 0; i < indicators.length; i++) {
    indicatorsItem.push(
        <div
          key={i}
          className={
            `indicator
            ${i + slidesToShow === activeSlide ? `indicator--active` : ``}`
          }
          id={i}
          onClick={(evt) => onIndicatorDotClick(evt)}
        >
          <span className="visually-hidden">{i + 1}</span>
        </div>
    );
  }
  return (
    <div className={
      `indicators`
    }
    >
      {indicatorsItem}
    </div>
  );
};

SlideIndicators.propTypes = {
  activeSlide: PropTypes.number.isRequired,
  slidesToShow: PropTypes.number.isRequired,
  indicators: PropTypes.arrayOf(PropTypes.number).isRequired,
  onIndicatorDotClick: PropTypes.func.isRequired,
};

export default SlideIndicators;
