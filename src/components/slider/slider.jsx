import React from "react";
import PropTypes from "prop-types";
import Arrows from "../arrows/arrows.jsx";
import SlideIndicators from "../slide-indicators/slide-indicators.jsx";
import VisualizedSettings from "../visualized-settings/visualized-settings.jsx";
import {
  getSlidesCount,
  getAdaptiveSlidesCount,
  getSlideData,
  getBackground
} from "../../utils/common.js";
import {
  AUTOPLAY_DELAY,
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
    this.slidesCount = this.props.adaptiveSlides ?
      getAdaptiveSlidesCount(this.props.slidesCount, window.innerWidth) :
      getSlidesCount(this.props.slidesCount) || 1;
    this.slideRef = null;
    this.styleSheet = document.styleSheets[0];
    this.timer = null;
    this.demoMode = this.props.demoMode || false;

    this.winWidth = null;
    this.inputedWidth = this.props.width || window.innerWidth;
    this.inputedHeight = this.props.height || window.innerHeight;
    this.ratio = this.inputedWidth / this.inputedHeight;

    this.state = {
      activeSlide: this.slidesCount,
      autoplayDelay: this.props.autoplayDelay || AUTOPLAY_DELAY,
      isCaption: this.props.caption || false,
      isDisabled: false,
      isAdaptive: this.props.adaptiveSlides || false,
      isAnimatedSwipe: this.props.animatedSwipe || false,
      animationTime: this.props.animationTime || 350,
      isArrows: this.props.arrows || false,
      isAutoplay: this.props.autoplay || false,
      isIndicators: this.props.indicators || false,
      isInfinite: this.props.infinite || false,
      isReverse: false,
      isDragging: false,
      slideAnimation: ``,
      slidePosition: SlidePosition.INITIAL,
      sliderWidth: this.props.width || window.innerWidth,
      sliderHeight: this.props.height || window.innerHeight,
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
    this.checkWidth = this.checkWidth.bind(this);


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
    this.changeAnimationTime = this.changeAnimationTime.bind(this);
  }

  // togglers for isualised settings -----------------------------------------
  setWidth(value) {
    this.setState({
      sliderWidth: value,
    });
    this.inputedWidth = value;
    this.ratio = value / this.state.sliderHeight;
  }
  setHeight(value) {
    this.setState({
      sliderHeight: value,
    });
    this.inputedHeight = value;
    this.ratio = this.state.sliderWidth / value;
  }
  toggleInfinite() {
    this.setState({isInfinite: !this.state.isInfinite});
  }
  toggleAutoplay() {
    this.setState({isAutoplay: !this.state.isAutoplay});
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
  changeAnimationTime(value) {
    this.setState({animationTime: value});
  }
  toggleCaption() {
    this.setState({isCaption: !this.state.isCaption});
  }
  changeSlidesCount(value) {
    this.slidesCount = value;
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
    this.handleAutoplay();
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this.checkWidth);
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

  checkWidth() {
    if (this.winWidth !== window.innerWidth) {
      this.updateWindowDimensions();
    }
  }

  setupSlider() {
    this.buildSlides(this.state.slidesToShow);
    this.buildIndicators(this.state.slidesToShow);
    this.updateWindowDimensions();
    window.addEventListener(`resize`, this.checkWidth);
    if (this.slideRef) {
      this.slideRef.addEventListener(`mouseleave`, (evt) => this.leaveSlideZone(evt));
    }
  }

  updateWindowDimensions() {
    const {isAdaptive, slidesToShow} = this.state;

    const updateWidth = () => {
      const {width} = this.props;
      let newWidth;
      if (!width) {
        newWidth = window.innerWidth;
      }
      if (this.winWidth > window.innerWidth) {
        if (this.inputedWidth > window.innerWidth) {
          newWidth = window.innerWidth;
        }
        if (this.inputedWidth <= window.innerWidth) {
          newWidth = this.inputedWidth;
        }
      }
      if (this.winWidth < window.innerWidth) {
        if (window.innerWidth > this.inputedWidth) {
          newWidth = this.state.sliderWidth;
        }
        if (window.innerWidth < this.inputedWidth) {
          newWidth = window.innerWidth;
        }
      }
      return newWidth;
    };

    const updateHeight = () => {
      const {height} = this.props;
      switch (true) {
        case !height:
          return window.innerHeight;
        default:
          return this.state.sliderWidth / this.ratio;
      }
    };

    const updatedWidth = updateWidth();
    const updatedHeight = updateHeight();
    const updatedSlidesToShow = isAdaptive ? getAdaptiveSlidesCount(this.slidesCount, window.innerWidth) : slidesToShow;

    this.setState({
      isReverse: false,
      slidesToShow: updatedSlidesToShow,
      sliderWidth: updatedWidth,
      sliderHeight: updatedHeight
    });

    this.winWidth = window.innerWidth;
    this.buildSlides(updatedSlidesToShow);
    this.buildIndicators(updatedSlidesToShow);
  }

  // atoplay handlers ---------------------------------------------------------
  handleAutoplay() {
    const {
      isAutoplay,
      isInfinite,
      isReverse,
    } = this.state;

    if (!isAutoplay) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (isAutoplay) {
      if (isReverse && !isInfinite) {
        this.resetAutoplayPrevInterval();
      }
      if (!isReverse && !isInfinite) {
        this.resetAutoplayNextInterval();
      }
    }
    if (isAutoplay && isInfinite) {
      this.resetAutoplayNextInterval();
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
    this.handleAutoplay();
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
    this.setAnimation(evt);
    this.setState({
      activeSlide: currentSlide,
      isDisabled: true,
      slidePosition: position,
    });

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
    this.setAnimation(evt);
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

  animateSlide(evt) {
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
    const lastSlide = (this.indicators.length - 1) + slidesToShow;
    const alternativeAnimationPosition = (this.initSlides.length - (Math.floor(this.initSlides.length / slidesToShow) * slidesToShow)) * 100;
    let a = ``;

    // autoplay animation -----------------------------------------------------
    if (isAutoplay && !isInfinite) {
      if (!isReverse) {
        if (!evt && activeSlide === lastSlide - 1) {
          this.setState({
            isReverse: true
          });
        }
        a = SlidePosition.STEP;
      }
      if (isReverse) {
        if (!evt && activeSlide === slidesToShow + 1) {
          this.setState({
            isReverse: false
          });
        }
        a = -SlidePosition.STEP;
      }
    }

    if (isAutoplay && isInfinite) {
      this.setState({
        isReverse: false
      });
      a = SlidePosition.STEP;
    }

    // navigation arrows click animation --------------------------------------
    if ((evt && evt.currentTarget.id === `arrow-next`) ||
        (this.positionDiff && this.positionDiff.x > SwipeSensitivity.MIN) ||
        (isAutoplay && !isReverse && isInfinite)) {
      if (activeSlide === lastSlide - 1) {
        this.setState({
          isReverse: true
        });
        a = this.initSlides.length % slidesToShow !== 0 ?
          alternativeAnimationPosition :
          SlidePosition.STEP;
      }
      a = SlidePosition.STEP;
    }
    if ((evt && evt.currentTarget.id === `arrow-prev`) ||
        (this.positionDiff && this.positionDiff.x < SwipeSensitivity.MIN)) {
      if (activeSlide === slidesToShow + 1) {
        this.setState({
          isReverse: false
        });
        a = this.initSlides.length % slidesToShow !== 0 ?
          -alternativeAnimationPosition :
          -SlidePosition.STEP;
      }
      a = -SlidePosition.STEP;
    }

    // slide indicators click animation ---------------------------------------
    if (evt) {
      const target = evt.target;
      const id = parseInt(target.id, 10);
      if (id + slidesToShow - activeSlide === 1) {
        a = SlidePosition.STEP;
      } else if (id + slidesToShow - activeSlide === -1) {
        a = -SlidePosition.STEP;
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

    // swipe animation --------------------------------------------------------
    if (this.positionDiff && isAnimatedSwipe) {
      const positionCorrection = Math.round(this.positionDiff.x * 100 / sliderWidth);
      // stop switching slides on the first or last slide when animatedSwipe is on
      if (this.positionDiff.x < SwipeSensitivity.MAX && this.positionDiff.x > -SwipeSensitivity.MAX ||
        !isInfinite && slidePosition < SlidePosition.INITIAL ||
        !isInfinite && slidePosition > (this.indicators.length * 100)) {
        a = -positionCorrection;
      } else {
        // next/prev slide switching ------------------------------------------
        if (this.positionDiff.x > SwipeSensitivity.MIN) {
          a = SlidePosition.STEP - positionCorrection;
          if (this.initSlides.length % slidesToShow !== 0 && activeSlide === lastSlide) {
            a = alternativeAnimationPosition - positionCorrection * slidesToShow;
          }
        }
        if (this.positionDiff.x < SwipeSensitivity.MIN) {
          a = -SlidePosition.STEP - positionCorrection;
          if (this.initSlides.length % slidesToShow !== 0 && activeSlide === slidesToShow) {
            a = -alternativeAnimationPosition - positionCorrection * slidesToShow;
          }
        }
      }
    }

    // stop switching slides on the first or last slide when animatedSwipe is off ------
    if (this.positionDiff && !isAnimatedSwipe && !isInfinite) {
      if (activeSlide === slidesToShow && this.positionDiff.x < SwipeSensitivity.MIN ||
        activeSlide === lastSlide && this.positionDiff.x > SwipeSensitivity.MIN) {
        a = false;
      }
    }

    return a;
  }

  setAnimation(evt) {
    const slideAnimation = `animation${Math.round(Math.random() * 100)}`;
    const keyframes = `@keyframes ${slideAnimation} {
      0% {transform:translate(${this.animateSlide(evt)}%)}
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

    if (Math.abs(this.positionDiff.x) >= SwipeSensitivity.MAX) {
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
      } else {
        this.setState({
          isSwiping: true
        });
      }
    }

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
    const {
      isAnimatedSwipe,
      isDisabled,
    } = this.state;

    this.touchTimeStart = evt.timeStamp;
    if (isAnimatedSwipe && isDisabled) {
      this.setState({
        isDisabled: false
      });
    }
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
      isDisabled,
      sliderWidth,
      slidesToShow,
      slidePosition,
    } = this.state;
    let shift;

    if (this.touchPositionStart && slidesToShow !== this.initSlides.length) {
      if (!isDisabled) {
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
    if (this.touchPositionStart) {
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
      animationTime,
      autoplayDelay,
      isCaption,
      isDisabled,
      isDragging,
      isArrows,
      isAdaptive,
      isAnimatedSwipe,
      isAutoplay,
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
      <div className="slider-wrapper">
        {this.demoMode ?
          <VisualizedSettings
            setWidth={this.setWidth}
            setHeight={this.setHeight}
            toggleInfinite={this.toggleInfinite}
            toggleAutoplay={this.toggleAutoplay}
            changeAutoplayDelay={this.changeAutoplayDelay}
            toggleIndicators={this.toggleIndicators}
            toggleArrows={this.toggleArrows}
            toggleAdaptive={this.toggleAdaptive}
            toggleAnimatedSwipe={this.toggleAnimatedSwipe}
            toggleCaption={this.toggleCaption}
            changeSlidesCount={this.changeSlidesCount}
            changeAnimationTime={this.changeAnimationTime}
            animationTime={animationTime}
            autoplayDelay={autoplayDelay}
            isAdaptive={isAdaptive}
            isAnimatedSwipe={isAnimatedSwipe}
            isArrows={isArrows}
            isAutoplay={isAutoplay}
            isCaption={isCaption}
            isInfinite={isInfinite}
            isIndicators={isIndicators}
            slidesToShow={slidesToShow}
            sliderWidth={sliderWidth}
            sliderHeight={sliderHeight}
          /> : ``}
        <section
          className="slider"
          style={{
            maxWidth: sliderWidth,
            width: `100%`,
            height: sliderHeight,
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
              animationDuration: `${animationTime}ms`,
              left: `-${slidePosition}%`,

            }}
          >
            {slideData.map((it, index) => {
              let style = {
                minWidth: `${100 / slidesToShow}%`,
                backgroundImage: `url(${getBackground(it)})`,
              };
              let styleHidden = {
                minWidth: `${100 / slidesToShow}%`,
                visibility: `hidden`
              };
              return (
                <div
                  key={it + index}
                  className={`slide
                    ${index - slidesToShow >= 0 && index - slidesToShow < this.initSlides.length ?
                  `slide-${(index - slidesToShow) + 1}` : ``}
                    ${isCaption ? `` : `slide--no-caption`}`}
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
      </div>
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
  animationTime: PropTypes.number,
  slidesCount: PropTypes.number,
};

export default Slider;
