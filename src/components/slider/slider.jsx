import React from "react";
import PropTypes from "prop-types";
import Arrows from "../arrows/arrows.jsx";
import SlideIndicators from "../slide-indicators/slide-indicators.jsx";
// import {touchStart, touchMove, touchEnd} from "../../utils/swipe.js";

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this._slides = React.Children.toArray(this.props.children);
    this._timer = null;
    this._indicators = [];
    this.sensitivity = 20;
    // this.props = null;
    this.propstouchPositionCurrent = null;
    this.propstouchTimeStart = null;
    this.propstouchTimeEnd = null;
    this.positionDiff = 0;

    this.state = {
      sliderWidth: this.props.width || ``,
      sliderHeight: this.props.height || ``,
      activeSlide: this.props.slidesCount > this._slides.length ? this._slides.length : this.props.slidesCount || 1,
      isInfinite: this.props.isInfinite || false,
      isCaption: this.props.isCaption || false,
      isDisabled: false,
      isAutoplay: this.props.isAutoplay || false,
      isIndicators: this.props.isIndicators || false,
      isArrows: this.props.isArrows || false,
      slides: [],
      slidePosition: 100,
      slidesToShow: this.props.slidesCount > this._slides.length ? this._slides.length : this.props.slidesCount || 1,
      // slideAnim: ``,
      animationName: ``
    };

    this._handlPrevSlideClick = this._handlPrevSlideClick.bind(this);
    this._handlNextSlideClick = this._handlNextSlideClick.bind(this);
    this._handleSlideIndicatorClick = this._handleSlideIndicatorClick.bind(this);
    this._handleMouseOver = this._handleMouseOver.bind(this);
    this._updateWindowDimensions = this._updateWindowDimensions.bind(this);
  }

  _buildIndicators() {
    for (let i = 0; i < Math.ceil(this._slides.length / this.state.slidesToShow); i++) {
      this._indicators.push(i);
    }
  }

  clickHdl(evt) {

    let styleSheet = document.styleSheets[0];

    let animationName = `animation${Math.round(Math.random() * 100)}`;
    console.log(this._indicators.length);
    const anima = () => {
      let a = ``;
      if (this.positionDiff) {
        console.log(this.state.slidePosition);
        if (!this.state.isInfinite && this.state.slidePosition < 100) {
          console.log(`FUCK ME`);
          a = -Math.round(((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10))) * this.state.slidesToShow);
        } else if (!this.state.isInfinite && this.state.slidePosition > (this._indicators.length * 100)) {
          console.log(`FUCK YOU`);
          a = -Math.round(((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10))) * this.state.slidesToShow);
        } else {
          console.log(`FUCK HIM`);
          a = this.positionDiff.x > 0 ?
            Math.round(this.state.slidesToShow * 100 - ((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10))) * this.state.slidesToShow) :
            -Math.round(this.state.slidesToShow * 100 + ((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10))) * this.state.slidesToShow);
        }

      }

      if (!this.positionDiff) {
        a = evt.currentTarget.classList[1] === `arrows__next` || parseInt(evt.currentTarget.id, 10) + this.state.slidesToShow > this.state.activeSlide ? this.state.slidesToShow * 100 : this.state.slidesToShow * -100;
      }
      return a;
    };

    let keyframes =
    `@-webkit-keyframes ${animationName} {
      0% {-webkit-transform:translate(${anima()}%)}
      100% {-webkit-transform:translate(${0}%)}
    }`;

    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

    this.setState({
      animationName
    });
    console.log(keyframes);
  }

  checkAction(slide, next, prev) {
    this.positionDiff = {
      x: this.touchPositionStart.x - this.touchPositionCurrent.x,
    };

    if (Math.abs(this.positionDiff.x) > 0 && this.touchTimeEnd - this.touchTimeStart > 150) {
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
    if (this.touchTimeStart && this.state.slidesToShow !== this._slides.length) {
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

      console.log(`slidePosition : ` + this.state.slidePosition);
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

  componentDidMount() {
    const {isAutoplay, slidesToShow} = this.state;
    this._updateWindowDimensions();
    this._buildIndicators();

    window.addEventListener(`resize`, this._updateWindowDimensions);

    switch (true) {
      case this._slides.length !== 1 && isAutoplay:
        this._timer = setInterval(this._handlNextSlideClick, 3000);
        break;
      case slidesToShow > 1:
        const firstCloneArray = this._slides.slice(0, slidesToShow);
        const lastCloneArray = this._slides.slice(this._slides.length - slidesToShow);
        this.setState({
          slides: [...lastCloneArray, ...this._slides, ...firstCloneArray]
        });
        break;
      default:
        if (this._slides.length === 1) {
          this.setState({
            activeSlide: slidesToShow - 1,
            slidePosition: 0,
            slides: [...this._slides]
          });
          return;
        }
        const firstElement = this._slides[0];
        const lastElement = this._slides[this._slides.length - 1];
        this.setState({
          slides: [lastElement, ...this._slides, firstElement]
        });
        break;
    }
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

    // this._updateWindowDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this._updateWindowDimensions);
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


  _updateWindowDimensions() {
    const {width, height} = this.props;
    const updatedWidth = parseInt(width, 10) < window.innerWidth ? width : `${window.innerWidth}px`;
    const updatedHeight = parseInt(height, 10) < window.innerHeight ? height : `${window.innerHeight}px`;
    // console.log(`1150`);
    // if (updatedWidth === 1150) {
    //   console.log(`1150`);
    // }

    this.setState({
      sliderWidth: updatedWidth,
      sliderHeight: updatedHeight
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


  _handlPrevSlideClick(evt) {
    this.clickHdl(evt);
    const {
      activeSlide,
      isInfinite,
      slidesToShow,
      slidePosition,
      slides,
    } = this.state;
    console.log(`slidePosition : ` + slidePosition);
    let currentSlide = activeSlide;
    let position = this.positionDiff ? Math.round(slidePosition - ((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10)))) : slidePosition;

    // console.log(`(this.positionDiff.x : ` + (this.positionDiff.x * 100) / parseInt(this.state.sliderWidth, 10));
    console.log(`position : ` + position);
    console.log(`currentSlide : ` + currentSlide);

    switch (true) {
      case !isInfinite && currentSlide === slidesToShow || slides.length === 1 || slidesToShow === this._slides.length:
        currentSlide = currentSlide;
        position = position;
        break;
      case position === 100:
        currentSlide = (this._indicators.length - 1) + slidesToShow;
        position = ((this._slides.length / slidesToShow) * 100);
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

    console.log(this.state.slidePosition);

  }

  _handlNextSlideClick(evt) {
    this.clickHdl(evt);
    const {
      activeSlide,
      isInfinite,
      slidePosition,
      slides,
      slidesToShow,
    } = this.state;
    console.log(`slidePosition : ` + slidePosition);
    let currentSlide = activeSlide;
    let position = this.positionDiff ? Math.round(slidePosition - ((this.positionDiff.x * 100 / parseInt(this.state.sliderWidth, 10)))) : slidePosition;

    // console.log(`(this.positionDiff.x : ` + (this.positionDiff.x * 100) / parseInt(this.state.sliderWidth, 10));
    console.log(`position : ` + position);
    console.log(`currentSlide : ` + currentSlide);

    switch (true) {
      case !isInfinite && currentSlide === this._indicators.length + slidesToShow - 1 || slides.length === 1 || slidesToShow === this._slides.length:
        currentSlide = currentSlide;
        position = position;
        break;
      case position === 100 * Math.ceil((this._slides.length) / slidesToShow):
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
    console.log(position);
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

    this.clickHdl(evt);
  }

  _handleSlideAnim() {
    setTimeout(() => {
      this.setState({
        isDisabled: false,
        // slideAnim: ``
      });
    }, 150);
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

  render() {
    const {
      activeSlide,
      isCaption,
      isIndicators,
      slides,
      slidePosition,
      slidesToShow,
      // slideAnim,
      sliderWidth,
      sliderHeight
    } = this.state;

    const slideData = this._getSlideData(slides);
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
              animationName: this.state.animationName,
              animationTimingFunction: `ease-in-out`,
              animationDuration: `2s`,
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
            return (
              <div
                key={it + index}
                className={`slide__item ${isCaption ? `` : `slide__item--no-caption`}`}
                // className={`slide__item ${slideAnim} ${isCaption ? `` : `slide__item--no-caption`}`}
                onAnimationEnd={() => this._handleSlideAnim()}
                id={index + activeSlide}
                style={style}
              >
                {it}
              </div>
            );
          })}

        </div>

        {!this.state.isArrows || slides.length === 1 || slidesToShow === this._slides.length ? `` :
          <Arrows
            activeSlide={activeSlide}
            isInfinite={this.state.isInfinite}
            isDisabled={this.state.isDisabled}
            slides={this._slides}
            slidesToShow={this.state.slidesToShow}
            indicators={this._indicators}
            onLeftArrowClick={this._handlPrevSlideClick}
            onRightArrowClick={this._handlNextSlideClick}
            onMouseOverHandler={this._handleMouseOver}
          />}
        {!isIndicators || this._slides.length === slidesToShow ? `` :
          <SlideIndicators
            activeSlide={activeSlide}
            isInfinite={this.state.isInfinite}
            isCaption={isCaption}
            slides={this._slides}
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
  slidesCount: PropTypes.number
};

export default Slider;
