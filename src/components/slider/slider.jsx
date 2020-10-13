import React from "react";
import PropTypes from "prop-types";
import Arrows from "../arrows/arrows.jsx";
import SlideIndicators from "../slide-indicators/slide-indicators.jsx";
import {
  getSlidesCount,
  getSlideData,
  getBackground,
} from "../../utils/common.js";
import {
  INTERVAL_TIME,
  SwipeSensitivity,
  SlidePosition,
} from "../../const.js";
class Slider extends React.Component {
  constructor(props) {
    super(props);

    this._initSlides = React.Children.toArray(this.props.children);
    this._modifiedSlides = [];
    this._indicators = [];
    this._timer = null;
    this._slidesToShow = this.props.adaptiveSlides ? getSlidesCount(this.props.slidesCount) : this.props.slidesCount;
    this.positionDiff = null;
    this.styleSheet = document.styleSheets[0];

    this.sliderRef = React.createRef();
    this.slideRef = React.createRef();

    this.state = {
      activeSlide: this._slidesToShow,
      isInfinite: this.props.infinite || false,
      isCaption: this.props.caption || false,
      isDisabled: false,
      isAutoplay: this.props.autoplay || false,
      isIndicators: this.props.indicators || false,
      isArrows: this.props.arrows || false,
      isAdaptive: this.props.adaptiveSlides || false,
      isReverse: false,
      isAnimatedSwipe: this.props.animatedSwipe || false,
      sliderWidth: parseInt(this.props.width, 10) || ``,
      sliderHeight: parseInt(this.props.height, 10) || ``,
      slidePosition: SlidePosition.INITIAL,
      slidesToShow: this._slidesToShow,
      slideAnimation: ``
    };

    this._handlPrevSlideClick = this._handlPrevSlideClick.bind(this);
    this._handlNextSlideClick = this._handlNextSlideClick.bind(this);
    this._handleSlideIndicatorClick = this._handleSlideIndicatorClick.bind(this);
    this._pauseAutoplay = this._pauseAutoplay.bind(this);
    this._updateWindowDimensions = this._updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    // if (this._initSlides.length % this.state.slidesToShow !== 0) {
    //   this._initSlides.push(this._initSlides[0]);
    // }
    this._setupSlider();
    this.sliderRef.addEventListener(`mouseleave`, (evt) => this.leaveZone(evt));
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
        this._resetAutoplayPrevInterval();
      } else if (activeSlide === slidesToShow) {
        this._resetAutoplayNextInterval();
      }
    }
    if (isAutoplay && isInfinite) {
      this._resetAutoplayNextInterval();
    }
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this._updateWindowDimensions);
    this.sliderRef.removeEventListener(`mouseleave`, (evt) => this.leaveZone(evt));
    clearInterval(this._timer);
    this._timer = null;
  }

  _buildSlides() {
    const {slidesToShow} = this.state;
    const firstElement = this._initSlides[0];
    const lastElement = this._initSlides[this._initSlides.length - 1];
    const firstCloneArray = this._initSlides.slice(0, slidesToShow + 1);
    const lastCloneArray = this._initSlides.slice(this._initSlides.length - slidesToShow);
    // const corrected = this._initSlides.slice(this._initSlides.length - slidesToShow + 1);

    if (this._modifiedSlides.length) {
      this._modifiedSlides = [];
    }
    switch (true) {
      case slidesToShow > 1:
        this._modifiedSlides = [...lastCloneArray, ...this._initSlides, ...firstCloneArray];
        // if (this._initSlides.length % 2 !== 0) {
        //   this._modifiedSlides = [...corrected, ...this._initSlides, ...firstCloneArray];
        // }
        break;
      default:
        if (this._initSlides.length === 1) {
          this._modifiedSlides = [...this._initSlides];
          this.setState({
            activeSlide: slidesToShow - 1,
            slidePosition: 0
          });
          return;
        }
        this._modifiedSlides = [lastElement, ...this._initSlides, firstElement];
        break;
    }

    this.setState({
      activeSlide: slidesToShow,
      slidePosition: SlidePosition.INITIAL,
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
      slidePosition: SlidePosition.INITIAL
    });

    this._buildSlides();
    this._buildIndicators();
  }

  // atoplay handlers ---------------------------------------------------------
  _startAutoplay() {
    const {isAutoplay} = this.state;

    if (isAutoplay && this._initSlides.length !== 1) {
      this._timer = setInterval(this._handlNextSlideClick, INTERVAL_TIME);
    }
  }

  _pauseAutoplay() {
    clearInterval(this._timer);
    this._timer = null;
  }

  _resumeAutoplay() {
    const {
      isAutoplay,
      isInfinite,
      isReverse,
    } = this.state;

    if (isAutoplay && !isInfinite) {
      if (isReverse) {
        this._resetAutoplayPrevInterval();
      }
      if (!isReverse) {
        this._resetAutoplayNextInterval();
      }
    }

    if (isAutoplay && isInfinite) {
      this.setState({
        isReverse: false
      });
      this._resetAutoplayNextInterval();
    }
  }

  _resetAutoplayPrevInterval() {
    clearInterval(this._timer);
    this._timer = null;
    this._timer = setInterval(this._handlPrevSlideClick, INTERVAL_TIME);
  }

  _resetAutoplayNextInterval() {
    clearInterval(this._timer);
    this._timer = null;
    this._timer = setInterval(this._handlNextSlideClick, INTERVAL_TIME);
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
      isAnimatedSwipe
    } = this.state;

    const positionCorrection = this.positionDiff ? this.positionDiff.x * 100 / sliderWidth : false;
    const lastSlide = (this._indicators.length - 1) + slidesToShow;

    let position = this.positionDiff && isAnimatedSwipe ? Math.round(slidePosition - ((positionCorrection))) : slidePosition;
    let currentSlide = activeSlide;

    switch (true) {
      case !isInfinite &&
            currentSlide === slidesToShow ||
            this._modifiedSlides.length === 1 ||
            slidesToShow === this._initSlides.length:
        currentSlide = currentSlide;
        position = position;
        break;
      case position === SlidePosition.INITIAL:
        currentSlide = lastSlide;
        position = ((this._indicators.length) * 100);
        break;
      default:
        currentSlide = currentSlide - 1;
        position -= SlidePosition.STEP;
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
      isAnimatedSwipe
    } = this.state;

    const positionCorrection = this.positionDiff ? this.positionDiff.x * 100 / sliderWidth : 0;
    let position = this.positionDiff && isAnimatedSwipe ? Math.round(slidePosition - ((positionCorrection))) : slidePosition;
    let currentSlide = activeSlide;

    switch (true) {
      case !isInfinite &&
            currentSlide === this._indicators.length + slidesToShow - 1 ||
            this._modifiedSlides.length === 1 ||
            slidesToShow === this._initSlides.length:
        currentSlide = currentSlide;
        position = position;
        break;
      case position === SlidePosition.INITIAL * Math.ceil((this._initSlides.length) / slidesToShow):
        currentSlide = slidesToShow;
        position = SlidePosition.INITIAL;
        break;
      default:
        currentSlide = currentSlide + 1;
        position += SlidePosition.STEP;
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
        const position = ((id - slidesToShow + 1) * SlidePosition.STEP);
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
      isAnimatedSwipe,
      activeSlide
    } = this.state;
    const slideAnimation = `animation${Math.round(Math.random() * 100)}`;

    const animateSlide = () => {
      const lastSlide = (this._indicators.length - 1) + slidesToShow;
      const endPosition = (this._indicators.length - 1) * 100;
      const startAnimationPosition = slidesToShow * 100;
      let a = ``;

      if (this.positionDiff) {
        if (this.positionDiff.x > SwipeSensitivity.MIN) {
          if (slidePosition >= endPosition) {
            this.setState({
              isReverse: true
            });
          }
          // a = startAnimationPosition;
        }
        if (this.positionDiff.x < SwipeSensitivity.MIN) {
          if (activeSlide - 1 === slidesToShow) {
            this.setState({
              isReverse: false
            });
          }
          // a = -startAnimationPosition;
        }
      }

      // if (this.positionDiff && isAnimatedSwipe) {
      //   const positionCorrection = this.positionDiff.x * 100 / sliderWidth;

      //   if (this.positionDiff.x < SwipeSensitivity.MAX && this.positionDiff.x > -SwipeSensitivity.MAX ||
      //     !isInfinite && slidePosition < SlidePosition.INITIAL ||
      //     !isInfinite && slidePosition > (this._indicators.length * 100)) {
      //     a = -slidesToShow * positionCorrection;

      //   } else {
      //     a = this.positionDiff.x > SwipeSensitivity.MIN ?
      //       Math.round(startAnimationPosition - (positionCorrection) * slidesToShow) :
      //       -Math.round(startAnimationPosition + (positionCorrection) * slidesToShow);
      //   }
      // }

      if (this.positionDiff && isAnimatedSwipe) {
        const positionCorrection = this.positionDiff.x * 100 / sliderWidth;
        if (this.positionDiff.x < SwipeSensitivity.MAX && this.positionDiff.x > -SwipeSensitivity.MAX ||
          !isInfinite && slidePosition < SlidePosition.INITIAL ||
          !isInfinite && slidePosition > (this._indicators.length * 100)) {
          a = -slidesToShow * positionCorrection;
        } else {
          if (this.positionDiff.x > SwipeSensitivity.MIN) {
            a = Math.round(startAnimationPosition - (positionCorrection) * slidesToShow);
            if (this._initSlides.length % slidesToShow !== 0 && activeSlide === lastSlide) {
              a = ((this._initSlides.length - (Math.floor(this._initSlides.length / slidesToShow) * slidesToShow)) * 100) - (positionCorrection * slidesToShow);
            }
          } else if (this.positionDiff.x < SwipeSensitivity.MIN) {
            a = -Math.round(startAnimationPosition + (positionCorrection) * slidesToShow);
            if (this._initSlides.length % slidesToShow !== 0 && activeSlide === slidesToShow) {
              a = -(((this._initSlides.length - (Math.floor(this._initSlides.length / slidesToShow) * slidesToShow)) * 100)) - (positionCorrection * slidesToShow);
            }
          }
        }
      }

      if (this.positionDiff && !isAnimatedSwipe && !isInfinite) {
        if (activeSlide === slidesToShow && this.positionDiff.x < SwipeSensitivity.MIN ||
          activeSlide === lastSlide && this.positionDiff.x > SwipeSensitivity.MIN) {
          a = false;
        }
      }

      if (!this.positionDiff && isAutoplay && !isReverse && isInfinite) {
        a = startAnimationPosition;
      }

      if (!this.positionDiff && isAutoplay && !isReverse && !isInfinite) {
        if (slidePosition === endPosition) {
          this.setState({
            isReverse: true
          });
        }
        a = startAnimationPosition;
      }

      if (!this.positionDiff && isAutoplay && isReverse && !isInfinite) {
        if (activeSlide - 1 === slidesToShow) {
          this.setState({
            isReverse: false
          });
        }
        a = -startAnimationPosition;
      }

      if (!this.positionDiff) {
        if (evt) {

          if (evt.currentTarget.classList[1] === `arrows__next`) {
            a = startAnimationPosition;
            if (activeSlide === lastSlide) {
              a = this._initSlides.length % slidesToShow !== 0 ?
                (this._initSlides.length - (Math.floor(this._initSlides.length / slidesToShow) * slidesToShow)) * 100 :
                startAnimationPosition;
            }
            if (isAutoplay) {
              this.setState({
                isReverse: true
              });
            }
          }
          if (evt.currentTarget.classList[1] === `arrows__prev`) {
            a = -startAnimationPosition;
            if (activeSlide === slidesToShow) {
              a = this._initSlides.length % slidesToShow !== 0 ?
                -(this._initSlides.length - (Math.floor(this._initSlides.length / slidesToShow) * slidesToShow)) * 100 :
                -startAnimationPosition;
            }
            if (isAutoplay) {
              this.setState({
                isReverse: false
              });
            }
          }

          if (parseInt(evt.currentTarget.id, 10) + slidesToShow - activeSlide === 1) {
            a = startAnimationPosition;
          } else if (parseInt(evt.currentTarget.id, 10) + slidesToShow - activeSlide > 1) {
            a = slidesToShow === 1 ?
              (((parseInt(evt.target.id, 10) + 1) - activeSlide) * slidesToShow) * 100 :
              ((parseInt(evt.currentTarget.id, 10) - (activeSlide - slidesToShow)) * slidesToShow) * 100;
          }
          if (parseInt(evt.currentTarget.id, 10) + slidesToShow - activeSlide === -1) {
            a = -startAnimationPosition;
          } else if (parseInt(evt.currentTarget.id, 10) + slidesToShow - activeSlide < -1) {
            a = slidesToShow === 1 ?
              (((parseInt(evt.target.id, 10) + 1) - activeSlide) * slidesToShow) * 100 :
              ((parseInt(evt.currentTarget.id, 10) - (activeSlide - slidesToShow)) * slidesToShow) * 100;
          }
        }
      }
      // console.log(`slidePosition : ` + slidePosition);
      // console.log(`id : ` + evt.target.id);
      // console.log(`activeSlide : ` + activeSlide);
      // console.log(`slidesToShow : ` + slidesToShow);
      // console.log(`initSlides : ` + this._initSlides.length);
      // console.log(`indicators : ` + this._indicators.length);
      // console.log(`DIFF : ` + a);
      return a;
    };

    const keyframes = `@keyframes ${slideAnimation} {
      0% {transform:translate(${animateSlide()}%)}
      100% {transform:translate(${0}%)}
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
      isAnimatedSwipe,
    } = this.state;

    this.positionDiff = {
      x: this.touchPositionStart.x - this.touchPositionCurrent.x,
    };
    if (Math.abs(this.positionDiff.x) >= SwipeSensitivity.MAX && this.touchTimeEnd - this.touchTimeStart !== 0) {
      if (this.positionDiff.x > SwipeSensitivity.MAX) {
        this._handlNextSlideClick();
      } else {
        this._handlPrevSlideClick();
      }
    } else {
      if (isAnimatedSwipe) {
        const positionCorrection = this.positionDiff.x * 100 / sliderWidth;
        const position = slidePosition - positionCorrection;
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
    if (evt.clientX > this.sliderRef.offsetWidth ||
      evt.clientX < this.sliderRef.offsetWidth ||
      evt.clientY > this.sliderRef.offsetHeight ||
      evt.clientY < this.sliderRef.offsetHeight) {
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
      isAnimatedSwipe,
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


      if (isAnimatedSwipe) {
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
    const slideData = getSlideData(this._modifiedSlides);

    return (
      <section
        className="slider"
        style={{
          maxWidth: sliderWidth,
        }}
        onMouseOver={this._pauseAutoplay}
        onMouseOut={() => this._resumeAutoplay()}
        ref={(ref) => {
          this.sliderRef = ref;
        }}
      >
        <div
          className={`slide`}
          onMouseDown={(evt) => this.touchStart(evt)}
          onMouseMove={(evt) => this.touchMove(evt)}
          onMouseUp={(evt) => this.touchEnd(evt)}
          onTouchStart={(evt) => this.touchStart(evt)}
          onTouchMove={(evt) => this.touchMove(evt)}
          onTouchEnd={(evt) => this.touchEnd(evt)}
        >
          {slideData.map((it, index) => {
            let style = {
              animationName: slideAnimation,
              animationTimingFunction: `ease-in-out`,
              animationDuration: `1s`,
              color: `${!getBackground(it) ? `black` : `white`}`,
              minWidth: `${100 / slidesToShow}%`,
              height: sliderHeight,
              left: `-${slidePosition}%`,
              backgroundImage: `url(${getBackground(it)})`,
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
                ref={(ref) => {
                  this.slideRef = ref;
                }}
              >
                {it}
              </div>
            );
          })}

        </div>

        {!isArrows || this._initSlides.length <= slidesToShow || slidesToShow === this._initSlides.length ? `` :
          <Arrows
            activeSlide={activeSlide}
            isInfinite={isInfinite}
            isDisabled={isDisabled}
            slides={this._initSlides}
            slidesToShow={slidesToShow}
            indicators={this._indicators}
            onLeftArrowClick={this._handlPrevSlideClick}
            onRightArrowClick={this._handlNextSlideClick}
            onMouseOverHandler={this._pauseAutoplay}
          />}
        {!isIndicators || this._initSlides.length <= slidesToShow ? `` :
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
  slidesCount: PropTypes.number,
};

export default Slider;
