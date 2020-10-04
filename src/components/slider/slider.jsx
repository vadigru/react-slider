import React from "react";
import PropTypes from "prop-types";
import Arrows from "../arrows/arrows.jsx";
import SlideIndicators from "../slide-indicators/slide-indicators.jsx";
// import {touchStart, touchMove, touchEnd} from "../../utils/swipe.js";
const getSlidesCount = (count = 1) => {
  if (count > 1) {
    if (window.innerWidth > 1150) {
      count = count;
    } else if (window.innerWidth > 768 && window.innerWidth < 1150) {
      count = 2;
    } else if (window.innerWidth < 768) {
      count = 1;
    }
  }

  return count;
};
class Slider extends React.Component {
  constructor(props) {
    super(props);

    this._initSlides = React.Children.toArray(this.props.children);
    this._modifiedSlides = [];
    this._indicators = [];
    this._timer = null;
    this._slidesMaxCount = 3;
    this._sensitivity = 20;
    this._slidesToShow = this.props.isMultiple ? getSlidesCount(this.props.slidesCount) : this.props.slidesCount;

    this.propstouchPositionCurrent = null;
    this.propstouchTimeStart = null;
    this.propstouchTimeEnd = null;
    this.positionDiff = 0;
    this.styleSheet = document.styleSheets[0];

    this.state = {
      sliderWidth: this.props.width || ``,
      sliderHeight: this.props.height || ``,
      activeSlide: this._slidesToShow,
      isInfinite: this.props.isInfinite || false,
      isCaption: this.props.isCaption || false,
      isDisabled: false,
      isAutoplay: this.props.isAutoplay || false,
      isIndicators: this.props.isIndicators || false,
      isArrows: this.props.isArrows || false,
      isMultiple: this.props.isMultiple || false,
      // slides: [],
      slidePosition: 100,
      // slidesToShow: this.props.slidesCount > this._initSlides.length ? this._initSlides.length : this.props.slidesCount || 1,
      slidesToShow: this._slidesToShow,
      // slidesToShow: ,
      // slideAnim: ``,
      slideAnimation: ``
    };

    this._handlPrevSlideClick = this._handlPrevSlideClick.bind(this);
    this._handlNextSlideClick = this._handlNextSlideClick.bind(this);
    this._handleSlideIndicatorClick = this._handleSlideIndicatorClick.bind(this);
    this._handleMouseOver = this._handleMouseOver.bind(this);
    this._updateWindowDimensions = this._updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this._setupSlider();
  }

