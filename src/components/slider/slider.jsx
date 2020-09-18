import React from "react";
import PropTypes from "prop-types";
import Arrows from "../arrows/arrows.jsx";
import SlideIndicators from "../slide-indicators/slide-indicators.jsx";
import {touchStart, touchMove, touchEnd} from "../../utils/swipe.js";
class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: this.props.slidesCount,
      isInfinite: this.props.isInfinite,
      isCaption: this.props.isCaption,
      isDisabled: false,
      isAutoplay: this.props.isAutoplay,
      slides: [],
      slidePosition: 100,
      slidesToShow: this.props.slidesCount,
      slideAnim: ``,
      sliderWidth: this.props.width || 0,
      sliderHeight: this.props.height || 0
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
    const {slidesCount} = this.props;
    const {isAutoplay, slidesToShow} = this.state;
    if (isAutoplay) {
      this._timer = setInterval(this._handlNextSlideClick, 3000);
    }
    if (slidesCount > 1) {
      const firstCloneArray = this._slides.slice(0, slidesToShow);
      const lastCloneArray = this._slides.slice(this._slides.length - slidesToShow);
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
    this._updateWindowDimensions();
    window.addEventListener(`resize`, this._updateWindowDimensions);
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
        this._prevInterval();
      } else if (activeSlide === slidesToShow) {
        this._nextInterval();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this._updateWindowDimensions);
  }

  _prevInterval() {
    clearInterval(this._timer);
    this._timer = null;
    this._timer = setInterval(this._handlPrevSlideClick, 3000);
  }

  _nextInterval() {
    clearInterval(this._timer);
    this._timer = null;
    this._timer = setInterval(this._handlNextSlideClick, 3000);
  }

  _updateWindowDimensions() {
    const {width, height} = this.props;
    let isMobile = false;
    let computedWidth = window.innerWidth;
    let computedHeight = window.innerHeight;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|honex|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      isMobile = true;
    }
    computedWidth = width ? width : computedWidth;
    computedHeight = height ? height : computedHeight;
    this.setState({
      sliderWidth: isMobile ? 100 : computedWidth,
      sliderHeight: computedHeight
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
        this._prevInterval();
      } else {
        this._nextInterval();
      }
    }
    if (isAutoplay && isInfinite) {
      this._nextInterval();
    }
  }

  _handlPrevSlideClick() {
    const {
      activeSlide,
      isInfinite,
      slidesToShow,
      slidePosition,
      slides
    } = this.state;

    let currentSlide = activeSlide;
    let position = slidePosition;
    if (!isInfinite && currentSlide === slidesToShow) {
      return;
    }
    if (currentSlide === slidesToShow) {
      currentSlide = (slides.length - 1 - slidesToShow);
      position = ((slides.length - 1) - slidesToShow) * 100 / slidesToShow;
    } else if (currentSlide > slidesToShow) {
      currentSlide = currentSlide - 1;
      position -= 100 / slidesToShow;
    }

    this.setState({
      activeSlide: currentSlide,
      isDisabled: true,
      slidePosition: position,
      slideAnim: `slideRight`
    });
  }

  _handlNextSlideClick() {
    const {
      activeSlide,
      isInfinite,
      slidePosition,
      slides,
      slidesToShow
    } = this.state;

    let currentSlide = activeSlide;
    let position = slidePosition;
    if (!isInfinite && currentSlide === (slides.length - slidesToShow) - slidesToShow) {
      return;
    }
    if (currentSlide === (slides.length - 1) - slidesToShow) {
      currentSlide = slidesToShow;
      position = 100;
    } else if (currentSlide < slides.length - 1) {
      currentSlide = currentSlide + 1;
      position += 100 / slidesToShow;
    }

    this.setState({
      activeSlide: currentSlide,
      isDisabled: true,
      slidePosition: position,
      slideAnim: `slideLeft`
    });
  }

  _handleSlideIndicatorClick(evt) {
    const {activeSlide, slidesToShow} = this.state;
    const target = evt.target;
    const id = parseInt(target.id, 10);
    if (id === activeSlide) {
      return;
    }
    if (id > activeSlide) {
      this.setState({
        activeSlide: id,
        slidePosition: id * 100 / slidesToShow,
        slideAnim: `slideLeft`
      });
    } else {
      this.setState({
        activeSlide: id,
        slidePosition: id * 100 / slidesToShow,
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
      sliderWidth,
      sliderHeight
    } = this.state;

    const {
      width,
      height
    } = this.props;

    const slideData = this._getSlideData(slides);

    return (
      <section
        className="slider"
        onMouseOver={this._handleMouseOver}
        onMouseOut={() => this._handleMouseOut()}
        style={{
          width: `${sliderWidth}${width ? `%` : `px`}`,
        }}
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
                  height: `${sliderHeight}${height ? `vh` : `px`}`,
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
  slidesCount: PropTypes.number.isRequired,
  width: PropTypes.number,
  height: PropTypes.number
};

export default Slider;
