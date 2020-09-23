import React from "react";
import PropTypes from "prop-types";
import Arrows from "../arrows/arrows.jsx";
import SlideIndicators from "../slide-indicators/slide-indicators.jsx";
import {touchStart, touchMove, touchEnd} from "../../utils/swipe.js";
import {checkMobile} from "../../utils/check-mobile.js";
class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: this.props.slidesCount || 1,
      isInfinite: this.props.isInfinite || false,
      isCaption: this.props.isCaption || false,
      isDisabled: false,
      isAutoplay: this.props.isAutoplay || false,
      slides: [],
      slidePosition: 100,
      slidesToShow: this.props.slidesCount || 1,
      slideAnim: ``,
      sliderWidth: this.props.width || 0,
      sliderHeight: this.props.height || 0
    };

    this._slides = React.Children.toArray(this.props.children);
    this._timer = null;
    this._handlPrevSlideClick = this._handlPrevSlideClick.bind(this);
    this._handlNextSlideClick = this._handlNextSlideClick.bind(this);
    this._handleSlideIndicatorClick = this._handleSlideIndicatorClick.bind(this);
    this._handleMouseOver = this._handleMouseOver.bind(this);
    this._updateWindowDimensions = this._updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    const {slidesCount} = this.props;
    const {isAutoplay, slidesToShow} = this.state;
    if (isAutoplay) {
      this._timer = setInterval(this._handlNextSlideClick, 3000);
    }

    if (slidesCount > 1 && slidesCount <= this._slides.length) {
      const firstCloneArray = this._slides.slice(0, slidesToShow);
      const lastCloneArray = this._slides.slice(this._slides.length - slidesToShow);
      this.setState({
        slides: [...lastCloneArray, ...this._slides, ...firstCloneArray]
      });
    } else if (slidesCount > this._slides.length) {
      throw new Error(`I cannot show more slides than you have in a list.`);
    } else {
      if (this._slides.length === 1) {
        this.setState({
          activeSlide: slidesCount - 1,
          slidePosition: 0,
          slides: [...this._slides]
        });
      } else {
        const firstElement = this._slides[0];
        const lastElement = this._slides[this._slides.length - 1];
        this.setState({
          slides: [lastElement, ...this._slides, firstElement]
        });
      }
    }
    this._updateWindowDimensions();
    window.addEventListener(`resize`, this._updateWindowDimensions);
  }

  componentDidUpdate() {
    const {
      activeSlide,
      isAutoplay,
      isInfinite,
      slides,
      slidesToShow
    } = this.state;

    if (isAutoplay && !isInfinite) {
      if (activeSlide === (slides.length - slidesToShow) - slidesToShow) {
        this._resetPrevInterval();
      } else if (activeSlide === slidesToShow) {
        this._resetNextInterval();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this._updateWindowDimensions);
  }

  _resetPrevInterval() {
    clearInterval(this._timer);
    this._timer = null;
    this._timer = setInterval(this._handlPrevSlideClick, 3000);
  }

  _resetNextInterval() {
    clearInterval(this._timer);
    this._timer = null;
    this._timer = setInterval(this._handlNextSlideClick, 3000);
  }


  _updateWindowDimensions() {
    const {width, height} = this.props;
    const updatedWidth = width ? width : `${window.innerWidth}px`;
    const updatedHeight = height ? height : `${window.innerHeight}px`;
    this.setState({
      sliderWidth: checkMobile() ? `100%` : updatedWidth,
      sliderHeight: checkMobile() ? `100vw` : updatedHeight
    });
  }

  _handleMouseOver() {
    clearInterval(this._timer);
    this._timer = null;
  }

  _handleMouseOut() {
    const {
      activeSlide,
      isAutoplay,
      isInfinite,
      slides,
      slidesToShow
    } = this.state;

    if (isAutoplay && !isInfinite) {
      if (activeSlide === (slides.length - slidesToShow) - slidesToShow) {
        this._resetPrevInterval();
      } else {
        this._resetNextInterval();
      }
    }
    if (isAutoplay && isInfinite) {
      this._resetNextInterval();
    }
  }

  _handlPrevSlideClick() {
    const {
      activeSlide,
      isInfinite,
      slidesToShow,
      slidePosition,
      slides
    } = this.state;

    let currentSlide = activeSlide;
    let position = slidePosition;
    if (!isInfinite && currentSlide === slidesToShow || slides.length === 1) {
      return;
    }
    if (currentSlide === slidesToShow) {
      currentSlide = (slides.length - 1 - slidesToShow);
      position = ((slides.length - 1) - slidesToShow) * 100 / slidesToShow;
    } else if (currentSlide > slidesToShow) {
      currentSlide = currentSlide - 1;
      position -= 100 / slidesToShow;
    }

    this.setState({
      activeSlide: currentSlide,
      isDisabled: true,
      slidePosition: position,
      slideAnim: `slideRight`
    });
  }

  _handlNextSlideClick() {
    const {
      activeSlide,
      isInfinite,
      slidePosition,
      slides,
      slidesToShow
    } = this.state;

    let currentSlide = activeSlide;
    let position = slidePosition;
    if (!isInfinite && currentSlide === (slides.length - slidesToShow) - slidesToShow || slides.length === 1) {
      return;
    }
    if (currentSlide === (slides.length - 1) - slidesToShow) {
      currentSlide = slidesToShow;
      position = 100;
    } else if (currentSlide < slides.length - 1) {
      currentSlide = currentSlide + 1;
      position += 100 / slidesToShow;
    }

    this.setState({
      activeSlide: currentSlide,
      isDisabled: true,
      slidePosition: position,
      slideAnim: `slideLeft`
    });
  }

  _handleSlideIndicatorClick(evt) {
    const {activeSlide, slidesToShow} = this.state;
    const target = evt.target;
    const id = parseInt(target.id, 10);
    if (id === activeSlide) {
      return;
    }
    if (id > activeSlide) {
      this.setState({
        activeSlide: id,
        slidePosition: id * 100 / slidesToShow,
        slideAnim: `slideLeft`
      });
    } else {
      this.setState({
        activeSlide: id,
        slidePosition: id * 100 / slidesToShow,
        slideAnim: `slideRight`
      });
    }
  }

  _handleSlideAnim() {
    setTimeout(() => {
      this.setState({
        isDisabled: false,
        slideAnim: ``
      });
    }, 1);
  }

  _getSlideData(arr) {
    const newArr = [];
    arr.forEach((it) => newArr.push(it.props.children));
    return newArr;
  }

  _getBackground(arr) {
    let background = ``;
    if (Array.isArray(arr)) {
      arr.some((it) => {
        if (it.props.src) {
          background = it.props.src;
        }
      });
    } else {
      for (let property in arr) {
        if (arr.hasOwnProperty(property)) {
          if (arr[`props`].src) {
            background = arr[`props`].src;
          }
        }
      }
    }

    return background;
  }

  render() {
    const {
      activeSlide,
      isCaption,
      slides,
      slidePosition,
      slidesToShow,
      slideAnim,
      sliderWidth,
      sliderHeight
    } = this.state;

    const slideData = this._getSlideData(slides);

    return (
      <section
        className="slider"
        onMouseOver={this._handleMouseOver}
        onMouseOut={() => this._handleMouseOut()}
        style={{
          maxWidth: sliderWidth,
        }}
      >
        <div
          className={`slide`}
          onTouchStart={(evt) => touchStart(evt)}
          onTouchMove={(evt) => touchMove(evt)}
          onTouchEnd={(evt) => touchEnd(
              evt,
              activeSlide,
              this._handlNextSlideClick,
              this._handlPrevSlideClick
          )}
        >
          {slideData.map((it, index) => {
            return (
              <div
                key={it + index}
                className={`slide__item ${slideAnim} ${isCaption ? `` : `slide__item--without-caption`}`}
                onAnimationEnd={() => this._handleSlideAnim()}
                id={index + activeSlide}
                style={{
                  color: `${!this._getBackground(it) ? `black` : `white`}`,
                  minWidth: `${100 / slidesToShow}%`,
                  height: sliderHeight,
                  left: `-${slidePosition}%`,
                  backgroundImage: `url(${this._getBackground(it)})`,
                }}
              >
                {it}
              </div>
            );
          })}
          {slides.length === 1 ? `` :
            <SlideIndicators
              activeSlide={activeSlide}
              isInfinite={this.state.isInfinite}
              isCaption={isCaption}
              slides={this._slides}
              slidesToShow={slidesToShow}
              onIndicatorDotClick={this._handleSlideIndicatorClick}
            />}
        </div>

        {slides.length === 1 ? `` :
          <Arrows
            activeSlide={activeSlide}
            isInfinite={this.state.isInfinite}
            isDisabled={this.state.isDisabled}
            slides={this._slides}
            slidesToShow={this.state.slidesToShow}
            onLeftArrowClick={this._handlPrevSlideClick}
            onRightArrowClick={this._handlNextSlideClick}
            onMouseOverHandler={this._handleMouseOver}
          />}
      </section>
    );
  }
}

Slider.propTypes = {
  children: PropTypes.node.isRequired,
  isInfinite: PropTypes.bool,
  isCaption: PropTypes.bool,
  isAutoplay: PropTypes.bool,
  slidesCount: PropTypes.number,
  width: PropTypes.string,
  height: PropTypes.string
};

export default Slider;