  componentDidUpdate() {
    const {
      activeSlide,
      isAutoplay,
      isInfinite,
      // slides,
      slidesToShow
    } = this.state;
    if (isAutoplay && !isInfinite) {
      if (activeSlide === (this._modifiedSlides.length - 1) + slidesToShow) {
        this._resetPrevInterval();
      } else if (activeSlide === slidesToShow) {
        this._resetNextInterval();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this._updateWindowDimensions);
    clearInterval(this._timer);
    this._timer = null;
  }

  _buildSlides() {
    const {slidesToShow} = this.state;
    if (this._modifiedSlides.length) {
      this._modifiedSlides = [];
      // this.setState({
      //   slides: []
      // });
    }
    switch (true) {
      case slidesToShow > 1:
        const firstCloneArray = this._initSlides.slice(0, slidesToShow);
        const lastCloneArray = this._initSlides.slice(this._initSlides.length - slidesToShow);
        this._modifiedSlides = [...lastCloneArray, ...this._initSlides, ...firstCloneArray];
        // this.setState({
        //   slides: [...lastCloneArray, ...this._initSlides, ...firstCloneArray]
        // });
        break;
      default:
        if (this._initSlides.length === 1) {
          this.setState({
            activeSlide: slidesToShow - 1,
            slidePosition: 100,
            // slides: [...this._initSlides]
          });
          this._modifiedSlides = [...this._initSlides];
          return;
        }
        const firstElement = this._initSlides[0];
        const lastElement = this._initSlides[this._initSlides.length - 1];
        this._modifiedSlides = [lastElement, ...this._initSlides, firstElement];
        // this.setState({
        //   slides: [lastElement, ...this._initSlides, firstElement]
        // });
        break;
    }
    this.setState({
      activeSlide: this.state.slidesToShow
    });
    // console.log(this._modifiedSlides);
  }

  _buildIndicators() {
    if (this._indicators !== []) {
      this._indicators = [];
    }
    for (let i = 0; i < Math.ceil(this._initSlides.length / this.state.slidesToShow); i++) {
      this._indicators.push(i);
    }
  }

  _getSlideData(arr) {
    const newArr = [];
    arr.forEach((it) => newArr.push(it.props.children));
    return newArr;
  }

  _getBackground(arr) {
    let background = ``;
    switch (true) {
      case Array.isArray(arr):
        arr.some((it) => {
          if (it.props.src) {
            background = it.props.src;
          }
        });
        break;
      default:
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

  _setupSlider() {
    this._buildSlides();
    this._buildIndicators();
    this._startAutoplay();
    this._updateWindowDimensions();
    window.addEventListener(`resize`, this._updateWindowDimensions);
  }

  _updateWindowDimensions() {
    const {width, height} = this.props;
    const updatedWidth = parseInt(width, 10) < window.innerWidth ? width : `${window.innerWidth}px`;
    const updatedHeight = parseInt(height, 10) < window.innerHeight ? height : `${window.innerHeight}px`;

    const updatedSlidesToShow = getSlidesCount(this.props.slidesCount);

    this.setState({
      slidesToShow: this.state.isMultiple ? updatedSlidesToShow : this.state.slidesToShow,
      sliderWidth: updatedWidth,
      sliderHeight: updatedHeight,
      // activeSlide: updatedSlidesToShow,
      slidePosition: 100
    });

    this._buildSlides();
    this._buildIndicators();
  }

  // atoplay handlers ---------------------------------------------------------
  _startAutoplay() {
    const {isAutoplay} = this.state;
    if (isAutoplay && this._initSlides.length !== 1) {
      this._timer = setInterval(this._handlNextSlideClick, 3000);
    }
  }

  _handleMouseOver() {
    clearInterval(this._timer);
    this._timer = null;
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

  _handleMouseOut() {
    const {
      activeSlide,
      isAutoplay,
      isInfinite,
      // slides,
      slidesToShow
    } = this.state;
    if (isAutoplay && !isInfinite) {
      if (activeSlide === (this._modifiedSlides.length - slidesToShow) - slidesToShow) {
        this._resetPrevInterval();
      } else {
        this._resetNextInterval();
      }
    }
    if (isAutoplay && isInfinite) {
      this._resetNextInterval();
    }
  }

  // slider navigation handlers -----------------------------------------------
  _handlPrevSlideClick(evt) {
    this.setAnimation(evt);
    const {
      activeSlide,
      isInfinite,
      slidesToShow,
      slidePosition,
      // slides,
    } = this.state;
    let currentSlide = activeSlide;
    let position = this.positionDiff ? Math.round(slidePosition - ((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10)))) : slidePosition;

    switch (true) {
      case !isInfinite && currentSlide === slidesToShow || this._modifiedSlides.length === 1 || slidesToShow === this._initSlides.length:
        currentSlide = currentSlide;
        position = position;
        break;
      case position === 100:
        currentSlide = (this._indicators.length - 1) + slidesToShow;
        position = ((this._initSlides.length / slidesToShow) * 100);
        break;
      default:
        currentSlide = currentSlide - 1;
        position -= 100;
        break;
    }
    this.setState({
      activeSlide: currentSlide,
      isDisabled: true,
      slidePosition: position,
      // slideAnim: `slideRight`
    });
  }

  _handlNextSlideClick(evt) {
    this.setAnimation(evt);
    const {
      activeSlide,
      isInfinite,
      slidePosition,
      // slides,
      slidesToShow,
    } = this.state;
    let currentSlide = activeSlide;
    let position = this.positionDiff ? Math.round(slidePosition - ((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10)))) : slidePosition;
    switch (true) {
      case !isInfinite && currentSlide === this._indicators.length + slidesToShow - 1 || this._modifiedSlides.length === 1 || slidesToShow === this._initSlides.length:
        currentSlide = currentSlide;
        position = position;
        break;
      case position === 100 * Math.ceil((this._initSlides.length) / slidesToShow):
        currentSlide = slidesToShow;
        position = 100;
        break;
      default:
        currentSlide = currentSlide + 1;
        position += 100;
        break;
    }
    this.setState({
      activeSlide: currentSlide,
      isDisabled: true,
      slidePosition: position,
      // slideAnim: `slideLeft`
    });
  }

  _handleSlideIndicatorClick(evt) {
    const {activeSlide, slidesToShow} = this.state;
    const target = evt.target;
    const id = parseInt(target.id, 10) + slidesToShow;
    switch (true) {
      case id === activeSlide:
        return;
      case id > activeSlide:
        this.setState({
          activeSlide: id,
          slidePosition: ((id - slidesToShow + 1) * 100),
        });
        break;
      default:
        this.setState({
          activeSlide: id,
          slidePosition: ((id - slidesToShow + 1) * 100),
        });
        break;
    }
    this.setAnimation(evt);
  }

  // animation ---------------------------------------------------------------
  _handleSlideAnim() {
    setTimeout(() => {
      this.setState({
        isDisabled: false,
        // slideAnim: ``
      });
    }, 150);
  }

  setAnimation(evt) {
    // let styleSheet = document.styleSheets[0];
    let slideAnimation = `animation${Math.round(Math.random() * 100)}`;
    const anima = () => {
      let a = ``;
      if (this.positionDiff) {
        if (!this.state.isInfinite && this.state.slidePosition < 100) {
          a = -Math.round(((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10))) * this.state.slidesToShow);
        } else if (!this.state.isInfinite && this.state.slidePosition > (this._indicators.length * 100)) {
          a = -Math.round(((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10))) * this.state.slidesToShow);
        } else {
          a = this.positionDiff.x > 0 ?
            Math.round(this.state.slidesToShow * 100 - ((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10))) * this.state.slidesToShow) :
            -Math.round(this.state.slidesToShow * 100 + ((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10))) * this.state.slidesToShow);
        }
      }
      if (!this.positionDiff) {
        a = this.state.isAutoplay || evt.currentTarget.classList[1] === `arrows__next` || parseInt(evt.currentTarget.id, 10) + this.state.slidesToShow > this.state.activeSlide ? this.state.slidesToShow * 100 : this.state.slidesToShow * -100;
      }
      return a;
    };
    let keyframes =
    `@-webkit-keyframes ${slideAnimation} {
      0% {-webkit-transform:translate(${anima()}%)}
      100% {-webkit-transform:translate(${0}%)}
    }`;
    this.styleSheet.insertRule(keyframes, this.styleSheet.cssRules.length);
    this.setState({
      slideAnimation
    });
  }

  // handle touchevents and mouseevents --------------------------------------
  checkAction(slide, next, prev) {
    this.positionDiff = {
      x: this.touchPositionStart.x - this.touchPositionCurrent.x,
    };
    if (Math.abs(this.positionDiff.x) > 0 && this.touchTimeEnd - this.touchTimeStart > 0) {
      if (this.positionDiff.x > 0) {
        next(slide);
      } else {
        prev(slide);
      }
    }
    this.touchTimeStart = null;
    this.touchTimeEnd = null;
    this.positionDiff = null;
  }

  touchStart(evt) {
    this.touchTimeStart = evt.timeStamp;
    if (evt.type === `mousedown`) {
      evt.preventDefault();
      this.touchPositionStart = {
        x: evt.clientX,
      };
    } else {
      this.touchPositionStart = {
        x: evt.changedTouches[0].clientX,
      };
    }

    this.touchPositionCurrent = {
      x: this.touchPositionStart.x,
    };
  }

  touchMove(evt) {
    let shift;

    if (this.touchTimeStart && this.state.slidesToShow !== this._initSlides.length) {
      if (evt.type === `mousemove`) {
        evt.preventDefault();
        shift = {
          x: this.touchPositionCurrent.x - evt.clientX,
        };
        this.touchPositionCurrent = {
          x: evt.clientX,
        };
      } else if (evt.type === `touchmove`) {
        shift = {
          x: this.touchPositionCurrent.x - evt.changedTouches[0].clientX,
        };
        this.touchPositionCurrent = {
          x: evt.changedTouches[0].clientX,
        };
      }

      this.setState({
        slidePosition: this.state.slidePosition + shift.x * 100 / parseInt(this.state.sliderWidth, 10)
      });
    }
  }

  touchEnd(evt, slide, next, prev) {
    if (this.touchTimeStart) {
      this.touchTimeEnd = evt.timeStamp;
      this.checkAction(slide, next, prev);
      this.touchPositionStart = null;
      this.touchPositionCurrent = null;
    }
  }

  render() {
    const {
      activeSlide,
      isCaption,
      isIndicators,
      // slides,
      slidePosition,
      slidesToShow,
      // slideAnim,
      sliderWidth,
      sliderHeight
    } = this.state;

    const slideData = this._getSlideData(this._modifiedSlides);
    return (
      <section
        className="slider"
        style={{
          maxWidth: sliderWidth,
        }}
        onMouseOver={this._handleMouseOver}
        onMouseOut={() => this._handleMouseOut()}
      >
        <div
          className={`slide`}
          onMouseOut={(evt) => this.touchEnd(
              evt,
              activeSlide,
              this._handlNextSlideClick,
              this._handlPrevSlideClick
          )}
          onMouseDown={(evt) => this.touchStart(evt)}
          onMouseMove={(evt) => this.touchMove(evt)}
          onMouseUp={(evt) => this.touchEnd(
              evt,
              activeSlide,
              this._handlNextSlideClick,
              this._handlPrevSlideClick
          )}
          onTouchStart={(evt) => this.touchStart(evt)}
          onTouchMove={(evt) => this.touchMove(evt)}
          onTouchEnd={(evt) => this.touchEnd(
              evt,
              activeSlide,
              this._handlNextSlideClick,
              this._handlPrevSlideClick
          )}
        >
          {slideData.map((it, index) => {
            let style = {
              animationName: this.state.slideAnimation,
              animationTimingFunction: `ease-in-out`,
              animationDuration: `0.3s`,
              animationDelay: `0.0s`,
              animationIterationCount: 1,
              animationDirection: `normal`,
              animationFillMode: `forwards`,
              color: `${!this._getBackground(it) ? `black` : `white`}`,
              minWidth: `${100 / slidesToShow}%`,
              height: sliderHeight,
              left: `-${slidePosition}%`,
              backgroundImage: `url(${this._getBackground(it)})`,
            };
            let styleHidden = {
              minWidth: `${100 / slidesToShow}%`,
              height: sliderHeight,
              left: `-${slidePosition}%`,
              visibility: `hidden`
            };
            return (
              <div
                key={it + index}
                className={`slide__item ${isCaption ? `` : `slide__item--no-caption`}`}
                // className={`slide__item ${slideAnim} ${isCaption ? `` : `slide__item--no-caption`}`}
                onAnimationEnd={() => this._handleSlideAnim()}
                id={index + activeSlide}
                style={!this.state.isInfinite && index < slidesToShow || !this.state.isInfinite && index > (this._initSlides.length - 1) + slidesToShow ? styleHidden : style}
              >
                {it}
              </div>
            );
          })}

        </div>

        {!this.state.isArrows || this._modifiedSlides.length === 1 || slidesToShow === this._initSlides.length ? `` :
          <Arrows
            activeSlide={activeSlide}
            isInfinite={this.state.isInfinite}
            isDisabled={this.state.isDisabled}
            slides={this._initSlides}
            slidesToShow={this.state.slidesToShow}
            indicators={this._indicators}
            onLeftArrowClick={this._handlPrevSlideClick}
            onRightArrowClick={this._handlNextSlideClick}
            onMouseOverHandler={this._handleMouseOver}
          />}
        {!isIndicators || this._initSlides.length === slidesToShow ? `` :
          <SlideIndicators
            activeSlide={activeSlide}
            isInfinite={this.state.isInfinite}
            isCaption={isCaption}
            slides={this._initSlides}
            slidesToShow={slidesToShow}
            indicators={this._indicators}
            onIndicatorDotClick={this._handleSlideIndicatorClick}
          />}
      </section>
    );
  }
}

Slider.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  isInfinite: PropTypes.bool,
  isCaption: PropTypes.bool,
  isAutoplay: PropTypes.bool,
  isIndicators: PropTypes.bool,
  isArrows: PropTypes.bool,
  isMultiple: PropTypes.bool,
  slidesCount: PropTypes.number
};

export default Slider;
