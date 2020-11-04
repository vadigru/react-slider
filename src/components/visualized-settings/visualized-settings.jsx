import React from "react";
import PropTypes from "prop-types";

const VisualizedSetting = (props) => {
  const {
    setWidth,
    setHeight,
    toggleInfinite,
    toggleAutoplay,
    changeAutoplayDelay,
    toggleIndicators,
    toggleArrows,
    toggleAdaptive,
    toggleAnimatedSwipe,
    toggleCaption,
    changeSlidesCount,
    changeAnimationTime,
    animationTime,
    autoplayDelay,
    initSlides,
    isInfinite,
    isAutoplay,
    isIndicators,
    isArrows,
    isAdaptive,
    isAnimatedSwipe,
    isCaption,
    slidesToShow,
    sliderWidth,
    sliderHeight,
  } = props;

  return (
    <section className="slider-settings">
      <div>
        <label htmlFor="wrange">
          <span className="label-text">Width</span>
          <input
            id="wrange"
            type="range"
            min="320"
            max="1920"
            name="wrange"
            value={sliderWidth}
            onChange={(evt) => {
              setWidth(Math.ceil(parseInt(evt.target.value, 10)));
            }}
          />
          <span className="label-text-output">{(sliderWidth).toFixed(0)}</span>
        </label>
      </div>

      <div>
        <label htmlFor="hrange">
          <span className="label-text">Height</span>
          <input
            id="hrange"
            type="range"
            min="320"
            max="1080"
            name="hrange"
            value={sliderHeight}
            onChange={(evt) => {
              setHeight(Math.ceil(parseInt(evt.target.value, 10)));
            }}
          />
          <span className="label-text-output">{(sliderHeight).toFixed(0)}</span>
        </label>
      </div>

      <div>
        <label htmlFor="animation-time">
          <span className="label-text">Animation/Speed</span>
          <input
            id="animation-time"
            type="range"
            min="100"
            max="3000"
            name="animation-time"
            value={animationTime}
            onChange={(evt) => {
              changeAnimationTime(parseInt(evt.target.value, 10));
            }}
          />
          <span className="label-text-output">{animationTime}</span>
        </label>
      </div>

      <div>
        <input
          id="autoplay"
          className="visually-hidden"
          type="checkbox"
          name="autoplay"
          onChange={toggleAutoplay}
          defaultChecked={isAutoplay ? `checked` : false}
        />
        <label
          htmlFor="autoplay"
          className="label-autoplay"
        >
          <span className="label-text">Autoplay/Interval</span>
          <input
            id="autoplay-delay"
            type="range"
            min="1000"
            max="10000"
            name="autoplay-delay"
            value={autoplayDelay}
            disabled={isAutoplay ? false : true}
            onChange={(evt) => {
              changeAutoplayDelay(parseInt(evt.target.value, 10));
            }}
          />
          <span className="label-text-output">{autoplayDelay}</span>
        </label>
      </div>

      <div>
        <input
          id="adaptive"
          className="visually-hidden"
          type="checkbox"
          name="adaptive"
          onChange={toggleAdaptive}
          defaultChecked={isAdaptive ? `checked` : false}
        />
        <label
          htmlFor="adaptive"
          className="label-adaptive"
        >
          <span className="label-text">Adaptive/Slides</span>
          <input
            id="slides-count"
            type="range"
            min="1"
            max={initSlides.length > 3 ? 3 : initSlides.length}
            name="slides-count"
            value={slidesToShow}
            disabled={isAdaptive ? false : true}
            onChange={(evt) => {
              changeSlidesCount(parseInt(evt.target.value, 10));
            }}
          />
          <span className="label-text-output">{slidesToShow}</span>
        </label>
      </div>

      <div>
        <input
          id="infinite"
          className="visually-hidden"
          type="checkbox"
          name="infinite"
          onChange={toggleInfinite}
          defaultChecked={isInfinite ? `checked` : false}
        />
        <label htmlFor="infinite">
          <span className="label-text">Infinte</span>
        </label>
      </div>

      <div>
        <input
          id="animated-swipe"
          className="visually-hidden"
          type="checkbox"
          name="animated-swipe"
          onChange={toggleAnimatedSwipe}
          defaultChecked={isAnimatedSwipe ? `checked` : false}
        />
        <label htmlFor="animated-swipe">
          <span className="label-text">Animated swipe</span>
        </label>
      </div>

      <div>
        <input
          id="indicators"
          className="visually-hidden"
          type="checkbox"
          name="indicators"
          onChange={toggleIndicators}
          defaultChecked={isIndicators ? `checked` : false}
        />
        <label htmlFor="indicators">
          <span className="label-text">Indicators</span>
        </label>
      </div>

      <div>
        <input
          id="arrows"
          className="visually-hidden"
          type="checkbox"
          name="arrows"
          onChange={toggleArrows}
          defaultChecked={isArrows ? `checked` : false}
        />
        <label htmlFor="arrows">
          <span className="label-text">Arrows</span>
        </label>
      </div>

      <div>
        <input
          id="caption"
          className="visually-hidden"
          type="checkbox"
          name="caption"
          onChange={toggleCaption}
          defaultChecked={isCaption ? `checked` : false}
        />
        <label htmlFor="caption">
          <span className="label-text">Caption</span>
        </label>
      </div>

    </section>
  );
};

VisualizedSetting.propTypes = {
  setWidth: PropTypes.func.isRequired,
  setHeight: PropTypes.func.isRequired,
  toggleInfinite: PropTypes.func.isRequired,
  toggleAutoplay: PropTypes.func.isRequired,
  changeAutoplayDelay: PropTypes.func.isRequired,
  toggleIndicators: PropTypes.func.isRequired,
  toggleArrows: PropTypes.func.isRequired,
  toggleAdaptive: PropTypes.func.isRequired,
  toggleAnimatedSwipe: PropTypes.func.isRequired,
  toggleCaption: PropTypes.func.isRequired,
  changeSlidesCount: PropTypes.func.isRequired,
  changeAnimationTime: PropTypes.func.isRequired,
  animationTime: PropTypes.number.isRequired,
  autoplayDelay: PropTypes.number.isRequired,
  initSlides: PropTypes.arrayOf(PropTypes.object).isRequired,
  isIndicators: PropTypes.bool.isRequired,
  isArrows: PropTypes.bool.isRequired,
  isAdaptive: PropTypes.bool.isRequired,
  isAnimatedSwipe: PropTypes.bool.isRequired,
  isAutoplay: PropTypes.bool.isRequired,
  isCaption: PropTypes.bool.isRequired,
  isInfinite: PropTypes.bool.isRequired,
  slidesToShow: PropTypes.number.isRequired,
  sliderWidth: PropTypes.number,
  sliderHeight: PropTypes.number,
};

export default VisualizedSetting;
