import React from "react";
import PropTypes from "prop-types";
import {isMobile} from "../../utils/common.js";

class VisualizedSetting extends React.Component {
  constructor(props) {
    super(props);

    // refs for visualized settings -------------------------------------------
    this.widthRef = React.createRef();
    this.heigthRef = React.createRef();
    this.infiniteRef = React.createRef();
    this.autoplayRef = React.createRef();
    this.autoplayDelayRef = React.createRef();
    this.indicatorsRef = React.createRef();
    this.arrowsRef = React.createRef();
    this.adaptiveRef = React.createRef();
    this.animatedSwipeRef = React.createRef();
    this.animationTimeRef = React.createRef();
    this.captionRef = React.createRef();
    this.slidesCountRef = React.createRef();
  }

  render() {
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
    } = this.props;

    return (
      <section className="slider-settings">
        <label htmlFor="wrange">
          <span className="label-title">Width</span>
          <input
            id="wrange"
            type="range"
            min="320"
            max="1920"
            name="wrange"
            value={sliderWidth}
            ref={this.widthRef}
            onChange={(evt) => {
              setWidth(evt.target.value);
            }}
          />
          <span>{sliderWidth}</span>
        </label>
        <label htmlFor="hrange">
          <span className="label-title">Height</span>
          <input
            id="hrange"
            type="range"
            min="320"
            max="1080"
            name="hrange"
            value={sliderHeight}
            ref={this.heightRef}
            onChange={(evt) => {
              setHeight(evt.target.value);
            }}
          />
          <span>{sliderHeight}</span>
        </label>
        <label htmlFor="animation-time">
          <span className="label-title">Animation in ms</span>
          <input
            id="animation-time"
            type="range"
            min="100"
            max="3000"
            name="animation-time"
            value={animationTime}
            ref={this.animationTimeRef}
            onChange={(evt) => {
              changeAnimationTime(evt.target.value);
            }}
          />
          <span>{animationTime}</span>
        </label>
        <div className="slider-settings-autoplay">
          <label
            htmlFor="autoplay"
            className="label-connected label-autoplay"
          >
            <span className="label-title">Autoplay</span>
            <input
              id="autoplay"
              type="checkbox"
              name="autoplay"
              ref={this.autoplayRef}
              onChange={toggleAutoplay}
              defaultChecked={isAutoplay ? `checked` : false}
            />
          </label>
          <label
            htmlFor="autoplay-delay"
            className="label-connected label-autoplay-delay"
          >
            <span className="label-title">in ms</span>
            <input
              id="autoplay-delay"
              type={isMobile.any() ? `number` : `range`}
              min="1000"
              max="10000"
              name="autoplay-delay"
              value={autoplayDelay}
              disabled={isAutoplay ? false : true}
              style={{backgroundColor: !isAutoplay ? `#ccc` : ``}}
              ref={this.autoplayDelayRef}
              onChange={(evt) => {
                changeAutoplayDelay(evt.target.value);
              }}
            />
            {isMobile.any() ? `` : <span>{autoplayDelay}</span>}
          </label>
        </div>
        <div className="slider-settings-adaptive">
          <label
            htmlFor="adaptive"
            className="label-connected label-adaptive"
          >
            <span className="label-title">Adaptive</span>
            <input
              id="adaptive"
              type="checkbox"
              name="adaptive"
              ref={this.adaptiveRef}
              onChange={toggleAdaptive}
              defaultChecked={isAdaptive ? `checked` : false}
            />
          </label>
          <label
            htmlFor="slides-count"
            className="label-connected label-slides-count"
          >
            <span className="label-title">slides</span>
            <input
              id="slides-count"
              type={isMobile.any() ? `number` : `range`}
              min="1"
              max="3"
              name="slides-count"
              value={slidesToShow}
              disabled={isAdaptive ? false : true}
              style={{backgroundColor: !isAdaptive ? `#ccc` : ``}}
              ref={this.slidesCountRef}
              onChange={(evt) => {
                changeSlidesCount(evt.target.value > 3 ? 3 : evt.target.value);
              }}
            />
            {isMobile.any() ? `` : <span>{slidesToShow}</span>}
          </label>
        </div>
        <label htmlFor="animated-swipe">
          <span className="label-title">Animated swipe</span>
          <input
            id="animated-swipe"
            type="checkbox"
            name="animated-swipe"
            ref={this.animatedSwipeRef}
            onChange={toggleAnimatedSwipe}
            defaultChecked={isAnimatedSwipe ? `checked` : false}
          />
        </label>
        <label htmlFor="indicators">
          <span className="label-title">Indicators</span>
          <input
            id="indicators"
            type="checkbox"
            name="indicators"
            ref={this.indicatorsRef}
            onChange={toggleIndicators}
            defaultChecked={isIndicators ? `checked` : false}
          />
        </label>
        <label htmlFor="arrows">
          <span className="label-title">Arrows</span>
          <input
            id="arrows"
            type="checkbox"
            name="arrows"
            ref={this.arrowsRef}
            onChange={toggleArrows}
            defaultChecked={isArrows ? `checked` : false}
          />
        </label>
        <label htmlFor="caption">
          <span className="label-title">Caption</span>
          <input
            id="caption"
            type="checkbox"
            name="caption"
            ref={this.captionRef}
            onChange={toggleCaption}
            defaultChecked={isCaption ? `checked` : false}
          />
        </label>
        <label htmlFor="infinite">
          <span className="label-title">Infinte</span>
          <input
            id="infinite"
            type="checkbox"
            name="infinite"
            ref={this.infiniteRef}
            onChange={toggleInfinite}
            defaultChecked={isInfinite ? `checked` : false}
          />
        </label>
      </section>
    );
  }
}

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
  isInfinite: PropTypes.bool.isRequired,
  isAutoplay: PropTypes.bool.isRequired,
  isIndicators: PropTypes.bool.isRequired,
  isArrows: PropTypes.bool.isRequired,
  isAdaptive: PropTypes.bool.isRequired,
  isAnimatedSwipe: PropTypes.bool.isRequired,
  isCaption: PropTypes.bool.isRequired,
  slidesToShow: PropTypes.number.isRequired,
  sliderWidth: PropTypes.number.isRequired,
  sliderHeight: PropTypes.number.isRequired,
};

export default VisualizedSetting;
