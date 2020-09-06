import React from "react";
import Arrows from "../arrows/arrows.jsx";
import SlideIndicators from "../slide-indicators/slide-indicators.jsx";

class Slider extends React.Component {
  constructor(props) {
    super(props);

    // this._getBackground = this._getBackground.bind(this);
    this._data = React.Children.toArray(this.props.children);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.props.setSlidesCount(this._data);
  }

  _getSlideData(arr) {
    const newArr = [];
    arr.forEach((it) => newArr.push(it.props.children));
    return newArr;
  }

  _getBackground(arr) {
    console.log(arr);
    let background;
    arr.forEach((it) => {
      if (it.props.src) {
        console.log(it.type);
        background = it.props.src;
      }
    });

    return background;
  }

  render() {
    const slideData = this._getSlideData(this._data);
    return (
      <React.Fragment>
        {slideData.map((it, index) => {
          const slideAnim = this.props.slideDirection ? `slideLeft` : `slideRight`;
          const active = this.props.activeSlide === index ? `slide__item--active` : ``;
          return (
            <div key={it + index} className="slide">
              <div className={`slide__item ${active} ${slideAnim}`} id={index} style={{backgroundImage: `url(${this._getBackground(it)})`, backgroundColor: `rgba(0, 0, 0, 0.5)`, backgroundBlendMode: `multiply`, backgroundSize: `cover`}}>
                {it}
              </div>
            </div>
          );
        })}
        <Arrows
          activeSlide={this.props.activeSlide}
          onLeftArrowClick={this.props.onLeftArrowClick}
          onRightArrowClick={this.props.onRightArrowClick}
        />
        <SlideIndicators
          caption={this.props.caption}
          activeSlide={this.props.activeSlide}
          onIndicatorDotClick={this.props.onIndicatorDotClick}
          slides={this._data}
        />
      </React.Fragment>
    );
  }
}

export default Slider;
