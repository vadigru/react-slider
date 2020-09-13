import React from "react";
import PropTypes from "prop-types";
import Arrows from "../arrows/arrows.jsx";
import SlideIndicators from "../slide-indicators/slide-indicators.jsx";

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this._data = React.Children.toArray(this.props.children);
  }

  componentDidMount() {
    const {setSlides} = this.props;
    if (this.props.slidesToShow > 1) {
      const firstCloneArray = this._data.slice(0, this.props.slidesToShow);
      const lastCloneArray = this._data.slice(this._data.length - this.props.slidesToShow);
      setSlides([...lastCloneArray, ...this._data, ...firstCloneArray]);
    } else {
      const firstElement = this._data[0];
      const lastElement = this._data[this._data.length - 1];
      setSlides([lastElement, ...this._data, firstElement]);
    }


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

  _handleSlideAnim() {
    const {setSlideAnim} = this.props;
    setSlideAnim(``);
  }

  render() {
    const {
      activeSlide,
      isCaption,
      slides,
      slidesToShow,
      slidePosition,
      slideAnim,
      onLeftArrowClick,
      onRightArrowClick,
      onIndicatorDotClick,
    } = this.props;

    const slideData = this._getSlideData(slides);

    return (
      <React.Fragment>
        <div
          className={`slide slide-${activeSlide}`}
        >
          {slideData.map((it, index) => {
            return (
              <div
                key={it + index}
                className={`slide__item ${slideAnim}`}
                onAnimationEnd={() => this._handleSlideAnim()}
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
          onLeftArrowClick={onLeftArrowClick}
          onRightArrowClick={onRightArrowClick}
        />
        <SlideIndicators
          isCaption={isCaption}
          activeSlide={activeSlide}
          onIndicatorDotClick={onIndicatorDotClick}
          slides={this._data}
          slidesToShow={slidesToShow}
        />
      </React.Fragment>
    );
  }
}

Slider.propTypes = {
  children: PropTypes.node.isRequired,
  setSlides: PropTypes.func.isRequired,
  activeSlide: PropTypes.number.isRequired,
  isCaption: PropTypes.bool.isRequired,
  slides: PropTypes.arrayOf(PropTypes.node).isRequired,
  slidesToShow: PropTypes.number.isRequired,
  // slideDirection: PropTypes.bool.isRequired,
  slidePosition: PropTypes.number.isRequired,
  slideAnim: PropTypes.string.isRequired,
  setSlideAnim: PropTypes.func.isRequired,
  onLeftArrowClick: PropTypes.func.isRequired,
  onRightArrowClick: PropTypes.func.isRequired,
  onIndicatorDotClick: PropTypes.func.isRequired,
};

export default Slider;
