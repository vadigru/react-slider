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
  INDICATORS_HEIGHT,
  SwipeSensitivity,
  SlidePosition,
} from "../../const.js";
class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.indicators = [];
    this.initSlides = React.Children.toArray(this.props.children);
    this.modifiedSlides = [];
    this.positionDiff = null;
    this.slidesCount = this.props.adaptiveSlides ? getSlidesCount(this.props.slidesCount, window.innerWidth) : this.props.slidesCount || 1;
    this.slideRef = null;
    this.styleSheet = document.styleSheets[0];
    this.timer = null;
    this.touchTimeEnd = null;
    this.touchTimeStart = null;
    this.demoMode = this.props.demoMode || false;

    this.state = {
      activeSlide: this.slidesCount,
      autoplayDelay: this.props.autoplayDelay || AUTOPLAY_DELAY,
      isCaption: this.props.caption || false,
      isDisabled: false,
      isAdaptive: this.props.adaptiveSlides || false,
      isAnimatedSwipe: this.props.animatedSwipe || false,
      isArrows: this.props.arrows || false,
      isAutoplay: this.props.autoplay || false,
      isIndicators: this.props.indicators || false,
      isInfinite: this.props.infinite || false,
      isReverse: false,
      isDragging: false,
      slideAnimation: ``,
      slidePosition: SlidePosition.INITIAL,
      sliderWidth: this.props.width || 0,
      sliderHeight: this.props.height || 0,
      slidesToShow: this.slidesCount,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handlNextSlideClick = this.handlNextSlideClick.bind(this);
    this.handlPrevSlideClick = this.handlPrevSlideClick.bind(this);
    this.handleSlideIndicatorClick = this.handleSlideIndicatorClick.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onAnimationEnd = this.onAnimationEnd.bind(this);
    this.onMouseOverPauseAutoplay = this.onMouseOverPauseAutoplay.bind(this);
    this.onMouseOutResumeAutoplay = this.onMouseOutResumeAutoplay.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

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
    this.captionRef = React.createRef();
    this.slidesCountRef = React.createRef();
    // bindings for visualized settings ---------------------------------------
    this.setWidth = this.setWidth.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.toggleInfinite = this.toggleInfinite.bind(this);
    this.toggleAutoplay = this.toggleAutoplay.bind(this);
    this.changeAutoplayDelay = this.changeAutoplayDelay.bind(this);
    this.toggleIndicators = this.toggleIndicators.bind(this);
    this.toggleArrows = this.toggleArrows.bind(this);
    this.toggleAdaptive = this.toggleAdaptive.bind(this);
    this.toggleAnimatedSwipe = this.toggleAnimatedSwipe.bind(this);
    this.toggleCaption = this.toggleCaption.bind(this);
    this.changeSlidesCount = this.changeSlidesCount.bind(this);
  }

  // togglers for isualised settings -----------------------------------------
  setWidth(value) {
    this.setState({sliderWidth: parseInt(value, 10)});
  }
  setHeight(value) {
    this.setState({sliderHeight: parseInt(value, 10)});
  }
  toggleInfinite() {
    this.setState({isInfinite: !this.state.isInfinite});
  }
  toggleAutoplay() {
    if (this.state.isAutoplay === false) {
      this.setState({isAutoplay: true});
      this.timer = setInterval(this.handlNextSlideClick, this.autoplayDelay);
    } else {
      this.setState({isAutoplay: false});
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  changeAutoplayDelay(value) {
    if (this.state.isAutoplay === true) {
      clearInterval(this.timer);
      this.timer = null;
      this.timer = setInterval(this.handlNextSlideClick, value);
    }
    this.setState({autoplayDelay: value});
  }
  toggleIndicators() {
    this.setState({isIndicators: !this.state.isIndicators});
  }
  toggleArrows() {
    this.setState({isArrows: !this.state.isArrows});
  }
  toggleAdaptive() {
    this.setState({isAdaptive: !this.state.isAdaptive});
  }
  toggleAnimatedSwipe() {
    this.setState({isAnimatedSwipe: !this.state.isAnimatedSwipe});
  }
  toggleCaption() {
    this.setState({isCaption: !this.state.isCaption});
  }
  changeSlidesCount(value) {
    this.slidesCount = parseInt(value, 10);
    this.setState({
      activeSlide: this.slidesCount,
      slidesToShow: this.slidesCount
    });
    this.buildIndicators(this.slidesCount);
    this.buildSlides(this.slidesCount);
  }
  // --------------------------------------------------------------------------

  componentDidMount() {
    this.setupSlider();
  }

  componentDidUpdate() {
    const {
      activeSlide,
      isAutoplay,
      isInfinite,
      slidesToShow,
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
    this.slideRef.removeEventListener(`mouseleave`, (evt) => this.leaveSlideZone(evt));
    clearInterval(this.timer);
    this.timer = null;
  }

  buildSlides(count) {
    const {isAdaptive} = this.state;
    const firstElement = this.initSlides[0];
    const lastElement = this.initSlides[this.initSlides.length - 1];
    const firstCloneArray = this.initSlides.slice(0, count + 1);
    const lastCloneArray = this.initSlides.slice(this.initSlides.length - count);

    if (this.modifiedSlides.length) {
      this.modifiedSlides = [];
    }
    switch (true) {
      case count > 1:
        this.modifiedSlides = [...lastCloneArray, ...this.initSlides, ...firstCloneArray];
        break;
      default:
        if (this.initSlides.length === 1) {
          this.modifiedSlides = [...this.initSlides];
          this.setState({
            activeSlide: count - 1,
            slidePosition: 0
          });
          return;
        }
        this.modifiedSlides = [lastElement, ...this.initSlides, firstElement];
        break;
    }

    if (!isAdaptive && count !== 1) {
      return;
    }
    this.setState({
      activeSlide: count,
      slidePosition: SlidePosition.INITIAL,
    });
  }

  buildIndicators(count) {
    if (this.indicators !== []) {
      this.indicators = [];
    }
    for (let i = 0; i < Math.ceil(this.initSlides.length / count); i++) {
      this.indicators.push(i);
    }
  }

  setupSlider() {
    this.buildSlides(this.state.slidesToShow);
    this.buildIndicators(this.state.slidesToShow);
    this.startAutoplay();
    this.updateWindowDimensions();
    window.addEventListener(`resize`, this.updateWindowDimensions);
    if (this.slideRef) {
      this.slideRef.addEventListener(`mouseleave`, (evt) => this.leaveSlideZone(evt));
    }
  }

  updateWindowDimensions() {
    const {width, height} = this.props;
    const {isAdaptive, slidesToShow} = this.state;
    const updatedWidth = width < window.innerWidth ? width : window.innerWidth;
    const updatedHeight = height < window.innerHeight ? height : window.innerHeight;
    const updatedSlidesToShow = isAdaptive ? getSlidesCount(this.slidesCount, window.innerWidth) : slidesToShow;

    this.setState({
      isReverse: false,
      slidesToShow: updatedSlidesToShow,
      sliderWidth: updatedWidth,
      sliderHeight: updatedHeight,
    });
    this.buildSlides(updatedSlidesToShow);
    this.buildIndicators(updatedSlidesToShow);
  }

  // atoplay handlers ---------------------------------------------------------
  startAutoplay() {
    const {isAutoplay, autoplayDelay} = this.state;

    if (isAutoplay && this.initSlides.length !== 1) {
      this.timer = setInterval(this.handlNextSlideClick, autoplayDelay);
    }
  }

  onMouseOverPauseAutoplay() {
    const {isAutoplay} = this.state;
    if (isAutoplay) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  onMouseOutResumeAutoplay() {
    const {
      isAutoplay,
      isInfinite,
      isReverse,
    } = this.state;

    if (isAutoplay) {
      if (isReverse && !isInfinite) {
        this.resetAutoplayPrevInterval();
      }
      if (!isReverse && !isInfinite) {
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
    const {
      activeSlide,
      isAnimatedSwipe,
      isInfinite,
      slidesToShow,
      slidePosition,
      sliderWidth,
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
    this.setAnimation(evt);
  }

  handlNextSlideClick(evt) {
    const {
      activeSlide,
      isAnimatedSwipe,
      isInfinite,
      slidePosition,
      slidesToShow,
      sliderWidth,
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
    this.setAnimation(evt);
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
  onAnimationEnd() {
    const {slideAnimation} = this.state;
    if (this.styleSheet.cssRules[this.styleSheet.cssRules.length - 1].name === slideAnimation) {
      this.styleSheet.deleteRule(this.styleSheet.cssRules.length - 1);
    }
    this.setState({
      isDisabled: false,
      isDragging: false
    });
  }

  setAnimation(evt) {
    const {
      sliderWidth,
      isAutoplay,
      isAnimatedSwipe,
      isInfinite,
      isReverse,
      slidePosition,
      slidesToShow,
      activeSlide
    } = this.state;
    const slideAnimation = `animation${Math.round(Math.random() * 100)}`;

    const animateSlide = () => {
      const lastSlide = (this.indicators.length - 1) + slidesToShow;
      const startAnimationPosition = 100;
      const alternativeAnimationPosition = (this.initSlides.length - (Math.floor(this.initSlides.length / slidesToShow) * slidesToShow)) * 100;
      let a = ``;

      // autoplay handle ------------------------------------------------------
      if (isAutoplay && !isInfinite) {
        if (!isReverse) {
          if (!evt && activeSlide === lastSlide) {
            this.setState({
              isReverse: true
            });
          }
          a = startAnimationPosition;
        }
        if (isReverse) {
          if (!evt && activeSlide === slidesToShow) {
            this.setState({
              isReverse: false
            });
          }
          a = -startAnimationPosition;
        }

      }

      // navigation arrows click handle -----------------------------------
      if ((evt && evt.currentTarget.id === `arrow-next`) ||
          (this.positionDiff && this.positionDiff.x > SwipeSensitivity.MIN) ||
          (isAutoplay && !isReverse && isInfinite)) {
        a = startAnimationPosition;
        if (activeSlide === lastSlide) {
          a = this.initSlides.length % slidesToShow !== 0 ?
            alternativeAnimationPosition :
            startAnimationPosition;
        }
      }
      if ((evt && evt.currentTarget.id === `arrow-prev`) ||
          (this.positionDiff && this.positionDiff.x < SwipeSensitivity.MIN)) {
        a = -startAnimationPosition;
        if (activeSlide === slidesToShow) {
          a = this.initSlides.length % slidesToShow !== 0 ?
            -alternativeAnimationPosition :
            -startAnimationPosition;
        }
      }

      // slide indicators click handle ------------------------------------
      if (evt) {
        const target = evt.target;
        const id = parseInt(target.id, 10);
        if (id + slidesToShow - activeSlide === 1) {
          a = startAnimationPosition;
        } else if (id + slidesToShow - activeSlide === -1) {
          a = -startAnimationPosition;
        }
        if (id + slidesToShow - activeSlide > 1 ||
                   id + slidesToShow - activeSlide < -1) {
          a = slidesToShow === 1 ?
            (((id + 1) - activeSlide)) * 100 :
            ((id - (activeSlide - slidesToShow))) * 100;
        }
        if (id + slidesToShow - activeSlide >= 1 && id === this.indicators.length - 1) {
          this.setState({
            isReverse: true
          });
        }
        if (id + slidesToShow - activeSlide <= -1 && id + slidesToShow === slidesToShow) {
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
          a = -positionCorrection;
        } else {
          // next/prev slide switching --------------------------------------
          if (this.positionDiff.x > SwipeSensitivity.MIN) {
            a = startAnimationPosition - positionCorrection;
            if (this.initSlides.length % slidesToShow !== 0 && activeSlide === lastSlide) {
              a = alternativeAnimationPosition - (positionCorrection * slidesToShow);
            }
          }
          if (this.positionDiff.x < SwipeSensitivity.MIN) {
            a = -startAnimationPosition - positionCorrection;
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
      isAnimatedSwipe,
      sliderWidth,
      slidePosition,
    } = this.state;

    this.positionDiff = {
      x: this.touchPositionStart.x - this.touchPositionCurrent.x,
      y: this.touchPositionStart.y - this.touchPositionCurrent.y,
    };

    if (this.positionDiff.y) {
      window.removeEventListener(`resize`, this.updateWindowDimensions);
      setTimeout(() => {
        window.addEventListener(`resize`, this.updateWindowDimensions);
      }, 1);
    }
    if (Math.abs(this.positionDiff.x) >= SwipeSensitivity.MAX && this.touchTimeEnd - this.touchTimeStart > 150) {
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

  leaveSlideZone(evt) {
    if (evt.clientX > this.slideRef.offsetWidth ||
      evt.clientX < this.slideRef.offsetWidth ||
      evt.clientY > this.slideRef.offsetHeight ||
      evt.clientY < this.slideRef.offsetHeight) {
      this.onTouchEnd(evt);
    }
  }

  onTouchStart(evt) {
    this.touchTimeStart = evt.timeStamp;
    if (evt.type === `mousedown`) {
      this.touchPositionStart = {
        x: evt.clientX,
        y: evt.clientY,
      };
      this.touchPositionCurrent = {
        x: this.touchPositionStart.x,
        y: this.touchPositionStart.y,
      };
    } else if (evt.changedTouches && evt.changedTouches.length) {
      this.touchPositionStart = {
        x: evt.changedTouches[0].clientX,
        y: evt.changedTouches[0].clientY,
      };
      this.touchPositionCurrent = {
        x: this.touchPositionStart.x,
        y: this.touchPositionStart.y,
      };
    }
    this.onMouseOverPauseAutoplay();
  }

  onTouchMove(evt) {
    const {
      isAnimatedSwipe,
      sliderWidth,
      slidesToShow,
      slidePosition,
    } = this.state;
    let shift;

    if (this.touchPositionStart && slidesToShow !== this.initSlides.length) {
      if (evt.type === `mousemove`) {
        shift = {
          x: this.touchPositionCurrent.x - evt.clientX,
          y: this.touchPositionCurrent.y - evt.clientY,
        };
        this.touchPositionCurrent = {
          x: evt.clientX,
          y: evt.clientY,
        };
      } else {
        shift = {
          x: this.touchPositionCurrent.x - evt.changedTouches[0].clientX,
          y: this.touchPositionCurrent.y - evt.changedTouches[0].clientY,
        };
        this.touchPositionCurrent = {
          x: evt.changedTouches[0].clientX,
          y: evt.changedTouches[0].clientY,
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

  onTouchEnd(evt) {
    if (this.touchTimeStart) {
      this.touchTimeEnd = evt.timeStamp;
      this.checkAction(evt);
      this.touchPositionStart = null;
      this.touchPositionCurrent = null;
    }

    this.onMouseOutResumeAutoplay();
  }

  handleClick(evt) {
    if (this.state.isDragging) {
      if (evt.metaKey || evt.shiftKey || evt.altKey || evt.ctrlKey) {
        return;
      }
      evt.preventDefault();
      evt.stopPropagation();
    }
  }

  render() {
    const {
      activeSlide,
      isCaption,
      isDisabled,
      isDragging,
      isArrows,
      isIndicators,
      isInfinite,
      slidePosition,
      slidesToShow,
      sliderWidth,
      sliderHeight,
      slideAnimation,
    } = this.state;

    const slideData = getSlideData(this.modifiedSlides);

    return (
      <main>
        {this.demoMode ? <section className="slider-settings">
          <label htmlFor="wrange">Width:
            <input
              id="wrange"
              type="range"
              min="320"
              max="1920"
              value={this.state.sliderWidth}
              ref={this.widthRef}
              onChange={(evt) => {
                this.setWidth(evt.target.value);
              }}
            />
            <span>{this.state.sliderWidth}</span>
          </label>
          <label htmlFor="hrange">Height:
            <input
              id="hrange"
              type="range"
              min="320"
              max="1080"
              value={this.state.sliderHeight}
              ref={this.heightRef}
              onChange={(evt) => {
                this.setHeight(evt.target.value);
              }}
            />
            <span>{this.state.sliderHeight}</span>
          </label>
          <label htmlFor="autoplay" className="label-autoplay">Autoplay:
            <input
              id="autoplay"
              type="checkbox"
              name="autoplay"
              ref={this.autoplayRef}
              onChange={this.toggleAutoplay}
              defaultChecked={this.state.isAutoplay ? `checked` : false}
            />
          </label>
          <label htmlFor="autoplay-delay" className="label-autoplay">Autoplay delay (ms):
            <input
              id="autoplay-delay"
              type="number"
              name="autoplayDelay"
              value={this.state.autoplayDelay}
              readOnly={this.state.isAutoplay ? false : true}
              style={{backgroundColor: !this.state.isAutoplay ? `#ccc` : ``}}
              ref={this.autoplayDelayRef}
              onChange={(evt) => {
                this.changeAutoplayDelay(evt.target.value);
              }}
            />
          </label>
          <label htmlFor="indicators">Indicators:
            <input
              id="indicators"
              type="checkbox"
              name="indicators"
              ref={this.indicatorsRef}
              onChange={this.toggleIndicators}
              defaultChecked={this.state.isIndicators ? `checked` : false}
            />
          </label>
          <label htmlFor="arrows">Arrows:
            <input
              id="arrows"
              type="checkbox"
              name="arrows"
              ref={this.arrowsRef}
              onChange={this.toggleArrows}
              defaultChecked={this.state.isArrows ? `checked` : false}
            />
          </label>
          <label htmlFor="caption">Caption:
            <input
              id="caption"
              type="checkbox"
              name="caption"
              ref={this.captionRef}
              onChange={this.toggleCaption}
              defaultChecked={this.state.isCaption ? `checked` : false}
            />
          </label>
          <label htmlFor="animated">Animated swipe:
            <input
              id="animated"
              type="checkbox"
              name="animated"
              ref={this.animatedSwipeRef}
              onChange={this.toggleAnimatedSwipe}
              defaultChecked={this.state.isAnimatedSwipe ? `checked` : false}
            />
          </label>

          <label htmlFor="infinite">Infinte:
            <input
              id="infinite"
              type="checkbox"
              name="infinite"
              ref={this.infiniteRef}
              onChange={this.toggleInfinite}
              defaultChecked={this.state.isInfinite ? `checked` : false}
            />
          </label>
          <label htmlFor="adaptive" className="label-adaptive">Adaptive:
            <input
              id="adaptive"
              type="checkbox"
              name="adaptive"
              ref={this.adaptiveRef}
              onChange={this.toggleAdaptive}
              defaultChecked={this.state.isAdaptive ? `checked` : false}
            />
          </label>
          <label htmlFor="slides-count" className="label-adaptive">Max slides (3):
            <input
              id="slides-count"
              type="number"
              min="1"
              max="3"
              name="slides-count"
              value={this.state.slidesToShow}
              readOnly={this.state.isAdaptive ? false : true}
              style={{backgroundColor: !this.state.isAdaptive ? `#ccc` : ``}}
              ref={this.slidesCountRef}
              onChange={(evt) => {
                this.changeSlidesCount(evt.target.value > 3 ? 3 : evt.target.value);
              }}
            />
          </label>
        </section> : ``}
        <section
          className="slider"
          style={{
            maxWidth: sliderWidth,
            width: `100%`
          }}
          onMouseOver={this.onMouseOverPauseAutoplay}
          onMouseOut={this.onMouseOutResumeAutoplay}
          onClickCapture={this.handleClick}
        >
          <div
            className={`slides`}
            onMouseDown={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              this.onTouchStart(evt);
            }}
            onMouseMove={(evt) => this.onTouchMove(evt)}
            onMouseUp={(evt) => this.onTouchEnd(evt)}
            onTouchStart={(evt) => this.onTouchStart(evt)}
            onTouchMove={(evt) => this.onTouchMove(evt)}
            onTouchEnd={(evt) => this.onTouchEnd(evt)}
            onAnimationEnd={this.onAnimationEnd}
            ref={(ref) => {
              this.slideRef = ref;
            }}
            style={{
              animationName: slideAnimation,
              animationTimingFunction: `ease`,
              animationDuration: `0.75s`,
              left: `-${slidePosition}%`,

            }}
          >
            {slideData.map((it, index) => {
              let style = {
                minWidth: `${100 / slidesToShow}%`,
                height: isIndicators ? sliderHeight - INDICATORS_HEIGHT : sliderHeight,
                backgroundImage: `url(${getBackground(it)})`,
              };
              let styleHidden = {
                minWidth: `${100 / slidesToShow}%`,
                height: isIndicators ? sliderHeight - INDICATORS_HEIGHT : sliderHeight,
                visibility: `hidden`
              };
              return (
                <div
                  key={it + index}
                  className={`slide ${isCaption ? `` : `slide--no-caption`}`}
                  id={index}
                  style={this.initSlides.length !== 1 && !isInfinite && index < slidesToShow ||
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
              isDragging={isDragging}
              slidesToShow={slidesToShow}
              indicators={this.indicators}
              onLeftArrowClick={this.handlPrevSlideClick}
              onRightArrowClick={this.handlNextSlideClick}
            />}
          {!isIndicators || this.initSlides.length <= slidesToShow ? `` :
            <SlideIndicators
              activeSlide={activeSlide}
              isCaption={isCaption}
              slidesToShow={slidesToShow}
              indicators={this.indicators}
              onIndicatorDotClick={this.handleSlideIndicatorClick}
            />}
        </section>
      </main>
    );
  }
}

Slider.propTypes = {
  children: PropTypes.node.isRequired,
  demoMode: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
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
