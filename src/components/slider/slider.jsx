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
      slideAnim: ``
    };

    this._slides = React.Children.toArray(this.props.children);

    this._handlPrevSlideClick = this._handlPrevSlideClick.bind(this);
    this._handlNextSlideClick = this._handlNextSlideClick.bind(this);
    this._handleSlideIndicatorClick = this._handleSlideIndicatorClick.bind(this);
  }

  componentDidMount() {
    if (this.state.isAutoplay) {
      setInterval(() => {
        this._handlNextSlideClick(this.state.activeSlide);
      }, 5000);
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

  _handlPrevSlideClick(slide) {
    let currentSlide = slide;
    let position = this.state.slidePosition;
    if (currentSlide === this.state.slidesToShow) {
      currentSlide = (this.state.slides.length - 1 - this.state.slidesToShow);
      position = ((this.state.slides.length - 1) - this.state.slidesToShow) * 100 / this.state.slidesToShow;
    } else if (currentSlide > this.state.slidesToShow) {
      currentSlide = slide - 1;
      position -= 100 / this.state.slidesToShow;
    } else {
      currentSlide = this.state.activeSlide;
      position = this.state.slidePosition;
    }

    this.setState({
      activeSlide: currentSlide,
      isDisabled: true,
      slidePosition: position,
      slideAnim: `slideRight`
    });
  }

  _handlNextSlideClick(slide) {
    let currentSlide = slide;
    let position = this.state.slidePosition;
    if (currentSlide === (this.state.slides.length - 1) - this.state.slidesToShow) {
      currentSlide = this.state.slidesToShow;
      position = 100;
    } else if (currentSlide < this.state.slides.length - 1) {
      currentSlide = slide + 1;
      position += 100 / this.state.slidesToShow;
    } else {
      currentSlide = this.state.activeSlide;
      position = this.state.slidePosition;
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
    }, 1);
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

  _autoplay() {

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
      <React.Fragment>
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
        />

        <SlideIndicators
          activeSlide={activeSlide}
          isInfinite={this.state.isInfinite}
          isCaption={isCaption}
          slides={this._slides}
          slidesToShow={slidesToShow}
          onIndicatorDotClick={this._handleSlideIndicatorClick}
        />
      </React.Fragment>
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
