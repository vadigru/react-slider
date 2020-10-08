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
    this._sensitivity = 100;
    this._slidesToShow = this.props.adaptiveSlides ? getSlidesCount(this.props.slidesCount) : this.props.slidesCount;
    this.positionDiff = null;
    this.styleSheet = document.styleSheets[0];

    this.slideRef = React.createRef();

    this.state = {
      sliderWidth: parseInt(this.props.width, 10) || ``,
      sliderHeight: parseInt(this.props.height, 10) || ``,
      activeSlide: this._slidesToShow,
      isInfinite: this.props.infinite || false,
      isCaption: this.props.caption || false,
      isDisabled: false,
      isAutoplay: this.props.autoplay || false,
      isIndicators: this.props.indicators || false,
      isArrows: this.props.arrows || false,
      isAdaptive: this.props.adaptiveSlides || false,
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
    const lastSlide = (this._indicators.length - 1) + slidesToShow;

    if (isAutoplay && !isInfinite) {
      if (activeSlide === lastSlide) {
        this._resetPrevInterval();
      } else if (activeSlide === slidesToShow) {
        this._resetNextInterval();
      }
    }
    if (isAutoplay && isInfinite) {
      this._resetNextInterval();
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
      activeSlide: slidesToShow
    });
  }

  _buildIndicators() {
    const {slidesToShow} = this.state;

    if (this._indicators !== []) {
      this._indicators = [];
    }
    for (let i = 0; i < Math.ceil(this._initSlides.length / slidesToShow); i++) {
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
    const {isAdaptive, slidesToShow} = this.state;
    const updatedWidth = parseInt(width, 10) < window.innerWidth ? parseInt(width, 10) : window.innerWidth;
    const updatedHeight = parseInt(height, 10) < window.innerHeight ? parseInt(height, 10) : window.innerHeight;
    const updatedSlidesToShow = getSlidesCount(this.props.slidesCount);

    this.setState({
      isReverse: false,
      slidesToShow: isAdaptive ? updatedSlidesToShow : slidesToShow,
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
      isAutoplay,
      isInfinite,
      isReverse,
    } = this.state;

    if (isAutoplay && !isInfinite) {
      if (isReverse) {
        this._resetPrevInterval();
      }
      if (!isReverse) {
        this._resetNextInterval();
      }
    }

    if (isAutoplay && isInfinite) {
      this.setState({
        isReverse: false
      });
      this._resetNextInterval();
    }
  }

  // slider navigation handlers -----------------------------------------------
  _handlPrevSlideClick(evt) {
    this.setAnimation(evt);
    const {
      sliderWidth,
      activeSlide,
      isInfinite,
      slidesToShow,
      slidePosition,
      animatedSwipe
    } = this.state;
    const positionCorrection = this.positionDiff ? this.positionDiff.x * 100 / sliderWidth : 0;
    const lastSlide = (this._indicators.length - 1) + slidesToShow;

    let position = this.positionDiff && animatedSwipe ? Math.round(slidePosition - ((positionCorrection))) : slidePosition;
    let currentSlide = activeSlide;

    switch (true) {
      case !isInfinite && currentSlide === slidesToShow || this._modifiedSlides.length === 1 || slidesToShow === this._initSlides.length:
        currentSlide = currentSlide;
        position = position;
        break;
      case position === 100:
        currentSlide = lastSlide;
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
    });
  }

  _handlNextSlideClick(evt) {
    this.setAnimation(evt);
    const {
      sliderWidth,
      activeSlide,
      isInfinite,
      slidePosition,
      slidesToShow,
      animatedSwipe
    } = this.state;
    const positionCorrection = this.positionDiff ? this.positionDiff.x * 100 / sliderWidth : 0;
    let position = this.positionDiff && animatedSwipe ? Math.round(slidePosition - ((positionCorrection))) : slidePosition;
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
    });
  }

  _handleSlideIndicatorClick(evt) {
    const {activeSlide, slidesToShow} = this.state;
    const target = evt.target;
    const id = parseInt(target.id, 10) + slidesToShow;

    switch (true) {
      case id === activeSlide:
        return;
      default:
        const position = ((id - slidesToShow + 1) * 100);
        this.setState({
          activeSlide: id,
          slidePosition: position,
        });
        break;
    }
    this.setAnimation(evt);
  }

  // animation ---------------------------------------------------------------
  _handleSlideAnim() {
    const {slideAnimation} = this.state;

    setTimeout(() => {
      if (this.styleSheet.cssRules[this.styleSheet.cssRules.length - 1].name === slideAnimation) {
        this.styleSheet.deleteRule(this.styleSheet.cssRules.length - 1);
      }
      this.setState({
        isDisabled: false,
      });
    }, 150);
  }

  setAnimation(evt) {
    const {
      sliderWidth,
      isInfinite,
      isAutoplay,
      isReverse,
      slidePosition,
      slidesToShow,
      animatedSwipe,
      activeSlide
    } = this.state;
    const slideAnimation = `animation${Math.round(Math.random() * 100)}`;

    const anima = () => {
      let a = ``;
      const lastSlide = (this._indicators.length - 1) + slidesToShow;
      if (this.positionDiff && animatedSwipe) {
        const positionCorrection = this.positionDiff.x * 100 / sliderWidth;
        if (slidePosition <= (slidesToShow + 1) * 100) {
          this.setState({
            isReverse: false
          });
        }
        if (slidePosition >= (this._indicators.length - 1) * 100) {
          this.setState({
            isReverse: true
          });
        }
        if (this.positionDiff.x < 100 && this.positionDiff.x > -100 ||
          !isInfinite && slidePosition < 100 ||
          !isInfinite && slidePosition > (this._indicators.length * 100)) {
          a = -slidesToShow * positionCorrection;
        } else {
          a = this.positionDiff.x > 0 ?
            Math.round(slidesToShow * 100 - ((positionCorrection)) * slidesToShow) :
            -Math.round(slidesToShow * 100 + ((positionCorrection)) * slidesToShow);
        }
      }

      if (this.positionDiff && !animatedSwipe && !isInfinite) {
        if (this.positionDiff.x > 0) {
          if (activeSlide === lastSlide) {
            this.setState({
              isReverse: true
            });
          }
          a = Math.round(slidesToShow * 100);
        }
        if (this.positionDiff.x < 0) {
          if (activeSlide === slidesToShow) {
            this.setState({
              isReverse: false
            });
          }
          a = -Math.round(slidesToShow * 100);
        }
        if (activeSlide === slidesToShow && this.positionDiff.x < 0 ||
          activeSlide === lastSlide && this.positionDiff.x > 0) {
          a = false;
        }
      }

      if (!this.positionDiff && isAutoplay && !isReverse && isInfinite) {
        a = slidesToShow * 100;
      }

      if (!this.positionDiff && isAutoplay && !isReverse && !isInfinite) {
        if (slidePosition === (this._indicators.length - 1) * 100) {
          this.setState({
            isReverse: true
          });
        }
        a = slidesToShow * 100;
      }

      if (!this.positionDiff && isAutoplay && isReverse && !isInfinite) {
        if (slidePosition < (slidesToShow + 1) * 100) {
          this.setState({
            isReverse: false
          });
        }
        a = slidesToShow * -100;
      }

      if (!this.positionDiff) {
        if (evt) {
          if (evt.currentTarget.classList[1] === `arrows__next` || parseInt(evt.currentTarget.id, 10) + slidesToShow > activeSlide) {
            this.setState({
              isReverse: true
            });
            if (activeSlide === lastSlide) {
              this.setState({
                isReverse: true
              });
              a = slidesToShow * 100;
            }
            a = slidesToShow * 100;
          }
          if (evt.currentTarget.classList[1] === `arrows__prev` || parseInt(evt.currentTarget.id, 10) + slidesToShow < activeSlide) {
            this.setState({
              isReverse: false
            });
            a = slidesToShow * -100;
            if (activeSlide === slidesToShow) {
              this.setState({
                isReverse: false
              });
              a = slidesToShow * -100;
            }
          }
        }
      }

      return a;
    };

    const keyframes = `@-webkit-keyframes ${slideAnimation} {
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
    const {
      sliderWidth,
      slidePosition,
      animatedSwipe,
    } = this.state;

    this.positionDiff = {
      x: this.touchPositionStart.x - this.touchPositionCurrent.x,
    };
    if (Math.abs(this.positionDiff.x) >= 100 && this.touchTimeEnd - this.touchTimeStart !== 0) {
      if (this.positionDiff.x > 100) {
        this._handlNextSlideClick();
      } else {
        this._handlPrevSlideClick();
      }
    } else {
      if (animatedSwipe) {
        const position = slidePosition - this.positionDiff.x * 100 / sliderWidth;
        this.setState({
          slidePosition: position
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
    const {
      sliderWidth,
      animatedSwipe,
      slidesToShow,
      slidePosition,
    } = this.state;
    let shift;

    if (this.touchPositionStart && slidesToShow !== this._initSlides.length) {
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
        const position = slidePosition + (shift.x * 100 / sliderWidth);
        this.setState({
          slidePosition: position
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
      isDisabled,
      isInfinite,
      isCaption,
      isIndicators,
      isArrows,
      slidePosition,
      slidesToShow,
      sliderWidth,
      sliderHeight,
      slideAnimation,
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
              animationName: slideAnimation,
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
                onAnimationEnd={() => this._handleSlideAnim()}
                id={index + activeSlide}
                style={!isInfinite && index < slidesToShow ||
                  !isInfinite && index > (this._initSlides.length - 1) + slidesToShow ?
                  styleHidden :
                  style}
              >
                {it}
              </div>
            );
          })}

        </div>

        {!isArrows || this._modifiedSlides.length === 1 || slidesToShow === this._initSlides.length ? `` :
          <Arrows
            activeSlide={activeSlide}
            isInfinite={isInfinite}
            isDisabled={isDisabled}
            slides={this._initSlides}
            slidesToShow={slidesToShow}
            indicators={this._indicators}
            onLeftArrowClick={this._handlPrevSlideClick}
            onRightArrowClick={this._handlNextSlideClick}
            onMouseOverHandler={this._handleMouseOver}
          />}
        {!isIndicators || this._initSlides.length === slidesToShow ? `` :
          <SlideIndicators
            activeSlide={activeSlide}
            isInfinite={isInfinite}
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
  infinite: PropTypes.bool,
  caption: PropTypes.bool,
  autoplay: PropTypes.bool,
  indicators: PropTypes.bool,
  arrows: PropTypes.bool,
  adaptiveSlides: PropTypes.bool,
  animatedSwipe: PropTypes.bool,
  slidesCount: PropTypes.number
};

export default Slider;
