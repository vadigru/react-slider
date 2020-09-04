import React from "react";
// import PropTypes from "prop-types";
import Arrows from "../arrows/arrows.jsx";
import slides from "../slides/slides.jsx";
import SlideIndicators from "../slide-indicators/slide-indicators.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
      isInfinte: true,
      caption: true
    };

    this._handlPrevSlideClick = this._handlPrevSlideClick.bind(this);
    this._handlNextSlideClick = this._handlNextSlideClick.bind(this);
    this._handleSlideIndicatorClick = this._handleSlideIndicatorClick.bind(this);
  }

  _handlPrevSlideClick(currentSlide) {
    let prevSlide = currentSlide;
    if (prevSlide !== 0 && prevSlide <= slides.length - 1) {
      prevSlide = currentSlide - 1;
    } else if (prevSlide === 0 && this.state.isInfinte) {
      prevSlide = slides.length - 1;
    } else {
      prevSlide = this.state.activeSlide;
    }

    this.setState({
      activeSlide: prevSlide
    });
  }

  _handlNextSlideClick(currentSlide) {
    let nextSlide = currentSlide;
    if (nextSlide < slides.length - 1) {
      nextSlide = currentSlide + 1;
    } else if (nextSlide === slides.length - 1 && this.state.isInfinte) {
      nextSlide = 0;
    } else {
      nextSlide = this.state.activeSlide;
    }

    this.setState({
      activeSlide: nextSlide
    });
  }

  _handleSlideIndicatorClick(evt) {
    const target = evt.target;
    const id = parseInt(target.id, 10);
    if (id === this.state.activeSlide) {
      return;
    }
    this.setState({
      activeSlide: id
    });
  }

  render() {
    return (
      <main className="container">
        <section className="slider">
          <h1>SLIDER</h1>
          {slides.map((Slide, index) => {
            const active = this.state.activeSlide === index ? `slide__item--active` : ``;
            return (
              <div key={index} className="slide">
                <div className={`slide__item ${active}`} id={index}>
                  <Slide id={index} activeSlide={this.state.activeSlide} caption={this.state.caption} />
                </div>
              </div>
            );
          })}
          <Arrows
            activeSlide={this.state.activeSlide}
            onLeftArrowClick={this._handlPrevSlideClick}
            onRightArrowClick={this._handlNextSlideClick}
          />
          <SlideIndicators
            caption={this.state.caption}
            activeSlide={this.state.activeSlide}
            onIndicatorDotClick={this._handleSlideIndicatorClick}
          />
        </section>
      </main>
    );
  }
}

App.propTypes = {
};

export default App;
