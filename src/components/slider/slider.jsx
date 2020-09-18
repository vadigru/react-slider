import React from "react";
import PropTypes from "prop-types";
import Arrows from "../arrows/arrows.jsx";
import SlideIndicators from "../slide-indicators/slide-indicators.jsx";
import {touchStart, touchMove, touchEnd} from "../../utils/swipe.js";
class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: this.props.slidesToShow,
      isInfinite: this.props.isInfinite,
      isCaption: this.props.isCaption,
      isDisabled: false,
      isAutoplay: this.props.isAutoplay,
      slides: [],
      slidePosition: 100,
      slidesToShow: this.props.slidesToShow,
      slideAnim: ``,
      width: window.innerWidth,
      height: window.innerHeight
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
    this._updateWindowDimensions();
    window.addEventListener(`resize`, this._updateWindowDimensions());

    if (this.state.isAutoplay) {
      this._timer = setInterval(this._handlNextSlideClick, 3000);
    }
    if (this.props.slidesToShow > 1) {
      const firstCloneArray = this._slides.slice(0, this.state.slidesToShow);
      const lastCloneArray = this._slides.slice(this._slides.length - this.state.slidesToShow);
      this.setState({
        slides: [...lastCloneArray, ...this._slides, ...firstCloneArray]
      });
    } else {
      const firstElement = this._slides[0];
      const lastElement = this._slides[this._slides.length - 1];
      this.setState({
        slides: [lastElement, ...this._slides, firstElement]
      });
    }
  }

  componentDidUpdate() {
    if (this.state.isAutoplay && !this.state.isInfinite) {
      if (this.state.activeSlide === (this.state.slides.length - this.state.slidesToShow) - this.state.slidesToShow) {
        clearInterval(this._timer);
        this._timer = null;
        this._timer = setInterval(this._handlPrevSlideClick, 3000);
      } else if (this.state.activeSlide === this.state.slidesToShow) {
        clearInterval(this._timer);
        this._timer = null;
        this._timer = setInterval(this._handlNextSlideClick, 3000);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this._updateWindowDimensions);
  }

  _updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _handleMouseOver() {
    clearInterval(this._timer);
    this._timer = null;
  }

  _handleMouseOut() {
    if (this.state.isAutoplay && !this.state.isInfinite) {
      if (this.state.activeSlide === (this.state.slides.length - this.state.slidesToShow) - this.state.slidesToShow) {
        clearInterval(this._timer);
        this._timer = null;
        this._timer = setInterval(this._handlPrevSlideClick, 3000);
      } else {
        clearInterval(this._timer);
        this._timer = null;
        this._timer = setInterval(this._handlNextSlideClick, 3000);
      }
    } else {
      clearInterval(this._timer);
      this._timer = null;
      this._timer = setInterval(this._handlNextSlideClick, 3000);
    }
  }

  _handlPrevSlideClick() {
    let currentSlide = this.state.activeSlide;
    let position = this.state.slidePosition;
    if (!this.state.isInfinite && currentSlide === this.state.slidesToShow) {
      return;
    }
    if (currentSlide === this.state.slidesToShow) {
      currentSlide = (this.state.slides.length - 1 - this.state.slidesToShow);
      position = ((this.state.slides.length - 1) - this.state.slidesToShow) * 100 / this.state.slidesToShow;
    } else if (currentSlide > this.state.slidesToShow) {
      currentSlide = currentSlide - 1;
      position -= 100 / this.state.slidesToShow;
    }

    this.setState({
      activeSlide: currentSlide,
      isDisabled: true,
      slidePosition: position,
      slideAnim: `slideRight`
    });
  }

  _handlNextSlideClick() {
    let currentSlide = this.state.activeSlide;
    let position = this.state.slidePosition;
    if (!this.state.isInfinite && currentSlide === (this.state.slides.length - this.state.slidesToShow) - this.state.slidesToShow) {
      return;
    }
    if (currentSlide === (this.state.slides.length - 1) - this.state.slidesToShow) {
      currentSlide = this.state.slidesToShow;
      position = 100;
    } else if (currentSlide < this.state.slides.length - 1) {
      currentSlide = currentSlide + 1;
      position += 100 / this.state.slidesToShow;
    }

    this.setState({
      activeSlide: currentSlide,
      isDisabled: true,
      slidePosition: position,
      slideAnim: `slideLeft`
    });
  }

  _handleSlideIndicatorClick(evt) {
    const target = evt.target;
    const id = parseInt(target.id, 10);
    if (id === this.state.activeSlide) {
      return;
    }
    if (id > this.state.activeSlide) {
      this.setState({
        activeSlide: id,
        slidePosition: id * 100 / this.state.slidesToShow,
        slideAnim: `slideLeft`
      });
    } else {
      this.setState({
        activeSlide: id,
        slidePosition: id * 100 / this.state.slidesToShow,
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
    }, 300);
  }

  _getSlideData(arr) {
    const newArr = [];
    arr.forEach((it) => newArr.push(it.props.children));
    return newArr;
  }

  _getBackground(arr) {
    let background = `https://c4.wallpaperflare.com/wallpaper/585/526/393/gray-simple-background-empty-minimalism-wallpaper-preview.jpg`;
    arr.some((it) => {
      if (!it.props.src) {
        background = background;
      }
      if (it.type === `img`) {
        background = it.props.src;
      }
    });
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
    } = this.state;

    const slideData = this._getSlideData(slides);

    return (
      <section
        className="slider"
        onMouseOver={this._handleMouseOver}
        onMouseOut={() => this._handleMouseOut()}
      >
        <div
          className={`slide`}
        >
          {slideData.map((it, index) => {
            return (
              <div
                key={it + index}
                className={`slide__item ${slideAnim} ${isCaption ? `` : `slide__item--without-caption`}`}
                onAnimationEnd={() => this._handleSlideAnim()}
                onTouchStart={(evt) => touchStart(evt)}
                onTouchMove={(evt) => touchMove(evt)}
                onTouchEnd={(evt) => touchEnd(
                    evt,
                    activeSlide,
                    this._handlNextSlideClick,
                    this._handlPrevSlideClick
                )}
                id={index + activeSlide}
                style={{
                  minWidth: `${100 / slidesToShow}%`,
                  height: `${this.state.height}px`,
                  position: `relative`,
                  left: `-${slidePosition}%`,
                  backgroundImage: `url(${this._getBackground(it)})`,
                  backgroundColor: `rgba(0, 0, 0, 0.5)`,
                  backgroundBlendMode: `multiply`,
                  backgroundSize: `cover`,
                  backgroundPosition: `center`,
                  backgroundPositionY: 0
                }}
              >
                {it}
              </div>
            );
          })}
        </div>

        <Arrows
          activeSlide={activeSlide}
          isInfinite={this.state.isInfinite}
          isDisabled={this.state.isDisabled}
          slides={this._slides}
          slidesToShow={this.state.slidesToShow}
          onLeftArrowClick={this._handlPrevSlideClick}
          onRightArrowClick={this._handlNextSlideClick}
          onMouseOverHandler={this._handleMouseOver}
        />

        <SlideIndicators
          activeSlide={activeSlide}
          isInfinite={this.state.isInfinite}
          isCaption={isCaption}
          slides={this._slides}
          slidesToShow={slidesToShow}
          onIndicatorDotClick={this._handleSlideIndicatorClick}
        />
      </section>
    );
  }
}

Slider.propTypes = {
  children: PropTypes.node.isRequired,
  isInfinite: PropTypes.bool.isRequired,
  isCaption: PropTypes.bool.isRequired,
  isAutoplay: PropTypes.bool.isRequired,
  slidesToShow: PropTypes.number.isRequired,
};

export default Slider;
