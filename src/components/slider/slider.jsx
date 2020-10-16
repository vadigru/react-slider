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
  AUTOPLAY_DELAY,
  TIMEOUT_DELAY,
  SwipeSensitivity,
  SlidePosition,
} from "../../const.js";
class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.initSlides = React.Children.toArray(this.props.children);
    this.modifiedSlides = [];
    this.indicators = [];
    this.slidesCount = this.props.adaptiveSlides ? getSlidesCount(this.props.slidesCount) : this.props.slidesCount;
    this.slideRef = React.createRef();

    this.timer = null;
    this.touchTimeStart = null;
    this.touchTimeEnd = null;
    this.positionDiff = null;
    this.styleSheet = document.styleSheets[0];

    this.state = {
      activeSlide: this.slidesCount,
      autoplayDelay: this.props.autoplayDelay || AUTOPLAY_DELAY,
      isInfinite: this.props.infinite || false,
      isCaption: this.props.caption || false,
      isDisabled: false,
      isAutoplay: this.props.autoplay || false,
      isIndicators: this.props.indicators || false,
      isArrows: this.props.arrows || false,
      isAdaptive: this.props.adaptiveSlides || false,
      isReverse: false,
      isAnimatedSwipe: this.props.animatedSwipe || false,
      isDragging: false,
      sliderWidth: parseInt(this.props.width, 10) || ``,
      sliderHeight: parseInt(this.props.height, 10) || ``,
      slidePosition: SlidePosition.INITIAL,
      slidesToShow: this.slidesCount,
      slideAnimation: ``
    };

    this.handlPrevSlideClick = this.handlPrevSlideClick.bind(this);
    this.handlNextSlideClick = this.handlNextSlideClick.bind(this);
    this.handleSlideIndicatorClick = this.handleSlideIndicatorClick.bind(this);
    this.pauseAutoplay = this.pauseAutoplay.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.setupSlider();
    this.slideRef.addEventListener(`mouseleave`, (evt) => this.leaveZone(evt));
  }

  componentDidUpdate() {
    const {
      activeSlide,
      isAutoplay,
      isInfinite,
      slidesToShow
    } = this.state;
    const lastSlide = (this.indicators.length - 1) + slidesToShow;

    if (isAutoplay && !isInfinite) {
      if (activeSlide === lastSlide) {
        this.resetAutoplayPrevInterval();
      } else if (activeSlide === slidesToShow) {
        this.resetAutoplayNextInterval();
      }
    }
    if (isAutoplay && isInfinite) {
      this.resetAutoplayNextInterval();
    }
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this.updateWindowDimensions);
    this.slideRef.removeEventListener(`mouseleave`, (evt) => this.leaveZone(evt));
    clearInterval(this.timer);
    this.timer = null;
  }

  buildSlides() {
    const {slidesToShow} = this.state;
    const firstElement = this.initSlides[0];
    const lastElement = this.initSlides[this.initSlides.length - 1];
    const firstCloneArray = this.initSlides.slice(0, slidesToShow + 1);
    const lastCloneArray = this.initSlides.slice(this.initSlides.length - slidesToShow);

    if (this.modifiedSlides.length) {
      this.modifiedSlides = [];
    }
    switch (true) {
      case slidesToShow > 1:
        this.modifiedSlides = [...lastCloneArray, ...this.initSlides, ...firstCloneArray];
        break;
      default:
        if (this.initSlides.length === 1) {
          this.modifiedSlides = [...this.initSlides];
          this.setState({
            activeSlide: slidesToShow - 1,
            slidePosition: 0
          });
          return;
        }
        this.modifiedSlides = [lastElement, ...this.initSlides, firstElement];
        break;
    }

    this.setState({
      activeSlide: slidesToShow,
      slidePosition: SlidePosition.INITIAL,
    });
  }

  buildIndicators() {
    const {slidesToShow} = this.state;

    if (this.indicators !== []) {
      this.indicators = [];
    }
    for (let i = 0; i < Math.ceil(this.initSlides.length / slidesToShow); i++) {
      this.indicators.push(i);
    }
  }

  setupSlider() {
    this.buildSlides();
    this.buildIndicators();
    this.startAutoplay();
    this.updateWindowDimensions();
    window.addEventListener(`resize`, this.updateWindowDimensions);
  }

  updateWindowDimensions() {
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

    this.buildSlides();
    this.buildIndicators();
  }

  // atoplay handlers ---------------------------------------------------------
  startAutoplay() {
    const {isAutoplay, autoplayDelay} = this.state;

    if (isAutoplay && this.initSlides.length !== 1) {
      this.timer = setInterval(this.handlNextSlideClick, autoplayDelay);
    }
  }

  pauseAutoplay() {
    clearInterval(this.timer);
    this.timer = null;
  }

  resumeAutoplay() {
    const {
      isAutoplay,
      isInfinite,
      isReverse,
    } = this.state;

    if (isAutoplay && !isInfinite) {
      if (isReverse) {
        this.resetAutoplayPrevInterval();
      }
      if (!isReverse) {
        this.resetAutoplayNextInterval();
      }
    }
    if (isAutoplay && isInfinite) {
      this.setState({
        isReverse: false
      });
      this.resetAutoplayNextInterval();
    }
  }

  resetAutoplayPrevInterval() {
    const {autoplayDelay} = this.state;
    clearInterval(this.timer);
    this.timer = null;
    this.timer = setInterval(this.handlPrevSlideClick, autoplayDelay);
  }

  resetAutoplayNextInterval() {
    const {autoplayDelay} = this.state;
    clearInterval(this.timer);
    this.timer = null;
    this.timer = setInterval(this.handlNextSlideClick, autoplayDelay);
  }

  // slider navigation handlers -----------------------------------------------
  handlPrevSlideClick(evt) {
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
    const lastSlide = (this.indicators.length - 1) + slidesToShow;

    let position = this.positionDiff && isAnimatedSwipe ? Math.round(slidePosition - positionCorrection) : slidePosition;
    let currentSlide = activeSlide;

    switch (true) {
      case !isInfinite &&
            currentSlide === slidesToShow ||
            this.modifiedSlides.length === 1 ||
            slidesToShow === this.initSlides.length:
        currentSlide = currentSlide;
        position = position;
        break;
      case position === SlidePosition.INITIAL:
        currentSlide = lastSlide;
        position = ((this.indicators.length) * 100);
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

  handlNextSlideClick(evt) {
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
    let position = this.positionDiff && isAnimatedSwipe ? Math.round(slidePosition - positionCorrection) : slidePosition;
    let currentSlide = activeSlide;

    switch (true) {
      case !isInfinite &&
            currentSlide === this.indicators.length + slidesToShow - 1 ||
            this.modifiedSlides.length === 1 ||
            slidesToShow === this.initSlides.length:
        currentSlide = currentSlide;
        position = position;
        break;
      case position === SlidePosition.INITIAL * Math.ceil((this.initSlides.length) / slidesToShow):
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

  handleSlideIndicatorClick(evt) {
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
  handleSlideAnim() {
    const {slideAnimation} = this.state;

    setTimeout(() => {
      if (this.styleSheet.cssRules[this.styleSheet.cssRules.length - 1].name === slideAnimation) {
        this.styleSheet.deleteRule(this.styleSheet.cssRules.length - 1);
      }
      this.setState({
        isDisabled: false,
      });
    }, TIMEOUT_DELAY);
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
      const lastSlide = (this.indicators.length - 1) + slidesToShow;
      const startAnimationPosition = slidesToShow * 100;
      const alternativeAnimationPosition = (this.initSlides.length - (Math.floor(this.initSlides.length / slidesToShow) * slidesToShow)) * 100;
      let a = ``;

      // autoplay handle ------------------------------------------------------
      if (isAutoplay && !isInfinite) {
        if (!isReverse) {
          if (!evt && activeSlide + 1 === lastSlide) {
            this.setState({
              isReverse: true
            });
          }
          a = startAnimationPosition;
        }
        if (isReverse) {
          if (!evt && activeSlide - 1 === slidesToShow) {
            this.setState({
              isReverse: false
            });
          }
          a = -startAnimationPosition;
        }

      }

      // navigation arrows click handle -----------------------------------
      if ((evt && evt.currentTarget.classList[1] === `arrows__next`) ||
          (this.positionDiff && this.positionDiff.x > SwipeSensitivity.MIN) ||
          (isAutoplay && !isReverse && isInfinite)) {
        a = startAnimationPosition;
        if (activeSlide === lastSlide) {
          a = this.initSlides.length % slidesToShow !== 0 ?
            alternativeAnimationPosition :
            startAnimationPosition;
        }
      }
      if ((evt && evt.currentTarget.classList[1] === `arrows__prev`) ||
          (this.positionDiff && this.positionDiff.x < SwipeSensitivity.MIN)) {
        a = -startAnimationPosition;
        if (activeSlide === slidesToShow) {
          a = this.initSlides.length % slidesToShow !== 0 ?
            -alternativeAnimationPosition :
            -startAnimationPosition;
        }
      }

      if (evt) {
        const id = parseInt(evt.target.id, 10);
        // slide indicators click handle ------------------------------------
        if (id + slidesToShow - activeSlide === 1) {
          a = startAnimationPosition;
        } else if (id + slidesToShow - activeSlide === -1) {
          a = -startAnimationPosition;
        }
        if (id + slidesToShow - activeSlide > 1 ||
                   id + slidesToShow - activeSlide < -1) {
          a = slidesToShow === 1 ?
            (((id + 1) - activeSlide) * slidesToShow) * 100 :
            ((id - (activeSlide - slidesToShow)) * slidesToShow) * 100;
        }
        if (id + slidesToShow - activeSlide >= 1 && parseInt(evt.target.id, 10) === this.indicators.length - 1) {
          this.setState({
            isReverse: true
          });
        }
        if (id + slidesToShow - activeSlide <= -1 && parseInt(evt.target.id, 10) + slidesToShow === slidesToShow) {
          this.setState({
            isReverse: false
          });
        }
      }

      // animated swipe handle ------------------------------------------------
      if (this.positionDiff && isAnimatedSwipe) {
        const positionCorrection = Math.round(this.positionDiff.x * 100 / sliderWidth);
        // stop switching slides on the first or last slide when infinity mode is on
        if (this.positionDiff.x < SwipeSensitivity.MAX && this.positionDiff.x > -SwipeSensitivity.MAX ||
          !isInfinite && slidePosition < SlidePosition.INITIAL ||
          !isInfinite && slidePosition > (this.indicators.length * 100)) {
          a = -slidesToShow * positionCorrection;
        } else {
          // next/prev slide switching --------------------------------------
          if (this.positionDiff.x > SwipeSensitivity.MIN) {
            a = startAnimationPosition - positionCorrection * slidesToShow;
            if (this.initSlides.length % slidesToShow !== 0 && activeSlide === lastSlide) {
              a = alternativeAnimationPosition - (positionCorrection * slidesToShow);
            }
          }
          if (this.positionDiff.x < SwipeSensitivity.MIN) {
            a = -startAnimationPosition - positionCorrection * slidesToShow;
            if (this.initSlides.length % slidesToShow !== 0 && activeSlide === slidesToShow) {
              a = -alternativeAnimationPosition - positionCorrection * slidesToShow;
            }
          }
        }
      }

      // stop switching slides on the first or last slide when infinity mode is off ------
      if (this.positionDiff && !isAnimatedSwipe && !isInfinite) {
        if (activeSlide === slidesToShow && this.positionDiff.x < SwipeSensitivity.MIN ||
          activeSlide === lastSlide && this.positionDiff.x > SwipeSensitivity.MIN) {
          a = false;
        }
      }

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
        this.handlNextSlideClick();
      } else {
        this.handlPrevSlideClick();
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
    this.pauseAutoplay();
  }

  touchMove(evt) {
    const {
      sliderWidth,
      isAnimatedSwipe,
      slidesToShow,
      slidePosition,
    } = this.state;
    let shift;

    if (this.touchPositionStart && slidesToShow !== this.initSlides.length) {
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
          slidePosition: position,
          isDragging: true
        });
      }
    }
  }

  touchEnd(evt) {
    const {isAnimatedSwipe} = this.state;
    evt.preventDefault();
    if (this.touchTimeStart) {
      this.touchTimeEnd = evt.timeStamp;
      this.checkAction();
      this.touchPositionStart = null;
      this.touchPositionCurrent = null;
    }
    if (isAnimatedSwipe) {
      this.setState({
        isDragging: false
      });
    }
    this.resumeAutoplay();
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
    const slideData = getSlideData(this.modifiedSlides);

    return (
      <section
        className="slider"
        style={{
          maxWidth: sliderWidth,
        }}
        onMouseOver={this.pauseAutoplay}
        onMouseOut={() => this.resumeAutoplay()}
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
              animationTimingFunction: `ease`,
              animationDuration: `0.75s`,
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
                onAnimationEnd={() => this.handleSlideAnim()}
                id={index + activeSlide}
                style={!isInfinite && index < slidesToShow ||
                  !isInfinite && index > (this.initSlides.length - 1) + slidesToShow ?
                  styleHidden :
                  style}
              >
                {it}
              </div>
            );
          })}

        </div>

        {!isArrows || this.initSlides.length <= slidesToShow || slidesToShow === this.initSlides.length ? `` :
          <Arrows
            activeSlide={activeSlide}
            isInfinite={isInfinite}
            isDisabled={isDisabled}
            isDragging={this.state.isDragging}
            slides={this.initSlides}
            slidesToShow={slidesToShow}
            indicators={this.indicators}
            onLeftArrowClick={this.handlPrevSlideClick}
            onRightArrowClick={this.handlNextSlideClick}
            onMouseOverHandler={this.pauseAutoplay}
          />}
        {!isIndicators || this.initSlides.length <= slidesToShow ? `` :
          <SlideIndicators
            activeSlide={activeSlide}
            isInfinite={isInfinite}
            isCaption={isCaption}
            slides={this.initSlides}
            slidesToShow={slidesToShow}
            indicators={this.indicators}
            onIndicatorDotClick={this.handleSlideIndicatorClick}
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
  autoplayDelay: PropTypes.number,
  indicators: PropTypes.bool,
  arrows: PropTypes.bool,
  adaptiveSlides: PropTypes.bool,
  animatedSwipe: PropTypes.bool,
  slidesCount: PropTypes.number,
};

export default Slider;
