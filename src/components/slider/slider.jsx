import React from "react";
import PropTypes from "prop-types";
import Arrows from "../arrows/arrows.jsx";
import SlideIndicators from "../slide-indicators/slide-indicators.jsx";
// import {touchStart, touchMove, touchEnd} from "../../utils/swipe.js";
import {getSlidesCount} from "../../utils/common.js";
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

    // this.propstouchPositionCurrent = null;
    // this.propstouchTimeStart = null;
    // this.propstouchTimeEnd = null;
    this.positionDiff = null;
    this.styleSheet = document.styleSheets[0];

    this.slideRef = React.createRef();

    this.state = {
      sliderWidth: parseInt(this.props.width, 10) || ``,
      sliderHeight: parseInt(this.props.height, 10) || ``,
      activeSlide: this._slidesToShow,
      isInfinite: this.props.isInfinite || false,
      isCaption: this.props.isCaption || false,
      isDisabled: false,
      isAutoplay: this.props.isAutoplay || false,
      isIndicators: this.props.isIndicators || false,
      isArrows: this.props.isArrows || false,
      isMultiple: this.props.isMultiple || false,
      isReverse: false,
      animatedSwipe: this.props.animatedSwipe || false,
      slidePosition: 100,
      slidesToShow: this._slidesToShow,
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
    this.slideRef.addEventListener(`mouseleave`, (evt) => this.leaveZone(evt));
  }

  componentDidUpdate() {
    const {
      activeSlide,
      isAutoplay,
      isInfinite,
      slidesToShow
    } = this.state;
    if (isAutoplay && !isInfinite) {
      if (activeSlide === (this._indicators.length - 1) + slidesToShow) {
        this._resetPrevInterval();
      } else if (activeSlide === slidesToShow) {
        this._resetNextInterval();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this._updateWindowDimensions);
    this.slideRef.removeEventListener(`mouseleave`, (evt) => this.leaveZone(evt));
    clearInterval(this._timer);
    this._timer = null;
  }

  _buildSlides() {
    const {slidesToShow} = this.state;
    if (this._modifiedSlides.length) {
      this._modifiedSlides = [];
    }
    switch (true) {
      case slidesToShow > 1:
        const firstCloneArray = this._initSlides.slice(0, slidesToShow);
        const lastCloneArray = this._initSlides.slice(this._initSlides.length - slidesToShow);
        this._modifiedSlides = [...lastCloneArray, ...this._initSlides, ...firstCloneArray];
        break;
      default:
        if (this._initSlides.length === 1) {
          this.setState({
            activeSlide: slidesToShow - 1,
            slidePosition: 100,
          });
          this._modifiedSlides = [...this._initSlides];
          return;
        }
        const firstElement = this._initSlides[0];
        const lastElement = this._initSlides[this._initSlides.length - 1];
        this._modifiedSlides = [lastElement, ...this._initSlides, firstElement];
        break;
    }
    this.setState({
      activeSlide: this.state.slidesToShow
    });
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
    const updatedWidth = parseInt(width, 10) < window.innerWidth ? parseInt(width, 10) : window.innerWidth;
    const updatedHeight = parseInt(height, 10) < window.innerHeight ? parseInt(height, 10) : window.innerHeight;

    const updatedSlidesToShow = getSlidesCount(this.props.slidesCount);

    this.setState({
      slidesToShow: this.state.isMultiple ? updatedSlidesToShow : this.state.slidesToShow,
      sliderWidth: updatedWidth,
      sliderHeight: updatedHeight,
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
      slidesToShow,
    } = this.state;
    if (isAutoplay && !isInfinite) {
      if (activeSlide === (this._indicators.length - 1) + slidesToShow) {
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
    } = this.state;
    const positionCorrection = this.positionDiff ? this.positionDiff.x * 100 / this.state.sliderWidth : 0;
    let position = this.positionDiff && this.state.animatedSwipe ? Math.round(slidePosition - ((positionCorrection))) : slidePosition;
    let currentSlide = activeSlide;

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
      // isReverse: true,
    });
  }

  _handlNextSlideClick(evt) {
    this.setAnimation(evt);
    const {
      activeSlide,
      isInfinite,
      slidePosition,
      slidesToShow,
    } = this.state;
    const positionCorrection = this.positionDiff ? this.positionDiff.x * 100 / this.state.sliderWidth : 0;
    let position = this.positionDiff && this.state.animatedSwipe ? Math.round(slidePosition - ((positionCorrection))) : slidePosition;
    let currentSlide = activeSlide;

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
      // isReverse: false,
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
      if (this.styleSheet.cssRules[this.styleSheet.cssRules.length - 1].name === this.state.slideAnimation) {
        this.styleSheet.deleteRule(this.styleSheet.cssRules.length - 1);
      }
      this.setState({
        isDisabled: false,
      });
    }, 150);
  }

  setAnimation(evt) {
    const slideAnimation = `animation${Math.round(Math.random() * 100)}`;
    const anima = () => {
      let a = ``;
      if (this.positionDiff && this.state.animatedSwipe) {
        const positionCorrection = this.positionDiff.x * 100 / this.state.sliderWidth;
        if (this.positionDiff.x < 100 && this.positionDiff.x > -100 || !this.state.isInfinite && this.state.slidePosition < 100 || !this.state.isInfinite && this.state.slidePosition > (this._indicators.length * 100)) {
          a = -this.state.slidesToShow * positionCorrection;
        } else {
          a = this.positionDiff.x > 0 ?
            Math.round(this.state.slidesToShow * 100 - ((positionCorrection)) * this.state.slidesToShow) :
            -Math.round(this.state.slidesToShow * 100 + ((positionCorrection)) * this.state.slidesToShow);
        }
      }

      if (!this.positionDiff && !this.state.isAutoplay) {
        a = evt.currentTarget.classList[1] === `arrows__next` || parseInt(evt.currentTarget.id, 10) + this.state.slidesToShow > this.state.activeSlide ? this.state.slidesToShow * 100 : this.state.slidesToShow * -100;
      }

      if (this.positionDiff && !this.state.animatedSwipe) {
        if (!this.state.isInfinite && this.state.activeSlide === this.state.slidesToShow && this.positionDiff.x < 0 ||
          !this.state.isInfinite && this.state.activeSlide === (this._indicators.length - 1) + this.state.slidesToShow && this.positionDiff.x > 0) {
          a = false;
        } else {
          a = this.positionDiff.x > 0 ?
            Math.round(this.state.slidesToShow * 100) :
            -Math.round(this.state.slidesToShow * 100);
        }
      }

      // if (this.state.isAutoplay && !this.state.isReverse) {
      //   if (this.state.activeSlide === (this._indicators.length - 1)) {
      //     this.setState({
      //       isReverse: !this.state.isReverse
      //     });
      //   }
      //   a = this.state.slidesToShow * 100;
      // }
      // if (this.state.isAutoplay && this.state.isReverse) {
      //   if (this.state.activeSlide === this.state.slidesToShow + 1) {
      //     this.setState({
      //       isReverse: !this.state.isReverse
      //     });
      //   }
      //   a = this.state.slidesToShow * -100;
      // }

      return a;
    };

    const keyframes =
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
  checkAction(evt) {
    this.positionDiff = {
      x: this.touchPositionStart.x - this.touchPositionCurrent.x,
    };
    if (Math.abs(this.positionDiff.x) > 100 && this.touchTimeEnd - this.touchTimeStart > 150) {
      if (this.positionDiff.x > 100) {
        this._handlNextSlideClick();
      } else {
        this._handlPrevSlideClick();
      }
    } else {
      if (this.state.animatedSwipe) {
        this.setState({
          slidePosition: this.state.slidePosition - this.positionDiff.x * 100 / this.state.sliderWidth
        });
        this.setAnimation(evt);
      }
    }

    this.touchTimeStart = null;
    this.touchTimeEnd = null;
    this.positionDiff = null;
  }

  leaveZone(evt) {
    if (evt.clientX > this.slideRef.offsetWidth ||
      evt.clientX < this.slideRef.offsetWidth ||
      evt.clientY > this.slideRef.offsetHeight ||
      evt.clientY < this.slideRef.offsetHeight) {
      this.touchEnd(evt);
    }
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
    const {animatedSwipe} = this.state;
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
      } else {
        shift = {
          x: this.touchPositionCurrent.x - evt.changedTouches[0].clientX,
        };
        this.touchPositionCurrent = {
          x: evt.changedTouches[0].clientX,
        };
      }


      if (animatedSwipe) {
        this.setState({
          slidePosition: this.state.slidePosition + (shift.x * 100 / this.state.sliderWidth)
        });
      }
    }
  }

  touchEnd(evt) {
    if (this.touchTimeStart) {
      this.touchTimeEnd = evt.timeStamp;
      this.checkAction();
      this.touchPositionStart = null;
      this.touchPositionCurrent = null;
    }
  }

  render() {
    const {
      activeSlide,
      isCaption,
      isIndicators,
      slidePosition,
      slidesToShow,
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
          onMouseDown={(evt) => this.touchStart(evt)}
          onMouseMove={(evt) => this.touchMove(evt)}
          onMouseUp={(evt) => this.touchEnd(evt)}
          onTouchStart={(evt) => this.touchStart(evt)}
          onTouchMove={(evt) => this.touchMove(evt)}
          onTouchEnd={(evt) => this.touchEnd(evt)}
          ref={(ref) => {
            this.slideRef = ref;
          }}
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
                ref={(ref) => {
                  this.elItemRef = ref;
                }}
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
  animatedSwipe: PropTypes.bool,
  slidesCount: PropTypes.number
};

export default Slider;
